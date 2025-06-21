package com.project.ReadStory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    private Long maBinhLuan;
    private String noiDung;
    private LocalDateTime ngayThem;
    private LocalDateTime ngayChinhSua;
    private String tenNguoiDung; // Thêm tên người dùng
    private String tenTruyen;
}
