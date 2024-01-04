package com.demo.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.springframework.web.servlet.ModelAndView;

import com.demo.dao.DAO;
import com.demo.dao.FriendDAO;
import com.demo.dao.GroupDAO;
import com.demo.dao.UserDAO;
import com.demo.model.User;
import com.demo.service.UserService;

@MultipartConfig
@WebServlet("/update-user")
public class UpdateUserController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    
    public UpdateUserController() {
        super();
        
    }
    
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
        
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String oldusername = request.getParameter("oldusername");
		String username = request.getParameter("username");
		String password = request.getParameter("password");
//		Part avatarPart = request.getPart("avatar");
//		String avatar = (avatarPart != null && avatarPart.getSize() > 0) ? avatarPart.getSubmittedFileName() : null;
		
//	    if(avatar == null) {	
//			avatar = user.avatar;
//	    }
		String avatar = request.getParameter("avatar");
		UserDAO dao = new UserDAO();
		User user = dao.checkUser(oldusername);
		System.out.println(oldusername + "," + username + "," + password + "," + avatar);
		
		//thuc hien update
		
		//update user
		dao.updateUser(oldusername, username, password, avatar);
		//tao folder moi
		UserService userService = new UserService();
        userService.createUserFolder(username, password, avatar);
        //update friends
        FriendDAO friendDAO = new FriendDAO();
        friendDAO.updateFriend1(oldusername, username);
        friendDAO.updateFriend2(oldusername, username);
        //update conversations_users
        GroupDAO groupDAO = new GroupDAO();
        groupDAO.updateInfoMember(oldusername, username);
        //xong update
        
        DAO dao1 = new DAO();
		User u = dao1.checkLogin(username, password);
		
		List<User> l = new ArrayList<>();
		l = dao1.getFriend(username);

		request.setAttribute("user", u);
		request.setAttribute("friends", l);
		
		RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/views/chatbox.jsp");
        dispatcher.forward(request, response);
	}

}
