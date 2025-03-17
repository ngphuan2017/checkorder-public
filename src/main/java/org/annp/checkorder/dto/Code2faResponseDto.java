package org.annp.checkorder.dto;

public class Code2faResponseDto {
    private Data data;

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    // Lớp Data dùng để chứa secretKey
    public static class Data {
        private String code2fa;
        private Integer sum2fa;
        private Integer status;

        public String getCode2fa() {
            return code2fa;
        }

        public void setCode2fa(String code2fa) {
            this.code2fa = code2fa;
        }

        public Integer getSum2fa() {
            return sum2fa;
        }

        public void setSum2fa(Integer sum2fa) {
            this.sum2fa = sum2fa;
        }

        public Integer getStatus() {
            return status;
        }

        public void setStatus(Integer status) {
            this.status = status;
        }
    }
}
