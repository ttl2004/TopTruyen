package com.project.ReadStory.Mapper;

import com.project.ReadStory.dto.request.FollowCreationRequest;
import com.project.ReadStory.dto.request.ReadStoryCreationRequest;
import com.project.ReadStory.dto.response.FollowResponse;
import com.project.ReadStory.dto.response.ReadStoryResponse;
import com.project.ReadStory.entity.Follow;
import com.project.ReadStory.entity.ReadStory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReadStoryMapper {
    ReadStory toReadStory(ReadStoryCreationRequest request);

    //Mapping user to userResponse
    ReadStoryResponse toReadStoryResponse(ReadStory readStory);

}
