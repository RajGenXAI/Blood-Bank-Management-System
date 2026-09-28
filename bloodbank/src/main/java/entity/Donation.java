package entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(nullable = false)
    private LocalDate donationDate;

    @Column(nullable = false)
    private Integer unitsCollected;

    @Column(nullable = false)
    private String status;

    public Donation() {
    }

    public Donation(Donor donor,
                    LocalDate donationDate,
                    Integer unitsCollected,
                    String status) {
        this.donor = donor;
        this.donationDate = donationDate;
        this.unitsCollected = unitsCollected;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Donor getDonor() {
        return donor;
    }

    public void setDonor(Donor donor) {
        this.donor = donor;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}