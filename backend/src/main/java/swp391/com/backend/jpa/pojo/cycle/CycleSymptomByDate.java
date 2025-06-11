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
    private Long cycleId;

    private LocalDateTime date;

    private Symptom symptom;

    @ManyToOne
    @JoinColumn(name = "cycle_id", insertable = false, updatable = false)
    private Cycle cycles;
}


