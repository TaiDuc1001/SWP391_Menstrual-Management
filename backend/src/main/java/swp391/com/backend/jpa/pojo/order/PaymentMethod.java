package swp391.com.backend.jpa.pojo.order;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

public enum PaymentMethod {
    MOMO,
    BANK_TRANSFER,
    CASH_ON_DELIVERY
}

