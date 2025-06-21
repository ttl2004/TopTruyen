package com.project.ReadStory.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentUpdateRequest {
    private String noiDung;
    private Long maTruyen;
    private Long maNguoiDung;
}
