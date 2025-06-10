package swp391.com.backend.jpa.pojo.test;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.order.Order;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "packages")
@Data
@NoArgsConstructor
public class Package {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    private String packageName;

    @Lob
    private String description;

    private BigDecimal price;
    private Integer duration;
    private Boolean isActive;

    @OneToMany(mappedBy = "aPackage")
    private List<PackageTest> packageTests;
}
