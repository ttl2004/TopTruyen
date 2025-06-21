package com.project.ReadStory.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "TheLoai")
@ToString(exclude = "thuocVeList")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maTheLoai")
    private Integer maTheLoai;

    @Column(name = "tenTheLoai", length = 100)
    private String tenTheLoai;

    @Column(name = "moTa", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "ngayThem")
    private LocalDateTime ngayThem;

    @Column(name = "ngayCapNhat")
    private LocalDateTime ngayCapNhat;

    @PrePersist
    protected void onCreate() {
        this.ngayThem = LocalDateTime.now();
        this.ngayCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.ngayCapNhat = LocalDateTime.now();
    }

    //Các quan hệ
    //Quan hệ 1-N với ThuocVe
    @OneToMany(mappedBy = "theLoai", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<BelongTo> thuocVeList;


}
