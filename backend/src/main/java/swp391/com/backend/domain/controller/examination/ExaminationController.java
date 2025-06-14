package swp391.com.backend.domain.controller.examination;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.ExaminationDTO;
import swp391.com.backend.domain.dto.dto.TestResultListDTO;
import swp391.com.backend.domain.dto.simpledto.SimpleExaminationDTO;
import swp391.com.backend.domain.mapper.ExaminationMapper;
import swp391.com.backend.domain.mapper.TestResultMapper;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.pojo.examination.ExaminationStatus;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.service.examination.ExaminationService;
import swp391.com.backend.service.test.PanelService;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
@RequiredArgsConstructor
public class ExaminationController {
    private final ExaminationService examinationService;
    private final ExaminationMapper examinationMapper;
    private final TestResultMapper testResultMapper;
    private final PanelService panelService;

    @GetMapping
    public ResponseEntity<List<SimpleExaminationDTO>> getAllOrders() {
        List<SimpleExaminationDTO> result = examinationService.getAllExaminations()
                .stream()
                .map(examinationMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExaminationInfo(@PathVariable Long id) {
        Examination examination = examinationService.findExaminationById(id);

        if(examination.getExaminationStatus() != ExaminationStatus.COMPLETED) {
            return ResponseEntity.badRequest().body("Incomplete examination");
        }

        ExaminationDTO examinationDTO = examinationMapper.toDTO(examination);
        List<ResultDetail> resultDetails = examinationService.getResultDetailById(id);
        List<TestType> testTypes = examinationService.getTestTypesById(id);

        List<TestResultListDTO> testResultList = testResultMapper.toTestResultDtoList(testTypes, resultDetails);
        examinationDTO.setTestResults(testResultList);


        examinationDTO.setExaminationStatus(examination.getExaminationStatus());
        return ResponseEntity.ok(examinationDTO);
    }

    @PutMapping("/{id}/sampled")
    public ResponseEntity<ExaminationDTO> sampleExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.SAMPLED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toDTO(updatedExamination));
    }

    @PutMapping("/{id}/completed")
    public ResponseEntity<ExaminationDTO> completeExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.COMPLETED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toDTO(updatedExamination));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ExaminationDTO> cancelExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.CANCELLED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toDTO(updatedExamination));
    }

    @DeleteMapping("/api/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        examinationService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
