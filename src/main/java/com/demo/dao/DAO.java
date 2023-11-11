package com.demo.dao;

import com.demo.model.User;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class DAO {
	public List<User> getAllUser(String user_name) {
		List<User> l = new ArrayList<>();
		String query = "select * from user where username not in (?)";
		//SELECT * FROM `user` WHERE username not in ('admin');

		try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/chat", "root", "");
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, user_name);
			ResultSet rs = ps.executeQuery();

			while (rs.next()) {
				String username = rs.getString(1);
				String password = rs.getString(2);
				l.add(new User(username, password, "0"));

			}
			return l;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return null;
	}
	public User checkLogin(String username, String password) {
		String query = "select * from user where username = ? and password = ?";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/chat", "root", "");
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, username);
			ps.setString(2, password);
			ResultSet rs = ps.executeQuery();
			
			while (rs.next()) {
				return new User(username, password, "1");
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		return null;
	}
	public List<String> getAllUserFromGroup(String group) {
		List<String> l = new ArrayList<>();
		String query = "select * from conversations_users where conversations_id = ?";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/chat", "root", "");
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, group);
			ResultSet rs = ps.executeQuery();
			
			while (rs.next()) {	
				l.add(rs.getString(2));
			}
			return l;
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		
		return null;
	}
	
	public static void main(String[] args) {
		DAO dao = new DAO();
		List<String> l = dao.getAllUserFromGroup("1");
		for(String o : l) System.out.println(o);
	}
}
