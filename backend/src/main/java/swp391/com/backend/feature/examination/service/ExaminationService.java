package swp391.com.backend.feature.examination.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.examination.exception.ExaminationConflictException;
import swp391.com.backend.feature.result.data.Result;
import swp391.com.backend.feature.resultDetail.data.ResultDetail;
import swp391.com.backend.feature.testType.data.TestType;
import swp391.com.backend.feature.examination.data.ExaminationRepository;
import swp391.com.backend.feature.result.service.ResultService;
import swp391.com.backend.feature.staff.data.Staff;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.schedule.service.ScheduleService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExaminationService {
    private final ExaminationRepository examinationRepository;
    private final ResultService resultService;
    private final ScheduleService scheduleService;

    public List<Examination> getAllExaminations() {
        return examinationRepository.findAllWithRelations();
    }
    @Transactional
    public Examination createExamination(Examination examination) {
        validateExaminationConflict(examination);
        return examinationRepository.save(examination);
    }


    public void deleteOrder(Long id){
        Examination examination = examinationRepository.findById(id).orElseThrow(() -> new RuntimeException("Examination not found"));
        examinationRepository.delete(examination);
    }    public Examination findExaminationById(Long id) {
        Examination examination = examinationRepository.findExaminationByIdWithRelations(id);
        if (examination == null) {
            throw new RuntimeException("Examination not found with id: " + id);
        }
        return examination;
    }

    public List<ResultDetail> getResultDetailById(Long id){
        return resultService.findResultDetailsByExaminationId(id);
    }

    public List<TestType> getTestTypesById(Long id) {
        return resultService.findTestTypesByExaminationId(id);
    }

    public Examination updateExaminationStatus(Long id, ExaminationStatus status) {
        Examination existingExamination = examinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examination not found with id: " + id));

        if (existingExamination.getExaminationStatus() == ExaminationStatus.SAMPLED && status == ExaminationStatus.EXAMINED) {
            if (existingExamination.getResult() == null) {
                Result result = new Result();
                result.setExamination(existingExamination);
                Result savedResult = resultService.saveResult(result);
                existingExamination.setResult(savedResult);
            }
        }

        existingExamination.setExaminationStatus(status);

        Examination updatedExamination = examinationRepository.save(existingExamination);
        return updatedExamination;
    }

    public Examination updateExaminationTestResults(Long id, List<ResultDetail> testResults) {
        Examination existingExamination = findExaminationById(id);
        existingExamination.getResult().setResultDetails(testResults);
        return examinationRepository.save(existingExamination);
    }    public List<Examination> getExaminationsForStaff() {
        return examinationRepository.findAllWithRelations().stream()
                .filter(examination -> examination.getExaminationStatus() != ExaminationStatus.PENDING)
                .toList();
    }
    public Examination updateExaminationStatusWithStaff(Long id, ExaminationStatus status, Long staffId) {
        Examination existingExamination = examinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examination not found with id: " + id));
        if (staffId != null && (status == ExaminationStatus.IN_PROGRESS || status == ExaminationStatus.SAMPLED || status == ExaminationStatus.EXAMINED)) {
            if (existingExamination.getStaff() == null) {
                Staff staff = new Staff();
                staff.setId(staffId);
                existingExamination.setStaff(staff);
            }
        }

        if (existingExamination.getExaminationStatus() == ExaminationStatus.SAMPLED && status == ExaminationStatus.EXAMINED) {
            if (existingExamination.getResult() == null) {
                Result result = new Result();
                result.setExamination(existingExamination);
                Result savedResult = resultService.saveResult(result);
                existingExamination.setResult(savedResult);
            }
        }

        existingExamination.setExaminationStatus(status);

        Examination updatedExamination = examinationRepository.save(existingExamination);
        return updatedExamination;
    }

    private void validateExaminationConflict(Examination examination) {
        boolean conflictExists = examinationRepository.existsByDateAndSlotAndNotCancelledOrCompleted(
            examination.getDate(), 
            examination.getSlot()
        );
        
        if (conflictExists) {
            throw new ExaminationConflictException("An examination is already scheduled for this date and time slot");
        }
    }
    public List<String> getAvailableSlots(String dateString) {
        LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
        
        List<Slot> allSlots = Arrays.asList(Slot.values());
        List<String> allSlotTimeRanges = allSlots.stream()
                .filter(slot -> !slot.getTimeRange().equals("Filler slot, not used"))
                .map(Slot::getTimeRange)
                .collect(Collectors.toList());

        List<Slot> bookedSlots = examinationRepository.findBookedSlotsByDate(date);
        List<String> bookedSlotTimeRanges = bookedSlots.stream()
                .map(Slot::getTimeRange)
                .collect(Collectors.toList());
        
        return allSlotTimeRanges.stream()
                .filter(slot -> !bookedSlotTimeRanges.contains(slot))
                .collect(Collectors.toList());
    }

}

