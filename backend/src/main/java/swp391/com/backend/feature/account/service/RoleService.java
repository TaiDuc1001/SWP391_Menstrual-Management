package swp391.com.backend.feature.account.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.data.Role;
import swp391.com.backend.feature.admin.data.Admin;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.service.DoctorService;
import swp391.com.backend.feature.staff.data.Staff;
import swp391.com.backend.feature.admin.service.AdminService;
import swp391.com.backend.feature.staff.service.StaffService;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final CustomerService customerService;
    private final StaffService staffService;
    private final DoctorService doctorService;
    private final AdminService adminService;
    private final AccountService accountService;



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

}




