package com.demo.color.domain;

import lombok.Data;

/**
 * @since   : 2023. 3. 25.
 * @FileName: FoundationVO.java
 * @author  : 이세아
 * @설명    : 메이크업 상담 결과에 따른 Foundation 결과 정보

 * <pre>
 *   수정일         수정자               수정내용
 * ----------      --------    ---------------------------
 * 2023. 3. 25.     이세아       create
 * </pre>
 */
@Data
public class FoundationVO {
	
	private String pcode;
	private String pname;
	private int pprice;
	private int dept2no;
	private String ptype;
	private String optcolor;
	private String optname;
	private String iloc;
	private String itype;

}
