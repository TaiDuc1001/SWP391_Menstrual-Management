package swp391.com.backend.jpa.pojo.appointments;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.roles.Doctor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rating_feedbacks")
@Data
@NoArgsConstructor
public class RatingFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "appointment_id", unique = true)
    private Appointment appointment;

    @Column(name = "rating_score")
    private Integer ratingScore;

    @Lob
    private String feedback;

    @Column(name = "rating_date")
    private LocalDateTime ratingDate;

    @Column(name = "is_active")
    private Boolean isActive;
}
