package swp391.com.backend.domain.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.domain.dto.AccountDTO;
import swp391.com.backend.jpa.pojo.roles.Account;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountDTO toDTO(Account entity);
    Account toEntity(AccountDTO dto);
}
