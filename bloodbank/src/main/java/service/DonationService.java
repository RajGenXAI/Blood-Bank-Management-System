package service;

import dto.DonationRequest;
import entity.Donation;
import entity.Donor;
import exception.BadRequestException;
import exception.ResourceNotFoundException;
import repository.DonationRepository;
import repository.DonorRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DonationService {

    private static final long MINIMUM_DONATION_GAP_DAYS = 90;

    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;

    public DonationService(DonationRepository donationRepository,
                           DonorRepository donorRepository) {
        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
    }

    public Donation createDonation(DonationRequest request) {

        Donor donor = donorRepository.findById(request.getDonorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor not found with id: " + request.getDonorId()
                        )
                );

        checkDonationEligibility(donor, request.getDonationDate());

        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setDonationDate(request.getDonationDate());
        donation.setUnitsCollected(request.getUnitsCollected());
        donation.setStatus("COMPLETED");

        Donation savedDonation = donationRepository.save(donation);

        donor.setLastDonationDate(request.getDonationDate());
        donorRepository.save(donor);

        return savedDonation;
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public Donation getDonationById(Long id) {

        return donationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donation not found with id: " + id
                        )
                );
    }

    public List<Donation> getDonationsByDonor(Long donorId) {

        if (!donorRepository.existsById(donorId)) {
            throw new ResourceNotFoundException(
                    "Donor not found with id: " + donorId
            );
        }

        return donationRepository.findByDonorId(donorId);
    }

    public void deleteDonation(Long id) {

        Donation donation = getDonationById(id);

        donationRepository.delete(donation);
    }

    private void checkDonationEligibility(
            Donor donor,
            LocalDate donationDate) {

        if (donor.getLastDonationDate() == null) {
            return;
        }

        LocalDate eligibleDate =
                donor.getLastDonationDate()
                        .plusDays(MINIMUM_DONATION_GAP_DAYS);

        if (donationDate.isBefore(eligibleDate)) {

            throw new BadRequestException(
                    "Donor is not eligible to donate yet. " +
                            "Minimum donation gap has not been completed."
            );
        }
    }
}