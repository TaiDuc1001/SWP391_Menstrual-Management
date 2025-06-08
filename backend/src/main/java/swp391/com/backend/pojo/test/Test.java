package swp391.com.backend.pojo.test;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.order.ResultDetail;

import java.util.List;

@Entity
@Getter
@Setter
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
