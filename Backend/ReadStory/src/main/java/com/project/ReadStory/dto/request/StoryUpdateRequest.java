package com.project.ReadStory.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryUpdateRequest {
    @Size(min = 3, message = "STORY_NAME_INVALID")
    private String tenTruyen;
    private String moTa;
    private String loaiTruyen;
    private String tinhTrang;
    private String trangThai;
    private String tenTacGia;
    private String anhDaiDien;
    private List<Long> theLoaiIds;
}
