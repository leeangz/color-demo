package com.demo.color.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.demo.color.domain.BlushVO;
import com.demo.color.domain.FoundationVO;
import com.demo.color.domain.LipVO;
import com.demo.color.domain.ReservVO;
import com.demo.color.domain.ResultVO;
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
 * 2023. 4. 2.     이세아       마이페이지 controller - makeon 예약결과
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
	
	@GetMapping("/mypage_result")
	public void mypageresult(@RequestParam("rid") String rid, Model model) {
		log.info("==== 마이페이지 예약 결과 창 ====");
		ReservVO info = service.getReservInfo(rid);
		ResultVO result = service.getResultInfo(rid);
		
		String lipopt = result.getLip_opt();
		String blushopt = result.getBlush_opt();
		String faceopt = result.getFace_opt();
		
		LipVO lipresult = service.getLipResult(lipopt);
		BlushVO blushresult = service.getBlushResult(blushopt);
		FoundationVO faceresult = service.getFaceResult(faceopt);
		
		model.addAttribute("info", info);
		model.addAttribute("result", result);
		model.addAttribute("lipresult", lipresult);
		model.addAttribute("blushresult", blushresult);
		model.addAttribute("faceresult", faceresult);	
	}
	
}
