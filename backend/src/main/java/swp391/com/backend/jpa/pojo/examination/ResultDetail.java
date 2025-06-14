package swp391.com.backend.jpa.pojo.examination;

import jakarta.persistence.*;
import lombok.*;
import swp391.com.backend.jpa.pojo.test.TestType;

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
