package com.project.ReadStory.controller;
import com.project.ReadStory.dto.request.ApiResponse;
import com.project.ReadStory.dto.request.UserCreationRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/users")

public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    ApiResponse<User> createUser(@RequestBody @Valid UserCreationRequest request) {
        ApiResponse<User> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.createUser(request));

        return apiResponse;
    }


    @GetMapping
    public ResponseEntity<PagedResponse<User>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }


    @GetMapping("/{userId}")
    UserResponse getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse>getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @PutMapping("/myInfo/{userId}")
    UserResponse updateMyInfo(@PathVariable Long userId, @RequestBody UserUpdateRequest request) {
        return userService.updateUser(userId, request);
    }

    @PutMapping("/{userId}")
    UserResponse updateUser(@PathVariable Long userId, @RequestBody UserUpdateRequest request) {
          return userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    void deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<User>> searchUsers(String keyword, Pageable pageable) {
        return ResponseEntity.ok(userService.searchByTenNguoiDung(keyword, pageable));
    }

    @GetMapping("/statistical")
    public Map<String, Object> statisticalUsersRegisteredToday(){
        return userService.getUserStatistics();
    }
//    public List<User> searchUsers(@RequestParam("keyword") String keyword) {
//        return userService.searchByTenNguoiDung(keyword);
//    }
}
