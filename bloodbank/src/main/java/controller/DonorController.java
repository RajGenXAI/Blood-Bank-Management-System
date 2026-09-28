package controller;

import dto.DonorRequest;
import entity.Donor;
import enums.BloodGroup;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.DonorService;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    public ResponseEntity<Donor> createDonor(
            @Valid @RequestBody DonorRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(donorService.createDonor(request));
    }

    @GetMapping
    public ResponseEntity<List<Donor>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonorById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                donorService.getDonorById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donor> updateDonor(
            @PathVariable Long id,
            @Valid @RequestBody DonorRequest request) {

        return ResponseEntity.ok(
                donorService.updateDonor(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(
            @PathVariable Long id) {

        donorService.deleteDonor(id);

        return ResponseEntity.noContent().build();
    }
}