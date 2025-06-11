package swp391.com.backend.domain.controller.roles;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.AccountDTO;
import swp391.com.backend.domain.dto.request.AccountCreateRequest;
import swp391.com.backend.domain.dto.request.LoginRequest;
import swp391.com.backend.domain.mapper.AccountMapper;
import swp391.com.backend.jpa.pojo.roles.Account;
import swp391.com.backend.service.roles.AccountService;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final AccountMapper accountMapper;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Account account = accountService.login(loginRequest.getEmail(), loginRequest.getPassword());

        //Verify account is not null
        if (account == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Login failed: Invalid email or password"));
        }

        return ResponseEntity.ok(accountMapper.toDTO(account));
    }



    @PostMapping("/register")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountCreateRequest request) {

        // Create account entity from request
        Account account = Account.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build();

        Account createdAccount = accountService.createAccount(account);

        return ResponseEntity.status(HttpStatus.CREATED).body(accountMapper.toDTO(createdAccount));
    }

}
