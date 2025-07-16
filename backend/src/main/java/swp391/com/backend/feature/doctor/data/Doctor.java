package swp391.com.backend.feature.doctor.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.account.data.Actor;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.account.data.Account;
import swp391.com.backend.feature.account.data.Role;
import swp391.com.backend.feature.schedule.data.Schedule;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class Doctor implements Actor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "doctor")
    private List<Schedule> schedules;

    private String name;
    private String specialization;
    private String degree; // Bằng cấp
    private String university; // Trường học
    private BigDecimal price;
    private Integer experience; // Số năm kinh nghiệm
}
