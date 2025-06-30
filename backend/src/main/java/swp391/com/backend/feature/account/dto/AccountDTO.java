package swp391.com.backend.feature.account.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.server.core.Relation;
import swp391.com.backend.feature.account.data.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Relation(collectionRelation = "accounts", itemRelation = "account")
public class AccountDTO {
    private Long id;
    private String email;
    private Role role;
    private ActorDTO profile;
}
