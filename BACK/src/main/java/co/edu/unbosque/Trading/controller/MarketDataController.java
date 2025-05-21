package co.edu.unbosque.Trading.controller;

import co.edu.unbosque.Trading.model.AssetDTO;
import co.edu.unbosque.Trading.model.BarDTO;
import co.edu.unbosque.Trading.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alpaca")
public class MarketDataController {

    @Autowired
    private MarketDataService marketDataService;

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