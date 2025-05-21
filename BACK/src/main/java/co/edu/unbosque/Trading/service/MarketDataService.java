package co.edu.unbosque.Trading.service;

import co.edu.unbosque.Trading.model.AssetDTO;
import co.edu.unbosque.Trading.model.BarDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.*;
import java.util.*;

import java.util.List;

@Service
public class MarketDataService {

    @Value("${alpaca.api.key}")
    private String apiKey;
    @Value("${alpaca.api.secret}")
    private String apiSecret;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public MarketDataService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<AssetDTO> fetchAssetsInfo() throws Exception {
        String assetsUrl = "https://paper-api.alpaca.markets/v2/assets";
        HttpEntity<Void> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<String> assetsResponse = restTemplate.exchange(assetsUrl, HttpMethod.GET, entity, String.class);

        JsonNode assetsArray = objectMapper.readTree(assetsResponse.getBody());

        List<String> symbols = new ArrayList<>();
        Map<String, AssetDTO> assetInfoMap = new HashMap<>();
        int maxAssets = 25;
        int count = 0;

        for (JsonNode asset : assetsArray) {
            if (asset.get("status").asText().equals("active") && asset.get("tradable").asBoolean()) {
                String symbol = asset.get("symbol").asText();
                symbols.add(symbol);
                AssetDTO dto = new AssetDTO();
                dto.setSymbol(symbol);
                dto.setName(asset.get("name").asText());
                dto.setExchange(asset.get("exchange").asText());
                assetInfoMap.put(symbol, dto);

                count++;
                if (count >= maxAssets) {
                    break;
                }
            }
        }

        // Construir el parámetro de símbolos para el snapshot
        String symbolsParam = String.join(",", symbols);
        String snapshotsUrl = "https://data.alpaca.markets/v2/stocks/snapshots?symbols=" + symbolsParam;

        ResponseEntity<String> snapshotsResponse = restTemplate.exchange(snapshotsUrl, HttpMethod.GET, entity, String.class);

        System.out.println("Snapshots response body: " + snapshotsResponse.getBody());

        JsonNode rootNode = objectMapper.readTree(snapshotsResponse.getBody());

        if (rootNode != null && rootNode.size() > 0) {
            Iterator<String> fieldNames = rootNode.fieldNames();
            while (fieldNames.hasNext()) {
                String symbol = fieldNames.next();
                JsonNode snapshot = rootNode.get(symbol);

                if (snapshot != null && snapshot.has("latestTrade") && snapshot.has("prevDailyBar") && snapshot.has("dailyBar")) {
                    double lastPrice = snapshot.get("latestTrade").get("p").asDouble();
                    double prevClose = snapshot.get("prevDailyBar").get("c").asDouble();
                    long volume = snapshot.get("dailyBar").get("v").asLong();

                    double change = lastPrice - prevClose;
                    double changePercent = (change / prevClose) * 100.0;

                    AssetDTO dto = assetInfoMap.get(symbol);
                    if (dto != null) {
                        dto.setLastPrice(lastPrice);
                        dto.setChange(change);
                        dto.setChangePercent(changePercent);
                        dto.setVolume(volume);
                    }
                } else {
                    System.out.println("Warning: Incomplete snapshot data for symbol " + symbol);
                }
            }
        } else {
            System.out.println("Warning: Empty snapshot response or invalid JSON.");
        }

        return new ArrayList<>(assetInfoMap.values());
    }



    public List<BarDTO> fetchBarsForSymbol(String symbol) throws Exception {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(3);

        String barsUrl = "https://data.alpaca.markets/v2/stocks/" + symbol +
                "/bars?timeframe=1Day&start=" + startDate.format(formatter) +
                "&end=" + endDate.format(formatter) + "&feed=iex";

        HttpEntity<Void> entity = new HttpEntity<>(createHeaders());

        try {
            ResponseEntity<String> barsResponse = restTemplate.exchange(barsUrl, HttpMethod.GET, entity, String.class);

            System.out.println("Bars API response body: " + barsResponse.getBody());

            JsonNode rootNode = objectMapper.readTree(barsResponse.getBody());

            List<BarDTO> barsList = new ArrayList<>();
            if (rootNode != null && rootNode.has("bars") && rootNode.get("bars").isArray()) {
                for (JsonNode bar : rootNode.get("bars")) {
                    BarDTO dto = new BarDTO();
                    dto.setT(bar.get("t").asText());
                    dto.setO(bar.get("o").asDouble());
                    dto.setH(bar.get("h").asDouble());
                    dto.setL(bar.get("l").asDouble());
                    dto.setC(bar.get("c").asDouble());
                    dto.setV(bar.get("v").asLong());
                    barsList.add(dto);
                }
            } else {
                System.out.println("Warning: No 'bars' field in API response or 'bars' is empty.");
            }

            return barsList;

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.err.println("Alpaca API Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new Exception("Failed to fetch bars: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Error fetching bars: " + e.getMessage());
            throw e;
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("APCA-API-KEY-ID", apiKey);
        headers.set("APCA-API-SECRET-KEY", apiSecret);
        return headers;
    }

}