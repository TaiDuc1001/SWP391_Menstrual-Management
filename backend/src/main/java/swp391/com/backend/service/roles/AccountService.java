package swp391.com.backend.service.roles;

import org.springframework.stereotype.Service;
import swp391.com.backend.pojo.roles.Account;
import swp391.com.backend.repository.roles.AccountRepository;

@Service
public class AccountService {
    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    public Account login(String email, String password) {
        return accountRepository.findAccountByEmailAndPassword(email, password);
    }

    public Account deleteAccount(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(account);
        return account;
    }
}
