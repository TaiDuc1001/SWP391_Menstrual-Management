package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.dto.AppointmentDTO;
import swp391.com.backend.jpa.pojo.appointments.Appointment;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    Appointment toEntity(AppointmentDTO dto);
    AppointmentDTO toDTO(Appointment entity);
}
