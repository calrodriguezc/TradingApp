package co.edu.unbosque.Trading.service;

import co.edu.unbosque.Trading.model.AlpacaAccountRequest;
import co.edu.unbosque.Trading.model.AlpacaAccountResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
public class AlpacaAccountService {

    private final RestTemplate restTemplate;

    public AlpacaAccountService() {
        this.restTemplate = new RestTemplate();
    }

    public AlpacaAccountResponse createAccount(AlpacaAccountRequest request) throws Exception {
        String url = "https://broker-api.sandbox.alpaca.markets/v1/accounts";

        HttpHeaders headers = createHeadersWithBasicAuth();
        HttpEntity<AlpacaAccountRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<AlpacaAccountResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AlpacaAccountResponse.class
            );
            return response.getBody();
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.err.println("Alpaca API Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new Exception("Failed to create account: " + e.getMessage(), e);
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