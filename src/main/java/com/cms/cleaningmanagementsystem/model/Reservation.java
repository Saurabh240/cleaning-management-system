package com.cms.cleaningmanagementsystem.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Document(collection = "reservations")
@Data
public class Reservation {
    @Id
    private String id;
    private String customerId;
    private String typeOfServices;
    private String frequency;
    private List<String> options;
    private UserDetails userDetails;
    private String couponCode;
    private LocalDateTime bookingDate;
    private LocalTime bookingTime;
    private boolean confirmed;
}
