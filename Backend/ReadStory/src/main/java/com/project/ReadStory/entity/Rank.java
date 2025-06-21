package com.project.ReadStory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "CapBac")
public class Rank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maCapBac")
    private int maCapBac;

    @Column(name = "tenCapBac", length = 100)
    private String tenCapBac;

    @Column(name = "mau", length = 50)
    private String mau;

//    Cac quan he
    @OneToMany(mappedBy = "capBac", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> nguoiDungList;


}
