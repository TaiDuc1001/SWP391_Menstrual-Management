package swp391.com.backend.feature.schedule.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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


}
