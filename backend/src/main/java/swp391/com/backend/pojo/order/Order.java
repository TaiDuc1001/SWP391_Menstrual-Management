package swp391.com.backend.pojo.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.test.Package;
import swp391.com.backend.pojo.roles.Customer;
import swp391.com.backend.pojo.roles.Staff;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String orderSlot;
    private BigDecimal totalAmount;
    private String orderStatus;

    @Lob
    private String note;

    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    private Integer amount;

    @OneToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @OneToOne(mappedBy = "order")
    private Package aPackage;

    @OneToOne(mappedBy = "order")
    private Result result;
}