package com.project.ReadStory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ThuocVe")
@ToString(exclude = {"truyen", "theLoai"})
public class BelongTo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maThuocVe")
    private Long maThuocVe;

//    Cac Quan he
    @ManyToOne
    @JoinColumn(name = "maTheLoai")
    @JsonIgnore
    private Category theLoai;

    @ManyToOne
    @JoinColumn(name = "maTruyen")
    @JsonIgnore
    private Story truyen;
}
