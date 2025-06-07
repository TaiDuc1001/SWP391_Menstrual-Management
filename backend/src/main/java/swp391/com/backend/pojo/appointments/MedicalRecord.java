package swp391.com.backend.pojo.appointments;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.roles.Customer;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "record_date")
    private LocalDateTime recordDate;

    @Column(name = "record_type")
    private String recordType;

    @Lob
    private String description;

    @Column(name = "is_confidential")
    private Boolean isConfidential;
}

