package co.edu.unbosque.Trading.service;

import co.edu.unbosque.Trading.model.*;
import co.edu.unbosque.Trading.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Service
public class AuthService {

    private final AlpacaAccountRepository alpacaAccountRepository;
    private final AlpacaAccountService alpacaAccountService;
    private final UserRepository userRepository;
    private final InvestorRepository investorRepository;
//    private final AdminRepository adminRepository;
    private final CommissionRepository commissionRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AlpacaAccountRepository alpacaAccountRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AlpacaAccountService alpacaAccountService,
            InvestorRepository investorRepository,
//            AdminRepository adminRepository,
            CommissionRepository commissionRepository) {
        this.userRepository = userRepository;
        this.investorRepository = investorRepository;
//        this.adminRepository = adminRepository;
        this.commissionRepository = commissionRepository;
        this.passwordEncoder = passwordEncoder;
        this.alpacaAccountService = alpacaAccountService;
        this.alpacaAccountRepository = alpacaAccountRepository;
    }

    public List<Commission> findCommissions() {
        return commissionRepository.findAll(); // Asume que usas JPA
    }

    public List<Investor> findInvestorsByCommissionId(Long commissionId) {
        return investorRepository.findByCommissionId(commissionId); // Asume que tienes este método en el repositorio
    }

    @Transactional
    public String registerInvestor(Investor investor) {
        if (investorRepository.existsByUsername(investor.getUsername())) {
            return "El usuario ya existe";
        }
        investor.setPassword(passwordEncoder.encode(investor.getPassword()));
        Investor savedInvestor = investorRepository.save(investor);

        AlpacaAccountRequest request = mapUserToAlpacaAccountRequest(investor);
        try {
            AlpacaAccountResponse response = alpacaAccountService.createAccount(request);
            AlpacaAccountResponse savedAccount = alpacaAccountRepository.save(response);

            savedInvestor.setAlpacaAccount(savedAccount);
            investorRepository.save(savedInvestor);

            return "Usuario registrado exitosamente";
        } catch (Exception e) {
            investorRepository.delete(savedInvestor);
            return "Error al registrar usuario - no se pudo crear la cuenta Alpaca";
        }
    }

    public String assignCommissionToInvestor(Long investorId, Long commissionId) {
        Investor investor = investorRepository.findById(investorId)
                .orElseThrow(() -> new IllegalArgumentException("Inversor no encontrado"));

        Commission agent = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new IllegalArgumentException("Comisionista no encontrado"));

        investor.setCommission(agent);
        investorRepository.save(investor);

        return "Comisionista asignado correctamente al inversor " + investorId;
    }


//    @Transactional
//    public String registerAdmin(Admin admin) {
//        if (adminRepository.existsByUsername(admin.getUsername())) {
//            return "El usuario ya existe";
//        }
//
//        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
//
//        Admin savedAdmin = adminRepository.save(admin);
//
//        AlpacaAccountRequest request = mapUserToAlpacaAccountRequest(admin);
//        try {
//            AlpacaAccountResponse response = alpacaAccountService.createAccount(request);
//            AlpacaAccountResponse savedAccount = alpacaAccountRepository.save(response);
//
//            savedAdmin.setAlpacaAccount(savedAccount);
//            adminRepository.save(savedAdmin);
//
//            return "Usuario registrado exitosamente";
//        } catch (Exception e) {
//            adminRepository.delete(savedAdmin);
//            return "Error al registrar usuario - no se pudo crear la cuenta Alpaca";
//        }
//    }

    @Transactional
    public String registerCommission(Commission commission) {
        if (commissionRepository.existsByUsername(commission.getUsername())) {
            return "El usuario ya existe";
        }

        commission.setPassword(passwordEncoder.encode(commission.getPassword()));

        Commission savedcommission = commissionRepository.save(commission);

        AlpacaAccountRequest request = mapUserToAlpacaAccountRequest(commission);
        try {
            AlpacaAccountResponse response = alpacaAccountService.createAccount(request);
            AlpacaAccountResponse savedAccount = alpacaAccountRepository.save(response);

            savedcommission.setAlpacaAccount(savedAccount);
            commissionRepository.save(savedcommission);

            return "Usuario registrado exitosamente";
        } catch (Exception e) {
            commissionRepository.delete(savedcommission);
            return "Error al registrar usuario - no se pudo crear la cuenta Alpaca";
        }
    }

    private AlpacaAccountRequest mapUserToAlpacaAccountRequest(User user) {
        AlpacaAccountRequest.Contact contact = AlpacaAccountRequest.Contact.builder()
                .email_address(user.getEmail())
                .phone_number(user.getPhoneNumber())
                .street_address(Collections.singletonList("CALLE 0 # 0 - 0"))
                .city("NULL")
                .build();

        AlpacaAccountRequest.Identity identity = AlpacaAccountRequest.Identity.builder()
                .given_name(user.getName())
                .family_name(user.getLastName())
                .date_of_birth("2002-09-25")
                .country_of_tax_residence("COL")  // Suponiendo que es el mismo que country
                .funding_source(Collections.singletonList("employment_income")) // Puedes ajustarlo si quieres otro
                .tax_id(user.getCedula())
                .tax_id_type("COL_NIT")
                .build();

        AlpacaAccountRequest.Disclosures disclosures = AlpacaAccountRequest.Disclosures.builder()
                .is_control_person(false)
                .is_affiliated_exchange_or_finra(false)
                .is_politically_exposed(false)
                .immediate_family_exposed(false)
                .build();

        Instant now = Instant.now();
        String signedAt = DateTimeFormatter.ISO_INSTANT.format(now);
        String ipAddress = "185.13.21.99";

        List<AlpacaAccountRequest.Agreement> agreements = List.of(
                AlpacaAccountRequest.Agreement.builder()
                        .agreement("customer_agreement")
                        .signed_at(signedAt)
                        .ip_address(ipAddress)
                        .build(),
                AlpacaAccountRequest.Agreement.builder()
                        .agreement("margin_agreement")
                        .signed_at(signedAt)
                        .ip_address(ipAddress)
                        .build()
        );

        return AlpacaAccountRequest.builder()
                .contact(contact)
                .identity(identity)
                .disclosures(disclosures)
                .agreements(agreements)
                .account_type("trading")
                .account_sub_type("")
                .build();
    }

}