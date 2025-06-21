package com.project.ReadStory.service;
import com.project.ReadStory.Mapper.UserMapper;
import com.project.ReadStory.dto.request.UserCreationRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.exception.AppException;
import com.project.ReadStory.exception.ErrorCode;
import com.project.ReadStory.responsitory.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    //Tạo hoặc thêm người dùng mới
    public User createUser(UserCreationRequest request) {
        if((userRepository.existsByTenNguoiDung(request.getTenNguoiDung()))){
            throw new AppException(ErrorCode.USER_EXIST);
        }
        if((userRepository.existsByTenDangNhap(request.getTenDangNhap()))){
            throw new AppException(ErrorCode.USERNAME_EXIST);
        }
        if((userRepository.existsByEmail(request.getEmail()))){
            throw new AppException(ErrorCode.EMAIL_EXIST);
        }

        User user = userMapper.toUser(request);

        return userRepository.save(user);
    }

//    Lấy tất cả người dùng
    public PagedResponse<User> getAllUsers(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }


// Lấy 1 người dùng thông qua Id
    public UserResponse getUserById(Long userId) {
        return userMapper.toUserResponse(userRepository.findByMaNguoiDung(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại")));
    }

//    Cập nhật thông tin người dùng

    public UserResponse updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findByMaNguoiDung(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        userMapper.updateUser(user, request);
        return userMapper.toUserResponse(userRepository.save(user));
    }
//    Xóa người dùng
    public void deleteUser(Long userId) {
        if(!userRepository.existsByMaNguoiDung(userId)){
            throw new RuntimeException("Người dùng không tồn tại");
        }
        userRepository.deleteById(userId.toString());
    }

    //Tìm kiếm
//    public List<User> searchByTenNguoiDung(String keyword) {
//        return userRepository.findByTenNguoiDungContainingIgnoreCase(keyword);
//    }
    public PagedResponse<User> searchByTenNguoiDung(String keyword, Pageable pageable) {
        Page<User> page = userRepository.findByTenNguoiDungContainingIgnoreCase(keyword, pageable);

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

//    xEM THÔNG TIN BẢN THÂN
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        User user = userRepository.findByTenDangNhap(name)
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    // Lấy thông kê cho quản lý user
    public Map<String, Object> getUserStatistics() {
        long totalUsersToday = userRepository.countUsersRegisteredToday();
        long totalUsersYesterday = userRepository.countUsersRegisteredYesterday();
        long totalUsersLastMonth = userRepository.countUsersRegisteredLastMonth();
        double percentageChange = ((totalUsersToday - totalUsersYesterday) / (double) totalUsersYesterday) * 100;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsersToday", totalUsersToday);
        stats.put("totalUsersYesterday", totalUsersYesterday);
        stats.put("totalUsersLastMonth", totalUsersLastMonth);
        stats.put("percentageChange", percentageChange);
        return stats;
    }

}
