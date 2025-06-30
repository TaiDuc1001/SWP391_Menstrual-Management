package swp391.com.backend.feature.panel.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.panel.data.Panel;
import swp391.com.backend.feature.panel.data.PanelTag;
import swp391.com.backend.feature.panel.data.PanelType;
import swp391.com.backend.feature.panel.dto.*;
import swp391.com.backend.feature.panel.mapper.PanelMapper;
import swp391.com.backend.feature.panel.service.PanelService;
import swp391.com.backend.feature.panelTestType.service.PanelTestTypeService;
import swp391.com.backend.feature.testType.mapper.TestTypeMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/panels")
@RequiredArgsConstructor
public class AdminPanelController {
    
    private final PanelService panelService;
    private final PanelMapper panelMapper;
    private final PanelTestTypeService panelTestTypeService;
    private final TestTypeMapper testTypeMapper;

    /**
     * GET /api/admin/panels - Lấy danh sách với phân trang
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getPanelsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
            
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Panel> panelPage = panelService.getPanelsWithPagination(pageable);
        
        List<AdminPanelDTO> panels = panelPage.getContent().stream()
                .map(panel -> {
                    AdminPanelDTO dto = panelMapper.toAdminDTO(panel);
                    // Get test types for each panel
                    dto.setTestTypes(panelTestTypeService.getTestTypesByPanelId(panel.getId())
                            .stream()
                            .map(testTypeMapper::toDTO)
                            .toList());
                    return dto;
                })
                .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("panels", panels);
        response.put("currentPage", panelPage.getNumber());
        response.put("totalItems", panelPage.getTotalElements());
        response.put("totalPages", panelPage.getTotalPages());
        response.put("pageSize", panelPage.getSize());
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/admin/panels/{id} - Lấy chi tiết panel
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdminPanelDTO> getPanelById(@PathVariable Long id) {
        Panel panel = panelService.findPanelById(id);
        AdminPanelDTO dto = panelMapper.toAdminDTO(panel);
        
        // Get test types
        dto.setTestTypes(panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testTypeMapper::toDTO)
                .toList());
        
        return ResponseEntity.ok(dto);
    }

    /**
     * GET /api/admin/panels/search - Tìm kiếm panel
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPanels(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) PanelType panelType,
            @RequestParam(required = false) PanelTag panelTag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
            
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Panel> panelPage = panelService.searchPanels(keyword, panelType, panelTag, pageable);
        
        List<AdminPanelDTO> panels = panelPage.getContent().stream()
                .map(panel -> {
                    AdminPanelDTO dto = panelMapper.toAdminDTO(panel);
                    // Get test types for each panel
                    dto.setTestTypes(panelTestTypeService.getTestTypesByPanelId(panel.getId())
                            .stream()
                            .map(testTypeMapper::toDTO)
                            .toList());
                    return dto;
                })
                .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("panels", panels);
        response.put("currentPage", panelPage.getNumber());
        response.put("totalItems", panelPage.getTotalElements());
        response.put("totalPages", panelPage.getTotalPages());
        response.put("pageSize", panelPage.getSize());
        response.put("searchKeyword", keyword);
        response.put("panelType", panelType);
        response.put("panelTag", panelTag);
        
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/admin/panels - Tạo panel mới
     */
    @PostMapping
    public ResponseEntity<AdminPanelDTO> createPanel(@Valid @RequestBody CreatePanelRequest request) {
        Panel panel = panelMapper.fromCreateRequest(request);
        Panel createdPanel = panelService.createPanel(panel, request.getTestTypeIds());
        
        AdminPanelDTO dto = panelMapper.toAdminDTO(createdPanel);
        // Get test types for created panel
        dto.setTestTypes(panelTestTypeService.getTestTypesByPanelId(createdPanel.getId())
                .stream()
                .map(testTypeMapper::toDTO)
                .toList());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /**
     * PUT /api/admin/panels/{id} - Cập nhật panel
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdminPanelDTO> updatePanel(
            @PathVariable Long id, 
            @Valid @RequestBody UpdatePanelRequest request) {
        
        Panel panelToUpdate = panelMapper.fromUpdateRequest(request);
        Panel updatedPanel = panelService.updatePanel(id, panelToUpdate, request.getTestTypeIds());
        
        AdminPanelDTO dto = panelMapper.toAdminDTO(updatedPanel);
        // Get test types for updated panel
        dto.setTestTypes(panelTestTypeService.getTestTypesByPanelId(updatedPanel.getId())
                .stream()
                .map(testTypeMapper::toDTO)
                .toList());
        
        return ResponseEntity.ok(dto);
    }

    /**
     * DELETE /api/admin/panels/{id} - Xóa panel
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePanel(@PathVariable Long id) {
        panelService.deletePanel(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Panel deleted successfully");
        response.put("deletedId", id.toString());
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/admin/panels/statistics - Thống kê panels
     */
    @GetMapping("/statistics")
    public ResponseEntity<PanelStatisticsDTO> getPanelStatistics() {
        PanelStatisticsDTO statistics = panelService.getPanelStatistics();
        return ResponseEntity.ok(statistics);
    }
}
