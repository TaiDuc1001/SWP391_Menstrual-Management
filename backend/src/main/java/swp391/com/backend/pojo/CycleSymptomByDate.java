package swp391.com.backend.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@IdClass(CycleSymptomByDateId.class)
public class CycleSymptomByDate {
    @Id
    @Column(name = "cycle_id")
    private Integer cycleId;

    @Id
    @Column(name = "symptom_id")
    private Integer symptomId;

    @Id
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "cycle_id", insertable = false, updatable = false)
    private Cycle cycles;

    @ManyToOne
    @JoinColumn(name = "symptom_id", insertable = false, updatable = false)
    private Symptom symptoms;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class CycleSymptomByDateId implements Serializable {
    private Integer cycleId;
    private Integer symptomId;
    private LocalDateTime date;
}

