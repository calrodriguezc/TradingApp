package co.edu.unbosque.Trading.controller;

import co.edu.unbosque.Trading.model.AssetDTO;
import co.edu.unbosque.Trading.model.BarDTO;
import co.edu.unbosque.Trading.model.LoginRequestDTO;
import co.edu.unbosque.Trading.model.User;
import co.edu.unbosque.Trading.service.AuthService;
import co.edu.unbosque.Trading.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private MarketDataService marketDataService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User nuevoUsuario) {
        String mensaje = authService.register(nuevoUsuario);
        if (mensaje.equals("Usuario registrado correctamente")) {
            return ResponseEntity.ok(Map.of("message", mensaje));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", mensaje));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        String mensaje = authService.login(request);
        if (mensaje.equals("Inicio de sesión exitoso")) {
            return ResponseEntity.ok(Map.of("message", mensaje));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", mensaje));
        }
    }

    @GetMapping("/assets")
    public ResponseEntity<?> getAssetsInfo() {
        try {
            List<AssetDTO> assets = marketDataService.fetchAssetsInfo();
            return ResponseEntity.ok(assets);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error al obtener los activos"));
        }
    }

    @GetMapping("/bars/{symbol}")
    public ResponseEntity<List<BarDTO>> getBarsForSymbol(@PathVariable String symbol) {
        try {
            List<BarDTO> bars = marketDataService.fetchBarsForSymbol(symbol);
            return ResponseEntity.ok(bars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}