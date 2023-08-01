package com.example.variantgraphcraftbackend.controller;

import com.example.variantgraphcraftbackend.controller.exceptions.GeneNotFoundException;
import com.example.variantgraphcraftbackend.controller.exceptions.InvalidFileException;
import com.example.variantgraphcraftbackend.model.*;
import com.example.variantgraphcraftbackend.repository.FileRepository;
import com.example.variantgraphcraftbackend.service.ServiceHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
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
    private Boolean applicationReady;

    @Autowired
    public FileController(ServiceHandler handler) {
        System.out.println("Constructor of FileController called.");
        this.handler = handler;
        this.applicationReady = false;
    }

    @EventListener(ApplicationReadyEvent.class) 
    public void onStart() {
        System.out.println("Hello world! VGC backend is ready to receive requests...");
        applicationReady = true;
    }

    @GetMapping("ready")
    public Boolean ready() {
        return applicationReady;
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
    public ResponseEntity<?> addFile(@RequestBody UploadedFile file) {
        System.out.println("FILECONTROLLER METHOD ADDFILE CALLED.");
        System.out.println("ALL FILES:");
        System.out.println(this.fileRepository.findAll());
        System.out.println("Phenotype file: " + file.getPhenotypePath());
        System.out.println("VCF file: " + file.getPath());
        System.out.println("Size: " + file.getSize());

        try {
            if (!this.fileRepository.existsByPath(file.getPath())) {
                System.out.println("To be added path is: " + file.getPath());
                System.out.println("Current paths in fileRepository: " + this.getAllPaths());
                this.handler.handleSelected(file);
                System.out.println("REQUEST LOGIC DONE");
                UploadedFile result = this.fileRepository.save(file);
                return ResponseEntity.ok(result);
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
                System.out.println("REQUEST LOGIC DONE");
                return ResponseEntity.ok(existingFile);
            }
        } catch (IOException e) {
            System.out.println("IOException in addFile of FileController.");
            e.printStackTrace();
            deleteFile(file);
            ErrorResponse errorResponse = new ErrorResponse("An internal server error occurred.", 500);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (IndexOutOfBoundsException in) {
            System.out.println("IndexOutOfBoundsException in addFile of FileController.");
            in.printStackTrace();
            deleteFile(file);
            ErrorResponse errorResponse = new ErrorResponse("Invalid input file.", 500);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (InvalidFileException ex) {
            System.out.println("InvalidFileException in addFile of FileController.");
            ex.printStackTrace();
            deleteFile(file);
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getStatusCode());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    private void deleteFile(UploadedFile file) {
        String userHome = System.getProperty("user.home");
        String directoryName = "VGCGeneratedFiles";
        String directoryPath = userHome + File.separator + directoryName;

        File vcf = new File(file.getPath());
        String name = vcf.getName();
        name = name.substring(0, name.length() - 4);

        String fileDirectoryPath = directoryPath + "/VGC_" + name;
        this.fileRepository.delete(file);
        File directory = new File(fileDirectoryPath);

        File info = new File(fileDirectoryPath + "/info_" + name + ".txt");
        File index = new File(fileDirectoryPath + "/index_" + name + ".txt"); 


        if (directory.exists()) {
            if (info.exists()) {
                info.delete();
            }
            if (index.exists()) {
                index.delete();
            }
            directory.delete();
            System.out.println("The directory " + fileDirectoryPath + " has been deleted.");
        }
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
