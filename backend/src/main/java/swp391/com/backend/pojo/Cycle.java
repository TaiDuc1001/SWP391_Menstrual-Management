package swp391.com.backend.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Cycles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "cycle_start_date")
    private LocalDate cycleStartDate;

    @Column(name = "cycle_end_date")
    private LocalDate cycleEndDate;

    @Column(name = "cycle_length")
    private Integer cycleLength;

    @Column(name = "period_duration")
    private Integer periodDuration;

    @Column(name = "ovulation_date")
    private LocalDate ovulationDate;

    @Column(name = "fertility_window_start")
    private LocalDate fertilityWindowStart;

    @Column(name = "fertility_window_end")
    private LocalDate fertilityWindowEnd;

    @Column(name = "contraceptive_reminder")
    private String contraceptiveReminder;

    @Column(name = "is_active")
    private Boolean isActive;

    @OneToMany(mappedBy = "cycles")
    private List<CycleSymptomByDate> cycleSymptoms;
}

