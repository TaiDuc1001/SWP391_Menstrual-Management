package swp391.com.backend.domain.dto.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import swp391.com.backend.jpa.pojo.test.PanelTag;
import swp391.com.backend.jpa.pojo.test.PanelTestType;
import swp391.com.backend.jpa.pojo.test.PanelType;

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
