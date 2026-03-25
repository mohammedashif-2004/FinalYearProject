package com.bcaportal.bcaportal.service;

import com.bcaportal.bcaportal.dto.NoticeRequest;
import com.bcaportal.bcaportal.dto.NoticeResponse;
import com.bcaportal.bcaportal.entity.Notice;
import com.bcaportal.bcaportal.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeResponse createNotice(NoticeRequest request, String createdBy) {
        Notice notice = new Notice();
        notice.setTitle(request.getTitle());
        notice.setMessage(request.getMessage());
        notice.setType(request.getType() != null ? request.getType() : "General");
        notice.setCreatedBy(createdBy);

        Notice saved = noticeRepository.save(notice);
        return mapToResponse(saved);
    }

    public List<NoticeResponse> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }

    private NoticeResponse mapToResponse(Notice notice) {
        NoticeResponse res = new NoticeResponse();
        res.setId(notice.getId());
        res.setTitle(notice.getTitle());
        res.setMessage(notice.getMessage());
        res.setType(notice.getType());
        res.setCreatedBy(notice.getCreatedBy());
        res.setCreatedAt(notice.getCreatedAt());
        return res;
    }
}