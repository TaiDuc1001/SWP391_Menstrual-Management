package swp391.com.backend.feature.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.data.AccountRepository;
import swp391.com.backend.feature.account.data.Actor;
import swp391.com.backend.feature.account.data.Role;
import swp391.com.backend.feature.account.dto.AccountManagementDTO;
import swp391.com.backend.feature.admin.data.Admin;
import swp391.com.backend.feature.admin.data.AdminRepository;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.customer.data.CustomerRepository;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.data.DoctorRepository;
import swp391.com.backend.feature.staff.data.Staff;
import swp391.com.backend.feature.staff.data.StaffRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final DoctorRepository doctorRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final StaffRepository staffRepository;

    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    public Account login(String email, String password) {
        return accountRepository.findAccountByEmailAndPassword(email, password);
    }

    public Actor getActorByAccountId(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return switch(account.getRole().toString()) {
            case "ADMIN" -> adminRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            case "CUSTOMER" -> customerRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            case "DOCTOR" -> doctorRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            case "STAFF" -> staffRepository.findById(account.getId())
                    .orElseThrow(() -> new RuntimeException("Staff not found"));
            default -> throw new IllegalStateException("Unexpected value: " + account.getRole().toString());
        };
    }

    public Account deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(account);
        return account;
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
        // Note: Password update should be handled separately with proper hashing
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
        
        // Get profile information based on role
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
                    // Doctor doesn't have phone number field
                    break;
                case STAFF:
                    Staff staff = (Staff) actor;
                    dto.setName(staff.getName());
                    // Staff doesn't have phone number field
                    break;
                case ADMIN:
                    Admin admin = (Admin) actor;
                    dto.setName(admin.getName());
                    // Admin doesn't have phone number field
                    break;
            }
        } catch (Exception e) {
            // Profile not found or incomplete - that's okay
        }
        
        return dto;
    }

    public List<AccountManagementDTO> getAllAccountsWithProfiles() {
        List<Account> accounts = getAllAccounts();
        return accounts.stream()
                .map(account -> getAccountWithProfile(account.getId()))
                .toList();
    }

    public List<AccountManagementDTO> getAccountsByRoleWithProfiles(Role role) {
        List<Account> accounts = findAccountsByRole(role);
        return accounts.stream()
                .map(account -> getAccountWithProfile(account.getId()))
                .toList();
    }

    public AccountManagementDTO createAccountWithProfile(String email, String password, Role role, String name, String phoneNumber, Boolean status) {
        // Check if email already exists
        if (accountRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }
        
        // Create account
        Account account = Account.builder()
                .email(email)
                .password(password) // In real app, this should be hashed
                .role(role)
                .status(status != null ? status : true)
                .build();
        
        account = accountRepository.save(account);
        
        // Create profile based on role
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
            // If profile creation fails, delete the account
            accountRepository.delete(account);
            throw new RuntimeException("Failed to create profile for account: " + e.getMessage());
        }
        
        return getAccountWithProfile(account.getId());
    }

    public AccountManagementDTO updateAccountWithProfile(Long id, String email, String password, Role role, String name, String phoneNumber, Boolean status) {
        Account account = findAccountById(id);
        
        // Check if email already exists for another account
        if (!account.getEmail().equals(email) && accountRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists: " + email);
        }
        
        // Update account
        account.setEmail(email);
        if (password != null && !password.isEmpty()) {
            account.setPassword(password); // In real app, this should be hashed
        }
        account.setRole(role);
        account.setStatus(status);
        account = accountRepository.save(account);
        
        // Update profile based on role
        try {
            Actor actor = getActorByAccountId(id);
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
                    // Doctor doesn't have phone number field
                    doctorRepository.save(doctor);
                    break;
                case STAFF:
                    Staff staff = (Staff) actor;
                    staff.setName(name);
                    // Staff doesn't have phone number field
                    staffRepository.save(staff);
                    break;
                case ADMIN:
                    Admin admin = (Admin) actor;
                    admin.setName(name);
                    adminRepository.save(admin);
                    break;
            }
        } catch (Exception e) {
            // Profile might not exist yet, that's okay
        }
        
        return getAccountWithProfile(id);
    }
}
