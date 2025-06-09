package swp391.com.backend.jpa.pojo.roles;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.order.Order;

import java.util.List;

@Entity
@Table(name = "staffs")
@Data
@NoArgsConstructor
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "account_id", unique = true)
    private Account account;

    private String specialization;

    @OneToMany(mappedBy = "staff")
    private List<Order> orders;
}
