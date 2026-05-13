package com.event.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface FileService {
    String uploadFile(MultipartFile file, String subDir) throws IOException;
    void deleteFile(String fileName);
}
