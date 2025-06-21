package com.project.ReadStory.dto.response;

import com.project.ReadStory.entity.Rank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long maNguoiDung;
    private String tenNguoiDung;
    private String tenDangNhap;
    private String email;
    private Rank capBac;
    private String quyenHan;
}
