package swp391.com.backend.service.examination;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.jpa.repository.examination.ResultDetailRepository;
import swp391.com.backend.jpa.repository.test.TestTypeRepository;
import swp391.com.backend.service.test.TestTypeService;

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
}
