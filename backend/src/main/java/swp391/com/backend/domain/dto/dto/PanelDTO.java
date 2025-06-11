package swp391.com.backend.domain.dto.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PanelDTO {
    private Integer id;
    private String packageName;
    private String description;
    private BigDecimal price;
    private Integer duration;
    private Boolean isActive;
}
