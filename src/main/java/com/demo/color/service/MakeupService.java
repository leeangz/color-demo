package com.demo.color.service;

import java.util.List;

import com.demo.color.domain.BlushVO;
import com.demo.color.domain.FoundationVO;
import com.demo.color.domain.LipVO;

/**
 * @since : 2023. 3. 26.
 * @FileName: MakeupService.java
 * @author : 이세아
 * @설명 : 메이크업 상담 후 결과 -> 상품 추출해주는 서비스
 * 
 *     <pre>
 *   수정일         수정자               수정내용
 * ----------      --------    ---------------------------
 * 2023. 3. 26.     이세아       create
 *     </pre>
 */
public interface MakeupService {

	// Lip 제품 선정
	public List<LipVO> pickLip(String optcolor);

	// Blush 제품 선정
	public List<BlushVO> pickBlush(String optcolor);

	// Foundation 제품 선정
	public List<FoundationVO> pickFoundation(String optcolor);

}