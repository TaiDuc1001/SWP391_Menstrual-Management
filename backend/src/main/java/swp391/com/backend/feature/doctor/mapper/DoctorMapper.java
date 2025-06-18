package swp391.com.backend.feature.doctor.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.feature.doctor.dto.DoctorDTO;
import swp391.com.backend.feature.doctor.dto.SimpleDoctorDTO;
import swp391.com.backend.feature.doctor.data.Doctor;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    SimpleDoctorDTO toSimpleDTO(Doctor entity);
    Doctor toEntity(DoctorDTO dto);
}
