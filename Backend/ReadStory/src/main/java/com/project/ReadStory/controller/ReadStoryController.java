package com.project.ReadStory.controller;

import com.project.ReadStory.dto.request.ApiResponse;
import com.project.ReadStory.dto.request.FollowCreationRequest;
import com.project.ReadStory.dto.request.ReadStoryCreationRequest;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.entity.Follow;
import com.project.ReadStory.entity.ReadStory;
import com.project.ReadStory.service.FollowService;
import com.project.ReadStory.service.ReadStoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/readStory")
public class ReadStoryController {

    @Autowired
    private ReadStoryService readStoryService;

    @PostMapping
    ApiResponse<ReadStory> createReadStory(@RequestBody @Valid ReadStoryCreationRequest request) {
        ApiResponse<ReadStory> apiResponse = new ApiResponse<>();
        apiResponse.setResult(readStoryService.createReadStory(request));
        return apiResponse;
    }

    @DeleteMapping("/{readStoryId}")
    void deleteReadStory(@PathVariable Long readStoryId) {
        readStoryService.deleteReadStory(readStoryId);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<PagedResponse<ReadStory>> getAllReadStory(@PathVariable Long userId, Pageable pageable) {
        return ResponseEntity.ok(readStoryService.getAllReadStory(userId, pageable));
    }
}
