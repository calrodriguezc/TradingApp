package co.edu.unbosque.Trading.controller;

import co.edu.unbosque.Trading.model.*;
import co.edu.unbosque.Trading.repository.UserRepository;
import co.edu.unbosque.Trading.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/payment-details")
    public ResponseEntity<UserPaymentDetailsDTO> getPaymentDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (user.getAlpacaAccount() == null) {
            throw new RuntimeException("El usuario no tiene cuenta Alpaca asociada");
        }

        UserPaymentDetailsDTO dto = new UserPaymentDetailsDTO();
        dto.setAccountId(user.getAlpacaAccount().getId());
        dto.setAccountOwnerName(
                user.getAlpacaAccount().getIdentity().getGivenName() + " " +
                        user.getAlpacaAccount().getIdentity().getFamilyName()
        );
        if (user.getAchRelationship() != null) {
            dto.setBankAccountNumber(user.getAchRelationship().getBankAccountNumber());
            dto.setBankAccountType(user.getAchRelationship().getBankAccountType());
            dto.setBankRoutingNumber(user.getAchRelationship().getBankRoutingNumber());
            dto.setAchId(user.getAchRelationship().getAchRelationshipId());
        }

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/mi-perfil")
    public ResponseEntity<User> getPerfilUsuario() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register/investor")
    public ResponseEntity<?> registerInvestor(@RequestBody Investor investor) {
        try {
            String message = authService.registerInvestor(investor);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("message", "Error al registrar el inversionista", "error", e.getMessage())
            );
        }
    }

    @PostMapping("/register/commission")
    public ResponseEntity<?> registerCommission(@RequestBody Commission commission) {
        try {
            String message = authService.registerCommission(commission);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("message", "Error al registrar el inversionista", "error", e.getMessage())
            );
        }
    }

//    @PostMapping("/register/admin")
//    public ResponseEntity<?> registerAdmin(@RequestBody Investor investor) {
//        try {
//            String message = authService.registerInvestor(investor);
//            return ResponseEntity.ok(Map.of("message", message));
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().body(
//                    Map.of("message", "Error al registrar el inversionista", "error", e.getMessage())
//            );
//        }
//    }

}