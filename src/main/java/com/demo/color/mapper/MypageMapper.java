package com.demo.color.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.demo.color.domain.ReservVO;

/**
 * @since   : 2023. 4. 1.
 * @FileName: MypageMapper.java
 * @author  : 이세아
 * @설명    : @

 * <pre>
 *   수정일         수정자               수정내용
 * ----------      --------    ---------------------------
 * 2023. 4. 1.     이세아      	create
 * 2023. 4. 1.     이세아      	마이페이지에 예약 목록 나오기 mapper 
 * </pre>
 */

@Mapper
public interface MypageMapper {
	
	// 상담 후
	public List<ReservVO> getReservdone(String mid);

	// 상담 전
	public List<ReservVO> getReservReady(String mid);

}
