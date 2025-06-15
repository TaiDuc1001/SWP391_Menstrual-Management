package swp391.com.backend.service.examination;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.pojo.examination.ExaminationStatus;
import swp391.com.backend.jpa.pojo.examination.Result;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.jpa.repository.examination.ExaminationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExaminationService {
    private final ExaminationRepository examinationRepository;
    private final ResultService resultService;

    public List<Examination> getAllExaminations() {
        return examinationRepository.findAll();
    }

    public Examination createExamination(Examination examination) {
        return examinationRepository.save(examination);
    }

    public void deleteOrder(Long id){
        Examination examination = examinationRepository.findById(id).orElseThrow(() -> new RuntimeException("Examination not found"));
        examinationRepository.delete(examination);
    }

    public Examination findExaminationById(Long id) {
        return examinationRepository.findById(id).orElseThrow(() -> new RuntimeException("Examination not found"));
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

        // Check for transition from SAMPLED to EXAMINED
        if (existingExamination.getExaminationStatus() == ExaminationStatus.SAMPLED && status == ExaminationStatus.EXAMINED) {
            if (existingExamination.getResult() == null) {
                // Create and associate a new Result
                Result result = new Result();
                result.setExamination(existingExamination);
                // Optionally set other fields like code, etc.
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
    }
}
