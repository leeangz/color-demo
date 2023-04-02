package com.demo.color.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.color.domain.ReservVO;
import com.demo.color.mapper.MypageMapper;

@Service
public class MypageServiceImpl implements MypageService{
	
	@Autowired
	private MypageMapper mapper;

	@Override
	public List<ReservVO> getReservdone(String mid) {
		return mapper.getReservdone(mid);
	}

	@Override
	public List<ReservVO> getReservReady(String mid) {
		return mapper.getReservReady(mid);
	}

}
