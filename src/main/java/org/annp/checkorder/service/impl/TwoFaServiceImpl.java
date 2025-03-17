package org.annp.checkorder.service.impl;

import org.annp.checkorder.service.TwoFaService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TwoFaServiceImpl implements TwoFaService {

    @Autowired
    private WebClient webClient;

    // Phương thức lấy code 2FA từ API
    @Override
    public String get2faCode(String secret) {
        String result = "";
        try {
            String response = webClient.get()
                    .uri("/tok/{secret}", secret)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Chờ kết quả (đồng bộ)

            JSONObject jsonResponse = new JSONObject(response);
            result = jsonResponse.getString("token"); // Lấy giá trị "token"
        } catch (Exception e) {
            e.printStackTrace();
            result = "Câu trả lời đã có, nhưng thiên đạo muốn ngươi tự ngẫm thêm. Ngày mai, ta sẽ dẫn ngươi đến sự thật.";
        }
        return result;
    }
}
