package swp391.com.backend.feature.appointment.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findAppointmentByDoctorAndDate(Doctor doctor, LocalDate date);
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId")
    List<Appointment> findAppointmentsByDoctorId(@Param("doctorId") Long doctorId);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentStatus != AppointmentStatus.BOOKED")
    List<Appointment> findAppointmentsForDoctor();
    
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor = :doctor AND a.date = :date AND a.slot = :slot AND a.appointmentStatus NOT IN (swp391.com.backend.feature.appointment.data.AppointmentStatus.CANCELLED, swp391.com.backend.feature.appointment.data.AppointmentStatus.FINISHED)")
    boolean existsByDoctorAndDateAndSlotAndNotCancelled(@Param("doctor") Doctor doctor, @Param("date") LocalDate date, @Param("slot") Slot slot);
    
    @Modifying
    @Transactional
    @Query("UPDATE Appointment a SET a.customer = null WHERE a.customer.id = :customerId")
    void updateCustomerToNullByCustomerId(@Param("customerId") Long customerId);
    
    @Modifying
    @Transactional
    @Query("UPDATE Appointment a SET a.doctor = null WHERE a.doctor.id = :doctorId")
    void updateDoctorToNullByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT AVG(a.score) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.score IS NOT NULL")
    Double findAverageRatingByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.score IS NOT NULL")
    Long countRatingsByDoctorId(@Param("doctorId") Long doctorId);
}

