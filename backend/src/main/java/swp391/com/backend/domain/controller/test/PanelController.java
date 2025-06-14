package swp391.com.backend.domain.controller.test;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.ExaminationCreateResponse;
import swp391.com.backend.domain.dto.dto.PanelDTO;
import swp391.com.backend.domain.dto.request.ExaminationCreateRequest;
import swp391.com.backend.domain.dto.simpledto.SimplePanelDTO;
import swp391.com.backend.domain.mapper.ExaminationMapper;
import swp391.com.backend.domain.mapper.PanelMapper;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.pojo.examination.ExaminationStatus;
import swp391.com.backend.jpa.pojo.test.Panel;
import swp391.com.backend.service.examination.ExaminationService;
import swp391.com.backend.service.roles.CustomerService;
import swp391.com.backend.service.test.PanelService;
import swp391.com.backend.service.test.PanelTestTypeService;

import java.util.List;

@RestController
@RequestMapping("api/panels")
@RequiredArgsConstructor
public class PanelController {
    private final PanelService panelService;
    private final CustomerService customerService;
    private final PanelTestTypeService panelTestTypeService;
    private final PanelMapper panelMapper;
    private final ExaminationService examinationService;
    private final ExaminationMapper examinationMapper;

    @GetMapping
    public ResponseEntity<List<SimplePanelDTO>> getAllPanels(){
        List<SimplePanelDTO> result =  panelService.getAllPanels().stream()
                .map(panelMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PanelDTO> getPanelById(@PathVariable Long id) {
        Panel panel = panelService.findPanelById(id);
        PanelDTO result = panelMapper.toDTO(panel);
        List<String> testTypesDescriptions = panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testType -> testType.getDescription())
                .toList();

        List<String> testTypesNames = panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testType -> testType.getName())
                .toList();
        List<Long> testTypesIds = panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testType -> testType.getId())
                .toList();
        result.setTestTypesDescriptions(testTypesDescriptions);
        result.setTestTypesNames(testTypesNames);
        result.setTestTypesIds(testTypesIds);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}")
    public ResponseEntity<ExaminationCreateResponse> createExamination(@PathVariable Long id, @RequestBody ExaminationCreateRequest request) {
        Panel panel = panelService.findPanelById(id);
        Examination examination = Examination.builder()
                .id(null)
                .panel(panel)
                .date(request.getDate())
                .slot(request.getSlot())
                .customer(customerService.findCustomerById(3L))
                .examinationStatus(ExaminationStatus.IN_PROGRESS)
                .build();

        Examination createdExamination = examinationService.createExamination(examination);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examinationMapper.toCreateResponse(createdExamination));
    }
}
