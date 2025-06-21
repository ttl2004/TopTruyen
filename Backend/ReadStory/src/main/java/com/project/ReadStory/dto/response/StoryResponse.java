package com.project.ReadStory.dto.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryResponse {
    private Long maTruyen;
    private String tenTruyen;
    private String moTa;
    private String loaiTruyen;
    private String tinhTrang;
    private String trangThai;
    private String tenTacGia;
    private String anhDaiDien;
    private Long luotDoc;
    private Integer soChuong;
    private LocalDateTime ngayCapNhat;

}
