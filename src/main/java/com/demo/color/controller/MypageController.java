package com.demo.color.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.demo.color.domain.ReservVO;
import com.demo.color.service.MypageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * @since   : 2023. 4. 1.
 * @FileName: MypageController.java
 * @author  : 이세아
 * @설명    : @

 * <pre>
 *   수정일         수정자               수정내용
 * ----------      --------    ---------------------------
 * 2023. 4. 1.     이세아       create
 * 2023. 4. 1.     이세아       마이페이지 controller - makeon 예약관리
 * </pre>
 */

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/mypage")
@Controller
public class MypageController {
	
	@Autowired
	private MypageService service;
	
	@Value("${com.demo.upload.path}")
	private String uploadPath;
	
	@GetMapping("/mypage_reserv")
	public void reserving(String mid, Model model) {
		// String mid -> Principal principal 로 변경
		/*
		 * List<ReservVO> done = service.getReservdone(principal.getId());
		 * List<ReservVO> ready = service.getReservReady(principal.getId());
		 */
		log.info("===== 마이페이지 예약관리 =====");
		List<ReservVO> done = service.getReservdone("angz");
		List<ReservVO> ready = service.getReservReady("angz");
		model.addAttribute("done", done);
		model.addAttribute("ready", ready);
	}
	
}
