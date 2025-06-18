package swp391.com.backend.feature.schedule.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.appointment.data.AppointmentRepository;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.data.DoctorRepository;
import swp391.com.backend.feature.schedule.data.ScheduleRepository;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    public List<Slot> findAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId).get();
        List<Slot> bookedSlots = appointmentRepository.findAppointmentByDoctorAndDate(doctor, date).stream()
                .map(appointment -> appointment.getSlot())
                .toList();
        List<Slot> scheduledSlots = scheduleRepository.findByDoctorAndDate(doctor, date).stream()
                .map(schedule -> schedule.getSlot())
                .filter(slot -> !bookedSlots.contains(slot))
                .toList();


        return scheduledSlots;
    }
}
