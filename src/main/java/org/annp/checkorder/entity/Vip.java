package org.annp.checkorder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "vip")
public class Vip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Nationalized
    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "exp")
    private Integer exp;

    @Nationalized
    @Column(name = "rank", length = 50)
    private String rank;

    @Nationalized
    @Column(name = "img", length = 500)
    private String img;

    @Column(name = "color", length = 7)
    private String color;

    public Vip() {
    }

    public Vip(Integer id, String name, Integer exp, String rank, String img, String color) {
        this.id = id;
        this.name = name;
        this.exp = exp;
        this.rank = rank;
        this.img = img;
        this.color = color;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getExp() {
        return exp;
    }

    public void setExp(Integer exp) {
        this.exp = exp;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

}