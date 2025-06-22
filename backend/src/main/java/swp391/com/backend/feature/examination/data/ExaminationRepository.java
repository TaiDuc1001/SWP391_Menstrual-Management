package swp391.com.backend.feature.examination.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    Examination findExaminationById(Long id);
    
    @Query("SELECT e FROM Examination e " +
           "LEFT JOIN FETCH e.staff " +
           "LEFT JOIN FETCH e.customer " +
           "LEFT JOIN FETCH e.panel " +
           "WHERE e.id = :id")
    Examination findExaminationByIdWithRelations(@Param("id") Long id);
    
    @Query("SELECT e FROM Examination e " +
           "LEFT JOIN FETCH e.staff " +
           "LEFT JOIN FETCH e.customer " +
           "LEFT JOIN FETCH e.panel")
    List<Examination> findAllWithRelations();
}
