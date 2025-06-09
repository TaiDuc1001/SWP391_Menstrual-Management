package swp391.com.backend.domain.dto.request;


import lombok.Data;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.test.Package;

import java.math.BigDecimal;

@Data
public class OrderRequestDTO {
    private Integer id;
    private Package aPackage;
    private String date;
    private String slot;
    private String note;
    private Customer customer;
    private BigDecimal totalAmount;
}
