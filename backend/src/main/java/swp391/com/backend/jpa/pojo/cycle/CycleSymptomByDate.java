package swp391.com.backend.jpa.pojo.cycle;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "cycle_symptom_by_date")
@Data
@NoArgsConstructor
public class CycleSymptomByDate {
    @Id
    @Column(name = "cycle_id")
    private Long cycleId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "cycle_id")
    private Cycle cycle;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private Symptom symptom;
}


