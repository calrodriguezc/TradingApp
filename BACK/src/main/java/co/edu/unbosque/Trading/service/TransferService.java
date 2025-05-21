package co.edu.unbosque.Trading.service;

import co.edu.unbosque.Trading.model.Transfer;
import co.edu.unbosque.Trading.model.TransferDTO;
import co.edu.unbosque.Trading.repository.TransferRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
public class TransferService {

    private final RestTemplate restTemplate;
    private final TransferRepository transferRepository;

    public TransferService(TransferRepository transferRepository) {
        this.restTemplate = new RestTemplate();
        this.transferRepository = transferRepository;
    }

    public List<Transfer> getTransfersByAccountId(String accountId) {
        return transferRepository.findByAccountId(accountId);
    }

    public void depositFunds(String accountId, TransferDTO request) throws Exception {
        String url = "https://broker-api.sandbox.alpaca.markets/v1/accounts/" + accountId + "/transfers";

        HttpHeaders headers = createHeadersWithBasicAuth();
        HttpEntity<TransferDTO> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // Convertir el JSON de la respuesta a la entidad Transfer
                ObjectMapper mapper = new ObjectMapper();
                Transfer transfer = mapper.readValue(response.getBody(), Transfer.class);

                // Guardar en la base de datos
                transferRepository.save(transfer);
            }

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.err.println("Alpaca Transfer Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new Exception("Falló el depósito: " + e.getMessage(), e);
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
