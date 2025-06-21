package com.project.ReadStory.controller;

import com.project.ReadStory.dto.request.ApiResponse;
import com.project.ReadStory.dto.request.FollowCreationRequest;
import com.project.ReadStory.dto.request.UserCreationRequest;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.entity.Follow;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.service.FollowService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/follows")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping
    ApiResponse<Follow> createFollows(@RequestBody @Valid FollowCreationRequest request) {
        ApiResponse<Follow> apiResponse = new ApiResponse<>();
        apiResponse.setResult(followService.createFollows(request));
        return apiResponse;
    }

    @DeleteMapping("/{followId}")
    void deleteFollow(@PathVariable Long followId) {
        followService.deleteFollow(followId);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<PagedResponse<Follow>> getAllFollow(@PathVariable Long userId, Pageable pageable) {
        return ResponseEntity.ok(followService.getAllFollows(userId, pageable));
    }
}
