package swp391.com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountDTO {
    private Integer id;
    private String email;
    public AccountDTO(Integer id, String email) {
        this.id = id;
        this.email = email;
    }
}
