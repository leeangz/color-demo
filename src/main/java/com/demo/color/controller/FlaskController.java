package com.demo.color.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Controller
@RequiredArgsConstructor
@Log4j2
public class FlaskController {

	@Value("${com.demo.upload.path}")
	private String uploadPath;

	@GetMapping("/makeup")
	public String uploadForm() {
		log.info("====== 플라스크 연동 사진 업로드 ======");
		return "makeupform2";
	}

	@GetMapping("/makeuping")
	public String makeuping() {
		log.info("===== 메이크업 중 =====");
		return "makeupform2";
	}

	@PostMapping("/makeup.api")
	@ResponseBody
	public ResponseEntity<String> MakeupApi(@RequestParam("filePath") String filePath,
			@RequestParam("lips") String lips, @RequestParam("blush") String blush,
			@RequestParam("foundation") String foundation, Model model) throws IOException {

		log.info("선택한 입술 색상 : " + lips);
		log.info("선택된 블러쉬 색상 : " + blush);
		log.info("선택된 파운데이션 색상 : " + foundation);
		log.info("원본 파일 경로 : " + filePath);

		RestTemplate restTemplate = new RestTemplate();

		MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
		map.add("filePath", filePath);
		map.add("lips", lips);
		map.add("blush", blush);
		map.add("foundation", foundation);

		String apiUrl = "http://127.0.0.1:5000/apply-makeup/";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
		String responseJson = restTemplate.postForObject(apiUrl, request, String.class);

		ObjectMapper mapper = new ObjectMapper();
		Map<String, String> responseData = mapper.readValue(responseJson, new TypeReference<Map<String, String>>() {
		});

		model.addAttribute("lips", responseData.get("lips"));
		model.addAttribute("blush", responseData.get("blush"));
		model.addAttribute("foundation", responseData.get("foundation"));
		model.addAttribute("output_filepath", responseData.get("output_filepath"));

		log.info(responseData);

		try {
			String json = mapper.writeValueAsString(responseData);
			return ResponseEntity.ok(json);
		} catch (JsonProcessingException e) {
			log.error("Failed to convert responseData to JSON", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}