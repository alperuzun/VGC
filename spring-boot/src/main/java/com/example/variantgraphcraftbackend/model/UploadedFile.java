package com.example.variantgraphcraftbackend.model;
import javax.persistence.*;

@Entity
public class UploadedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String path;
    private String phenotypePath;
    private String size;


    public UploadedFile() {

    }

    public UploadedFile(String path, String phenotypePath, String size) {
        super();
        this.path = path;
        this.phenotypePath = phenotypePath;
        this.size = size;
    }

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getPath() {
        return this.path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getPhenotypePath() {
        return this.phenotypePath;
    }

    public void setPhenotypePath(String phenotypePath) {
        this.phenotypePath = phenotypePath;
    }

    public String getSize() {
        return this.size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}
