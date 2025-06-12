package swp391.com.backend.jpa.repository.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.roles.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findAccountByEmailAndPassword(String email, String password);
}
