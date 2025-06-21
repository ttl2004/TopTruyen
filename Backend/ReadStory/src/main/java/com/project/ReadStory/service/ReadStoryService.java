package com.project.ReadStory.service;

import com.project.ReadStory.Mapper.FollowMapper;
import com.project.ReadStory.Mapper.ReadStoryMapper;
import com.project.ReadStory.dto.request.FollowCreationRequest;
import com.project.ReadStory.dto.request.ReadStoryCreationRequest;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.entity.Follow;
import com.project.ReadStory.entity.ReadStory;
import com.project.ReadStory.entity.Story;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.responsitory.FollowRepository;
import com.project.ReadStory.responsitory.ReadStoryRepository;
import com.project.ReadStory.responsitory.StoryRepository;
import com.project.ReadStory.responsitory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReadStoryService {
    @Autowired
    private ReadStoryRepository readStoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoryRepository storyRepository;
    @Autowired
    private ReadStoryMapper readStoryMapper;


    //Tạo follow
    public ReadStory createReadStory(ReadStoryCreationRequest request) {

        // Kiểm tra nếu đã tồn tại
        Optional<ReadStory> existing = readStoryRepository.findByTruyen_MaTruyenAndNguoiDung_MaNguoiDung(
                request.getMaTruyen(), request.getMaNguoiDung()
        );
        if (existing.isPresent()) {
            throw new RuntimeException("Người dùng đã đọc truyện này rồi");
        }

        //nếu chưa đọc
        ReadStory readStory = readStoryMapper.toReadStory(request);

        Story story = storyRepository.findByMaTruyen(request.getMaTruyen())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy truyện với id: " + request.getMaTruyen()));
        User user = userRepository.findByMaNguoiDung(request.getMaNguoiDung())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + request.getMaNguoiDung()));

        story.setLuotDoc(story.getLuotDoc()+1);
        readStory.setTruyen(story);
        readStory.setNguoiDung(user);
        return readStoryRepository.save(readStory);
    }

    //xoá
    public void deleteReadStory(Long readStoryId) {
        readStoryRepository.deleteById(readStoryId.toString());
    }
    //lấy list
    public PagedResponse<ReadStory> getAllReadStory(Long userId, Pageable pageable) {
        Page<ReadStory> page = readStoryRepository.findByNguoiDung_MaNguoiDung(userId, pageable);

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
