package swp391.com.backend.feature.panelTestType.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.panelTestType.data.PanelTestType;
import swp391.com.backend.feature.testType.data.TestType;
import swp391.com.backend.feature.panel.data.PanelRepository;
import swp391.com.backend.feature.panelTestType.data.PanelTestTypeRepository;
import swp391.com.backend.feature.testType.data.TestTypeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PanelTestTypeService {
    private final PanelTestTypeRepository panelTestTypeRepository;
    private final PanelRepository panelRepository;
    private final TestTypeRepository testTypeRepository;

    public List<TestType> getTestTypesByPanelId(Long panelId) {
        List<TestType> testTypes = panelTestTypeRepository.findPanelTestTypesByPanelId(panelId)
                .stream()
                .map(panelTestType -> testTypeRepository.findById(panelTestType.getTestTypeId()).orElse(null))
                .toList();
        return testTypes;
    }

    public void addTestToPackage(Long packageId, Long testTypeId) {
        PanelTestType panelTestType = new PanelTestType();
        panelTestType.setPanelId(packageId);
        panelTestType.setTestTypeId(testTypeId);
        panelTestTypeRepository.save(panelTestType);
    }

    public void removeTestFromPackage(Long packageId, Long testTypeId) {
        panelTestTypeRepository.deleteByPanelIdAndTestTypeId(packageId, testTypeId);
    }
}
