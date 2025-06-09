package swp391.com.backend.jpa.pojo.appointments;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.roles.Doctor;

import java.math.BigDecimal;

@Entity
@Table(name = "appointments")
@Data
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

    private String appointmentDate;

    private Integer slot;

    private String googleMeetUrl;

    private String appointmentStatus;

    private String description;

    @Lob
    private String notes;

    private Boolean isActive;

    private BigDecimal price;

    @OneToOne(mappedBy = "appointment")
    private RatingFeedback ratingFeedback;
}
