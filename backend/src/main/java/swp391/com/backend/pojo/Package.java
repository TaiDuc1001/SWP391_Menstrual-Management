package swp391.com.backend.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
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
