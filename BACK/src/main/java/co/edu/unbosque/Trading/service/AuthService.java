package co.edu.unbosque.Trading.service;

import co.edu.unbosque.Trading.model.AlpacaAccountRequest;
import co.edu.unbosque.Trading.model.AlpacaAccountResponse;
import co.edu.unbosque.Trading.model.User;
import co.edu.unbosque.Trading.repository.AlpacaAccountRepository;
import co.edu.unbosque.Trading.repository.UserRepository;
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
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AlpacaAccountRepository alpacaAccountRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AlpacaAccountService alpacaAccountService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.alpacaAccountService = alpacaAccountService;
        this.alpacaAccountRepository = alpacaAccountRepository;
    }

    @Transactional
    public String register(User newUser) {
        if (userRepository.existsByUsername(newUser.getUsername())) {
            return "El usuario ya existe";
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User savedUser = userRepository.save(newUser);

        AlpacaAccountRequest request = mapUserToAlpacaAccountRequest(newUser);
        try {
            AlpacaAccountResponse response = alpacaAccountService.createAccount(request);
            AlpacaAccountResponse savedAccount = alpacaAccountRepository.save(response);

            savedUser.setAlpacaAccount(savedAccount);
            userRepository.save(savedUser);

            System.out.println("Cuenta Alpaca creada: " + response);
            return "Usuario registrado exitosamente";
        } catch (Exception e) {
            userRepository.delete(savedUser);
            System.err.println("Error creando cuenta en Alpaca: " + e.getMessage());
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