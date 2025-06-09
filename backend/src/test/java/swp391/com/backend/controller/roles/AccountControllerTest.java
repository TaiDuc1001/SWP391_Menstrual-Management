package swp391.com.backend.controller.roles;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import swp391.com.backend.domain.controller.roles.AccountController;
import swp391.com.backend.domain.dto.LoginRequestDTO;
import swp391.com.backend.domain.dto.RegisterDTO;
import swp391.com.backend.jpa.pojo.roles.Account;
import swp391.com.backend.service.roles.AccountService;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountController.class)
public class AccountControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AccountService accountService;

    @Test
    void loginSuccess() throws Exception {
        Account account = new Account();
        account.setId(1);
        account.setEmail("user@example.com");
        when(accountService.login("user@example.com", "password")).thenReturn(account);

        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("password");

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @Test
    void loginFailure() throws Exception {
        when(accountService.login("user@example.com", "wrong")).thenReturn(null);

        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("wrong");

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Login failed: Invalid email or password"));
    }

    @Test
    void registerSuccess() throws Exception {
        Account account = new Account();
        account.setId(2);
        account.setEmail("newuser@example.com");

        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("newuser@example.com");
        registerDTO.setPassword("newpassword");

        when(accountService.createAccount(org.mockito.ArgumentMatchers.any(Account.class)))
                .thenReturn(account);

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.email").value("newuser@example.com"));
    }

    // Optional: Test for registration failure (e.g., duplicate email)
    @Test
    void registerFailure() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("existing@example.com");
        registerDTO.setPassword("password");

        when(accountService.createAccount(org.mockito.ArgumentMatchers.any(Account.class)))
                .thenThrow(new RuntimeException("Email already exists"));

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isInternalServerError());
    }
}