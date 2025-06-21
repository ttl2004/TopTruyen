package com.project.ReadStory.Mapper;

import com.project.ReadStory.dto.request.CategoryCreationRequest;
import com.project.ReadStory.dto.request.CategoryUpdateRequest;
import com.project.ReadStory.dto.request.UserCreationRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.CategoryResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.Category;
import com.project.ReadStory.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toCategory(CategoryCreationRequest request);

    CategoryResponse toCategoryResponse(Category category);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);
}
