package swp391.com.backend.feature.panel.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.panel.data.PanelTag;
import swp391.com.backend.feature.panel.data.PanelType;
import swp391.com.backend.feature.testType.dto.TestTypeDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminPanelDTO {
    Long id;
    String panelName;
    String description;
    BigDecimal price;
    Integer responseTime;
    Integer duration;
    PanelType panelType;
    PanelTag panelTag;
    List<TestTypeDTO> testTypes;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
