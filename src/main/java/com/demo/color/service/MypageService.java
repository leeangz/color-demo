package com.demo.color.service;

import java.util.List;

import com.demo.color.domain.ReservVO;

/**
 * @since   : 2023. 4. 1.
 * @FileName: MypageService.java
 * @author  : 이세아
 * @설명    : @

 * <pre>
 *   수정일         수정자               수정내용
 * ----------      --------    ---------------------------
 * 2023. 4. 1.     이세아      	create
 * 2023. 4. 1.     이세아      	마이페이지에 예약 목록 나오기 service 
 * </pre>
 */
public interface MypageService {

	// 상담 후
	public List<ReservVO> getReservdone(String mid);

	// 상담 전
	public List<ReservVO> getReservReady(String mid);

}
