package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.*;

@Controller
public class AvatarController {

    private static final String IMAGE_BASE_PATH = "C:/image";

    @GetMapping("/files/{username}/{avatar}")
    @ResponseBody
    public void getAvatar(@PathVariable String username, @PathVariable String avatar,
                          HttpServletResponse response) throws IOException {
        String imagePath = IMAGE_BASE_PATH + "/" + username + "/" + avatar + ".png";
        File imageFile = new File(imagePath);
        //System.out.println(imagePath);
        
        if (imageFile.exists()) {
            try (InputStream inputStream = new FileInputStream(imageFile);
                 OutputStream outputStream = response.getOutputStream()) {
                response.setContentType("image/png"); 
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
