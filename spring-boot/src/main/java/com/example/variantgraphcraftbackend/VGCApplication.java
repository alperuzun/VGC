package com.example.variantgraphcraftbackend;

//import com.example.variantgraphcraftbackend.model.UploadedFile;
import com.example.variantgraphcraftbackend.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class VGCApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(VGCApplication.class, args);
    }

    @Autowired
    private FileRepository fileRepository;

    @Override
    public void run(String... args) throws Exception {
//        this.fileRepository.save(new UploadedFile("booya"));
    }

}
