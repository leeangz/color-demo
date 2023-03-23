package com.demo.color.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Controller
@RequiredArgsConstructor
@Log4j2
public class FlaskController {
	
	//@Autowired
	//private MakeupService makeupservice;

	@Value("${com.demo.upload.path}")
	private String uploadPath;

	@GetMapping("/makeup")
	public String uploadForm() {
		log.info("====== 플라스크 연동 사진 업로드 ======");
		return "makeupform2";
	}
	
	/*
	 * @Configuration
	 * 
	 * @EnableWebMvc public class WebConfig implements WebMvcConfigurer {
	 * 
	 * @Override public void addResourceHandlers(ResourceHandlerRegistry registry) {
	 * registry .addResourceHandler("/img/**")
	 * .addResourceLocations("file:C:/dev64/thehyundai/color/") .setCachePeriod(0);
	 * } }
	 */

	@PostMapping("/makeup.api")
	public String MakeupApi(@RequestParam("filePath") String filePath,
	        @RequestParam("lips") String lips,@RequestParam("blush") String blush,
	        @RequestParam("foundation") String foundation, Model model) throws IOException {
	    
		log.info("선택한 입술 색상 : " + lips);
		log.info("선택된 블러쉬 색상 : " + blush);
		log.info("선택된 파운데이션 색상 : " + foundation);
	    log.info(filePath);

	    RestTemplate restTemplate = new RestTemplate();
	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

	    MultiValueMap<String, String> map= new LinkedMultiValueMap<String, String>();
	    map.add("filePath", filePath);
	    map.add("lips", lips);
	    map.add("blush", blush);
	    map.add("foundation", foundation);

	    HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<MultiValueMap<String, String>>(map, headers);

	    String responseString = restTemplate.postForObject("http://127.0.0.1:5000/apply-makeup/", requestEntity, String.class);

	    model.addAttribute("file_path", responseString);
	    return "makeup-result";
	}

}