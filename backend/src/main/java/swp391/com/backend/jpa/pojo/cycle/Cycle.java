package swp391.com.backend.jpa.pojo.cycle;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.roles.Account;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "cycles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cycle{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "cycle_start_date")
    private LocalDate cycleStartDate;

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

    @Column(name = "is_active", columnDefinition = "TINYINT(1)")
    private Boolean isActive;

    @OneToMany(mappedBy = "cycles")
    private List<CycleSymptomByDate> cycleSymptoms;
}

