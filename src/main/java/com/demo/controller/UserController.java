package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.demo.dao.DAO;
import com.demo.dao.UserDAO;
import com.demo.model.User;

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
	public ModelAndView updateUser(@RequestParam String username) {
		ModelAndView mav = new ModelAndView("updateuser");
		
		
		//System.out.println(username);
		UserDAO dao = new UserDAO();
		User user = dao.checkUser(username);
		//System.out.println(user);
		mav.addObject("linkimage", "http://192.168.225.1/file/avatar/" + username + "/" + user.avatar);
		mav.addObject("username", username);
		mav.addObject("oldavatar", user.avatar);
		
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
