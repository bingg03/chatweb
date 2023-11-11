package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import com.demo.dao.DAO;
import com.demo.model.User;
import java.util.ArrayList;
import java.util.List;

@Controller
public class LoginController {
	@RequestMapping(value = "/chat", method = RequestMethod.POST)
	public ModelAndView handleLoginForm(@RequestParam String username, @RequestParam String password) {
		System.out.println(username + " " + password);
		DAO dao = new DAO();
		// Xử lý dữ liệu từ form ở đây
		User u = dao.checkLogin(username, password);
		
		if(u == null) {
			ModelAndView mav = new ModelAndView("login");
			mav.addObject("messageError", "Wrong username or password");
			return mav;
		} else {
			ModelAndView mav = new ModelAndView("chatbox");
			List<User> l = new ArrayList<>();
			l = dao.getAllUser(username);
			mav.addObject("user", u);
			mav.addObject("friends", l);
			return mav;
		}
	}

}
