package swp391.com.backend.feature.cycleSymptomByDate.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.cycleSymptomByDate.data.CycleSymptomByDate;
import swp391.com.backend.feature.cycleSymptomByDate.data.Symptom;
import swp391.com.backend.feature.cycleSymptomByDate.dto.CycleSymptomByDateRequest;
import swp391.com.backend.feature.cycleSymptomByDate.dto.CycleSymptomByDateResponse;
import swp391.com.backend.feature.cycleSymptomByDate.service.CycleSymptomByDateService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cycle-symptoms")
@RequiredArgsConstructor
public class CycleSymptomByDateController {
    private final CycleSymptomByDateService cycleSymptomByDateService;

    @PostMapping
    public ResponseEntity<CycleSymptomByDateResponse> saveSymptom(@RequestBody CycleSymptomByDateRequest request) {
        CycleSymptomByDate savedSymptom = cycleSymptomByDateService.saveSymptom(request);
        
        CycleSymptomByDateResponse response = new CycleSymptomByDateResponse(
                savedSymptom.getCycleId(),
                savedSymptom.getDate(),
                savedSymptom.getSymptom()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CycleSymptomByDateResponse>> getAllSymptoms() {
        List<CycleSymptomByDate> symptoms = cycleSymptomByDateService.getAllSymptoms();
        
        List<CycleSymptomByDateResponse> responses = symptoms.stream()
                .map(symptom -> new CycleSymptomByDateResponse(
                        symptom.getCycleId(),
                        symptom.getDate(),
                        symptom.getSymptom()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/cycle/{cycleId}")
    public ResponseEntity<List<CycleSymptomByDateResponse>> getSymptomsByCycle(@PathVariable Long cycleId) {
        List<CycleSymptomByDate> symptoms = cycleSymptomByDateService.getSymptomsByCycle(cycleId);
        
        List<CycleSymptomByDateResponse> responses = symptoms.stream()
                .map(symptom -> new CycleSymptomByDateResponse(
                        symptom.getCycleId(),
                        symptom.getDate(),
                        symptom.getSymptom()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteSymptomsByDate(@RequestParam LocalDateTime date) {
        cycleSymptomByDateService.deleteSymptomsByDate(date);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/specific")
    public ResponseEntity<Void> deleteSpecificSymptom(
            @RequestParam Long cycleId,
            @RequestParam LocalDateTime date,
            @RequestParam Symptom symptom) {
        cycleSymptomByDateService.deleteSymptom(cycleId, date, symptom);
        return ResponseEntity.ok().build();
    }
}

