package co.edu.unbosque.Trading.controller;

import co.edu.unbosque.Trading.model.*;
import co.edu.unbosque.Trading.service.AchRelationshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ach")
public class AchRelationshipController {

    @Autowired
    private AchRelationshipService achRelationshipService;

    @GetMapping("/account-balance/{accountId}")
    public ResponseEntity<?> getAccountBalance(@PathVariable String accountId) {
        try {
            AccountBalanceDTO balance = achRelationshipService.getAccountBalance(accountId);
            return ResponseEntity.ok(balance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener el balance: " + e.getMessage());
        }
    }

    @GetMapping("/orders/{accountId}")
    public ResponseEntity<?> getOrders(@PathVariable String accountId) {
        try {
            List<OrdersDTO> orders = achRelationshipService.getOrders(accountId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/portfolio/{accountId}")
    public ResponseEntity<?> getPortfolio(@PathVariable String accountId) {
        try {
            List<PositionDTO> positions = achRelationshipService.getPortfolio(accountId);
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/createOrder/{accountId}")
    public ResponseEntity<String> createOrder(
            @PathVariable String accountId,
            @RequestBody OrderDTO request
    ) {
        try {
            // Validar que el request contenga los parámetros necesarios según el tipo de orden
            validateOrderRequest(request);
            achRelationshipService.createOrder(accountId, request);
            return ResponseEntity.ok("Orden realizada con éxito.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    private void validateOrderRequest(OrderDTO request) throws Exception {
        // Validar que la orden tenga los parámetros requeridos según el tipo
        if ("market".equalsIgnoreCase(request.getType()) || "limit".equalsIgnoreCase(request.getType())) {
            if (request.getQty() == null && request.getNotional() == null) {
                throw new Exception("Para una orden de tipo 'market' o 'limit', debes proporcionar 'qty' o 'notional'.");
            }
        }

        if ("stop".equalsIgnoreCase(request.getType()) || "stop_limit".equalsIgnoreCase(request.getType())) {
            if (request.getStop_price() == null) {
                throw new Exception("Para una orden de tipo 'stop' o 'stop_limit', debes proporcionar 'stop_price'.");
            }
        }

        if ("limit".equalsIgnoreCase(request.getType()) && request.getPrice() == null) {
            throw new Exception("Para una orden de tipo 'limit', debes proporcionar 'price'.");
        }
    }

//    @PostMapping("/transfer/{accountId}")
//    public ResponseEntity<String> depositFunds(
//            @PathVariable String accountId,
//            @RequestBody TransferDTO request
//    ) {
//        try {
//            achRelationshipService.depositFunds(accountId, request);
//            return ResponseEntity.ok("Transferencia realizada con éxito.");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
//        }
//    }

    @PostMapping("/{accountId}")
    public ResponseEntity<String> createAchRelationship(
            @PathVariable String accountId,
            @RequestBody AchRelationshipDTO request,
            Authentication authentication
    ) {
        try {
            User user = (User) authentication.getPrincipal();
            String achId = achRelationshipService.createAchRelationship(accountId, request, user);
            return ResponseEntity.ok(achId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}