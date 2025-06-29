package swp391.com.backend.feature.panel.data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.panelTestType.data.PanelTestType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "panels")
@Data
@NoArgsConstructor
public class Panel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String panelName;

    @Lob
    private String description;

    private BigDecimal price;

    private Integer responseTime;

    private Integer duration;

    private PanelType panelType;

    private PanelTag panelTag;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "aPanel")
    private List<PanelTestType> panelTestTypes;

    @OneToMany(mappedBy = "panel")
    private List<Examination> examinations;
}
