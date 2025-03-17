package org.annp.checkorder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Entity
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "password", nullable = false, length = 250)
    private String password;

    @ColumnDefault("3")
    @Column(name = "role_id", nullable = false)
    private Integer roleId;

    @Column(name = "fullname", nullable = false, length = 100)
    private String fullname;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "email", length = 50)
    private String email;

    @Column(name = "phone", length = 10)
    private String phone;

    @Nationalized
    @Column(name = "address", length = 250)
    private String address;

    @Column(name = "gender")
    private Integer gender;

    @Nationalized
    @Column(name = "avatar", length = 500)
    private String avatar;

    @Column(name = "exp")
    private Integer exp;

    @Column(name = "notification")
    private Integer notification;

    @Column(name = "wheel")
    private Integer wheel;

    @Nationalized
    @Column(name = "ticket", length = 45)
    private String ticket;

    @Column(name = "ticket_time")
    private Instant ticketTime;

    @Column(name = "avatar_frame")
    private Integer avatarFrame;

    @Nationalized
    @Column(name = "link_facebook", length = 250)
    private String linkFacebook;

    @Nationalized
    @Column(name = "link_instagram", length = 250)
    private String linkInstagram;

    @Nationalized
    @Column(name = "link_youtube", length = 250)
    private String linkYoutube;

    @Nationalized
    @Column(name = "link_tiktok", length = 250)
    private String linkTiktok;

    @Nationalized
    @Column(name = "google_id", length = 250)
    private String googleId;

    @Nationalized
    @Column(name = "facebook_id", length = 250)
    private String facebookId;

    @Column(name = "created_date")
    private Instant createdDate;

    @Column(name = "updated_date")
    private Instant updatedDate;

    public User() {
    }

    public User(Integer id, String username, String password, Integer roleId, String fullname, Integer status, String email, String phone, String address, Integer gender, String avatar, Integer exp, Integer notification, Integer wheel, String ticket, Instant ticketTime, Integer avatarFrame, String linkFacebook, String linkInstagram, String linkYoutube, String linkTiktok, String googleId, String facebookId, Instant createdDate, Instant updatedDate) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.roleId = roleId;
        this.fullname = fullname;
        this.status = status;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.avatar = avatar;
        this.exp = exp;
        this.notification = notification;
        this.wheel = wheel;
        this.ticket = ticket;
        this.ticketTime = ticketTime;
        this.avatarFrame = avatarFrame;
        this.linkFacebook = linkFacebook;
        this.linkInstagram = linkInstagram;
        this.linkYoutube = linkYoutube;
        this.linkTiktok = linkTiktok;
        this.googleId = googleId;
        this.facebookId = facebookId;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Integer getExp() {
        return exp;
    }

    public void setExp(Integer exp) {
        this.exp = exp;
    }

    public Integer getNotification() {
        return notification;
    }

    public void setNotification(Integer notification) {
        this.notification = notification;
    }

    public Integer getWheel() {
        return wheel;
    }

    public void setWheel(Integer wheel) {
        this.wheel = wheel;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }

    public Instant getTicketTime() {
        return ticketTime;
    }

    public void setTicketTime(Instant ticketTime) {
        this.ticketTime = ticketTime;
    }

    public Integer getAvatarFrame() {
        return avatarFrame;
    }

    public void setAvatarFrame(Integer avatarFrame) {
        this.avatarFrame = avatarFrame;
    }

    public String getLinkFacebook() {
        return linkFacebook;
    }

    public void setLinkFacebook(String linkFacebook) {
        this.linkFacebook = linkFacebook;
    }

    public String getLinkInstagram() {
        return linkInstagram;
    }

    public void setLinkInstagram(String linkInstagram) {
        this.linkInstagram = linkInstagram;
    }

    public String getLinkYoutube() {
        return linkYoutube;
    }

    public void setLinkYoutube(String linkYoutube) {
        this.linkYoutube = linkYoutube;
    }

    public String getLinkTiktok() {
        return linkTiktok;
    }

    public void setLinkTiktok(String linkTiktok) {
        this.linkTiktok = linkTiktok;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public String getFacebookId() {
        return facebookId;
    }

    public void setFacebookId(String facebookId) {
        this.facebookId = facebookId;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Instant updatedDate) {
        this.updatedDate = updatedDate;
    }

}