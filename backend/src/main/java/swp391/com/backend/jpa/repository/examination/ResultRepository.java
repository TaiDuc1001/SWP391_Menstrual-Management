package swp391.com.backend.jpa.repository.examination;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.pojo.examination.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    Result findResultByExamination_Id(Long examinationId);

    Result findResultByExamination(Examination examination);
}
