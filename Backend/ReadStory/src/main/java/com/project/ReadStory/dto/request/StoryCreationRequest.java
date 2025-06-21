package com.project.ReadStory.dto.request;

import com.project.ReadStory.entity.BelongTo;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class StoryCreationRequest {

    @Size(min = 3, message = "STORY_NAME_INVALID")
    private String tenTruyen;

    private String moTa;

    private String tinhTrang;

    private String trangThai;

    private String tenTacGia;

    private String anhDaiDien;

    private List<Long> theLoaiIds;
}
