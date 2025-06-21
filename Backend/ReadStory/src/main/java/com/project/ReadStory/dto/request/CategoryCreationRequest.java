package com.project.ReadStory.dto.request;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CategoryCreationRequest {
    private String tenTheLoai;
    private String moTa;
}
