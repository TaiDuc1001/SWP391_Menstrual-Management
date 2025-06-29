package swp391.com.backend.feature.cycle.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CycleRepository extends JpaRepository<Cycle, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE Cycle c SET c.customer = null WHERE c.customer.id = :customerId")
    void updateCustomerToNullByCustomerId(@Param("customerId") Long customerId);
}
