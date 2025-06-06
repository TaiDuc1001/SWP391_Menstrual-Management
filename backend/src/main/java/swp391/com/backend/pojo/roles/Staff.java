package swp391.com.backend.pojo.roles;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.order.Order;

import java.util.List;

@Entity
@Getter
@Setter
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
