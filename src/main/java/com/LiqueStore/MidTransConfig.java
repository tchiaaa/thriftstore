package com.LiqueStore;

import com.midtrans.Config;
import com.midtrans.service.MidtransSnapApi;
import com.midtrans.service.impl.MidtransSnapApiImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MidTransConfig {
    @Value("$SB-Mid-server-UDIvroNFCwv9xlkRqhXyBgFm")
    private String serverKey;

    @Value("$SB-Mid-client-6dZa-wyCmYNFN3ve")
    private String clientKey;

    @Bean
    public MidtransSnapApi midtransSnapApi() {
        Config config = Config.builder()
                .setServerKey(serverKey)
                .setClientKey(clientKey)
                .setIsProduction(false)
                .build();
        return new MidtransSnapApiImpl(config);
    }
}
