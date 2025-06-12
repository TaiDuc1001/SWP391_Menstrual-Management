package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.dto.DoctorDTO;
import swp391.com.backend.domain.dto.simpledto.SimpleDoctorDTO;
import swp391.com.backend.jpa.pojo.roles.Doctor;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    SimpleDoctorDTO toSimpleDTO(Doctor entity);
    Doctor toEntity(DoctorDTO dto);
}
