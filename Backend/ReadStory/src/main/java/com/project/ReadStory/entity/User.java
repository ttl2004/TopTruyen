package com.project.ReadStory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "NguoiDung")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maNguoiDung")
    private Long maNguoiDung;

    @Column(name = "ten", length = 100, unique = true)
    private String tenNguoiDung;

    @Column(name = "tenDangNhap", length = 100, unique = true)
    private String tenDangNhap;

    @Column(name= "matKhau", length = 255)
    private String matKhau;

    @Column(name = "email", length = 255, unique = true)
    private String email;

    @Column(name = "ngayTao")
    private LocalDateTime ngayTao;

    @Column(name = "ngayCapNhat")
    private LocalDateTime ngayCapNhat;

    @Column(name = "quyenHan", length = 50)
    private String quyenHan;

    // Các quan hệ
    @ManyToOne
    @JoinColumn(name = "maCapBac")
    private Rank capBac;

    @OneToMany(mappedBy = "nguoiDung", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Comment> binhLuanList;

    @OneToMany(mappedBy = "nguoiDung", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Follow> theoDoiList;

    @OneToMany(mappedBy = "nguoiDung", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReadStory> truyenList;


    @PrePersist
    protected void onCreate() {
        this.ngayTao = LocalDateTime.now();
        this.ngayCapNhat = LocalDateTime.now();
        if (this.quyenHan == null || this.quyenHan.isEmpty()) {
            this.quyenHan = "USER";
        }

    }

    @PreUpdate
    protected void onUpdate() {
        this.ngayCapNhat = LocalDateTime.now();
    }

}
