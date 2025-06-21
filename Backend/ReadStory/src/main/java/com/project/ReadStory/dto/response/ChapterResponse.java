package com.project.ReadStory.dto.response;

import com.project.ReadStory.entity.Story;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterResponse {
    private Integer maChuong;

    private String tenChuong;

    private String noiDung;

}
