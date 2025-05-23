package co.edu.unbosque.Trading.service;

import co.edu.unbosque.Trading.model.*;
import co.edu.unbosque.Trading.repository.PortfolioRepository;
import co.edu.unbosque.Trading.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class PortfolioService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    public PortfolioService(PortfolioRepository achRelationshioRepository, UserRepository userRepository) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.portfolioRepository = achRelationshioRepository;
        this.userRepository = userRepository;
    }

    public AccountBalanceDTO getAccountBalance(String accountId) throws Exception {
        String url = "https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/" + accountId + "/account";

        HttpHeaders headers = createHeadersWithBasicAuth();
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());

            if (root.has("cash") && root.has("last_equity")) {
                AccountBalanceDTO balance = new AccountBalanceDTO();
                balance.setCash(root.get("cash").asText());
                balance.setLast_equity(root.get("last_equity").asText());
                return balance;
            } else {
                throw new Exception("Respuesta inválida: faltan campos 'cash' o 'buying_power'.");
            }

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.err.println("Alpaca Balance Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new Exception("Falló la consulta del balance: " + e.getMessage(), e);
        }
    }

    public List<OrdersDTO> getOrders(String accountId) throws Exception {
        String url = "https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/" + accountId + "/orders";

        HttpHeaders headers = createHeadersWithBasicAuth();
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            System.out.println("Status Code: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());
            List<OrdersDTO> orders = new ArrayList<>();

            if (root.isArray()) {
                for (JsonNode node : root) {
                    OrdersDTO order = new OrdersDTO();
                    order.setId(node.get("id").asText());
                    order.setSymbol(node.get("symbol").asText());
                    order.setQty(node.has("qty") && !node.get("qty").isNull() ? node.get("qty").asDouble() : null);
                    order.setNotional(node.has("notional") && !node.get("notional").isNull() ? node.get("notional").asDouble() : null);
                    order.setType(node.get("type").asText());
                    order.setSide(node.get("side").asText());
                    order.setTimeInForce(node.get("time_in_force").asText());
                    order.setStatus(node.get("status").asText());
                    order.setCreatedAt(node.get("created_at").asText());
                    orders.add(order);
                }
            }

            return orders;

        } catch (Exception e) {
            System.err.println("Error fetching orders: " + e.getMessage());
            throw new Exception("Failed to fetch orders", e);
        }
    }

    public List<PositionDTO> getPortfolio(String accountId) throws Exception {
        String url = "https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/" + accountId + "/positions";

        HttpHeaders headers = createHeadersWithBasicAuth();
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            List<PositionDTO> positions = new ArrayList<>();

            if (root.isArray()) {
                for (JsonNode node : root) {
                    PositionDTO position = new PositionDTO();
                    position.setSymbol(node.get("symbol").asText());
                    position.setQty(node.get("qty").asInt());
                    position.setAvg_entry_price(node.get("avg_entry_price").asDouble());
                    position.setCurrent_price(node.get("current_price").asDouble());
                    position.setMarket_value(node.get("market_value").asDouble());
                    position.setUnrealized_pl(node.get("unrealized_pl").asDouble());
                    position.setUnrealized_plpc(node.get("unrealized_plpc").asDouble());
                    position.setChange_today(node.get("change_today").asDouble());
                    positions.add(position);
                }
            }

            return positions;

        } catch (Exception e) {
            System.err.println("Error fetching portfolio: " + e.getMessage());
            throw new Exception("Failed to fetch portfolio", e);
        }
    }

    public void createOrder(String accountId, OrderDTO request) throws Exception {
        final double COMMISSION_RATE = 0.02;

        if (request.getNotional() != null) {
            double originalNotional = request.getNotional();
            double commission = originalNotional * COMMISSION_RATE;
            double adjustedNotional = originalNotional - commission;
            if (adjustedNotional <= 0) {
                throw new IllegalArgumentException("El valor después de aplicar la comisión es inválido.");
            }
            request.setNotional(adjustedNotional);
        }

        if (request.getQty() != null && request.getPrice() != null) {
            double totalCost = request.getQty() * request.getPrice();
            double commission = totalCost * COMMISSION_RATE;
            double adjustedQty = Math.floor((totalCost - commission) / request.getPrice());
            if (adjustedQty <= 0) {
                throw new IllegalArgumentException("La cantidad después de aplicar la comisión es inválida.");
            }
            request.setQty((int) adjustedQty);
        }

        String url = "https://broker-api.sandbox.alpaca.markets/v1/trading/accounts/" + accountId + "/orders";

        HttpHeaders headers = createHeadersWithBasicAuth();
        HttpEntity<OrderDTO> entity = new HttpEntity<>(request, headers);

        try {
            restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.err.println("Alpaca Order Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new Exception("Failed to create order: " + e.getMessage(), e);
        }
    }

    public String createAchRelationship(String accountId, AchRelationshipDTO request, User user) throws Exception {
            String url = "https://broker-api.sandbox.alpaca.markets/v1/accounts/" + accountId + "/ach_relationships";

        HttpHeaders headers = createHeadersWithBasicAuth();
        HttpEntity<AchRelationshipDTO> entity = new HttpEntity<>(request, headers);

        System.out.println("Request JSON: " + objectMapper.writeValueAsString(request));
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            if (root.has("id")) {
                String achRelationshipId = root.get("id").asText();
                AchRelationship achRelationship = new AchRelationship();
                achRelationship.setBankAccountType(request.getBankAccountType());
                achRelationship.setAccountOwnerName(request.getAccountOwnerName());
                achRelationship.setBankAccountNumber(request.getBankAccountNumber());
                achRelationship.setBankRoutingNumber(request.getBankRoutingNumber());
                achRelationship.setAchRelationshipId(achRelationshipId);
                achRelationship.setUser(user);
                user.setAchRelationship(achRelationship);
                portfolioRepository.save(achRelationship);
                userRepository.save(user);
                return achRelationshipId;
            } else {
                throw new Exception("La respuesta no contiene un campo 'id'.");
            }
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.err.println("Alpaca ACH Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new Exception("Falló la creación de la relación ACH: " + e.getMessage(), e);
        }
    }

    private HttpHeaders createHeadersWithBasicAuth() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        String basicAuthToken = "Basic Q0tKRUI4UktKM0tXMkM3OVlIOTU6RkNmaTVoZ05HdVFremNQUGpNYkZ3RGU4ZFhRdTdqeDJhcDdESEtVMw==";
        headers.set("Authorization", basicAuthToken);

        return headers;
    }

}