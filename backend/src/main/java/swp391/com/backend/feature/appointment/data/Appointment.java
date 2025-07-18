package swp391.com.backend.feature.appointment.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;

@Entity
@Table(name = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private LocalDate date;
    private Slot slot;
    private String url;
    private AppointmentStatus appointmentStatus;

    private String doctorNote;
    private String customerNote;

    @Lob
    private String feedback;

    private Integer score;

    private Boolean customerConfirmed = false;
    private Boolean doctorConfirmed = false;
}

