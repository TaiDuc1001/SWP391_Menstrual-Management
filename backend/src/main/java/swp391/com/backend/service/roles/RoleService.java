package swp391.com.backend.service.roles;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.roles.*;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final CustomerService customerService;
    private final StaffService staffService;
    private final DoctorService doctorService;
    private final AdminService adminService;
    private final AccountService accountService;


    public Role findRoleByAccountIdAndType(Long accountId, String roleType) {
        return switch (roleType.toUpperCase()) {
            case "ADMIN" -> adminService.findAdminById(accountId);
            case "CUSTOMER" -> customerService.findCustomerById(accountId);
            case "DOCTOR" -> doctorService.findDoctorById(accountId);
            case "STAFF" -> staffService.findStaffById(accountId);
            default -> null;
        };
    }

    public Account login(String email, String password, String roleType) {
        Account account = accountService.login(email, password);
        if( account == null) {
            return null; // Account not found or invalid credentials
        }
        Role role = findRoleByAccountIdAndType(account.getId(), roleType);
        if (role == null) {
            return null; // Role not found
        }
        return account;
    }

    public Account register(String email, String password, String roleType) {
        Account account = Account.builder()
                .email(email)
                .password(password)
                .status(true)
                .build();
        switch (roleType.toUpperCase()) {
            case "ADMIN":
                Admin admin = Admin.builder()
                        .account(account)
                        .build();
                adminService.createAdmin(admin);
                break;
            case "CUSTOMER":
                Customer customer = Customer.builder()
                        .account(account)
                        .build();
                customerService.createCustomer(customer);
                break;
            case "DOCTOR":
                Doctor doctor = Doctor.builder()
                        .account(account)
                        .build();
                doctorService.createDoctor(doctor);
                break;
            case "STAFF":
                Staff staff = Staff.builder()
                        .account(account)
                        .build();
                staffService.createStaff(staff);
                break;
            default:
                throw new IllegalArgumentException("Invalid role type: " + roleType);
        }
        return account;
    }

//    public Account update();
}



