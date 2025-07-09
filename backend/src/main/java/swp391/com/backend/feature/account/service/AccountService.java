package swp391.com.backend.feature.account.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.account.data.*;
import swp391.com.backend.feature.account.dto.AccountManagementDTO;
import swp391.com.backend.feature.admin.data.*;
import swp391.com.backend.feature.customer.data.*;
import swp391.com.backend.feature.doctor.data.*;
import swp391.com.backend.feature.staff.data.*;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final DoctorRepository doctorRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final StaffRepository staffRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    public Account login(String email, String password) {
        return accountRepository.findAccountByEmailAndPassword(email, password);
    }

    public Actor getActorByAccountId(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return switch (account.getRole()) {
            case ADMIN -> adminRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            case CUSTOMER -> customerRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            case DOCTOR -> doctorRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            case STAFF -> staffRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Staff not found"));
        };
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account findAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    public Account updateAccount(Long id, Account accountDetails) {
        Account account = findAccountById(id);
        account.setEmail(accountDetails.getEmail());
        account.setStatus(accountDetails.getStatus());
        account.setRole(accountDetails.getRole());

        if (accountDetails.getPassword() != null && !accountDetails.getPassword().isEmpty()) {
            account.setPassword(accountDetails.getPassword());
        }

        return accountRepository.save(account);
    }

    public List<Account> findAccountsByRole(Role role) {
        return accountRepository.findByRole(role);
    }

    public List<Account> findAccountsByStatus(Boolean status) {
        return accountRepository.findByStatus(status);
    }

    public Account toggleAccountStatus(Long id) {
        Account account = findAccountById(id);
        account.setStatus(!account.getStatus());
        return accountRepository.save(account);
    }

    public AccountManagementDTO getAccountWithProfile(Long id) {
        Account account = findAccountById(id);
        AccountManagementDTO dto = new AccountManagementDTO(
                account.getId(),
                account.getEmail(),
                account.getRole(),
                account.getStatus()
        );

        try {
            Actor actor = getActorByAccountId(id);
            switch (account.getRole()) {
                case CUSTOMER:
                    Customer customer = (Customer) actor;
                    dto.setName(customer.getName());
                    dto.setPhoneNumber(customer.getPhoneNumber());
                    break;
                case DOCTOR:
                    Doctor doctor = (Doctor) actor;
                    dto.setName(doctor.getName());
                    dto.setSpecialization(doctor.getSpecialization());
                    dto.setPrice(doctor.getPrice());
                    break;
                case STAFF:
                    Staff staff = (Staff) actor;
                    dto.setName(staff.getName());
                    break;
                case ADMIN:
                    Admin admin = (Admin) actor;
                    dto.setName(admin.getName());
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return dto;
    }

    public List<AccountManagementDTO> getAllAccountsWithProfiles() {
        return getAllAccounts().stream()
                .map(account -> getAccountWithProfile(account.getId()))
                .toList();
    }

    public List<AccountManagementDTO> getAccountsByRoleWithProfiles(Role role) {
        return findAccountsByRole(role).stream()
                .map(account -> getAccountWithProfile(account.getId()))
                .toList();
    }

    public AccountManagementDTO createAccountWithProfile(String email, String password, Role role, String name, String phoneNumber, Boolean status, String specialization, BigDecimal price) {
        if (accountRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        Account account = Account.builder()
                .email(email)
                .password(password)
                .role(role)
                .status(status != null ? status : true)
                .build();

        account = accountRepository.save(account);

        try {
            switch (role) {
                case CUSTOMER:
                    Customer customer = Customer.builder()
                            .account(account)
                            .name(name)
                            .phoneNumber(phoneNumber)
                            .build();
                    customerRepository.save(customer);
                    break;
                case DOCTOR:
                    Doctor doctor = Doctor.builder()
                            .account(account)
                            .name(name)
                            .specialization(specialization)
                            .price(price)
                            .build();
                    doctorRepository.save(doctor);
                    break;
                case STAFF:
                    Staff staff = Staff.builder()
                            .account(account)
                            .name(name)
                            .build();
                    staffRepository.save(staff);
                    break;
                case ADMIN:
                    Admin admin = Admin.builder()
                            .account(account)
                            .name(name)
                            .build();
                    adminRepository.save(admin);
                    break;
            }
        } catch (Exception e) {
            accountRepository.delete(account);
            throw new RuntimeException("Failed to create profile: " + e.getMessage());
        }

        return getAccountWithProfile(account.getId());
    }

    public AccountManagementDTO createAccountWithProfile(String email, String password, Role role, String name, String phoneNumber, Boolean status) {
        return createAccountWithProfile(email, password, role, name, phoneNumber, status, null, null);
    }

    @Transactional
    public AccountManagementDTO updateAccountWithProfile(Long id, String email, String password, Role role, String name, String phoneNumber, Boolean status, String specialization, BigDecimal price) {
        Account account = findAccountById(id);
        Role oldRole = account.getRole();

        if (!account.getEmail().equals(email) && accountRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        account.setEmail(email);
        account.setPassword((password != null && !password.isEmpty()) ? password : account.getPassword());
        account.setRole(role);
        account.setStatus(status);

        account = accountRepository.saveAndFlush(account);
        
        if (oldRole != role) {
            handleRoleTransitionSafely(id, oldRole, role, name, phoneNumber, specialization, price);
        } else {
            updateExistingProfile(id, role, name, phoneNumber, specialization, price);
        }

        return getAccountWithProfile(id);
    }

    public AccountManagementDTO updateAccountWithProfile(Long id, String email, String password, Role role, String name, String phoneNumber, Boolean status) {
        return updateAccountWithProfile(id, email, password, role, name, phoneNumber, status, null, null);
    }

    private void handleRoleTransitionSafely(Long accountId, Role oldRole, Role newRole, String name, String phoneNumber, String specialization, BigDecimal price) {
        deleteOldProfile(accountId, oldRole);
        entityManager.flush();
        entityManager.clear();
        Account freshAccount = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        createNewProfileWithAccount(freshAccount, newRole, name, phoneNumber, specialization, price);
    }

    private void deleteOldProfile(Long accountId, Role oldRole) {
        try {
            switch (oldRole) {
                case CUSTOMER -> customerRepository.findById(accountId).ifPresent(c -> {
                    c.setAccount(null);
                    customerRepository.save(c);
                });
                case DOCTOR -> doctorRepository.findById(accountId).ifPresent(d -> {
                    d.setAccount(null);
                    doctorRepository.save(d);
                    doctorRepository.deleteById(accountId); 
                });
                case ADMIN -> adminRepository.findById(accountId).ifPresent(a -> {
                    a.setAccount(null);
                    adminRepository.save(a);
                    adminRepository.deleteById(accountId);
                });
                case STAFF -> staffRepository.findById(accountId).ifPresent(s -> {
                    s.setAccount(null);
                    staffRepository.save(s);
                });
            }
        } catch (Exception e) {
            System.out.println("Warning: Failed to delete profile for role " + oldRole + ": " + e.getMessage());
        }
    }

    private void createNewProfileWithAccount(Account account, Role newRole, String name, String phoneNumber, String specialization, BigDecimal price) {
        switch (newRole) {
            case CUSTOMER:
                Customer customer = Customer.builder()
                        .account(account)
                        .name(name)
                        .phoneNumber(phoneNumber)
                        .build();
                customerRepository.save(customer);
                break;
            case DOCTOR:
                Doctor doctor = Doctor.builder()
                        .account(account)
                        .name(name)
                        .specialization(specialization)
                        .price(price)
                        .build();
                doctorRepository.save(doctor);
                break;
            case STAFF:
                Staff staff = Staff.builder()
                        .account(account)
                        .name(name)
                        .build();
                staffRepository.save(staff);
                break;
            case ADMIN:
                Admin admin = Admin.builder()
                        .account(account)
                        .name(name)
                        .build();
                adminRepository.save(admin);
                break;
        }
    }

    private void updateExistingProfile(Long accountId, Role role, String name, String phoneNumber, String specialization, BigDecimal price) {
        try {
            Actor actor = getActorByAccountId(accountId);
            switch (role) {
                case CUSTOMER:
                    Customer customer = (Customer) actor;
                    customer.setName(name);
                    customer.setPhoneNumber(phoneNumber);
                    customerRepository.save(customer);
                    break;
                case DOCTOR:
                    Doctor doctor = (Doctor) actor;
                    doctor.setName(name);
                    doctor.setSpecialization(specialization);
                    doctor.setPrice(price);
                    doctorRepository.save(doctor);
                    break;
                case STAFF:
                    Staff staff = (Staff) actor;
                    staff.setName(name);
                    staffRepository.save(staff);
                    break;
                case ADMIN:
                    Admin admin = (Admin) actor;
                    admin.setName(name);
                    adminRepository.save(admin);
                    break;
            }
        } catch (Exception e) {
            System.out.println("Warning: profile not updated - " + e.getMessage());
        }
    }
}
