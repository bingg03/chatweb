package com.demo.controller;

import java.io.IOException;
import java.net.URI;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.websocket.ContainerProvider;
import javax.websocket.DeploymentException;
import javax.websocket.WebSocketContainer;

import org.springframework.cglib.core.CollectionUtils;
import org.springframework.web.socket.client.WebSocketClient;

import javax.websocket.Session;

import com.demo.dao.UserDAO;
import com.demo.model.User;
import com.demo.websocket.WebSocket;


@MultipartConfig
@WebServlet("/registerservlet")
public class RegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    
    public RegisterServlet() {
        super();
        
    }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("dk o day");
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String avatar = request.getParameter("avatar");
		
		UserDAO userDAO = new UserDAO();
		User user = userDAO.checkUser(username);
		
		if(user != null) {
			request.getRequestDispatcher("/users/register").forward(request, response);
			
		} else {
			//dk o day
			avatar = avatar.substring(12);
			
			System.out.println(username + " " + password + " " + avatar);
			userDAO.addUser(username, password, avatar);
			request.getRequestDispatcher("login").forward(request, response);
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		doGet(request, response);
	}

	private String getFileName(final Part part) {
		final String partHeader = part.getHeader("content-disposition");
		for (String content : partHeader.split(";")) {
			if (content.trim().startsWith("filename")) {
				return content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
			}
		}
		return null;
	}
	
	
}
