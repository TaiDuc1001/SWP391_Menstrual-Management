package swp391.com.backend.pojo.appointments;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.roles.Customer;
import swp391.com.backend.pojo.roles.Doctor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private LocalDate appointmentDate;

    private Integer slot;

    private String googleMeetUrl;

    private String appointmentStatus;

    @Lob
    private String notes;

    private Boolean isActive;

    private BigDecimal price;

    @OneToOne(mappedBy = "appointment")
    private RatingFeedback ratingFeedback;
}
