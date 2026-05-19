package com.event.serviceImpl;

import com.event.service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    private final Path uploadRoot = Paths.get("uploads").toAbsolutePath().normalize();

    public FileServiceImpl() {
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize upload directory", e);
        }
    }

    @Override
    public String uploadFile(MultipartFile file, String subDir) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Cannot upload an empty file");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("Only image uploads are allowed");
        }

        Path targetDir = resolveUploadPath(subDir);
        Files.createDirectories(targetDir);

        String originalName = file.getOriginalFilename();
        String safeOriginalName = originalName == null ? "upload" : Paths.get(originalName).getFileName().toString();
        safeOriginalName = safeOriginalName.replaceAll("[^A-Za-z0-9._-]", "_");
        if (safeOriginalName.isBlank()) {
            safeOriginalName = "upload";
        }

        String fileName = UUID.randomUUID() + "_" + safeOriginalName;
        Path targetFile = targetDir.resolve(fileName).normalize();
        if (!targetFile.startsWith(uploadRoot)) {
            throw new IOException("Invalid upload path");
        }

        Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);
        return uploadRoot.relativize(targetFile).toString().replace('\\', '/');
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path targetFile = resolveUploadPath(filePath);
            Files.deleteIfExists(targetFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Path resolveUploadPath(String relativePath) throws IOException {
        String safePath = relativePath == null || relativePath.isBlank() ? "general" : relativePath.trim();
        Path requestedPath = Paths.get(safePath).normalize();
        if (requestedPath.isAbsolute() || requestedPath.startsWith("..")) {
            throw new IOException("Invalid upload path");
        }

        Path resolvedPath = uploadRoot.resolve(requestedPath).normalize();
        if (!resolvedPath.startsWith(uploadRoot)) {
            throw new IOException("Invalid upload path");
        }
        return resolvedPath;
    }
}
