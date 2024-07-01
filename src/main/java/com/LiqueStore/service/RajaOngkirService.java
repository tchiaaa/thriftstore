package com.LiqueStore.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Service
public class RajaOngkirService {
    @Value("${rajaongkir.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public RajaOngkirService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getProvinces() {
//        String url = "https://pro.rajaongkir.com/api/province";
        String url = "https://api.rajaongkir.com/starter/province";
        HttpHeaders headers = new HttpHeaders();
        headers.set("key", apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    public String getCities(int provinceId) {
//        String url = "https://pro.rajaongkir.com/api/city?province=" + provinceId;
        String url = "https://api.rajaongkir.com/starter/city?province=" + provinceId;
        org.springframework.http.HttpHeaders headers = new HttpHeaders();
        headers.set("key", apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    public String getShippingCost(int origin, int destination, int weight) {
//        String url = "https://pro.rajaongkir.com/api/cost";
        String url = "https://api.rajaongkir.com/starter/cost";
        HttpHeaders headers = new HttpHeaders();
        headers.set("key", apiKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("origin", String.valueOf(origin));
        map.add("destination", String.valueOf(destination));
        map.add("weight", String.valueOf(weight));
        map.add("courier", "jne");

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

}
