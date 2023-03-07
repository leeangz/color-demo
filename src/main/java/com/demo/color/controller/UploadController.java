package com.demo.color.controller;

import java.io.File;
import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.demo.color.dto.UploadResultDTO;

import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;

@RestController
@Log4j2
public class UploadController {

	@Value("${com.demo.upload.path}")
	private String uploadPath;

	private String makeFolder() {
		String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
		String folderPath = str.replace("/", File.separator);
		File uploadPathFolder = new File(uploadPath, folderPath);
		if (uploadPathFolder.exists() == false) {
			uploadPathFolder.mkdirs();
		}
		log.info(folderPath);
		return folderPath;
	}

	@PostMapping("/uploadAjax")
	public ResponseEntity<List<UploadResultDTO>> uploadFiles(MultipartFile[] uploadFiles) {
		
		List<UploadResultDTO> resultDTOList = new ArrayList<>();
		log.info(uploadFiles);
		for (MultipartFile i : uploadFiles) {
			if (i.getContentType().startsWith("image") == false) {
				log.warn("이 파일은 이미지파일이 아님");
				return new ResponseEntity<>(HttpStatus.FORBIDDEN);
			}
			String originalName = i.getOriginalFilename();
			log.info("fileName :" + originalName);

			String folderPath = makeFolder();
			log.info(folderPath);
			String uuid = UUID.randomUUID().toString();
			String saveName = uploadPath + File.separator + folderPath + File.separator + uuid + "_" + originalName;
			log.info(saveName);

			Path savePath = Paths.get(saveName);
			try {
				i.transferTo(savePath);
				String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator+"s_"+uuid+"_"+originalName;
				File thumbnailFile = new File(thumbnailSaveName);
				Thumbnailator.createThumbnail(savePath.toFile(), thumbnailFile, 100, 100);
				
				resultDTOList.add(new UploadResultDTO(originalName, uuid, folderPath));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return new ResponseEntity<>(resultDTOList, HttpStatus.OK);
	}

	@GetMapping("/display")
	public ResponseEntity<byte[]> getFile(String fileName) {
		ResponseEntity<byte[]> result = null;
		try {
			String srcFileName = URLDecoder.decode(fileName, "UTF-8");
			log.info(srcFileName);
			File file = new File(uploadPath + File.separator + srcFileName);
			log.info(file);

			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-Type", Files.probeContentType(file.toPath()));
			result = new ResponseEntity<>(FileCopyUtils.copyToByteArray(file), headers, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return result;
	}
	
	@PostMapping("/removeFile")
	public ResponseEntity<Boolean> removeFile(String fileName){
		String srcFileName = null;
		log.info("==== 파일 삭제 ====");
		
		try {
			srcFileName = URLDecoder.decode(fileName, "UTF-8");
			log.info("srcFileName: " + srcFileName);
			File file = new File(uploadPath + File.separator + srcFileName);
			boolean result = file.delete();
			
			File thumbnailfile = new File(file.getParent(), "s_" + file.getName());
			result = thumbnailfile.delete();
			
			return new ResponseEntity<> (result, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			
			return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}