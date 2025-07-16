package swp391.com.backend.feature.account.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.account.data.Actor;
import swp391.com.backend.feature.account.dto.AccountDTO;
import swp391.com.backend.feature.account.dto.AccountManagementDTO;
import swp391.com.backend.feature.account.dto.request.AccountCreateRequest;
import swp391.com.backend.feature.account.dto.request.AdminAccountCreateRequest;
import swp391.com.backend.feature.account.dto.request.AdminAccountUpdateRequest;
import swp391.com.backend.feature.account.dto.request.LoginRequest;
import swp391.com.backend.feature.account.mapper.AccountMapper;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.service.AccountService;
import swp391.com.backend.feature.account.service.RoleService;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.customer.dto.CustomerDTO;
import swp391.com.backend.feature.customer.mapper.CustomerMapper;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.dto.DoctorDTO;
import swp391.com.backend.feature.doctor.mapper.DoctorMapper;
import swp391.com.backend.feature.admin.data.Admin;
import swp391.com.backend.feature.admin.dto.AdminDTO;
import swp391.com.backend.feature.admin.mapper.AdminMapper;
import swp391.com.backend.feature.doctor.service.DoctorService;
import swp391.com.backend.feature.staff.data.Staff;
import swp391.com.backend.feature.staff.dto.StaffDTO;
import swp391.com.backend.feature.staff.mapper.StaffMapper;
import swp391.com.backend.feature.account.data.Role;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final RoleService roleService;
    private final AccountMapper accountMapper;
    private final AccountService accountService;
    private final DoctorMapper doctorMapper;
    private final CustomerMapper customerMapper;
    private final AdminMapper adminMapper;
    private final StaffMapper staffMapper;
    private final CustomerService customerService;
    private final DoctorService doctorService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Account account = accountService.login(request.getEmail(), request.getPassword());

        if (account == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Login failed: Invalid email or password"));
        }

        AccountDTO dto = accountMapper.toDTO(account);

        Actor actor = accountService.getActorByAccountId(account.getId());

        switch(account.getRole().toString()) {
            case "DOCTOR" :
                DoctorDTO doctorDTO = doctorMapper.toDTO((Doctor) actor);
                dto.setProfile(doctorDTO);
                break;
            case "CUSTOMER" :
                CustomerDTO customerDTO = customerMapper.toDTO((Customer) actor);
                dto.setProfile(customerDTO);
                break;
            case "ADMIN" :
                AdminDTO adminDTO = adminMapper.toDTO((Admin) actor);
                dto.setProfile(adminDTO);
                break;
            case "STAFF" :
                StaffDTO staffDTO = staffMapper.toDTO((Staff) actor);
                dto.setProfile(staffDTO);
                break;
            default:
                dto.setProfile(null);
                break;
        }
        return ResponseEntity.ok(dto);
    }



    @PostMapping("/register")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountCreateRequest request) {
        request.setRole(request.getRole().toUpperCase());
        Role role = Role.valueOf(request.getRole());
        Account newAccount = accountMapper.toEntity(request);
        newAccount.setRole(role);
        newAccount.setStatus(true);
        Account account = accountService.createAccount(newAccount);

        switch(role){
            case CUSTOMER:
                Customer newCustomer = new Customer();
                newCustomer.setAccount(account);
                Customer customer = customerService.createCustomer(newCustomer);
                break;
            case DOCTOR:
                Doctor newDoctor = new Doctor();
                newDoctor.setAccount(account);
                Doctor doctor = doctorService.createDoctor(newDoctor);
                break;
            default:
                throw new IllegalArgumentException("Invalid role for registration: " + request.getRole());
        }
        AccountDTO dto = accountMapper.toDTO(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    
    @GetMapping("/admin")
    public ResponseEntity<List<AccountManagementDTO>> getAllAccountsForAdmin() {
        List<AccountManagementDTO> accounts = accountService.getAllAccountsWithProfiles();
        return ResponseEntity.ok(accounts);
    }
    
    @GetMapping("/admin/{id}")
    public ResponseEntity<AccountManagementDTO> getAccountByIdForAdmin(@PathVariable Long id) {
        try {
            AccountManagementDTO account = accountService.getAccountWithProfile(id);
            return ResponseEntity.ok(account);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/admin/role/{role}")
    public ResponseEntity<List<AccountManagementDTO>> getAccountsByRoleForAdmin(@PathVariable Role role) {
        List<AccountManagementDTO> accounts = accountService.getAccountsByRoleWithProfiles(role);
        return ResponseEntity.ok(accounts);
    }
    
    @PostMapping("/admin")
    public ResponseEntity<?> createAccountByAdmin(@Valid @RequestBody AdminAccountCreateRequest request) {
        try {
            AccountManagementDTO account = accountService.createAccountWithProfile(
                request.getEmail(),
                request.getPassword(),
                request.getRole(),
                request.getName(),
                request.getPhoneNumber(),
                request.getStatus()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(account);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateAccountByAdmin(@PathVariable Long id, @Valid @RequestBody AdminAccountUpdateRequest request) {
        try {
            AccountManagementDTO account = accountService.updateAccountWithoutRoleChange(
                id,
                request.getEmail(),
                request.getPassword(),
                request.getName(),
                request.getPhoneNumber(),
                request.getStatus()
            );
            return ResponseEntity.ok(account);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

