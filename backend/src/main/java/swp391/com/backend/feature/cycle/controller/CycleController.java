package swp391.com.backend.feature.cycle.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.cycle.assembler.CycleAssembler;
import swp391.com.backend.feature.cycle.data.Cycle;
import swp391.com.backend.feature.cycle.dto.CycleCreationRequest;
import swp391.com.backend.feature.cycle.dto.CycleDTO;
import swp391.com.backend.feature.cycle.mapper.CycleMapper;
import swp391.com.backend.feature.cycle.service.CycleService;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/cycles")
@RestController
@RequiredArgsConstructor
public class CycleController {
    private final CycleService cycleService;
    private final CycleMapper cycleMapper;
    private final CycleAssembler cycleAssembler;

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

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CollectionModel<EntityModel<CycleDTO>>> getCycleByCustomerId(@PathVariable long customerId) {
        List<Cycle> cycles = cycleService.getCyclesByCustomerId(customerId);
        List<CycleDTO> dtos = cycleMapper.toDTOs(cycles);
        CollectionModel<EntityModel<CycleDTO>> collectionModel = cycleAssembler.toCollectionModel(dtos);
        return ResponseEntity.ok(collectionModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<CycleDTO>> getCycleById(@PathVariable long id) {
        Cycle cycle = cycleService.getCycleById(id);
        if (cycle == null) {
            throw new EntityNotFoundException("Cycle not found with id: " + id);
        }
        CycleDTO cycleDTO = cycleMapper.toDTO(cycle);
        EntityModel<CycleDTO> entityModel = cycleAssembler.toModel(cycleDTO);
        return ResponseEntity.ok(entityModel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCycle(@PathVariable long id) {
        cycleService.deleteCycleById(id);
        return ResponseEntity.noContent().build();
    }
}
