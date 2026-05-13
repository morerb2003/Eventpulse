package com.event.controller;

import com.event.service.FileService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "subDir", defaultValue = "general") String subDir
    ) {
        try {
            String filePath = fileService.uploadFile(file, subDir);
            return ResponseEntity.ok(Map.of("url", "/api/files/view/" + filePath));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/view/{subDir}/{fileName}")
    public ResponseEntity<Resource> viewFile(@PathVariable String subDir, @PathVariable String fileName) {
        try {
            Path path = Paths.get("uploads").resolve(subDir).resolve(fileName);
            Resource resource = new UrlResource(path.toUri());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // Simple assumption, can be dynamic
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
