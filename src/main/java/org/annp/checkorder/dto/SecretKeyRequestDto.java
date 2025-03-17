package org.annp.checkorder.dto;

public class SecretKeyRequestDto {
    private Data data;

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    // Lớp Data dùng để chứa secretKey
    public static class Data {
        private String secretKey;

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }
    }
}
