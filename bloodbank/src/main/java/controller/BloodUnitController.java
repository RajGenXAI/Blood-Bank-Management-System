package controller;

import dto.BloodUnitRequest;
import entity.BloodUnit;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.BloodUnitService;

import java.util.List;

@RestController
@RequestMapping("/api/blood-units")
public class BloodUnitController {

    private final BloodUnitService bloodUnitService;

    public BloodUnitController(BloodUnitService bloodUnitService) {
        this.bloodUnitService = bloodUnitService;
    }

    @PostMapping
    public ResponseEntity<BloodUnit> createBloodUnit(
            @Valid @RequestBody BloodUnitRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bloodUnitService.createBloodUnit(request));
    }

    @GetMapping
    public ResponseEntity<List<BloodUnit>> getAllBloodUnits() {
        return ResponseEntity.ok(
                bloodUnitService.getAllBloodUnits()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodUnit> getBloodUnitById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bloodUnitService.getBloodUnitById(id)
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<BloodUnit>> getAvailableUnits() {

        return ResponseEntity.ok(
                bloodUnitService.getAvailableUnits()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<BloodUnit> updateBloodUnit(
            @PathVariable Long id,
            @Valid @RequestBody BloodUnitRequest request) {

        return ResponseEntity.ok(
                bloodUnitService.updateBloodUnit(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloodUnit(
            @PathVariable Long id) {

        bloodUnitService.deleteBloodUnit(id);

        return ResponseEntity.noContent().build();
    }
}