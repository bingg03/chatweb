package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/users")
public class UserController {
	
	
	@GetMapping("/register")
	public ModelAndView showRegisterForm() {
		System.out.println("To DK");
		ModelAndView mav = new ModelAndView("register");

		String title = "Update User";
		String description = "Update your information";
		String status = "/register";
		String btnSubmit = "Update";
		String btnGoBack = "/chat";

		title = "Register User";
		description = "Enter your information";
		btnSubmit = "Register";
		btnGoBack = "/login";

		mav.addObject("title", title);
		mav.addObject("description", description);
		mav.addObject("status", status);
		mav.addObject("btnSubmit", btnSubmit);
		mav.addObject("btnGoBack", btnGoBack);

		return mav;
	}
	
	@GetMapping("/update")
	public ModelAndView updateUser() {
		ModelAndView mav = new ModelAndView("user-form");

		String title = "Update User";
		String description = "Update your information";
		String status = "/update";
		String btnSubmit = "Update";
		String btnGoBack = "/chat";


		mav.addObject("title", title);
		mav.addObject("description", description);
		mav.addObject("status", status);
		mav.addObject("btnSubmit", btnSubmit);
		mav.addObject("btnGoBack", btnGoBack);

		return mav;
	}
	
	
}
