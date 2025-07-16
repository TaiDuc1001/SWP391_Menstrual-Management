package swp391.com.backend.feature.result.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.feature.examination.data.Examination;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    Result findResultByExamination_Id(Long examinationId);

    Result findResultByExamination(Examination examination);
}

