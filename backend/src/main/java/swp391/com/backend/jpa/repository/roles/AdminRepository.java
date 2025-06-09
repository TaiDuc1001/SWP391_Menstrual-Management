package swp391.com.backend.jpa.repository.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.roles.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
}
