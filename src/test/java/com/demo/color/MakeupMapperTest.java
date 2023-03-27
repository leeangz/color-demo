package com.demo.color;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.demo.color.domain.LipVO;
import com.demo.color.mapper.MakeupMapper;

import lombok.extern.log4j.Log4j2;

@Log4j2
@SpringBootTest
public class MakeupMapperTest {
	
	@Autowired
	private MakeupMapper mappper;
	
	@Test
	public void pickLip() {
		List<LipVO> lipList = new ArrayList<>();
		lipList = mappper.PickLip("red");
		log.info(lipList);
	}

}
