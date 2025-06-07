package swp391.com.backend.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    private LocalDateTime orderSlot;
    private BigDecimal totalAmount;
    private String orderStatus;

    @Lob
    private String note;

    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @OneToOne(mappedBy = "order")
    private Invoice invoice;

    @OneToOne(mappedBy = "order")
    private Package aPackage;

    @OneToOne(mappedBy = "order")
    private Result result;
}
