package swp391.com.backend.domain.controller.roles;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.domain.dto.AccountDTO;
import swp391.com.backend.domain.dto.request.LoginRequestDTO;
import swp391.com.backend.domain.dto.RegisterDTO;
import swp391.com.backend.jpa.pojo.roles.Account;
import swp391.com.backend.service.roles.AccountService;

import java.util.Map;

@RestController
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        Account account = accountService.login(loginRequestDTO.getEmail(), loginRequestDTO.getPassword());
        if (account == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Login failed: Invalid email or password"));
        }
        return ResponseEntity.ok(new AccountDTO(account.getId(), account.getEmail()));
    }

    @PostMapping("/api/register")
    public ResponseEntity<AccountDTO> register(@RequestBody RegisterDTO registerDTO) {
        Account account = Account.builder()
                .email(registerDTO.getEmail())
                .password(registerDTO.getPassword())
                .build();
        Account createdAccount = accountService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AccountDTO(createdAccount.getId(), createdAccount.getEmail()));
    }
}
