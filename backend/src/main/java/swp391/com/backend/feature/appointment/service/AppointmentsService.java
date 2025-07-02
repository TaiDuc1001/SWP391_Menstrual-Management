package swp391.com.backend.feature.appointment.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.appointment.data.AppointmentRepository;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.doctor.service.DoctorService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentsService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorService doctorService;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByDoctorId(Long id) {
        List<Appointment> result = appointmentRepository.findAppointmentsByDoctorId(id).stream()
                .filter(appointment -> !(appointment.getAppointmentStatus() == (AppointmentStatus.BOOKED)))
                .toList();
        return result;
    }

    public List<Appointment> getAppointmentsByCustomerId(Long id) {
        List<Appointment> result = appointmentRepository.findAppointmentsByCustomerId(id);
        return result;
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));
        appointmentRepository.delete(appointment);
    }

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        validateNewAppointment(appointment);
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existingAppointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        if (!existingAppointment.getDate().equals(appointment.getDate()) || 
            !existingAppointment.getSlot().equals(appointment.getSlot()) ||
            !existingAppointment.getDoctor().getId().equals(appointment.getDoctor().getId())) {
            validateNewAppointment(appointment);
        }

        existingAppointment.setDate(appointment.getDate());
        existingAppointment.setSlot(appointment.getSlot());
        existingAppointment.setDoctor(doctorService.findDoctorById(appointment.getDoctor().getId()));
        return appointmentRepository.save(existingAppointment);
    }
    public Appointment findAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with id: " + id));
    }

    private void validateNewAppointment(Appointment appointment) {
        Appointment result = appointmentRepository.findAppointmentByDoctorIdAndSlotAndDate(
                appointment.getDoctor().getId(), appointment.getSlot(),appointment.getDate());

        if (result != null) {
            throw new EntityExistsException(
                String.format("An appointment already exists for doctor %s on %s at %s", 
                    appointment.getDoctor().getName(),
                    appointment.getDate(),
                    appointment.getSlot().getTimeRange())
            );
        }
    }


}
