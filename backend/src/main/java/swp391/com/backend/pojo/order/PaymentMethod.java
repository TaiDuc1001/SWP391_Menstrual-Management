package swp391.com.backend.pojo.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "method_name")
    private String methodName;

    @Lob
    private String description;

    @Column(name = "is_active")
    private Boolean isActive;
}

