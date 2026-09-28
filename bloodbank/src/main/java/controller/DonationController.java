package controller;

import dto.DonationRequest;
import entity.Donation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.DonationService;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<Donation> createDonation(
            @Valid @RequestBody DonationRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(donationService.createDonation(request));
    }

    @GetMapping
    public ResponseEntity<List<Donation>> getAllDonations() {
        return ResponseEntity.ok(
                donationService.getAllDonations()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getDonationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                donationService.getDonationById(id)
        );
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<Donation>> getDonationsByDonor(
            @PathVariable Long donorId) {

        return ResponseEntity.ok(
                donationService.getDonationsByDonor(donorId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(
            @PathVariable Long id) {

        donationService.deleteDonation(id);

        return ResponseEntity.noContent().build();
    }
}