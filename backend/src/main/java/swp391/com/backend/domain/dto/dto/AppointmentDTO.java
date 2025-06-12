package swp391.com.backend.domain.dto.dto;

import lombok.Data;
import swp391.com.backend.jpa.pojo.roles.Customer;
import swp391.com.backend.jpa.pojo.roles.Doctor;

@Data
public class AppointmentDTO {
    private Long customerId;
    private Long doctorId;
    private String date;
    private String status;
    private Integer slot;
    private String note;
    private String description;

}
