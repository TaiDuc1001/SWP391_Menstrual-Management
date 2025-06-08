package swp391.com.backend.dto;


import lombok.Getter;
import lombok.Setter;
import swp391.com.backend.pojo.roles.Customer;
import swp391.com.backend.pojo.test.Package;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderRequestDTO {
    private Integer id;
    private Package aPackage;
    private String date;
    private String slot;
    private String note;
    private Customer customer;
    private BigDecimal totalAmount;
}
