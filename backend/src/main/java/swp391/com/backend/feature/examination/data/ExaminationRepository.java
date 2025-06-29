package swp391.com.backend.feature.examination.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.examination.data.ExaminationStatus;

import java.time.LocalDate;
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
    @Query("SELECT COUNT(e) > 0 FROM Examination e WHERE e.date = :date AND e.slot = :slot AND e.examinationStatus NOT IN (swp391.com.backend.feature.examination.data.ExaminationStatus.CANCELLED, swp391.com.backend.feature.examination.data.ExaminationStatus.COMPLETED)")
    boolean existsByDateAndSlotAndNotCancelledOrCompleted(@Param("date") LocalDate date, @Param("slot") Slot slot);

    @Query("SELECT e.slot FROM Examination e WHERE e.date = :date AND e.examinationStatus NOT IN (swp391.com.backend.feature.examination.data.ExaminationStatus.CANCELLED, swp391.com.backend.feature.examination.data.ExaminationStatus.COMPLETED)")
    List<Slot> findBookedSlotsByDate(@Param("date") LocalDate date);

    @Modifying
    @Transactional
    @Query("UPDATE Examination e SET e.staff = null WHERE e.staff.id = :staffId")
    void updateStaffToNullByStaffId(@Param("staffId") Long staffId);
    
    @Modifying
    @Transactional
    @Query("UPDATE Examination e SET e.customer = null WHERE e.customer.id = :customerId")
    void updateCustomerToNullByCustomerId(@Param("customerId") Long customerId);

}
