package swp391.com.backend.jpa.pojo.schedule;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.roles.Doctor;

import java.time.LocalDate;

@Entity
@Table(name = "schedules")
@Data
@NoArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private Slot slot;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
}

