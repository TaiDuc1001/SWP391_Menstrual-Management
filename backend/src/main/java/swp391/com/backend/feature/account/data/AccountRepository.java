package swp391.com.backend.feature.account.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findAccountByEmailAndPassword(String email, String password);
    List<Account> findByRole(Role role);
    List<Account> findByStatus(Boolean status);
    List<Account> findByRoleAndStatus(Role role, Boolean status);
    boolean existsByEmail(String email);
}

