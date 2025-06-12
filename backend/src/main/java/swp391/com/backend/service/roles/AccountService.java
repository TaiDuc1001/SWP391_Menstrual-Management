package swp391.com.backend.service.roles;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.roles.Account;
import swp391.com.backend.jpa.repository.roles.AccountRepository;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    public Account login(String email, String password) {
        return accountRepository.findAccountByEmailAndPassword(email, password);
    }

    public Account deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(account);
        return account;
    }
}
