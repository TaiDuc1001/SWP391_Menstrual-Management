package swp391.com.backend.feature.appointment.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.appointment.dto.RescheduleStatus;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.doctor.data.Doctor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reschedule_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescheduleRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(length = 500)
    private String customerNote;

    @Enumerated(EnumType.STRING)
    private RescheduleStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "rescheduleRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RescheduleOption> options;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

