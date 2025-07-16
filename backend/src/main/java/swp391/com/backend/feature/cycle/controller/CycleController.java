package swp391.com.backend.feature.cycle.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.cycle.dto.CycleDTO;
import swp391.com.backend.feature.cycle.dto.CycleCreationRequest;
import swp391.com.backend.feature.cycle.mapper.CycleMapper;
import swp391.com.backend.feature.cycle.data.Cycle;
import swp391.com.backend.feature.cycle.service.CycleService;
import swp391.com.backend.common.util.AuthenticationUtil;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/cycles")
@RestController
@RequiredArgsConstructor
public class CycleController {
    private final CycleService cycleService;
    private final CycleMapper cycleMapper;
    private final AuthenticationUtil authenticationUtil;

    @PostMapping
    public ResponseEntity<CycleDTO> createCycle(@RequestBody CycleCreationRequest request) {
        Long customerId = authenticationUtil.getCurrentCustomerId();

        Cycle cycle = Cycle.builder()
                .cycleStartDate(request.getStartDate())
                .cycleLength(request.getCycleLength())
                .periodDuration(request.getPeriodDuration())
                .build();
        Cycle predictedCycle = cycleService.cyclePrediction(cycle);
        Cycle createdCycle = cycleService.createCycleForCustomer(predictedCycle, customerId);

        return ResponseEntity.ok(cycleMapper.toDTO(createdCycle));
    }

    @PostMapping("/next-prediction")
    public ResponseEntity<CycleDTO> nextCyclePrediction() {
        Cycle predictedCycle = cycleService.nextCyclePrediction();
        return ResponseEntity.ok(cycleMapper.toDTO(predictedCycle));
    }

    @GetMapping
    public ResponseEntity<List<CycleDTO>> getAllCycles() {
        Long customerId = authenticationUtil.getCurrentCustomerId();
        
        List<Cycle> cycles = cycleService.getCyclesByCustomer(customerId);
        List<CycleDTO> cycleDTOs = cycles.stream()
                .map(cycleMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cycleDTOs);
    }

    @GetMapping("/closest")
    public ResponseEntity<CycleDTO> getClosestCycle() {
        Long customerId = authenticationUtil.getCurrentCustomerId();
        
        Cycle closestCycle = cycleService.getClosestCycleByCustomer(customerId);
        return ResponseEntity.ok(cycleMapper.toDTO(closestCycle));
    }

    @GetMapping("/predict/{year}/{month}")
    public ResponseEntity<CycleDTO> predictCycleForMonth(
            @PathVariable int year,
            @PathVariable int month,
            @RequestParam(defaultValue = "3") Long customerId) {
        Cycle predictedCycle = cycleService.cyclePredictionForMonth(year, month, customerId);
        if (predictedCycle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cycleMapper.toDTO(predictedCycle));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllCycles() {
        Long customerId = authenticationUtil.getCurrentCustomerId();
        
        cycleService.deleteAllCyclesForCustomer(customerId);
        return ResponseEntity.ok().build();
    }
}

