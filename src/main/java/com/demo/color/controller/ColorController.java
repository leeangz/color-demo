package com.demo.color.controller;

import java.awt.AWTException;
import java.awt.Color;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.PointerInfo;
import java.awt.Robot;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.log4j.Log4j2;

@Controller
@Log4j2
public class ColorController {

	@GetMapping("/colormain")
	public void colormain() {
		log.info("======색조 추천 탭======");
	}

	@GetMapping("/colorAtMouse")
	public String getColorAtMouse() throws AWTException {
		PointerInfo pointerInfo = MouseInfo.getPointerInfo();
		Point point = pointerInfo.getLocation();
		Color color = new Robot().getPixelColor((int) point.getX(), (int) point.getY());
		int red = color.getRed();
		int green = color.getGreen();
		int blue = color.getBlue();
		return String.format("RGB: (%d, %d, %d)", red, green, blue);
	}
	
	@GetMapping("/color2")
    public String getImage(Model model) {
        String imageUrl = "/img/IMG_0184.JPG"; // 이미지 경로
        BufferedImage image = getImgPixel(imageUrl);

        if (image != null) {
            model.addAttribute("image", image);
            model.addAttribute("pixel", new Color(image.getRGB(image.getWidth()-1, image.getHeight()-1)));
        }

        return "color2";
    }

    private BufferedImage getImgPixel(String url) {
        BufferedImage image = null;
        try {
            image = ImageIO.read(new File(url));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return image;
    }
    
}