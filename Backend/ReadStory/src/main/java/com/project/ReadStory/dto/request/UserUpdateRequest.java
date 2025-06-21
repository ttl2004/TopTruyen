package com.project.ReadStory.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    @Size(min = 6, message = "NAME_INVALID")
    private String tenNguoiDung;

    @Size(min = 3, message = "USERNAME_INVALID")
    private String tenDangNhap;

    @Size(min = 8, message = "INVALID_PASSWORD")
    private String matKhau;

    private String email;
}
