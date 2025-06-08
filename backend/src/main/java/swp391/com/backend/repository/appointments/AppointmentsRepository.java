package swp391.com.backend.repository.appointments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.pojo.appointments.Appointment;

@Repository
public interface AppointmentsRepository extends JpaRepository<Appointment, Integer> {
}
