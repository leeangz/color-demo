package com.demo.color.service;

import org.apache.ibatis.annotations.Param;

import com.demo.color.domain.ReservVO;

/**
 * @since   : 2023. 3. 27.
 * @FileName: ReservService.java
 * @author  : 이세아
 * @설명    : @

 * <pre>
 *   수정일         수정자               수정내용
 * ----------      --------    ---------------------------
 * 2023. 3. 27.     이세아      @
 * </pre>
 */
public interface ReservService {
	
	//예약 insert
	public ReservVO reserv(@Param("rimg") String rimg, @Param("rdate") String rdate, @Param("mid") String mid);

	//날짜 별 예약 시간 남아있는지 조회 위함
	public int CountDate(String rdate);
	
	//시간 별 매진 확인
	public int CountTime(String rdate);

}
