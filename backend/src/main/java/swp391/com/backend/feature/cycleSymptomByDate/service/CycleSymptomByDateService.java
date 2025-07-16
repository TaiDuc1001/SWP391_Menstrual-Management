package swp391.com.backend.feature.cycleSymptomByDate.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.cycle.data.Cycle;
import swp391.com.backend.feature.cycle.data.CycleRepository;
import swp391.com.backend.feature.cycleSymptomByDate.data.CycleSymptomByDate;
import swp391.com.backend.feature.cycleSymptomByDate.data.CycleSymptomByDateRepository;
import swp391.com.backend.feature.cycleSymptomByDate.data.Symptom;
import swp391.com.backend.feature.cycleSymptomByDate.dto.CycleSymptomByDateRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CycleSymptomByDateService {
    private final CycleSymptomByDateRepository cycleSymptomByDateRepository;
    private final CycleRepository cycleRepository;

    public CycleSymptomByDate saveSymptom(CycleSymptomByDateRequest request) {


        List<Cycle> cycles = cycleRepository.findAll();
        if (cycles.isEmpty()) {
            throw new RuntimeException("No cycles found");
        }
        
        Cycle latestCycle = cycles.get(cycles.size() - 1);
        
        CycleSymptomByDate symptom = new CycleSymptomByDate();
        symptom.setCycleId(latestCycle.getId());
        symptom.setDate(request.getDate());
        symptom.setSymptom(request.getSymptom());
        
        return cycleSymptomByDateRepository.save(symptom);
    }

    public List<CycleSymptomByDate> getSymptomsByCycle(Long cycleId) {
        return cycleSymptomByDateRepository.findByCycleId(cycleId);
    }

    public List<CycleSymptomByDate> getAllSymptoms() {
        return cycleSymptomByDateRepository.findAll();
    }

    public void deleteSymptom(Long cycleId, LocalDateTime date, Symptom symptom) {
        Optional<CycleSymptomByDate> existingSymptom = cycleSymptomByDateRepository
                .findByCycleIdAndDateAndSymptom(cycleId, date, symptom);
        
        if (existingSymptom.isPresent()) {
            cycleSymptomByDateRepository.delete(existingSymptom.get());
        }
    }

    public void deleteSymptomsByDate(LocalDateTime date) {
        List<CycleSymptomByDate> symptoms = cycleSymptomByDateRepository.findByDate(date);
        cycleSymptomByDateRepository.deleteAll(symptoms);
    }
}

