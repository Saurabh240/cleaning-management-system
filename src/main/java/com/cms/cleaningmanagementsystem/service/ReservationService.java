package com.cms.cleaningmanagementsystem.service;

import com.cms.cleaningmanagementsystem.model.Reservation;
import com.cms.cleaningmanagementsystem.model.User;
import com.cms.cleaningmanagementsystem.repository.ReservationRepository;
import com.cms.cleaningmanagementsystem.repository.UserRepository;
import com.cms.cleaningmanagementsystem.security.JwtTokenUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public ReservationService(ReservationRepository reservationRepository, JwtTokenUtil jwtTokenUtil,UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userRepository = userRepository;
    }

    public Reservation getReservationById(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation createReservation(String token, Reservation reservation) {
        String userNameFromJwtToken = jwtTokenUtil.getUserNameFromJwtToken(token);
        Optional<User> byUsername = userRepository.findByUsername(userNameFromJwtToken);
        if (byUsername.isPresent()) {
            reservation.getUserDetails().setUsername(byUsername.get().getUsername());
            reservation.getUserDetails().setAddress(byUsername.get().getAddress());
            reservation.getUserDetails().setCity(byUsername.get().getCity());
        }
        return reservationRepository.save(reservation);
    }

    public Reservation confirmReservation(String id) {
        Reservation reservation = getReservationById(id);
        reservation.setConfirmed(true);
        return reservationRepository.save(reservation);
    }

    public Reservation modifyReservation(String id, Reservation newReservation) {
        Reservation reservation = getReservationById(id);
        reservation.setBookingDate(newReservation.getBookingDate());
        return reservationRepository.save(reservation);
    }

    public void cancelReservation(String id) {
        reservationRepository.deleteById(id);
    }
}
