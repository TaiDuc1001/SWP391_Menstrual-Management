package swp391.com.backend.feature.appointment.data;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;

@Entity
@Table(name = "reschedule_options")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescheduleOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reschedule_request_id")
    private RescheduleRequest rescheduleRequest;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private Slot slot;

    @Column(name = "is_selected")
    private Boolean isSelected = false;
}
