package com.project.ReadStory.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterUpdateRequest {
    @Size(min = 6, message = "CHAPTER_NAME_INVALID")
    private String tenChuong;

    private String noiDung;

}
