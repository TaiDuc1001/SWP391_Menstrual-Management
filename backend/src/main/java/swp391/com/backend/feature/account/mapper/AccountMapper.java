package swp391.com.backend.feature.account.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.feature.account.dto.AccountDTO;
import swp391.com.backend.feature.account.data.Account;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    AccountDTO toDTO(Account entity);
    Account toEntity(AccountDTO dto);
}

