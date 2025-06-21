package com.project.ReadStory.service;

import com.project.ReadStory.Mapper.CategoryMapper;
import com.project.ReadStory.dto.request.CategoryCreationRequest;
import com.project.ReadStory.dto.request.CategoryUpdateRequest;
import com.project.ReadStory.dto.request.UserCreationRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.CategoryResponse;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.Category;
import com.project.ReadStory.entity.Story;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.exception.AppException;
import com.project.ReadStory.exception.ErrorCode;
import com.project.ReadStory.responsitory.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    //Tạo thể loại
    public Category createCategorys(CategoryCreationRequest request) {
        Category category = categoryMapper.toCategory(request);

        return categoryRepository.save(category);
    }

    //Lấy all thể loại
    public PagedResponse<Category> getAllCategory(Pageable pageable) {
        Page<Category> page = categoryRepository.findAll(pageable);

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    // Lấy 1 thể loại thông qua Id
    public CategoryResponse getCategoryById(Long categoryId) {
        return categoryMapper.toCategoryResponse(categoryRepository.findByMaTheLoai(categoryId).orElseThrow(() -> new RuntimeException("Thể loại không tồn tại")));
    }

    //    Cập nhật thông tin Thể loại
    public CategoryResponse updateCategory(Long categoryId, CategoryUpdateRequest request) {
        Category category = categoryRepository.findByMaTheLoai(categoryId).orElseThrow(() -> new RuntimeException("thể loại không tồn tại"));

        categoryMapper.updateCategory(category, request);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }
    //    Xóa thể loại
    public void deleteCategory(Long categoryId) {
        if(!categoryRepository.existsByMaTheLoai(categoryId)){
            throw new RuntimeException("Thể loại không tồn tại");
        }
        categoryRepository.deleteById(categoryId.toString());
    }

    //Tìm kiếm
    public PagedResponse<Category> searchByTenTheLoai(String keyword, Pageable pageable) {
        Page<Category> page = categoryRepository.findByTenTheLoaiContainingIgnoreCase(keyword, pageable);

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
