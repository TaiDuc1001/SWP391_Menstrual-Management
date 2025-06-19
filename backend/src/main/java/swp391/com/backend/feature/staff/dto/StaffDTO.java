package swp391.com.backend.feature.staff.dto;

import swp391.com.backend.feature.account.dto.ActorDTO;
import lombok.Data;

@Data
public class StaffDTO implements ActorDTO {
    private Integer id;
    private String name;
}
