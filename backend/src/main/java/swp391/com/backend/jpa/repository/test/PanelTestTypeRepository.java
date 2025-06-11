package swp391.com.backend.jpa.repository.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.test.PanelTestType;

import java.util.List;

@Repository
public interface PanelTestTypeRepository extends JpaRepository<PanelTestType, Long> {
    List<PanelTestType> findTestsByPanelId(Long packageId);

    void deleteByPanelIdAndTestTypeId(Long panelId, Long testTypeId);
}
