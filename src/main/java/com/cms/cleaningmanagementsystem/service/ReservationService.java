package com.cms.cleaningmanagementsystem.service;

import com.cms.cleaningmanagementsystem.model.Reservation;
import com.cms.cleaningmanagementsystem.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Reservation getReservationById(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public Reservation confirmReservation(String id) {
        Reservation reservation = getReservationById(id);
        reservation.setConfirmed(true);
        return reservationRepository.save(reservation);
    }

    public Reservation modifyReservation(String id, Reservation newReservation) {
        Reservation reservation = getReservationById(id);
        reservation.setBookingDateTime(newReservation.getBookingDateTime());
        return reservationRepository.save(reservation);
    }

    public void cancelReservation(String id) {
        reservationRepository.deleteById(id);
    }
}
