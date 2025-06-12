package swp391.com.backend.jpa.repository.examination;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.examination.Examination;

@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    Examination findExaminationById(Long id);
}
