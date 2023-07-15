package com.cms.cleaningmanagementsystem.controller;

import com.cms.cleaningmanagementsystem.model.Reservation;
import com.cms.cleaningmanagementsystem.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/{id}")
    public Reservation getReservationById(@PathVariable String id) {
        return reservationService.getReservationById(id);
    }
    @GetMapping("/list")
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
    }

    @PutMapping("/{id}/confirm")
    public Reservation confirmReservation(@PathVariable String id) {
        return reservationService.confirmReservation(id);
    }

    @PutMapping("/{id}/modify")
    public Reservation modifyReservation(@PathVariable String id, @RequestBody Reservation reservation) {
        return reservationService.modifyReservation(id, reservation);
    }

    @DeleteMapping("/{id}")
    public void cancelReservation(@PathVariable String id) {
        reservationService.cancelReservation(id);
    }
}
