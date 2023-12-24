package com.demo.controller;

import java.io.IOException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;


@Controller

@RequestMapping(value = "/register")
public class RegisterController {
	public ModelAndView RegisterForm(@RequestParam String username,
            @RequestParam String password
            ,@RequestParam String avatar
            ) throws IOException {
		System.out.println("Hello");
		System.out.println(username + " " + password);
		
		
		ModelAndView mav = new ModelAndView("login");
		return mav;
	}
}
