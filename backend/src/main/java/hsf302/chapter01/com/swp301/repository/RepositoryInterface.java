package hsf302.chapter01.com.swp301.repository;



import hsf302.chapter01.com.swp301.pojo.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface ConfigurationRepository extends JpaRepository<hsf302.chapter01.com.swp301.pojo.Configuration, Integer> {
}

@Repository
interface DashboardReportRepository extends JpaRepository<DashboardReport, Integer> {
}

@Repository
interface AnalyticsRepository extends JpaRepository<Analytics, Integer> {
}

@Repository
interface FacilityRepository extends JpaRepository<Facility, Integer> {
}

@Repository
interface FAQRepository extends JpaRepository<FAQ, Integer> {
}