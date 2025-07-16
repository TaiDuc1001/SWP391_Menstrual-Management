package swp391.com.backend.feature.enumerator;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.schedule.data.Slot;

@RestController
@RequestMapping("/api/enumerators")
@RequiredArgsConstructor
public class EnumeratorController {
    @GetMapping("/slots")
    public ResponseEntity<Slot[]> getAllSlots() {
        return ResponseEntity.ok(Slot.values());
    }

    @GetMapping("/appointment-status")
    public ResponseEntity<AppointmentStatus[]> getAllAppointmentStatus() {
        return ResponseEntity.ok(AppointmentStatus.values());
    }

    @GetMapping("/examination-status")
    public ResponseEntity<ExaminationStatus[]> getAllExaminationStatus() {
        return ResponseEntity.ok(ExaminationStatus.values());
    }
}

