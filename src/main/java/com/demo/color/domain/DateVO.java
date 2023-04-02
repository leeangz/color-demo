package com.demo.color.domain;

import java.time.LocalDate;

import lombok.Data;

@Data
public class DateVO {

	private LocalDate date;
	private int availability;
}
