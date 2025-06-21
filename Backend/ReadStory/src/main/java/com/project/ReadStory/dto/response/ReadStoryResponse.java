package com.project.ReadStory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadStoryResponse {
    private Long maDoc;
    private Long maNguoiDung;
    private Long maTruyen;
}
