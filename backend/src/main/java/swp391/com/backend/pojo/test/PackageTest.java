package swp391.com.backend.pojo.test;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@IdClass(PackageTestId.class)
public class PackageTest {
    @Id
    @Column(name = "test_id")
    private Integer testId;

    @Id
    @Column(name = "package_id")
    private Integer packageId;

    @ManyToOne
    @JoinColumn(name = "test_id", insertable = false, updatable = false)
    private Test test;

    @ManyToOne
    @JoinColumn(name = "package_id", insertable = false, updatable = false)
    private Package aPackage;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class PackageTestId implements Serializable {
    private Integer testId;
    private Integer packageId;
}
