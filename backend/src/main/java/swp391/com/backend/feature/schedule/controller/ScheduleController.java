package swp391.com.backend.feature.schedule.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.schedule.dto.ScheduleRequest;
import swp391.com.backend.feature.schedule.service.ScheduleService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping
    public List<Slot> getAvailableSlots(@RequestBody ScheduleRequest request) {
        return scheduleService.findAvailableSlots(request.getDoctorId(), request.getDate());
    }
}
