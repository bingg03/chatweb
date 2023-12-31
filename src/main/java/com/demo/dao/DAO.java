package com.demo.dao;

import com.demo.model.User;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class DAO {
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
	
	public List<User> getFriend(String user_name) {
		List<User> l = new ArrayList<>();
		String query = "select * from friends where sender = ?";
		String query2 = "select * from user where username = ?";
		try {
			
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, user_name);
			ResultSet rs = ps.executeQuery();
			List<String> nameFriend = new ArrayList<>();
			while (rs.next()) {
				nameFriend.add(rs.getString(2));
			}
			for(String name : nameFriend) {
				ps = con.prepareStatement(query2);
				ps.setString(1, name);
				rs = ps.executeQuery();
				while (rs.next()) {
					l.add(new User(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4)));
				}
			}
			return l;
			
		} catch (Exception e) {
			
		}
		return null;
	}
	public User checkLogin(String username, String password) {
		String query = "select * from user where username = ? and password = ?";
		
		try {
			
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, username);
			ps.setString(2, password);
			ResultSet rs = ps.executeQuery();
			
			while (rs.next()) {
				return new User(username, password, rs.getString(3), rs.getString(4));
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
			
			Connection con = takeConnect();
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
		User u = dao.checkLogin("admin", "123");
		System.out.println(u);
		System.out.println(u.online == null);
	}
}
