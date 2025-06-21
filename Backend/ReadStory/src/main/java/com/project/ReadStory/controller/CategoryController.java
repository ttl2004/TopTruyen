package com.project.ReadStory.controller;

import com.project.ReadStory.dto.request.*;
import com.project.ReadStory.dto.response.CategoryResponse;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.Category;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.service.CategoryService;
import com.project.ReadStory.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorys")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    ApiResponse<Category> createCategorys(@RequestBody @Valid CategoryCreationRequest request) {
        ApiResponse<Category> apiResponse = new ApiResponse<>();
        apiResponse.setResult(categoryService.createCategorys(request));

        return apiResponse;
    }


    @GetMapping
    public ResponseEntity<PagedResponse<Category>> getAllCategory(Pageable pageable) {
        return ResponseEntity.ok(categoryService.getAllCategory(pageable));
    }


    @GetMapping("/{categoryId}")
    CategoryResponse getCategoryById(@PathVariable Long categoryId) {
        return categoryService.getCategoryById(categoryId);
    }

    @PutMapping("/{categoryId}")
    CategoryResponse updateCategory(@PathVariable Long categoryId, @RequestBody CategoryUpdateRequest request) {
        return categoryService.updateCategory(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    void deleteUser(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<Category>> searchCategory(String keyword, Pageable pageable) {
        return ResponseEntity.ok(categoryService.searchByTenTheLoai(keyword, pageable));
    }
}
