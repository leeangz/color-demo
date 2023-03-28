package com.demo.color.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.demo.color.domain.BlushVO;
import com.demo.color.domain.FoundationVO;
import com.demo.color.domain.LipVO;
import com.demo.color.domain.ResultVO;

/**
 * @since   : 2023. 3. 24.
 * @FileName: MakeupMapper.java
 * @author  : 이세아
 * @설명    : 메이크업 상담 결과 제품 추천 기능 Mapper

 * <pre>
 *   수정일         수정자               수정내용
 * ----------      --------    ---------------------------
 * 2023. 3. 24.     이세아      create
 * 2023. 3. 25.     이세아      상담 결과에 따른 제품 추출
 * 2023. 3. 28.		이세아	  아티스트 픽 이후 결과 DB 저장 매퍼
 * </pre>
 */
@Mapper
public interface MakeupMapper {
	
	// Lip 제품 선정
	public List<LipVO> PickLip(String optcolor);
	
	// Blush 제품 선정
	public List<BlushVO> PickBlush(String optcolor);
	
	// Foundation 제품 선정
	public List<FoundationVO> PickFoundation(String optcolor);
	
	// 아티스트가 선정한 제품 예약 결과 내역에 저장
	public void insertResult(ResultVO result);

}
