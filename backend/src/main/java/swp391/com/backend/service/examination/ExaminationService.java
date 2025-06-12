package swp391.com.backend.service.examination;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.examination.Examination;
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

    public List<Examination> getAllOrders() {
        return examinationRepository.findAll();
    }

    public Examination createOrder(Examination examination) {
        return examinationRepository.save(examination);
    }

    public void deleteOrder(Long id){
        Examination examination = examinationRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        examinationRepository.delete(examination);
    }

    public Examination findExaminationById(Long id) {
        return examinationRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<ResultDetail> getResultDetailById(Long id){
        return resultService.findResultDetailsByExaminationId(id);
    }

    public List<TestType> getTestTypesById(Long id) {
        return resultService.findTestTypesByExaminationId(id);
    }
}
