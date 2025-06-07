package swp391.com.backend.pojo.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import swp391.com.backend.pojo.test.Test;

@Entity
@Getter
@Setter
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
    private Boolean results;
}

