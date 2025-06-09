package swp391.com.backend.jpa.pojo.test;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.order.ResultDetail;

import java.util.List;

@Entity
@Table(name = "tests")
@Data
@NoArgsConstructor
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String type;

    @Lob
    private String description;

    @Column(name = "is_active")
    private Boolean isActive;

    @OneToMany(mappedBy = "test")
    private List<PackageTest> packageTests;

    @OneToMany(mappedBy = "test")
    private List<ResultDetail> resultDetails;
}
