package swp391.com.backend.service.examination;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.pojo.examination.Result;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.jpa.repository.examination.ExaminationRepository;
import swp391.com.backend.jpa.repository.examination.ResultRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {
    private final ResultRepository resultRepository;
    private final ResultDetailsService resultDetailsService;
    private final ExaminationRepository examinationRepository;

    public List<ResultDetail> findResultDetailsByExaminationId(Long examinationId) {
        Examination examination = examinationRepository.findExaminationById(examinationId);
        Result result = resultRepository.findResultByExamination(examination);
        if (result == null) {
            result = new Result();
            result.setExamination(examination);
            result = resultRepository.save(result);
            examination.setResult(result);
            examinationRepository.save(examination);
        }
        List<ResultDetail> resultDetail = resultDetailsService.findAllByResultId(result.getId());
        return resultDetail;
    }

    public List<TestType> findTestTypesByExaminationId(Long examinationId) {
        Examination examination = examinationRepository.findExaminationById(examinationId);
        Result result = resultRepository.findResultByExamination(examination);
        if (result == null) {
            result = new Result();
            result.setExamination(examination);
            result = resultRepository.save(result);
            examination.setResult(result);
            examinationRepository.save(examination);
        }
        List<ResultDetail> resultDetails = resultDetailsService.findAllByResultId(result.getId());
        List<TestType> testTypes = resultDetails.stream()
                .map(ResultDetail::getTestType)
                .toList();
        return testTypes;
    }

    public Result saveResult(Result result) {
        return resultRepository.save(result);
    }
}
