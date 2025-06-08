package swp391.com.backend.dto;


import lombok.Getter;
import lombok.Setter;
import swp391.com.backend.pojo.roles.Customer;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderRequestDTO {
    private String date;
    private String slot;
    private String note;
    private Customer customer;
    private BigDecimal totalAmount;
}
