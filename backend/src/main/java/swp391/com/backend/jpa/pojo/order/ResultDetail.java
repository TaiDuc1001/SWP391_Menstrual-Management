package swp391.com.backend.jpa.pojo.order;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.test.Test;

@Entity
@Table(name = "result_details")
@Data
@NoArgsConstructor
public class ResultDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "result_id")
    private Result result;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

    private Integer score;
    private String notes;
    @Column(name = "results", columnDefinition = "TINYINT(1)")
    private Boolean results;
}

