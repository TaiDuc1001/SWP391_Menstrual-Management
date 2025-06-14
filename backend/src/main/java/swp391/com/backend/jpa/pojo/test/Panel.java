package swp391.com.backend.jpa.pojo.test;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.examination.Examination;

import java.math.BigDecimal;
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

    @OneToMany(mappedBy = "aPanel")
    private List<PanelTestType> panelTestTypes;

    @OneToMany(mappedBy = "panel")
    private List<Examination> examinations;
}
