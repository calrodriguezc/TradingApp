package co.edu.unbosque.Trading.controller;

import co.edu.unbosque.Trading.model.Commission;
import co.edu.unbosque.Trading.model.Investor;
import co.edu.unbosque.Trading.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/investor")
public class InvestorController {

    @Autowired
    private AuthService authService;

    @PutMapping("/{investorId}/assign-commission")
    public ResponseEntity<?> assignCommission(
            @PathVariable Long investorId,
            @RequestParam Long commission_id) {

        try {
            String message = authService.assignCommissionToInvestor(investorId, commission_id);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("message", "Error al asignar comisionista", "error", e.getMessage())
            );
        }
    }

    @GetMapping("/by-commission/{commission_id}")
    public ResponseEntity<List<Investor>> getInvestorsByCommissionId(@PathVariable Long commission_id) {
        List<Investor> investors = authService.findInvestorsByCommissionId(commission_id);
        return ResponseEntity.ok(investors);
    }

    @GetMapping("/commissions")
    public ResponseEntity<List<Commission>> getCommissions() {
        List<Commission> investors = authService.findCommissions();
        return ResponseEntity.ok(investors);
    }

}
