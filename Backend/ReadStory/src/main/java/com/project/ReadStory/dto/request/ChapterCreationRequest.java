package com.project.ReadStory.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChapterCreationRequest {
    @Size(min = 6, message = "CHAPTER_NAME_INVALID")
    private String tenChuong;

    private String noiDung;

    private Long maTruyen;
}
