package org.annp.checkorder.dto;

import org.annp.checkorder.entity.User;

import java.time.Instant;

public class UserResponseDto {
    private Integer id;
    private String username;
    private Integer roleId;
    private String fullname;
    private Integer status;
    private String email;
    private String phone;
    private String address;
    private Integer gender;
    private String avatar;
    private Integer exp;
    private Integer notification;
    private Integer wheel;
    private String ticket;
    private Instant ticketTime;
    private Integer avatarFrame;
    private String linkFacebook;
    private String linkInstagram;
    private String linkYoutube;
    private String linkTiktok;
    private String googleId;
    private String facebookId;
    private Instant createdDate;
    private Instant updatedDate;

    public UserResponseDto() {
    }

    public UserResponseDto(Integer id, String username, Integer roleId, String fullname, Integer status, String email, String phone, String address, Integer gender, String avatar, Integer exp, Integer notification, Integer wheel, String ticket, Instant ticketTime, Integer avatarFrame, String linkFacebook, String linkInstagram, String linkYoutube, String linkTiktok, String googleId, String facebookId, Instant createdDate, Instant updatedDate) {
        this.id = id;
        this.username = username;
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

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.roleId = user.getRoleId();
        this.fullname = user.getFullname();
        this.status = user.getStatus();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.gender = user.getGender();
        this.avatar = user.getAvatar();
        this.exp = user.getExp();
        this.notification = user.getNotification();
        this.wheel = user.getWheel();
        this.ticket = user.getTicket();
        this.ticketTime = user.getTicketTime();
        this.avatarFrame = user.getAvatarFrame();
        this.linkFacebook = user.getLinkFacebook();
        this.linkInstagram = user.getLinkInstagram();
        this.linkYoutube = user.getLinkYoutube();
        this.linkTiktok = user.getLinkTiktok();
        this.googleId = user.getGoogleId();
        this.facebookId = user.getFacebookId();
        this.createdDate = user.getCreatedDate();
        this.updatedDate = user.getUpdatedDate();
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
