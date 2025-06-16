package swp391.com.backend.feature.testType.data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.resultDetail.data.ResultDetail;
import swp391.com.backend.feature.panelTestType.data.PanelTestType;

import java.util.List;

@Entity
@Table(name = "test_types")
@Data
@NoArgsConstructor
public class TestType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String normalRange;

    @Lob
    private String description;

    @OneToMany(mappedBy = "testType")
    private List<PanelTestType> panelTestTypes;

    @OneToMany(mappedBy = "testType")
    private List<ResultDetail> resultDetails;
}
