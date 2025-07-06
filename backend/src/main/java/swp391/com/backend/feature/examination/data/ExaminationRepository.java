package swp391.com.backend.feature.examination.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    Examination findExaminationById(Long id);

    @Query("SELECT COUNT(e) > 0 FROM Examination e WHERE e.date = :date AND e.slot = :slot AND e.examinationStatus NOT IN (swp391.com.backend.feature.examination.data.ExaminationStatus.CANCELLED, swp391.com.backend.feature.examination.data.ExaminationStatus.COMPLETED)")
    boolean existsByDateAndSlotAndNotCancelledOrCompleted(@Param("date") LocalDate date, @Param("slot") Slot slot);

    @Query("SELECT e.slot FROM Examination e WHERE e.date = :date AND e.examinationStatus NOT IN (swp391.com.backend.feature.examination.data.ExaminationStatus.CANCELLED, swp391.com.backend.feature.examination.data.ExaminationStatus.COMPLETED)")
    List<Slot> findBookedSlotsByDate(@Param("date") LocalDate date);

    List<Examination> findExaminationsByStaffId(Long id);

    List<Examination> findExaminationsByCustomerId(Long customerId);
}
