package dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class DonationRequest {

    @NotNull(message = "Donor ID is required")
    private Long donorId;

    @NotNull(message = "Donation date is required")
    private LocalDate donationDate;

    @NotNull(message = "Units collected is required")
    @Positive(message = "Units collected must be greater than zero")
    private Integer unitsCollected;

    public DonationRequest() {
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }

    public LocalDate getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDate donationDate) {
        this.donationDate = donationDate;
    }

    public Integer getUnitsCollected() {
        return unitsCollected;
    }

    public void setUnitsCollected(Integer unitsCollected) {
        this.unitsCollected = unitsCollected;
    }
}