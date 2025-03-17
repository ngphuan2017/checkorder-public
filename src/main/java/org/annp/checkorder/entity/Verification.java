package org.annp.checkorder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Entity
@Table(name = "verification")
public class Verification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "otp_code", length = 6)
    private String otpCode;

    @Nationalized
    @Column(name = "propersion", length = 100)
    private String propersion;

    @Column(name = "generated_time")
    private Instant generatedTime;

    public Verification() {
    }

    public Verification(Integer id, String otpCode, String propersion, Instant generatedTime) {
        this.id = id;
        this.otpCode = otpCode;
        this.propersion = propersion;
        this.generatedTime = generatedTime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public String getPropersion() {
        return propersion;
    }

    public void setPropersion(String propersion) {
        this.propersion = propersion;
    }

    public Instant getGeneratedTime() {
        return generatedTime;
    }

    public void setGeneratedTime(Instant generatedTime) {
        this.generatedTime = generatedTime;
    }

}