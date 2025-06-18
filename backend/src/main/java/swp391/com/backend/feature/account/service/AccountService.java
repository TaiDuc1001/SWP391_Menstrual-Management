package swp391.com.backend.feature.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.data.AccountRepository;
import swp391.com.backend.feature.account.data.Actor;
import swp391.com.backend.feature.admin.data.AdminRepository;
import swp391.com.backend.feature.customer.data.CustomerRepository;
import swp391.com.backend.feature.doctor.data.DoctorRepository;
import swp391.com.backend.feature.staff.data.StaffRepository;

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
}
