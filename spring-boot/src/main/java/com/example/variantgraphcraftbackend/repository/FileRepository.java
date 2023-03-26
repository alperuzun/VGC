package com.example.variantgraphcraftbackend.repository;

import com.example.variantgraphcraftbackend.model.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FileRepository extends JpaRepository<UploadedFile, Long> {

    boolean existsByPath(String path);
    UploadedFile findUploadedFileByPath(String path);

    @Modifying
    @Query("update UploadedFile u set u.phenotypePath = ?1 where u.path = ?2")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    void setPhenoTypeByPath(String phenotype, String path);

}
