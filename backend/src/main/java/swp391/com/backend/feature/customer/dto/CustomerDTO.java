package swp391.com.backend.feature.customer.dto;

import lombok.Data;
import swp391.com.backend.feature.account.dto.ActorDTO;

import java.time.LocalDate;

@Data
public class CustomerDTO implements ActorDTO {
    private Integer id;
    private String name;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private boolean gender;
    private String cccd;
    private String address;
}
