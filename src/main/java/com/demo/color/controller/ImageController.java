package com.demo.color.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.demo.color.service.ImageService;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Controller
@RequestMapping("/image")
public class ImageController {

	private ImageService imageService;

	@Autowired
	public ImageController(ImageService imageService) {
		this.imageService = imageService;
	}

	@GetMapping("/upload")
	public void upload2() {
		log.info("======== upload page =========");
	}

	@PostMapping("/upload")
	@ResponseBody
	public void FileUpload3(MultipartHttpServletRequest request) {
		try {
			log.info("/upload");
			// request의 file이름을 가져온다.
			String fileName = "TESTING_" + request.getParameter("file");
			log.info(fileName);

			MultipartFile file = request.getFile("file");

			// File 경로 임의 지정
			String uploadPath = "C:\\test/test1/abc/";

			File fileUpload = new File(uploadPath, file.getOriginalFilename());

			// 생성 될 경로가 없을 경우, 파일을 생성한다.
			if (!fileUpload.exists()) {
				log.info(uploadPath + " : 파일 경로 생성완료");
				fileUpload.mkdirs();
			}
			file.transferTo(fileUpload);

		} catch (Exception e) {

		}
	}

	@PostMapping("/uploadFormAction")
	public void uploadFormPost(MultipartFile[] uploadFile, Model model) {

		// File 경로 임의 지정
		String uploadFolder = "C:\\test/test1/abc/";

		for (MultipartFile multipartFile : uploadFile) {
			log.info("=======================");
			log.info("파일 명 : " + multipartFile.getOriginalFilename());
			log.info("파일 사이즈 : " + multipartFile.getSize());

			File saveFile = new File(uploadFolder, multipartFile.getOriginalFilename());

			try {
				multipartFile.transferTo(saveFile);
			} catch (Exception e) {
				log.error(e.getMessage());
			}
		}
	}

	@GetMapping("/uploadAjax")
	public void uploadAjax(MultipartFile[] uploadFile) {
		log.info("==== upload Ajax ====");
		// File 경로 임의 지정
		String uploadFolder = "C:\\test/test1/abc/";

		for (MultipartFile multipartFile : uploadFile) {
			log.info("=======================");
			log.info("파일 명 : " + multipartFile.getOriginalFilename());
			log.info("파일 사이즈 : " + multipartFile.getSize());
			
			String uploadFileName = multipartFile.getOriginalFilename();
			uploadFileName = uploadFileName.substring(uploadFileName.lastIndexOf("\\")+1);
			log.info(uploadFileName);
			
			File saveFile = new File(uploadFolder, uploadFileName);

			try {
				multipartFile.transferTo(saveFile);
			} catch (Exception e) {
				log.error(e.getMessage());
			}
		}
	}

	@GetMapping("/pixel")
	public ResponseEntity<String> getPixelValue(@RequestParam("x") int x, @RequestParam("y") int y) {
		try {
			String pixelValue = imageService.getPixelValue(x, y);
			return ResponseEntity.ok(pixelValue);
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Failed to get pixel value.");
		}
	}
}