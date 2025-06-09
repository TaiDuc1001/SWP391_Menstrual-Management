package swp391.com.backend.jpa.pojo.order;

import jakarta.persistence.*;
import lombok.*;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.roles.Staff;
import swp391.com.backend.jpa.pojo.test.Package;

import java.math.BigDecimal;

@Entity
@Table(name = "orders")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String slot;
    private BigDecimal totalAmount;
    private String status;
    private String date;

    @Lob
    private String note;

    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;


    @OneToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @OneToOne(mappedBy = "order")
    private Package aPackage;

    @OneToOne(mappedBy = "order")
    private Result result;
}