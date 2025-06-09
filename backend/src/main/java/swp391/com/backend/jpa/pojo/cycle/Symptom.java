package swp391.com.backend.jpa.pojo.cycle;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
@Table(name = "symptoms")
@Data
@NoArgsConstructor
public class Symptom{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String name;

    @Column(name = "is_active")
    private Boolean isActive;

    @OneToMany(mappedBy = "symptoms")
    private List<CycleSymptomByDate> cycleSymptoms;
}

