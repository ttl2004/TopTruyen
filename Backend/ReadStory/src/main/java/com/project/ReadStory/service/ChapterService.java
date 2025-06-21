package com.project.ReadStory.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.ReadStory.Mapper.ChapterMapper;
import com.project.ReadStory.dto.request.ChapterCreationRequest;
import com.project.ReadStory.dto.request.ChapterUpdateRequest;
import com.project.ReadStory.dto.request.StoryCreationRequest;
import com.project.ReadStory.dto.request.StoryUpdateRequest;
import com.project.ReadStory.dto.response.ChapterResponse;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.dto.response.StoryResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.Chapter;
import com.project.ReadStory.entity.Story;
import com.project.ReadStory.responsitory.ChapterRepository;
import com.project.ReadStory.responsitory.StoryRepository;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class ChapterService {

    @Autowired
    private ChapterRepository chapterRepository;

@Autowired
    private StoryRepository storyRepository;
    @Autowired
    private ChapterMapper chapterMapper;

    @Autowired
    private Cloudinary cloudinary;

    // Create a new chapter
    public Chapter createChapter(ChapterCreationRequest request, MultipartFile zipFile) {
        List<String> imageUrls = new ArrayList<>();

        try (ZipInputStream zis = new ZipInputStream(zipFile.getInputStream())) {
            ZipEntry zipEntry;

            while ((zipEntry = zis.getNextEntry()) != null) {
                String fileName = zipEntry.getName().toLowerCase();

                // Bỏ qua nếu không phải ảnh
                if (!fileName.endsWith(".jpg") && !fileName.endsWith(".jpeg") && !fileName.endsWith(".png")) {
                    continue;
                }

                // Đọc dữ liệu ảnh từ file ZIP
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int length;
                while ((length = zis.read(buffer)) > 0) {
                    baos.write(buffer, 0, length);
                }

                byte[] imageBytes = baos.toByteArray();

                // Upload ảnh lên Cloudinary
                Map<String, Object> uploadResult = cloudinary.uploader()
                        .upload(imageBytes, ObjectUtils.emptyMap());

                // Lưu URL vào danh sách
                String imageUrl = (String) uploadResult.get("secure_url");
                imageUrls.add(imageUrl);

                // Đóng entry hiện tại
                zis.closeEntry();
            }

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi giải nén hoặc upload ảnh", e);
        }
        for(String imageUrl : imageUrls) {
            System.out.println("Uploaded image URL: " + imageUrl);
        }
        Story story = storyRepository.findByMaTruyen(request.getMaTruyen())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy truyện với id: " + request.getMaTruyen()));

        // Tạo đối tượng Story
        StringBuilder noiDung = new StringBuilder();

        Chapter chapter = chapterMapper.toChapter(request);
        for (String imageUrl : imageUrls) {
            if (noiDung.length() == 0) {
                noiDung = new StringBuilder(imageUrl); // Lấy URL đầu tiên
            } else {
                noiDung.append(",").append(imageUrl); // Nối các URL với dấu phẩy
            }
        }
        story.setSoChuong(story.getSoChuong() + 1);
        chapter.setNoiDung(noiDung.toString());
        chapter.setTruyen(story);

        // Lưu chapter vào cơ sở dữ liệu
        return chapterRepository.save(chapter);

    }

    //Xoá chapter
    public void deleteChapter(Integer chapterId) {
        if(!chapterRepository.existsByMaChuong(chapterId)){
            throw new RuntimeException("Chương không tồn tại");
        }
        // Xóa ảnh cũ nếu có
        Chapter existingChapter = chapterRepository.findByMaChuong(chapterId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chương với id: " + chapterId));
        String oldImageUrls = existingChapter.getNoiDung();
        if (oldImageUrls != null && !oldImageUrls.isBlank()) {
            String[] urls = oldImageUrls.split(",");
            for (String url : urls) {
                url = url.trim();
                if (!url.isBlank()) {
                    try {
                        String publicId = extractPublicIdFromUrl(url);
                        if (publicId != null && !publicId.isBlank()) {
                            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                        }
                    } catch (IOException e) {
                        System.err.println("Lỗi khi xóa ảnh: " + e.getMessage());
                    }
                }
            }
        }
        chapterRepository.deleteById(chapterId.toString());
    }


    //Lấy tất cả chapter
    public PagedResponse<Chapter> getAllChapters(@PathVariable Long storyId, Pageable pageable) {
        Page<Chapter> page = chapterRepository.findByTruyen_MaTruyen(storyId,pageable);

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    //Lấy chapter theo id
    public ChapterResponse getChapterById(Integer chapterId) {
        return chapterMapper.toChapterResponse(chapterRepository.findByMaChuong(chapterId).orElseThrow(() -> new RuntimeException("Chương không tồn tại")));
    }

    //Cập nhật chapter
    public ChapterResponse updateChapter(Integer chapterId, ChapterUpdateRequest request, MultipartFile newImageFile) {
        Chapter existingStory =  chapterRepository.findByMaChuong(chapterId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy truyện với id: " + chapterId));

        // Cập nhật thông tin từ request
        chapterMapper.updateChapter(existingStory, request);

        // Nếu có ảnh mới thì xử lý thay thế
        if (newImageFile != null && !newImageFile.isEmpty()) {
            String oldImageUrl = existingStory.getNoiDung();
            if (oldImageUrl != null && !oldImageUrl.isBlank()) {
                try {
                    String oldPublicId = extractPublicIdFromUrl(oldImageUrl);
                    if (oldPublicId != null && !oldPublicId.isBlank()) {
                        cloudinary.uploader().destroy(oldPublicId, ObjectUtils.emptyMap());
                    }
                } catch (IOException e) {
                    System.err.println("Lỗi khi xóa ảnh cũ: " + e.getMessage());
                }
            }

            try {
                Map<String, Object> uploadResult = cloudinary.uploader()
                        .upload(newImageFile.getBytes(), ObjectUtils.emptyMap());
                String newImageUrl = (String) uploadResult.get("secure_url");
                existingStory.setNoiDung(newImageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Không thể upload ảnh mới lên Cloudinary", e);
            }
        }

        // Lưu và trả về response
        Chapter updatedChapter = chapterRepository.save(existingStory);
        return chapterMapper.toChapterResponse(updatedChapter);
    }
//    Tách id công khai từ URL
    private String extractPublicIdFromUrl(String url) {
        // VD: https://res.cloudinary.com/your_cloud/image/upload/v1234567890/abcxyz.jpg
        String[] parts = url.split("/");
        String filename = parts[parts.length - 1]; // abcxyz.jpg
        return filename.substring(0, filename.lastIndexOf(".")); // abcxyz
    }
}
