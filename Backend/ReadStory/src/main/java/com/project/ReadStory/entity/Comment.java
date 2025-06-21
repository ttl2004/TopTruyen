package com.project.ReadStory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "BinhLuan")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maBinhLuan")
    private Long maBinhLuan;

    @Column(name = "noiDung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "ngayThem")
    private LocalDateTime ngayThem;

    @Column(name = "ngayChinhSua")
    private LocalDateTime ngayChinhSua;

    // Quan hệ N-1 với NGuoiDung
    @ManyToOne
    @JoinColumn(name = "maNguoiDung")
    @JsonIgnore
    private User nguoiDung;

    // Quan hệ N-1với Truyen
    @ManyToOne
    @JoinColumn(name = "maTruyen")
    @JsonIgnore
    private Story truyen;

    @PrePersist
    protected void onCreate() {
        this.ngayThem = LocalDateTime.now();
        this.ngayChinhSua = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.ngayChinhSua = LocalDateTime.now();
    }
}
