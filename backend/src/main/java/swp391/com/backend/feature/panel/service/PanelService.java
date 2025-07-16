package swp391.com.backend.feature.panel.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.panel.data.Panel;
import swp391.com.backend.feature.panel.data.PanelRepository;
import swp391.com.backend.feature.panel.data.PanelTag;
import swp391.com.backend.feature.panel.data.PanelType;
import swp391.com.backend.feature.panel.dto.PanelStatisticsDTO;
import swp391.com.backend.feature.panel.exception.PanelNotFoundException;
import swp391.com.backend.feature.panelTestType.data.PanelTestType;
import swp391.com.backend.feature.panelTestType.data.PanelTestTypeRepository;
import swp391.com.backend.feature.testType.data.TestType;
import swp391.com.backend.feature.testType.data.TestTypeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PanelService {
    private final PanelRepository panelRepository;
    private final TestTypeRepository testTypeRepository;
    private final PanelTestTypeRepository panelTestTypeRepository;

    public Panel createPackage(Panel aPanel) {
        return panelRepository.save(aPanel);
    }

    public List<Panel> getAllPanels(){ return panelRepository.findAll(); }

    public Panel findPanelById(Long id) {
        return panelRepository.findById(id)
                .orElseThrow(() -> new PanelNotFoundException(id));
    }

    public void deletePackageById(Long id) {
        panelRepository.deleteById(id);
    }

    public Page<Panel> getPanelsWithPagination(Pageable pageable) {
        return panelRepository.findAll(pageable);
    }

    public Page<Panel> searchPanels(String keyword, PanelType panelType, PanelTag panelTag, Pageable pageable) {
        return panelRepository.searchPanels(keyword, panelType, panelTag, pageable);
    }

    @Transactional
    public Panel createPanel(Panel panel, List<Long> testTypeIds) {
        Panel savedPanel = panelRepository.save(panel);
        
        if (testTypeIds != null && !testTypeIds.isEmpty()) {
            for (Long testTypeId : testTypeIds) {
                TestType testType = testTypeRepository.findById(testTypeId)
                    .orElseThrow(() -> new RuntimeException("TestType not found with id: " + testTypeId));
                
                PanelTestType panelTestType = new PanelTestType();
                panelTestType.setPanelId(savedPanel.getId());
                panelTestType.setTestTypeId(testTypeId);
                panelTestType.setAPanel(savedPanel);
                panelTestType.setTestType(testType);
                panelTestTypeRepository.save(panelTestType);
            }
        }
        
        return savedPanel;
    }

    @Transactional
    public Panel updatePanel(Long id, Panel updatedPanel, List<Long> testTypeIds) {
        Panel existingPanel = findPanelById(id);

        existingPanel.setPanelName(updatedPanel.getPanelName());
        existingPanel.setDescription(updatedPanel.getDescription());
        existingPanel.setPrice(updatedPanel.getPrice());
        existingPanel.setResponseTime(updatedPanel.getResponseTime());
        existingPanel.setDuration(updatedPanel.getDuration());
        existingPanel.setPanelType(updatedPanel.getPanelType());
        existingPanel.setPanelTag(updatedPanel.getPanelTag());
        
        Panel savedPanel = panelRepository.save(existingPanel);

        if (testTypeIds != null) {

            panelTestTypeRepository.deleteByPanelId(id);

            for (Long testTypeId : testTypeIds) {
                TestType testType = testTypeRepository.findById(testTypeId)
                    .orElseThrow(() -> new RuntimeException("TestType not found with id: " + testTypeId));
                
                PanelTestType panelTestType = new PanelTestType();
                panelTestType.setPanelId(savedPanel.getId());
                panelTestType.setTestTypeId(testTypeId);
                panelTestType.setAPanel(savedPanel);
                panelTestType.setTestType(testType);
                panelTestTypeRepository.save(panelTestType);
            }
        }
        
        return savedPanel;
    }

    @Transactional
    public void deletePanel(Long id) {
        Panel panel = findPanelById(id);

        panelTestTypeRepository.deleteByPanelId(id);

        panelRepository.delete(panel);
    }

    public PanelStatisticsDTO getPanelStatistics() {
        PanelStatisticsDTO statistics = new PanelStatisticsDTO();
        
        Long totalPanels = panelRepository.countTotalPanels();
        Double averagePrice = panelRepository.getAveragePrice();
        
        statistics.setTotalPanels(totalPanels);
        statistics.setActivePanels(totalPanels); // Assuming all panels are active for now
        statistics.setInactivePanels(0L);
        statistics.setAveragePrice(averagePrice != null ? averagePrice : 0.0);
        statistics.setMostPopularPanel("N/A"); // Would need examination data to determine
        
        return statistics;
    }
}

