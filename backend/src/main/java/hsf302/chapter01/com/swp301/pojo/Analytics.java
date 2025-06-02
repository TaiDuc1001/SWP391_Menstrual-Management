package hsf302.chapter01.com.swp301.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics")
@Getter
@Setter
public class Analytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analytics_id")
    private Integer analyticsId;

    @Column(name = "metric_name")
    private String metricName;

    @Column(name = "metric_value", precision = 19, scale = 4)
    private BigDecimal metricValue;

    @Column(name = "metric_date")
    private LocalDate metricDate;

    @Column(name = "metric_type")
    private String metricType;

    @Column(name = "category")
    private String category;

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
    public Analytics() {}

    // Getters and setters...

}