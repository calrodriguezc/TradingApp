package co.edu.unbosque.Trading.controller;

import co.edu.unbosque.Trading.model.Transfer;
import co.edu.unbosque.Trading.model.TransferDTO;
import co.edu.unbosque.Trading.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transfer")
public class TransferController {

    @Autowired
    private TransferService transferService;

    @GetMapping("/getTransfers/{accountId}")
    public ResponseEntity<List<Transfer>> getTransfers(@PathVariable String accountId) {
        List<Transfer> transfers = transferService.getTransfersByAccountId(accountId);
        return ResponseEntity.ok(transfers);
    }

    @PostMapping("/{accountId}")
    public ResponseEntity<String> depositFunds(
            @PathVariable String accountId,
            @RequestBody TransferDTO request
    ) {
        try {
            transferService.depositFunds(accountId, request);
            return ResponseEntity.ok("Transferencia realizada con éxito.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}
