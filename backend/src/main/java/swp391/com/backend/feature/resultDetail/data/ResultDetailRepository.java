package swp391.com.backend.feature.resultDetail.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultDetailRepository extends JpaRepository<ResultDetail, Long> {
    ResultDetail findByResultId(Long resultId);

    List<ResultDetail> findAllByResultId(Long resultId);

    ResultDetail findByResultIdAndTestTypeId(Long resultId, Long testTypeId);
}

