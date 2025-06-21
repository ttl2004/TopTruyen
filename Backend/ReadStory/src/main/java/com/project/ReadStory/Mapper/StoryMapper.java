package com.project.ReadStory.Mapper;

import com.project.ReadStory.dto.request.StoryCreationRequest;
import com.project.ReadStory.dto.request.StoryUpdateRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.StoryResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.*;
import org.mapstruct.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface StoryMapper {
    Story toStory(StoryCreationRequest request);
    @Mapping(source = "luotDoc", target = "luotDoc")
    @Mapping(source = "soChuong", target = "soChuong")
    @Mapping(source = "ngayCapNhat", target = "ngayCapNhat")
    StoryResponse toStoryResponse(Story story);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateStory(@MappingTarget Story story, StoryUpdateRequest request);
}
