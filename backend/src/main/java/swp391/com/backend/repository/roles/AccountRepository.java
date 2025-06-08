package swp391.com.backend.repository.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.pojo.roles.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Account findAccountByEmailAndPassword(String email, String password);
}
