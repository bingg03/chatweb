package com.demo.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.demo.model.User;

public class UserDAO {
	
	public Connection takeConnect() {
		try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/chat", "root", "123456");
			return con;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return null;
	}
	
	public User checkUser(String username) {
		String query = "select * from user where username = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, username);
			ResultSet rs = ps.executeQuery();
			
			while (rs.next()) {
				return new User(username, rs.getString(2), rs.getString(3), rs.getString(4));
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		return null;
	}
	
	public void addUser(String username, String password, String avatar) {
		String query = "insert into user(username, password, avatar, online) values (?, ?, ?, ?)";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, username);
			ps.setString(2, password);
			ps.setString(3, avatar);
			ps.setString(4, null);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
		
	}
	
	public void updateUser(String oldusername, String username, String password, String avatar) {
		String query = "update user set username = ?, password = ?, avatar = ? where username = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, username);
			ps.setString(2, password);
			ps.setString(3, avatar);
			ps.setString(4, oldusername);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void setOnline(String username) {
		String query = "update user set online = ? where username = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, "online");
			ps.setString(2, username);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void setOffline(String username) {
		String query = "update user set online = ? where username = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, null);
			ps.setString(2, username);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	
	public static void main(String[] args) {
		UserDAO userDAO = new UserDAO();
		userDAO.setOffline("admin");
	}
}
