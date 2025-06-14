package swp391.com.backend.jpa.repository.examination;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;

import java.util.List;

@Repository
public interface ResultDetailRepository extends JpaRepository<ResultDetail, Long> {
    ResultDetail findByResultId(Long resultId);

    List<ResultDetail> findAllByResultId(Long resultId);

    ResultDetail findByResultIdAndTestTypeId(Long resultId, Long testTypeId);
}
