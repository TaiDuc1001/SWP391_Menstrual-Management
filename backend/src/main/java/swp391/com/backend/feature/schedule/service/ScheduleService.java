package swp391.com.backend.feature.schedule.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.appointment.data.AppointmentRepository;
import swp391.com.backend.feature.doctor.data.Doctor;
import swp391.com.backend.feature.doctor.data.DoctorRepository;
import swp391.com.backend.feature.schedule.data.Schedule;
import swp391.com.backend.feature.schedule.data.ScheduleRepository;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.schedule.dto.*;
import swp391.com.backend.feature.schedule.mapper.ScheduleMapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final ScheduleMapper scheduleMapper;

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

    // Admin methods
    public List<DoctorScheduleResponse> getAllDoctorSchedules() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
                .map(this::buildDoctorScheduleResponse)
                .collect(Collectors.toList());
    }

    public DoctorScheduleResponse getDoctorSchedules(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        return buildDoctorScheduleResponse(doctor);
    }

    @Transactional
    public List<ScheduleResponse> createSchedules(CreateScheduleRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + request.getDoctorId()));

        List<Schedule> createdSchedules = new ArrayList<>();
        
        for (Slot slot : request.getSlots()) {
            // Check if slot already exists
            if (scheduleRepository.existsByDoctorAndDateAndSlot(doctor, request.getDate(), slot)) {
                throw new RuntimeException("Schedule already exists for doctor " + doctor.getName() + 
                    " on " + request.getDate() + " at slot " + slot.name());
            }
            
            Schedule schedule = new Schedule();
            schedule.setDoctor(doctor);
            schedule.setDate(request.getDate());
            schedule.setSlot(slot);
            
            createdSchedules.add(scheduleRepository.save(schedule));
        }

        return createdSchedules.stream()
                .map(this::mapToScheduleResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScheduleResponse updateSchedule(Long scheduleId, UpdateScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));

        // Check if new slot conflicts with existing schedules
        if (scheduleRepository.existsByDoctorAndDateAndSlot(schedule.getDoctor(), request.getDate(), request.getSlot())) {
            Schedule existingSchedule = scheduleRepository.findByDoctorAndDate(schedule.getDoctor(), request.getDate())
                    .stream()
                    .filter(s -> s.getSlot().equals(request.getSlot()) && !s.getId().equals(scheduleId))
                    .findFirst()
                    .orElse(null);
                    
            if (existingSchedule != null) {
                throw new RuntimeException("Schedule already exists for this doctor on " + request.getDate() + 
                    " at slot " + request.getSlot().name());
            }
        }

        schedule.setDate(request.getDate());
        schedule.setSlot(request.getSlot());
        
        Schedule updatedSchedule = scheduleRepository.save(schedule);
        return mapToScheduleResponse(updatedSchedule);
    }

    @Transactional
    public void deleteSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));

        // Check if schedule has appointments
        boolean hasAppointments = appointmentRepository.findAppointmentByDoctorAndDate(schedule.getDoctor(), schedule.getDate())
                .stream()
                .anyMatch(appointment -> appointment.getSlot().equals(schedule.getSlot()));

        if (hasAppointments) {
            throw new RuntimeException("Cannot delete schedule. There are existing appointments for this slot.");
        }

        scheduleRepository.deleteById(scheduleId);
    }

    @Transactional
    public void deleteDoctorSchedulesByDate(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        // Check if any schedules have appointments
        List<Schedule> schedules = scheduleRepository.findByDoctorIdAndDate(doctorId, date);
        boolean hasAppointments = schedules.stream()
                .anyMatch(schedule -> appointmentRepository.findAppointmentByDoctorAndDate(doctor, date)
                        .stream()
                        .anyMatch(appointment -> appointment.getSlot().equals(schedule.getSlot())));

        if (hasAppointments) {
            throw new RuntimeException("Cannot delete schedules. There are existing appointments for this date.");
        }

        scheduleRepository.deleteByDoctorIdAndDate(doctorId, date);
    }

    public List<SlotOptionResponse> getSlotOptions() {
        return Arrays.stream(Slot.values())
                .filter(slot -> slot != Slot.ZERO)
                .map(scheduleMapper::toSlotOptionResponse)
                .collect(Collectors.toList());
    }

    private DoctorScheduleResponse buildDoctorScheduleResponse(Doctor doctor) {
        List<Schedule> schedules = scheduleRepository.findByDoctor(doctor);
        List<ScheduleResponse> scheduleResponses = schedules.stream()
                .map(this::mapToScheduleResponse)
                .collect(Collectors.toList());

        return new DoctorScheduleResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                scheduleResponses
        );
    }

    private ScheduleResponse mapToScheduleResponse(Schedule schedule) {
        ScheduleResponse response = scheduleMapper.toScheduleResponse(schedule);
        
        // Check if this schedule has appointments
        boolean hasAppointment = appointmentRepository.findAppointmentByDoctorAndDate(schedule.getDoctor(), schedule.getDate())
                .stream()
                .anyMatch(appointment -> appointment.getSlot().equals(schedule.getSlot()));
        
        response.setHasAppointment(hasAppointment);
        return response;
    }
}
