package swp391.com.backend.feature.schedule.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.schedule.dto.*;
import swp391.com.backend.feature.schedule.service.ScheduleService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping("/{doctorId}/{date}")
    public ResponseEntity<List<Integer>> getAvailableSlots(@PathVariable Long doctorId, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Integer> availableSlots = scheduleService.findAvailableSlots(doctorId, date).stream()
                .map(slot -> slot.ordinal())
                .toList();
        return ResponseEntity.ok(availableSlots);
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<List<DoctorScheduleResponse>> getAllDoctorSchedules() {
        List<DoctorScheduleResponse> schedules = scheduleService.getAllDoctorSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/admin/doctor/{doctorId}")
    public ResponseEntity<DoctorScheduleResponse> getDoctorSchedules(@PathVariable Long doctorId) {
        DoctorScheduleResponse schedules = scheduleService.getDoctorSchedules(doctorId);
        return ResponseEntity.ok(schedules);
    }

    @PostMapping("/admin/create")
    public ResponseEntity<List<ScheduleResponse>> createSchedules(@RequestBody CreateScheduleRequest request) {
        List<ScheduleResponse> createdSchedules = scheduleService.createSchedules(request);
        return ResponseEntity.ok(createdSchedules);
    }

    @PutMapping("/admin/{scheduleId}")
    public ResponseEntity<ScheduleResponse> updateSchedule(@PathVariable Long scheduleId, @RequestBody UpdateScheduleRequest request) {
        ScheduleResponse updatedSchedule = scheduleService.updateSchedule(scheduleId, request);
        return ResponseEntity.ok(updatedSchedule);
    }

    @DeleteMapping("/admin/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/doctor/{doctorId}/date/{date}")
    public ResponseEntity<Void> deleteDoctorSchedulesByDate(
            @PathVariable Long doctorId, 
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        scheduleService.deleteDoctorSchedulesByDate(doctorId, date);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/slot-options")
    public ResponseEntity<List<SlotOptionResponse>> getSlotOptions() {
        List<SlotOptionResponse> slotOptions = scheduleService.getSlotOptions();
        return ResponseEntity.ok(slotOptions);
    }
}
