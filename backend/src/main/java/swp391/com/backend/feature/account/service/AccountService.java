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
                case CUSTOMER -> {
                    Customer c = (Customer) actor;
                    dto.setName(c.getName());
                    dto.setPhoneNumber(c.getPhoneNumber());
                }
                case DOCTOR -> dto.setName(((Doctor) actor).getName());
                case STAFF -> dto.setName(((Staff) actor).getName());
                case ADMIN -> dto.setName(((Admin) actor).getName());
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

    public AccountManagementDTO createAccountWithProfile(String email, String password, Role role, String name, String phoneNumber, Boolean status) {
        if (accountRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        if (role == Role.CUSTOMER && phoneNumber != null && !phoneNumber.isEmpty() && !phoneNumber.matches("^0\\d{9}$")) {
            throw new RuntimeException("Phone number must be 10 digits starting with 0.");
        }

        Account account = Account.builder()
                .email(email)
                .password(password)
                .role(role)
                .status(status != null ? status : true)
                .build();

        account = accountRepository.save(account);

        try {
            createNewProfileWithAccount(account, role, name, phoneNumber);
        } catch (Exception e) {
            accountRepository.delete(account);
            throw new RuntimeException("Failed to create profile: " + e.getMessage());
        }

        return getAccountWithProfile(account.getId());
    }

    @Transactional
    public AccountManagementDTO updateAccountWithProfile(Long id, String email, String password, Role role, String name, String phoneNumber, Boolean status) {
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

        if (!oldRole.equals(role)) {
            handleRoleTransitionSafely(id, oldRole, role, name, phoneNumber);
        } else {
            updateExistingProfile(id, role, name, phoneNumber);
        }

        return getAccountWithProfile(id);
    }

    @Transactional
    public AccountManagementDTO updateAccountWithoutRoleChange(Long id, String email, String password, String name, String phoneNumber, Boolean status) {
        Account account = findAccountById(id);
        
        if (!account.getEmail().equals(email) && accountRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }

        if (account.getRole() == Role.CUSTOMER && phoneNumber != null && !phoneNumber.isEmpty() && !phoneNumber.matches("^0\\d{9}$")) {
            throw new RuntimeException("Phone number must be 10 digits starting with 0.");
        }

        account.setEmail(email);
        account.setPassword((password != null && !password.isEmpty()) ? password : account.getPassword());
        account.setStatus(status);

        account = accountRepository.save(account);

        updateExistingProfile(id, account.getRole(), name, phoneNumber);

        return getAccountWithProfile(id);
    }

    private void handleRoleTransitionSafely(Long accountId, Role oldRole, Role newRole, String name, String phoneNumber) {
        if (oldRole == Role.STAFF || newRole == Role.STAFF) {
            handleStaffRoleTransition(accountId, oldRole, newRole, name, phoneNumber);
        } else {
            deleteOldProfile(accountId, oldRole);
            entityManager.flush();
            entityManager.clear();
            Account fresh = accountRepository.findById(accountId).orElseThrow();
            createNewProfileWithAccount(fresh, newRole, name, phoneNumber);
        }
    }

    private void handleStaffRoleTransition(Long accountId, Role oldRole, Role newRole, String name, String phoneNumber) {
        Account account = findAccountById(accountId);

        if (oldRole == Role.STAFF && newRole != Role.STAFF) {
            updateExistingProfile(accountId, oldRole, name, phoneNumber);
            createNewProfileWithAccount(account, newRole, name, phoneNumber);
        } else if (oldRole != Role.STAFF && newRole == Role.STAFF) {
            deleteOldProfile(accountId, oldRole);
            entityManager.flush();
            entityManager.clear();
            createNewProfileWithAccount(account, newRole, name, phoneNumber);
        } else {
            updateExistingProfile(accountId, newRole, name, phoneNumber);
        }
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


    private void createNewProfileWithAccount(Account account, Role role, String name, String phoneNumber) {
        switch (role) {
            case CUSTOMER -> customerRepository.save(Customer.builder().account(account).name(name).phoneNumber(phoneNumber).build());
            case DOCTOR -> doctorRepository.save(Doctor.builder().account(account).name(name).build());
            case STAFF -> staffRepository.save(Staff.builder().account(account).name(name).build());
            case ADMIN -> adminRepository.save(Admin.builder().account(account).name(name).build());
        }
    }

    private void updateExistingProfile(Long accountId, Role role, String name, String phoneNumber) {
        try {
            Actor actor = getActorByAccountId(accountId);
            switch (role) {
                case CUSTOMER -> {
                    Customer c = (Customer) actor;
                    c.setName(name);
                    c.setPhoneNumber(phoneNumber);
                    customerRepository.save(c);
                }
                case DOCTOR -> {
                    Doctor d = (Doctor) actor;
                    d.setName(name);
                    doctorRepository.save(d);
                }
                case STAFF -> {
                    Staff s = (Staff) actor;
                    s.setName(name);
                    staffRepository.save(s);
                }
                case ADMIN -> {
                    Admin a = (Admin) actor;
                    a.setName(name);
                    adminRepository.save(a);
                }
            }
        } catch (Exception e) {
            System.out.println("Warning: profile not updated - " + e.getMessage());
        }
    }
}

