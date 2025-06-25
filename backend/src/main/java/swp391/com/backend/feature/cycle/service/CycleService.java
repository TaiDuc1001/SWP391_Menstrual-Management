package swp391.com.backend.feature.cycle.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.cycle.data.Cycle;
import swp391.com.backend.feature.cycle.data.CycleRepository;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CycleService {
    private final CycleRepository cycleRepository;

    public Cycle createCycle(Cycle cycle) {
        cycle.setId(null);
        return cycleRepository.save(cycle);
    }

    public List<Cycle> getAllCycles() {
        return cycleRepository.findAll();
    }

    public List<Cycle> getFourClosetCycleByDate(){
        LocalDate today = LocalDate.now();
        List<Cycle> cycles = getAllCycles();
        List<Cycle> fourClosestCycles  = cycles.stream()
                .sorted(Comparator.comparing(Cycle::getCycleStartDate))
                .limit(4)
                .toList();

        return fourClosestCycles;
    }

    public List<Cycle> getFourClosetCycleByCustomer(Long customerId){
        List<Cycle> cycles = getAllCycles();
        List<Cycle> fourClosestCycles  = cycles.stream()
                .filter(cycle -> cycle.getCustomer().getId().equals(customerId))
                .sorted(Comparator.comparing(Cycle::getCycleStartDate))
                .limit(4)
                .toList();

        return fourClosestCycles;
    }

    public Cycle getClosetCycleByDate(){
        LocalDate today = LocalDate.now();
        List<Cycle> cycles = getAllCycles();
        List<Cycle> ClosestCycles  = cycles.stream()
                .sorted(Comparator.comparing(Cycle::getCycleStartDate))
                .limit(1)
                .toList();

        return ClosestCycles.get(0);
    }

    public Cycle nextCyclePrediction() {
        List<Cycle> fourClosestCycles = getFourClosetCycleByDate();
        LocalDate predictedStartDate = fourClosestCycles.get(0).getCycleStartDate().plusDays(fourClosestCycles.get(0).getCycleLength()+1);

        double avgCycleLength = fourClosestCycles.stream()
                .mapToInt(Cycle::getCycleLength)
                .average()
                .orElse(0);

        double avgDuration = fourClosestCycles.stream()
                .mapToInt(Cycle::getPeriodDuration)
                .average()
                .orElse(0);

        Cycle predictedCycle = Cycle.builder()
                .cycleStartDate(predictedStartDate)
                .cycleLength((int) Math.round(avgCycleLength))
                .periodDuration((int) Math.round(avgDuration))
                .ovulationDate(predictedStartDate.plusDays(14))
                .fertilityWindowStart(predictedStartDate.plusDays(10))
                .fertilityWindowEnd(predictedStartDate.plusDays(15))
                .build();

        return predictedCycle;
    }

    public Cycle cyclePrediction(Cycle cycle) {
        Cycle predictedCycle = Cycle.builder()
                .cycleStartDate(cycle.getCycleStartDate())
                .cycleLength(cycle.getCycleLength())
                .periodDuration(cycle.getPeriodDuration())
                .ovulationDate(cycle.getCycleStartDate().plusDays(14))
                .fertilityWindowStart(cycle.getCycleStartDate().plusDays(10))
                .fertilityWindowEnd(cycle.getCycleStartDate().plusDays(15))
                .build();

        return predictedCycle;
    }

    public Cycle cyclePredictionForMonth(int year, int month) {
        List<Cycle> fourClosestCycles = getFourClosetCycleByDate();
        
        if (fourClosestCycles.isEmpty()) {
            return null;
        }

        double avgCycleLength = fourClosestCycles.stream()
                .mapToInt(Cycle::getCycleLength)
                .average()
                .orElse(28);

        double avgDuration = fourClosestCycles.stream()
                .mapToInt(Cycle::getPeriodDuration)
                .average()
                .orElse(7);

        Cycle lastCycle = fourClosestCycles.get(fourClosestCycles.size() - 1);
        LocalDate lastCycleStart = lastCycle.getCycleStartDate();
        
        LocalDate targetMonthStart = LocalDate.of(year, month, 1);
        LocalDate targetMonthEnd = targetMonthStart.plusMonths(1).minusDays(1);
        
        LocalDate predictedStartDate = lastCycleStart;
        while (predictedStartDate.isBefore(targetMonthStart)) {
            predictedStartDate = predictedStartDate.plusDays((int) Math.round(avgCycleLength));
        }
        
        if (predictedStartDate.isAfter(targetMonthEnd)) {
            predictedStartDate = predictedStartDate.minusDays((int) Math.round(avgCycleLength));
        }

        Cycle predictedCycle = Cycle.builder()
                .cycleStartDate(predictedStartDate)
                .cycleLength((int) Math.round(avgCycleLength))
                .periodDuration((int) Math.round(avgDuration))
                .ovulationDate(predictedStartDate.plusDays(14))
                .fertilityWindowStart(predictedStartDate.plusDays(10))
                .fertilityWindowEnd(predictedStartDate.plusDays(15))
                .build();

        return predictedCycle;
    }

    public Cycle cyclePredictionForMonth(int year, int month, Long customerId) {
        List<Cycle> fourClosestCycles = getFourClosetCycleByCustomer(customerId);
        
        if (fourClosestCycles.isEmpty()) {
            return null;
        }

        double avgCycleLength = fourClosestCycles.stream()
                .mapToInt(Cycle::getCycleLength)
                .average()
                .orElse(28);

        double avgDuration = fourClosestCycles.stream()
                .mapToInt(Cycle::getPeriodDuration)
                .average()
                .orElse(7);

        Cycle lastCycle = fourClosestCycles.get(fourClosestCycles.size() - 1);
        LocalDate lastCycleStart = lastCycle.getCycleStartDate();
        
        LocalDate targetMonthStart = LocalDate.of(year, month, 1);
        LocalDate targetMonthEnd = targetMonthStart.plusMonths(1).minusDays(1);
        
        LocalDate predictedStartDate = lastCycleStart;
        while (predictedStartDate.isBefore(targetMonthStart)) {
            predictedStartDate = predictedStartDate.plusDays((int) Math.round(avgCycleLength));
        }
        
        if (predictedStartDate.isAfter(targetMonthEnd)) {
            predictedStartDate = predictedStartDate.minusDays((int) Math.round(avgCycleLength));
        }

        Cycle predictedCycle = Cycle.builder()
                .cycleStartDate(predictedStartDate)
                .cycleLength((int) Math.round(avgCycleLength))
                .periodDuration((int) Math.round(avgDuration))
                .ovulationDate(predictedStartDate.plusDays(14))
                .fertilityWindowStart(predictedStartDate.plusDays(10))
                .fertilityWindowEnd(predictedStartDate.plusDays(15))
                .build();

        return predictedCycle;
    }

    public void deleteCycle(Integer cycleId) {
        cycleRepository.deleteById(cycleId.longValue());
    }
}
