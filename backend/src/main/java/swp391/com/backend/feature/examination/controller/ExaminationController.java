package swp391.com.backend.feature.examination.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.examination.dto.ExaminedExaminationDTO;
import swp391.com.backend.feature.examination.dto.SampledExaminationDTO;
import swp391.com.backend.feature.examination.testResult.TestResultListDTO;
import swp391.com.backend.feature.testType.dto.TestTypeDTO;
import swp391.com.backend.feature.examination.dto.ExaminationUpdateRequest;
import swp391.com.backend.feature.examination.dto.SimpleExaminationDTO;
import swp391.com.backend.feature.examination.mapper.ExaminationMapper;
import swp391.com.backend.feature.examination.testResult.TestResultMapper;
import swp391.com.backend.feature.testType.mapper.TestTypeMapper;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.result.data.Result;
import swp391.com.backend.feature.resultDetail.data.ResultDetail;
import swp391.com.backend.feature.testType.data.TestType;
import swp391.com.backend.feature.examination.service.ExaminationService;
import swp391.com.backend.feature.resultDetail.service.ResultDetailsService;
import swp391.com.backend.feature.panel.service.PanelService;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
@RequiredArgsConstructor
public class ExaminationController {
    private final ResultDetailsService resultDetailsService;
    private final ExaminationService examinationService;
    private final TestTypeMapper testTypeMapper;
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

    @GetMapping("/sampled/{id}")
    public ResponseEntity<?> getSampledExaminationInfo(@PathVariable Long id) {
        Examination examination = examinationService.findExaminationById(id);

        if(examination.getExaminationStatus().ordinal() < 1) {
            return ResponseEntity.badRequest().body("Unsampled examination");
        }

        SampledExaminationDTO sampledExaminationDTO = examinationMapper.toSampledDTO(examination);
        List<TestTypeDTO> testTypes = examinationService.getTestTypesById(id)
                .stream()
                .map(testTypeMapper::toDTO)
                .toList();

        sampledExaminationDTO.setTestTypes(testTypes);
        sampledExaminationDTO.setExaminationStatus(examination.getExaminationStatus());
        return ResponseEntity.ok(sampledExaminationDTO);
    }

    @GetMapping("/examined/{id}")
    public ResponseEntity<?> getExaminedExaminationInfo(@PathVariable Long id) {
        Examination examination = examinationService.findExaminationById(id);

        if(examination.getExaminationStatus().ordinal() < 2) {
            return ResponseEntity.badRequest().body("Unexamined examination");
        }

        ExaminedExaminationDTO examinedExaminationDTO = examinationMapper.toExaminedDTO(examination);
        List<ResultDetail> resultDetails = examinationService.getResultDetailById(id);
        List<TestType> testTypes = examinationService.getTestTypesById(id);
        List<TestResultListDTO> testResultList = testResultMapper.toTestResultDtoList(testTypes, resultDetails);

        examinedExaminationDTO.setTestResults(testResultList);
        examinedExaminationDTO.setExaminationStatus(examination.getExaminationStatus());
        return ResponseEntity.ok(examinedExaminationDTO);
    }

    @PutMapping("/sampled/{id}")
    public ResponseEntity<SimpleExaminationDTO> sampleExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.SAMPLED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toSimpleDTO(updatedExamination));
    }

    @PutMapping("/examined/{id}")
    public ResponseEntity<SimpleExaminationDTO> examineExamination(@PathVariable Long id, @RequestBody ExaminationUpdateRequest request) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.EXAMINED);

        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        Result result = updatedExamination.getResult();
        List<ResultDetail> testResults = testResultMapper.splitDtoList(request.getTestResults()).getRight()
                .stream()
                .map(resultDetail -> {
                    resultDetail.setResultId(result.getId());
                    resultDetail.setResult(result);
                    return resultDetailsService.updateResultDetail(resultDetail);
                })
                .toList();

        return ResponseEntity.ok(examinationMapper.toSimpleDTO(updatedExamination));
    }

    @PutMapping("/completed/{id}")
    public ResponseEntity<SimpleExaminationDTO> completeExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.COMPLETED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toSimpleDTO(updatedExamination));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<SimpleExaminationDTO> cancelExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.CANCELLED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toSimpleDTO(updatedExamination));
    }

    @DeleteMapping("/api/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        examinationService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
