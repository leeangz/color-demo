package com.demo.color.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.log4j.Log4j2;

@Controller
@Log4j2
public class UploadTestController {

   @GetMapping("/uploadEx")
   public void uploasEX(){
	   log.info("====== 파일 첨부 테스팅 페이지 ======");
   }
}
