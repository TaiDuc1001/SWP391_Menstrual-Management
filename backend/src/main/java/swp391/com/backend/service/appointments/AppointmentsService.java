package swp391.com.backend.service.appointments;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.appointments.Appointment;
import swp391.com.backend.jpa.repository.appointments.AppointmentsRepository;
import swp391.com.backend.service.roles.DoctorService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentsService {
    private final AppointmentsRepository appointmentsRepository;
    private final DoctorService doctorService;

    public List<Appointment> getAllAppointments() {
        return appointmentsRepository.findAll();
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointmentsRepository.delete(appointment);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentsRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existingAppointment = appointmentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        existingAppointment.setDate(appointment.getDate());
        existingAppointment.setSlot(appointment.getSlot());
        existingAppointment.setDoctor(doctorService.findDoctorById(appointment.getDoctor().getId()));
        return appointmentsRepository.save(existingAppointment);
    }

    public Appointment findAppointmentById(Long id) {
        return appointmentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }
}
