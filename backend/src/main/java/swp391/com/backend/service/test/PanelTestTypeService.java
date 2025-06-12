package swp391.com.backend.service.test;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.test.PanelTestType;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.jpa.repository.test.PanelRepository;
import swp391.com.backend.jpa.repository.test.PanelTestTypeRepository;
import swp391.com.backend.jpa.repository.test.TestTypeRepository;

import java.util.ArrayList;
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
