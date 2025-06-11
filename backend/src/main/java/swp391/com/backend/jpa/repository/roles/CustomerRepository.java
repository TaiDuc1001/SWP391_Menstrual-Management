package swp391.com.backend.jpa.repository.roles;

import org.springframework.data.jpa.repository.JpaRepository;
import swp391.com.backend.jpa.pojo.roles.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
