package com.project.ReadStory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowResponse {
    private Long maTheoDoi;
    private Long maNguoiDung;
    private Long maTruyen;
}
