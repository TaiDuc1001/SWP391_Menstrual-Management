package swp391.com.backend.feature.resultDetail.data;

import jakarta.persistence.*;
import lombok.*;
import swp391.com.backend.feature.result.data.Result;
import swp391.com.backend.feature.testType.data.TestType;

import java.io.Serializable;

@Entity
@Table(name = "result_details")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@IdClass(ResultDetailId.class)
public class ResultDetail {

    @Id
    @Column(name = "result_id")
    private Long resultId;

    @Id
    @Column(name = "test_type_id")
    private Long testTypeId;

    private String testIndex;
    private String notes;

    @Column(name = "diagnosis", columnDefinition = "TINYINT(1)")
    private Boolean diagnosis;

    @ManyToOne
    @JoinColumn(name = "result_id")
    private Result result;

    @ManyToOne
    @JoinColumn(name = "test_type_id")
    private TestType testType;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class ResultDetailId implements Serializable {
    private Long resultId;
    private Long testTypeId;
}
