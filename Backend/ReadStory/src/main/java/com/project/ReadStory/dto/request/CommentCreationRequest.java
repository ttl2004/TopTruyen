package com.project.ReadStory.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentCreationRequest {
    private String noiDung;
    private Long maNguoiDung;
    private Long maTruyen;
}
