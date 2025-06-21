package com.project.ReadStory.Mapper;

import com.project.ReadStory.dto.request.FollowCreationRequest;
import com.project.ReadStory.dto.request.UserCreationRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.FollowResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.Follow;
import com.project.ReadStory.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface FollowMapper {
    Follow toFollow(FollowCreationRequest request);

    //Mapping user to userResponse
    FollowResponse toFollowResponse(Follow follow);

}
