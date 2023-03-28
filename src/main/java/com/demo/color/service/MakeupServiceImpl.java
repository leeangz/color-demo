package com.demo.color.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.color.domain.BlushVO;
import com.demo.color.domain.FoundationVO;
import com.demo.color.domain.LipVO;
import com.demo.color.domain.ResultVO;
import com.demo.color.mapper.MakeupMapper;

@Service
public class MakeupServiceImpl implements MakeupService{
	
	@Autowired
	private MakeupMapper mapper;

	@Override
	public List<LipVO> pickLip(String optcolor) {
		return mapper.PickLip(optcolor);
	}

	@Override
	public List<BlushVO> pickBlush(String optcolor) {
		return mapper.PickBlush(optcolor);
	}

	@Override
	public List<FoundationVO> pickFoundation(String optcolor) {
		return mapper.PickFoundation(optcolor);
	}

	@Override
	public void insertResult(ResultVO result) {
		mapper.insertResult(result);
	}

}
