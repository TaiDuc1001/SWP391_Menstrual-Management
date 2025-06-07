package swp391.com.backend.pojo.roles;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.appointments.Appointment;
import swp391.com.backend.pojo.appointments.RatingFeedback;
import swp391.com.backend.pojo.appointments.Schedule;

import java.util.List;

@Entity
@Getter
@Setter
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
    private Boolean isActive;

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "doctor")
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "doctor")
    private List<RatingFeedback> feedbacks;
}
