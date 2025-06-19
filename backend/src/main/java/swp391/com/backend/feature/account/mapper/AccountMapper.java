package swp391.com.backend.feature.account.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.account.dto.AccountDTO;
import swp391.com.backend.feature.account.data.Account;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "profile", ignore = true)
    AccountDTO toDTO(Account entity);
    Account toEntity(AccountDTO dto);
}

