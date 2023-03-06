package com.demo.color.service;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {

    private BufferedImage image;

    public void saveImage(MultipartFile file) throws IOException {
        image = ImageIO.read(file.getInputStream());
    }

    public String getPixelValue(int x, int y) throws IOException {
        if (image == null) {
            throw new IllegalStateException("No image uploaded.");
        }

        int rgb = image.getRGB(x, y);
        Color color = new Color(rgb);

        int red = (rgb >> 16) & 0xFF;
        int green = (rgb >> 8) & 0xFF;
        int blue = rgb & 0xFF;

        return "Clicked pixel color (RGB): " + red + ", " + green + ", " + blue;
    }
}
