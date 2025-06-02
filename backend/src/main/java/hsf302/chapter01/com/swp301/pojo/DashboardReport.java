package hsf302.chapter01.com.swp301.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "dashboard_report")
@Setter
@Getter
public class DashboardReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @Column(name = "report_name")
    private String reportName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "report_type")
    private String reportType;

    @Column(name = "query", columnDefinition = "TEXT")
    private String query;

    @Column(name = "visualization_type")
    private String visualizationType;

    @Column(name = "access_level")
    private String accessLevel;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors, getters, and setters
    public DashboardReport() {}

    // Getters and setters...
}

