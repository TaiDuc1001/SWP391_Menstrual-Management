package swp391.com.backend.feature.panel.dto;

import lombok.Data;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import java.util.List;
import java.math.BigDecimal;
import swp391.com.backend.feature.panel.data.PanelTag;
import swp391.com.backend.feature.panel.data.PanelType;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdatePanelResponse {
    Long id;
    String panelName;
    String description;
    BigDecimal price;
    Integer responseTime;
    Integer duration;
    PanelType panelType;
    PanelTag panelTag;
    List<Long> testTypeIds;
}
