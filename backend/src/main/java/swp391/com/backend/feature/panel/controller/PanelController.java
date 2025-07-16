package swp391.com.backend.feature.panel.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.examination.dto.ExaminationCreateResponse;
import swp391.com.backend.feature.panel.dto.PanelDTO;
import swp391.com.backend.feature.examination.dto.ExaminationCreateRequest;
import swp391.com.backend.feature.panel.dto.SimplePanelDTO;
import swp391.com.backend.feature.examination.mapper.ExaminationMapper;
import swp391.com.backend.feature.panel.mapper.PanelMapper;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.panel.data.Panel;
import swp391.com.backend.feature.examination.service.ExaminationService;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.panel.service.PanelService;
import swp391.com.backend.feature.panelTestType.service.PanelTestTypeService;
import swp391.com.backend.feature.panel.dto.UpdatePanelRequest;
import swp391.com.backend.feature.panel.dto.UpdatePanelResponse;

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
    private final ExaminationMapper examinationMapper;    @GetMapping
    public ResponseEntity<List<SimplePanelDTO>> getAllPanels(){
        List<Panel> panels = panelService.getAllPanels();
        List<SimplePanelDTO> result = panels.stream()
                .map(panel -> {
                    SimplePanelDTO dto = panelMapper.toSimpleDTO(panel);

                    List<String> testTypesNames = panelTestTypeService.getTestTypesByPanelId(panel.getId())
                            .stream()
                            .map(testType -> testType.getName())
                            .toList();
                    List<String> testTypesDescriptions = panelTestTypeService.getTestTypesByPanelId(panel.getId())
                            .stream()
                            .map(testType -> testType.getDescription())
                            .toList();
                    dto.setTestTypesNames(testTypesNames);
                    dto.setTestTypesDescriptions(testTypesDescriptions);
                    return dto;
                })
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
        List<String> testTypesNormalRanges = panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testType -> testType.getNormalRange())
                .toList();
        List<String> testTypesUnits = panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testType -> testType.getUnit())
                .toList();
        List<Long> testTypesIds = panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testType -> testType.getId())
                .toList();
        result.setTestTypesDescriptions(testTypesDescriptions);
        result.setTestTypesNames(testTypesNames);
        result.setTestTypesNormalRanges(testTypesNormalRanges);
        result.setTestTypesUnits(testTypesUnits);
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
                .examinationStatus(ExaminationStatus.PENDING)
                .build();

        Examination createdExamination = examinationService.createExamination(examination);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examinationMapper.toCreateResponse(createdExamination));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpdatePanelResponse> updatePanel(@PathVariable Long id, @RequestBody UpdatePanelRequest request) {
        Panel updatedPanel = panelMapper.fromUpdateRequest(request);
        Panel savedPanel = panelService.updatePanel(id, updatedPanel, request.getTestTypeIds());
        UpdatePanelResponse response = new UpdatePanelResponse();
        response.setId(savedPanel.getId());
        response.setPanelName(savedPanel.getPanelName());
        response.setDescription(savedPanel.getDescription());
        response.setPrice(savedPanel.getPrice());
        response.setResponseTime(savedPanel.getResponseTime());
        response.setDuration(savedPanel.getDuration());
        response.setPanelType(savedPanel.getPanelType());
        response.setPanelTag(savedPanel.getPanelTag());
        response.setTestTypeIds(request.getTestTypeIds());
        return ResponseEntity.ok(response);
    }
}

