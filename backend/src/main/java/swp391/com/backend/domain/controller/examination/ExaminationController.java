package swp391.com.backend.domain.controller.examination;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.ExaminationDTO;
import swp391.com.backend.domain.dto.dto.TestResultListDTO;
import swp391.com.backend.domain.dto.simpledto.SimpleExaminationDTO;
import swp391.com.backend.domain.dto.request.OrderCreateRequest;
import swp391.com.backend.domain.mapper.ExaminationMapper;
import swp391.com.backend.domain.mapper.TestResultMapper;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.service.examination.ExaminationService;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
@RequiredArgsConstructor
public class ExaminationController {
    private final ExaminationService examinationService;
    private final ExaminationMapper examinationMapper;
    private final TestResultMapper testResultMapper;

    @GetMapping
    public ResponseEntity<List<SimpleExaminationDTO>> getAllOrders() {
        List<SimpleExaminationDTO> result = examinationService.getAllOrders()
                .stream()
                .map(examinationMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ExaminationDTO> createOrder(@RequestBody OrderCreateRequest request) {

        Examination examination = Examination.builder()
                .panel(request.getAPanel())
                .date(request.getDate())
                .slot(request.getSlot())
                .build();

        Examination createdExamination = examinationService.createOrder(examination);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examinationMapper.toDTO(createdExamination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExaminationDTO> getOrderInfo(@PathVariable Long id) {
        Examination examination = examinationService.findExaminationById(id);
        if (examination == null) {
            return ResponseEntity.notFound().build();
        }
        List<ResultDetail> resultDetails = examinationService.getResultDetailById(id);
        List<TestType> testTypes = examinationService.getTestTypesById(id);

        List<TestResultListDTO> testResultList = testResultMapper.toTestResultDtoList(testTypes, resultDetails);

        ExaminationDTO examinationDTO = examinationMapper.toDTO(examination);
        examinationDTO.setTestResults(testResultList);

        return ResponseEntity.ok(examinationDTO);
    }




    @DeleteMapping("/api/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        examinationService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
