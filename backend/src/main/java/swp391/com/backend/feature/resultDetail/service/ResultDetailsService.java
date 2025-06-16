package swp391.com.backend.feature.resultDetail.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.resultDetail.data.ResultDetail;
import swp391.com.backend.feature.testType.data.TestType;
import swp391.com.backend.feature.resultDetail.data.ResultDetailRepository;
import swp391.com.backend.feature.testType.service.TestTypeService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultDetailsService {
    private final ResultDetailRepository resultDetailRepository;
    private final TestTypeService testTypeService;

    public List<ResultDetail> findAllByResultId(Long resultId) {
        return resultDetailRepository.findAllByResultId(resultId);
    }

    public TestType findTestTypeById(Long testTypeId) {
        return testTypeService.findTestById(testTypeId);
    }

    public ResultDetail saveResultDetail(ResultDetail resultDetail) {
        return resultDetailRepository.save(resultDetail);
    }

    public ResultDetail updateResultDetail(ResultDetail resultDetail) {
        ResultDetail existingResultDetail = resultDetailRepository.findByResultIdAndTestTypeId(resultDetail.getResultId(), resultDetail.getTestTypeId());
        System.out.println("Updating ResultDetail: " + existingResultDetail.getResultId());
        existingResultDetail.setTestIndex(resultDetail.getTestIndex());
        existingResultDetail.setNotes(resultDetail.getNotes());
        existingResultDetail.setDiagnosis(resultDetail.getDiagnosis());

        return resultDetailRepository.save(existingResultDetail);
    }
}
