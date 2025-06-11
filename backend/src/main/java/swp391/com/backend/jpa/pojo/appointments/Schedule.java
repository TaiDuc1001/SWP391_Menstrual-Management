package swp391.com.backend.jpa.pojo.appointments;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.roles.Doctor;

@Entity
@Table(name = "schedules")
@Data
@NoArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "slot", columnDefinition = "TINYINT(1)")
    private Integer slot;

    @Column(name = "is_active", columnDefinition = "TINYINT(1)")
    private Boolean isActive;
}

