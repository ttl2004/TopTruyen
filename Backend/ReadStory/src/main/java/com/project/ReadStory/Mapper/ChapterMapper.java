package com.project.ReadStory.Mapper;

import com.project.ReadStory.dto.request.ChapterCreationRequest;
import com.project.ReadStory.dto.request.ChapterUpdateRequest;
import com.project.ReadStory.dto.request.UserCreationRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.ChapterResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.Chapter;
import com.project.ReadStory.entity.User;
import org.mapstruct.*;


@Mapper(componentModel = "spring")
public interface ChapterMapper {

    Chapter toChapter(ChapterCreationRequest request);
    ChapterResponse toChapterResponse(Chapter chapter);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateChapter(@MappingTarget Chapter chapter, ChapterUpdateRequest request);
}
