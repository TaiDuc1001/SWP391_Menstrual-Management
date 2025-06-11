package swp391.com.backend.domain.controller.roles;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.AccountDTO;
import swp391.com.backend.domain.dto.request.AccountCreateRequest;
import swp391.com.backend.domain.dto.request.LoginRequest;
import swp391.com.backend.domain.mapper.AccountMapper;
import swp391.com.backend.jpa.pojo.roles.*;
import swp391.com.backend.service.roles.*;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final RoleService roleService;
    private final AccountMapper accountMapper;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Account account = roleService.login(request.getEmail(), request.getPassword(), request.getRole());

        if (account == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Login failed: Invalid email or password"));
        }

        AccountDTO dto = accountMapper.toDTO(account);
        dto.setRole(request.getRole());

        return ResponseEntity.ok(dto);
    }



    @PostMapping("/register")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountCreateRequest request) {

        // Create account entity from request
        Account account = roleService.register(request.getEmail(), request.getPassword(), request.getRole());

        AccountDTO dto = accountMapper.toDTO(account);
        dto.setRole(request.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

}
