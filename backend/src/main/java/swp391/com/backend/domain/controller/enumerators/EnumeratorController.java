package swp391.com.backend.domain.controller.enumerators;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.jpa.pojo.schedule.Slot;

@RestController
@RequestMapping("/api/enumerators")
@RequiredArgsConstructor
public class EnumeratorController {
    @GetMapping("/slots")
    public ResponseEntity<Slot[]> getAllSlots() {
        return ResponseEntity.ok(Slot.values());
    }


}
