package swp391.com.backend.feature.account.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.account.assembler.AccountAssembler;
import swp391.com.backend.feature.account.data.Actor;
import swp391.com.backend.feature.account.dto.AccountDTO;
import swp391.com.backend.feature.account.dto.request.AccountCreateRequest;
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

import javax.swing.text.html.parser.Entity;
import java.util.List;
import java.util.Map;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

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
    private final AccountAssembler accountAssembler;

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<AccountDTO>>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        List<AccountDTO> accountDTOs = accountMapper.toDTOs(accounts);
        CollectionModel<EntityModel<AccountDTO>> collectionModel = accountAssembler.toCollectionModel(accountDTOs);
        return ResponseEntity.ok(collectionModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<AccountDTO>> getAccount(@PathVariable long id) {
        Account account = accountService.getAccountById(id);
        AccountDTO dto = accountMapper.toDTO(account);
        EntityModel<AccountDTO> entityModel = accountAssembler.toModel(dto);
        return ResponseEntity.ok(entityModel);
    }

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
        EntityModel<AccountDTO> entityModel = accountAssembler.toModel(dto);
        return ResponseEntity.ok(entityModel);
    }



    @PostMapping("/register")
    public ResponseEntity<EntityModel<AccountDTO>> createAccount(@RequestBody AccountCreateRequest request) {
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
        EntityModel<AccountDTO> entityModel = accountAssembler.toModel(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(entityModel);
    }
}
