package com.project.ReadStory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "TheoDoi")
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maTheoDoi")
    private Long maTheoDoi;

    @Column(name = "ngayTheoDoi")
    private LocalDateTime ngayTheoDoi;

    //Cac quan he
    @ManyToOne
    @JoinColumn(name = "maNguoiDung")
    @JsonIgnore
    private User nguoiDung;

    @ManyToOne
    @JoinColumn(name = "maTruyen")
    @JsonIgnore
    private Story truyen;

    @PrePersist
    protected void onCreate() {
        this.ngayTheoDoi = LocalDateTime.now();
    }
}
