package swp391.com.backend.feature.panelTestType.data;

import jakarta.persistence.*;
import lombok.*;
import swp391.com.backend.feature.panel.data.Panel;
import swp391.com.backend.feature.testType.data.TestType;

import java.io.Serializable;

@Entity
@Table(name = "panel_test_types")
@Data
@NoArgsConstructor
@IdClass(PanelTestTypeID.class)
public class PanelTestType {
    @Id
    @Column(name = "test_type_id")
    private Long testTypeId;

    @Id
    @Column(name = "panel_id")
    private Long panelId;

    @ManyToOne
    @JoinColumn(name = "test_type_id", insertable = false, updatable = false)
    private TestType testType;

    @ManyToOne
    @JoinColumn(name = "panel_id", insertable = false, updatable = false)
    private Panel aPanel;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class PanelTestTypeID implements Serializable {
    private Long testTypeId;
    private Long panelId;
}

