package com.example.variantgraphcraftbackend.controller;

import com.example.variantgraphcraftbackend.model.*;
import com.example.variantgraphcraftbackend.repository.FileRepository;
import com.example.variantgraphcraftbackend.service.ServiceHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class FileController {

    @Autowired
    private FileRepository fileRepository;
    private ServiceHandler handler;

    @Autowired
    public FileController(ServiceHandler handler) {
        System.out.println("Constructor of FileController called.");
        this.handler = handler;
    }

    /**
     * Returns all file entities in fileRepository.
     * @return
     */
    @GetMapping("view")
    public AboutBox getFileInfo() {
        System.out.println("FILECONTROLLER METHOD GETFILEINFO CALLED.");
        return this.handler.generateAbout();
    }

    /**
     * Returns all file entities in fileRepository.
     * @return
     */
    @GetMapping()
    public List<UploadedFile> getFiles() {
        System.out.println("FILECONTROLLER METHOD GETFILES CALLED (DONE).");
        return this.fileRepository.findAll();
    }

    /**
     * Adds a file to the fileRepository.
     * @param file
     * @return
     */
    @PostMapping("view")
    public UploadedFile addFile(@RequestBody UploadedFile file) {
        System.out.println("FILECONTROLLER METHOD ADDFILE CALLED.");
        System.out.println("ALL FILES:");
        System.out.println(this.fileRepository.findAll());
//        System.out.println("Files in repository: ");
//        System.out.println(this.fileRepository.findAll());
        System.out.println("Phenotype file: " + file.getPhenotypePath());
        System.out.println("VCF file: " + file.getPath());
        System.out.println("Size: " + file.getSize());

        try {
            if (!this.fileRepository.existsByPath(file.getPath())) {
                System.out.println("To be added path is: " + file.getPath());
                System.out.println("Current paths in fileRepository: " + this.getAllPaths());
//                    this.handler.setCurrFile(file);
                    this.handler.handleSelected(file);
                    System.out.println("REQUEST LOGIC DONE");
                    return this.fileRepository.save(file);
            } else {
                UploadedFile existingFile = this.fileRepository.findUploadedFileByPath(file.getPath());
                if (existingFile.getPhenotypePath() != null && file.getPhenotypePath() == null) {
                    this.fileRepository.setPhenoTypeByPath(null, file.getPath());
                    this.handler.selectByPath(file.getPath(), null, false);
                    System.out.println("PHENOTYPE FILE UPDATED...");
                } else if (existingFile.getPhenotypePath() == null && file.getPhenotypePath() != null) {
                    this.fileRepository.setPhenoTypeByPath(file.getPhenotypePath(), file.getPath());
                    this.handler.selectByPath(file.getPath(), file.getPhenotypePath(), true);
                    System.out.println("PHENOTYPE FILE UPDATED...");
                } else if (existingFile.getPhenotypePath() != null && file.getPhenotypePath() != null) {
                    if (!existingFile.getPhenotypePath().equals(file.getPhenotypePath())) {
                        this.fileRepository.setPhenoTypeByPath(file.getPhenotypePath(), file.getPath());
                        this.handler.selectByPath(file.getPath(), file.getPhenotypePath(), true);
                        System.out.println("PHENOTYPE FILE UPDATED...");
                    } else {
                        this.handler.selectByPath(file.getPath(), file.getPhenotypePath(), false);
                    }
                } else {
                    this.handler.selectByPath(file.getPath(), file.getPhenotypePath(), false);
                }
            }
            System.out.println("REQUEST LOGIC DONE");
        } catch(IOException e) {
            System.out.println("IOException; addFile method in FileController");
        }
        return null;
    }

    public List<String> getAllPaths() {
        List<UploadedFile> uploadedFiles = new ArrayList<>(this.fileRepository.findAll());
        List<String> titles = new ArrayList<>();

        for (UploadedFile f : uploadedFiles) {
            titles.add(f.getPath());
        }
        return titles;
    }
}

//    /**
//     * Informs the backend when the user selects gridview. When a file is
//     * selected, the default view is gridView.
//     * @param file
//     * @return
//     */
//    @PostMapping("gridview")
//    public GridView selectGridView(@RequestBody UploadedFile file) {
//        return this.handler.displayGridView(file.getPath());
//    }