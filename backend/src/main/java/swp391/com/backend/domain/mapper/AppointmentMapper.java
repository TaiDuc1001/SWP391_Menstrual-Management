package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.dto.AppointmentDTO;
import swp391.com.backend.domain.dto.simpledto.SimpleAppointmentDTO;
import swp391.com.backend.jpa.pojo.appointments.Appointment;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(source = "doctor.name", target = "doctorName")
//    @Mapping(source = "appointment.status", target = "status")
    SimpleAppointmentDTO toSimpleDTO(Appointment appointment);
    Appointment toEntity(AppointmentDTO dto);
    AppointmentDTO toDTO(Appointment entity);
}
