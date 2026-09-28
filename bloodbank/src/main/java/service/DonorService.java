package service;

import dto.DonorRequest;
import entity.Donor;
import enums.DonorStatus;
import exception.BadRequestException;
import exception.ResourceNotFoundException;
import repository.DonorRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonorService {

    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public Donor createDonor(DonorRequest request) {

        if (donorRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "A donor with this email already exists."
            );
        }

        Donor donor = new Donor();

        donor.setName(request.getName());
        donor.setEmail(request.getEmail());
        donor.setPhone(request.getPhone());
        donor.setBloodGroup(request.getBloodGroup());
        donor.setDateOfBirth(request.getDateOfBirth());
        donor.setLastDonationDate(request.getLastDonationDate());

        donor.setStatus(
                calculateDonorStatus(request.getLastDonationDate())
        );

        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {

        return donorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Donor not found with id: " + id
                        )
                );
    }

    public Donor updateDonor(Long id, DonorRequest request) {

        Donor donor = getDonorById(id);

        if (!donor.getEmail().equals(request.getEmail())
                && donorRepository.existsByEmail(request.getEmail())) {

            throw new BadRequestException(
                    "A donor with this email already exists."
            );
        }

        donor.setName(request.getName());
        donor.setEmail(request.getEmail());
        donor.setPhone(request.getPhone());
        donor.setBloodGroup(request.getBloodGroup());
        donor.setDateOfBirth(request.getDateOfBirth());
        donor.setLastDonationDate(request.getLastDonationDate());

        donor.setStatus(
                calculateDonorStatus(request.getLastDonationDate())
        );

        return donorRepository.save(donor);
    }

    public void deleteDonor(Long id) {

        Donor donor = getDonorById(id);

        donorRepository.delete(donor);
    }

    private DonorStatus calculateDonorStatus(
            java.time.LocalDate lastDonationDate) {

        if (lastDonationDate == null) {
            return DonorStatus.ELIGIBLE;
        }

        java.time.LocalDate eligibleDate =
                lastDonationDate.plusDays(90);

        if (!java.time.LocalDate.now().isBefore(eligibleDate)) {
            return DonorStatus.ELIGIBLE;
        }

        return DonorStatus.NOT_ELIGIBLE;
    }
}