package swp391.com.backend.feature.result.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.result.data.Result;
import swp391.com.backend.feature.resultDetail.data.ResultDetail;
import swp391.com.backend.feature.testType.data.TestType;
import swp391.com.backend.feature.examination.data.ExaminationRepository;
import swp391.com.backend.feature.result.data.ResultRepository;
import swp391.com.backend.feature.resultDetail.service.ResultDetailsService;

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
        List<ResultDetail> resultDetail = resultDetailsService.findAllByResultId(result.getId());
        return resultDetail;
    }

    public List<TestType> findTestTypesByExaminationId(Long examinationId) {
        Examination examination = examinationRepository.findExaminationById(examinationId);
        Result result = resultRepository.findResultByExamination(examination);
        List<ResultDetail> resultDetails = resultDetailsService.findAllByResultId(result.getId());
        List<TestType> testTypes = resultDetails.stream()
                .map(ResultDetail::getTestType)
                .toList();
        return testTypes;
    }
}
