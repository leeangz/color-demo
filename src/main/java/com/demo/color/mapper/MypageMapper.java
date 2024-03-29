package com.demo.color.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.demo.color.domain.BlushVO;
import com.demo.color.domain.FoundationVO;
import com.demo.color.domain.LipVO;
import com.demo.color.domain.ReservVO;
import com.demo.color.domain.ResultVO;

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
 * 2023. 4. 2.     이세아      	마이페이지 예약 결과 
 * </pre>
 */

@Mapper
public interface MypageMapper {
	
	// 상담 후
	public List<ReservVO> getReservdone(String mid);

	// 상담 전
	public List<ReservVO> getReservReady(String mid);
	
	// 결과 -> 결과값 립
	public LipVO getLipResult(String optname);
	
	// 결과 -> 결과값 블러쉬
	public BlushVO getBlushResult(String optname);
	
	// 결과 -> 결과값 페이스
	public FoundationVO getFaceResult(String optname, String pcode);

	// 결과 -> 상담값
	public ReservVO getReservInfo(String rid);

	// 결과 -> 결과값
	public ResultVO getResultInfo(String rid);

}
