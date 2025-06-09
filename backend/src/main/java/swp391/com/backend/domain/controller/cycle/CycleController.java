package swp391.com.backend.domain.controller.cycle;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.CycleDTO;
import swp391.com.backend.domain.dto.request.CycleCreationRequest;
import swp391.com.backend.domain.mapper.CycleMapper;
import swp391.com.backend.jpa.pojo.cycle.Cycle;
import swp391.com.backend.service.cycle.CycleService;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/cycles")
@RestController
@RequiredArgsConstructor
public class CycleController {
    private final CycleService cycleService;
    private final CycleMapper cycleMapper;

    @PostMapping
    public ResponseEntity<CycleDTO> createCycle(@RequestBody CycleCreationRequest request) {

        Cycle cycle = Cycle.builder()
                .cycleStartDate(request.getStartDate())
                .cycleLength(request.getCycleLength())
                .periodDuration(request.getPeriodDuration())
                .build();
        Cycle predictedCycle = cycleService.cyclePrediction(cycle);
        Cycle createdCycle = cycleService.createCycle(predictedCycle);

        return ResponseEntity.ok(cycleMapper.toDTO(createdCycle));
    }

    @PostMapping("/next-prediction")
    public ResponseEntity<CycleDTO> nextCyclePrediction() {
        Cycle predictedCycle = cycleService.nextCyclePrediction();
        return ResponseEntity.ok(cycleMapper.toDTO(predictedCycle));
    }

    @GetMapping
    public ResponseEntity<List<CycleDTO>> getAllCycles() {
        List<Cycle> cycles = cycleService.getAllCycles();
        List<CycleDTO> cycleDTOs = cycles.stream()
                .map(cycleMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cycleDTOs);
    }

    @GetMapping("/closest")
    public ResponseEntity<CycleDTO> getClosestCycle() {
        Cycle closestCycle = cycleService.getClosetCycleByDate();
        return ResponseEntity.ok(cycleMapper.toDTO(closestCycle));
    }
}
