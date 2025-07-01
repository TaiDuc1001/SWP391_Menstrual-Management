package swp391.com.backend.feature.appointment.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findAppointmentByDoctorAndDate(Doctor doctor, LocalDate date);

    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor = :doctor AND a.date = :date AND a.slot = :slot AND a.appointmentStatus NOT IN (swp391.com.backend.feature.appointment.data.AppointmentStatus.CANCELLED, swp391.com.backend.feature.appointment.data.AppointmentStatus.FINISHED)")
    boolean existsByDoctorAndDateAndSlotAndNotCancelled(@Param("doctor") Doctor doctor, @Param("date") LocalDate date, @Param("slot") Slot slot);

    List<Appointment> findAppointmentsByDoctorId(Long id);

    Appointment findAppointmentByDoctorIdAndSlotAndDate(Long doctorId, Slot slot, LocalDate date);

    List<Appointment> findAppointmentsByCustomerId(Long id);
}
