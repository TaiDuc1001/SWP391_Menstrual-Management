package swp391.com.backend.feature.cycleSymptomByDate.data;

import jakarta.persistence.*;
import lombok.*;
import swp391.com.backend.feature.cycle.data.Cycle;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "cycle_symptom_by_date")
@Data
@NoArgsConstructor
@IdClass(CycleSymptomByDateId.class)
public class CycleSymptomByDate {
    @Id
    @Column(name = "cycle_id")
    private Long cycleId;

    @ManyToOne
    @JoinColumn(name = "cycle_id", insertable = false, updatable = false)
    private Cycle cycle;

    @Id
    private LocalDateTime date;

    @Id
    @Enumerated(EnumType.STRING)
    private Symptom symptom;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class CycleSymptomByDateId implements Serializable {
    private Long cycleId;
    private LocalDateTime date;
    private Symptom symptom;
}


