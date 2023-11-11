package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/users")
public class UserController {
	
	
	@GetMapping("/register")
	public ModelAndView showRegisterForm() {
		ModelAndView mav = new ModelAndView("user-form");

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
	
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	   public ModelAndView homePage() {
	      ModelAndView mav = new ModelAndView("login");
	      //mav.addObject("message", "Xin chào từ Controller!");
	      return mav;
	   }
	
}
