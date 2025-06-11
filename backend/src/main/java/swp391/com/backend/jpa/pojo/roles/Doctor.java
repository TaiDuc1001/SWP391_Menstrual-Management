package swp391.com.backend.jpa.pojo.roles;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.appointments.Appointment;
import swp391.com.backend.jpa.pojo.appointments.RatingFeedback;
import swp391.com.backend.jpa.pojo.appointments.Schedule;

import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "account_id", unique = true)
    private Account account;

    private Integer experience;
    private String specialization;
    @Column(name = "is_active", columnDefinition = "TINYINT(1)")
    private Boolean isActive;

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "doctor")
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "doctor")
    private List<RatingFeedback> feedbacks;
}
