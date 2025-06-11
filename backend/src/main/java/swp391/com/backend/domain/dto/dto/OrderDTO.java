package swp391.com.backend.domain.dto.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderDTO {
    private Integer id;
    private PackageDTO aPackage;
    private String date;
    private Integer slot;
    private String note;
    private CustomerDTO customer;
    private BigDecimal totalAmount;
    private String status; 
}
