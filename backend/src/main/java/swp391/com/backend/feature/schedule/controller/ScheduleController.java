package swp391.com.backend.feature.schedule.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.schedule.dto.ScheduleDTO;
import swp391.com.backend.feature.schedule.service.ScheduleService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping("/{doctorId}/{date}")
    public ResponseEntity<ScheduleDTO> getDoctorSchedule(@PathVariable Long doctorId, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Integer> availableSlots = scheduleService.findAvailableSlots(doctorId, date).stream()
                .map(Slot::ordinal)
                .toList();
        List<Integer> busySlots = scheduleService.findBusySlots(doctorId, date).stream()
                .map(Slot::ordinal)
                .toList();
        List<Integer> scheduledSlots = scheduleService.findScheduledSlots(doctorId, date).stream()
                .map(Slot::ordinal)
                .toList();
        ScheduleDTO dto = new ScheduleDTO(doctorId,scheduledSlots, busySlots, availableSlots);
        return ResponseEntity.ok(dto);
    }
}
