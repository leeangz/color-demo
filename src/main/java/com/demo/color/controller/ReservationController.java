package com.demo.color.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.demo.color.domain.ReservVO;
import com.demo.color.service.ReservService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * @since   : 2023. 3. 27.
 * @FileName: ReservationController.java
 * @author  : 이세아
 * @설명    : @

 * <pre>
 *   수정일         수정자               수정내용
 * ----------      --------    ---------------------------
 * 2023. 3. 27.     이세아       create
 * 2023. 3. 27.     이세아       예약서비스 html 연결
 * 2023. 3. 30.		이세아	   첨부파일 업로드 처리
 * </pre>
 */

@Log4j2
@RequiredArgsConstructor
@RequestMapping("/reserv")
@Controller
public class ReservationController {
	
	@Autowired
	private ReservService service;
	
	@GetMapping("/reserv_main")
	public void reserv_main() {
		log.info("==== Make-on 메인 페이지====");
	}

	@GetMapping("/reserv_type")
	public void reserv_type() {
		log.info("==== Make-on 예약 타입 선정 ====");
	}

	@GetMapping("/reserv_offline")
	public void reserv_offline() {
		log.info("==== 예약 디테일 입력 페이지 : 오프라인 전용 ====");
	}

	@GetMapping("/reserv_online")
	public void reserv_online() {
		log.info("==== 예약 디테일 입력 페이지 : 온라인 전용 ====");
		
	}
	
	@GetMapping("/uploadEx")
	public void uploadEx() {
		log.info("==== 파일 업로드 샘플 페이지 ====");
	}
	
	@PostMapping("/reserv.do")
	public String reservSend(@RequestParam("rimg") String rimg, @RequestParam("rdate") String rdate, @RequestParam("mid") String mid) {

		log.info("==== 예약 DB 처리중 ====");
		ReservVO vo = new ReservVO();
		vo.setMid(mid);
		vo.setRdate(rdate);
		vo.setRimg(rimg);
		
		service.reserv(vo);
		
		return "redirect:/mypage/mypage_reserv";
	}
	
	// 날짜 별 예약이 풀인지 아닌지 체크
	@GetMapping("/can_reserv.do")
	public int getAvailableReserv(@RequestParam("rdate") String rdate) {
		return  service.CountDate(rdate);
	}
	
	// 날짜의 시간 별 예약이 가능/불가능 확인
	@PostMapping("/can_reserv_time.do")
	public int getAvailableTime(@RequestParam("rdate") String rdate) {
		return service.CountTime(rdate);
	}

}