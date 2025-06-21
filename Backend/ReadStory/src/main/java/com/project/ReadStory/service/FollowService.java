package com.project.ReadStory.service;

import com.project.ReadStory.Mapper.FollowMapper;
import com.project.ReadStory.dto.request.FollowCreationRequest;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.entity.Follow;
import com.project.ReadStory.entity.ReadStory;
import com.project.ReadStory.entity.Story;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.responsitory.FollowRepository;
import com.project.ReadStory.responsitory.StoryRepository;
import com.project.ReadStory.responsitory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FollowService {
    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoryRepository storyRepository;
    @Autowired
    private FollowMapper followMapper;


    //Tạo follow
    public Follow createFollows(FollowCreationRequest request) {
        // Kiểm tra nếu đã tồn tại
        Optional<Follow> existing = followRepository.findByTruyen_MaTruyenAndNguoiDung_MaNguoiDung(
                request.getMaTruyen(), request.getMaNguoiDung()
        );
        if (existing.isPresent()) {
            throw new RuntimeException("Người dùng đã theo dõi truyện này rồi");
        }
        // nếu chưa tông tại
        Follow follow = followMapper.toFollow(request);
        Story story = storyRepository.findByMaTruyen(request.getMaTruyen())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy truyện với id: " + request.getMaTruyen()));
        User user = userRepository.findByMaNguoiDung(request.getMaNguoiDung())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + request.getMaNguoiDung()));

        follow.setTruyen(story);
        follow.setNguoiDung(user);
        return followRepository.save(follow);
    }

    //xoá
    public void deleteFollow(Long followId) {
        followRepository.deleteById(followId.toString());
    }
    //lấy list
    public PagedResponse<Follow> getAllFollows(Long userId, Pageable pageable) {
        Page<Follow> page = followRepository.findByNguoiDung_MaNguoiDung(userId, pageable);

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
