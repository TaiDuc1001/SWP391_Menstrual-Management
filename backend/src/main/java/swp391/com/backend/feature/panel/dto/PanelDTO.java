package swp391.com.backend.feature.panel.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.feature.panel.data.PanelTag;
import swp391.com.backend.feature.panel.data.PanelType;

import java.math.BigDecimal;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PanelDTO {
    Long id;
    String panelName;
    String description;
    BigDecimal price;
    Integer responseTime;
    PanelType panelType;
    PanelTag panelTag;
    List<String> testTypesNames;
    List<String> testTypesDescriptions;
}
