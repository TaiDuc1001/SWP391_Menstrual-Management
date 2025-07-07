package swp391.com.backend.feature.appointment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.appointment.data.AppointmentRepository;
import swp391.com.backend.feature.appointment.exception.AppointmentConflictException;
import swp391.com.backend.feature.doctor.service.DoctorService;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentsService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorService doctorService;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsForDoctor() {
        // TODO: Get doctor ID from security context
        // For now, return all appointments - this should be changed in production
        return appointmentRepository.findAppointmentsForDoctor();
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findAppointmentsByDoctorId(doctorId);
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointmentRepository.delete(appointment);
    }
    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        validateAppointmentConflict(appointment);
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existingAppointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!existingAppointment.getDate().equals(appointment.getDate()) || 
            !existingAppointment.getSlot().equals(appointment.getSlot()) ||
            !existingAppointment.getDoctor().getId().equals(appointment.getDoctor().getId())) {
            validateAppointmentConflict(appointment);
        }

        existingAppointment.setDate(appointment.getDate());
        existingAppointment.setSlot(appointment.getSlot());
        existingAppointment.setDoctor(doctorService.findDoctorById(appointment.getDoctor().getId()));
        return appointmentRepository.save(existingAppointment);
    }
    public Appointment findAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }
    private void validateAppointmentConflict(Appointment appointment) {
        boolean conflictExists = appointmentRepository.existsByDoctorAndDateAndSlotAndNotCancelled(
                appointment.getDoctor(), 
                appointment.getDate(), 
                appointment.getSlot()
        );
        
        if (conflictExists) {
            throw new AppointmentConflictException(
                String.format("An appointment already exists for doctor %s on %s at %s", 
                    appointment.getDoctor().getName(),
                    appointment.getDate(),
                    appointment.getSlot().getTimeRange())
            );
        }
    }

    public List<String> getAvailableSlots(Long doctorId, String dateString) {
        Doctor doctor = doctorService.findDoctorById(doctorId);
        LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
        
        return Arrays.stream(Slot.values())
                .filter(slot -> !slot.equals(Slot.ZERO))
                .filter(slot -> !appointmentRepository.existsByDoctorAndDateAndSlotAndNotCancelled(doctor, date, slot))
                .map(Slot::getTimeRange)
                .collect(Collectors.toList());
    }

    public Double getAverageRatingByDoctorId(Long doctorId) {
        return appointmentRepository.findAverageRatingByDoctorId(doctorId);
    }

    public Long getTotalRatingsByDoctorId(Long doctorId) {
        return appointmentRepository.countRatingsByDoctorId(doctorId);
    }
}
