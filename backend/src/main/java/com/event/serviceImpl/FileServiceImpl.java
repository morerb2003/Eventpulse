package com.event.serviceImpl;

import com.event.service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    private final String uploadDir = "uploads";

    public FileServiceImpl() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    @Override
    public String uploadFile(MultipartFile file, String subDir) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + File.separator + subDir);
        
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        
        Files.copy(file.getInputStream(), path.resolve(fileName));
        return subDir + "/" + fileName;
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(uploadDir + File.separator + filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
