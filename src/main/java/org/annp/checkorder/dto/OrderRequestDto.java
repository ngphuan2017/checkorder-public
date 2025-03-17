package org.annp.checkorder.dto;

import java.time.Instant;

public class OrderRequestDto {
    private Data data;

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public static class Data {
        private String name;
        private Integer type;
        private String secretKey;
        private Integer accountId;
        private Integer status;
        private Instant endDate;
        private Integer sum2fa;
        private Integer userId;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getType() {
            return type;
        }

        public void setType(Integer type) {
            this.type = type;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }

        public Integer getAccountId() {
            return accountId;
        }

        public void setAccountId(Integer accountId) {
            this.accountId = accountId;
        }

        public Integer getStatus() {
            return status;
        }

        public void setStatus(Integer status) {
            this.status = status;
        }

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public Instant getEndDate() {
            return endDate;
        }

        public void setEndDate(Instant endDate) {
            this.endDate = endDate;
        }

        public Integer getSum2fa() {
            return sum2fa;
        }

        public void setSum2fa(Integer sum2fa) {
            this.sum2fa = sum2fa;
        }
    }

    public OrderRequestDto() {
    }

    public OrderRequestDto(Data data) {
        this.data = data;
    }
}
