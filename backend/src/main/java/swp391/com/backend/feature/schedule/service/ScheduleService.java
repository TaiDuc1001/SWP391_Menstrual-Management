package swp391.com.backend.feature.schedule.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.appointment.data.Appointment;
import swp391.com.backend.feature.appointment.data.AppointmentRepository;
import swp391.com.backend.feature.schedule.data.Schedule;
import swp391.com.backend.feature.schedule.data.ScheduleRepository;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;
import java.util.List;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private static final Logger logger = Logger.getLogger(ScheduleService.class.getName());

    public List<Slot> findAvailableSlots(Long doctorId, LocalDate date) {
        System.out.println("Finding available slots for doctor ID: " + doctorId + " on date: " + date);
        List<Slot> bookedSlots = appointmentRepository.findAppointmentsByDoctorIdAndDate(doctorId, date).stream()
                .map(Appointment::getSlot)
                .toList();
        System.out.println("Booked slots: " + bookedSlots);

        List<Slot> scheduledSlots = scheduleRepository.findSchedulesByDoctorIdAndDate(doctorId, date).stream()
                .map(Schedule::getSlot)
                .filter(slot -> !bookedSlots.contains(slot))
                .toList();
        return scheduledSlots;
    }
}
