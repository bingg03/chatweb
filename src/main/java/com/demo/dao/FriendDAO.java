package com.demo.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class FriendDAO {
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
	public void addFriend(String username, String receiver) {
		String query = "insert into friends(sender, receiver, status) values (?, ?, ?)";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, username);
			ps.setString(2, receiver);
			ps.setString(3, "2");
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void getFriend(String username, String receiver) {
		String query = "insert into friends(sender, receiver, status) values (?, ?, ?)";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, username);
			ps.setString(2, receiver);
			ps.setString(3, "0");
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	
	public void acceptFriend(String username, String receiver) {
		String query = "update friends set status = ? where sender = ? and receiver = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, "1");
			ps.setString(2, username);
			ps.setString(3, receiver);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void updateFriend1(String oldusername, String sender) {
		String query = "update friends set sender = ? where sender = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, sender);
			ps.setString(2, oldusername);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void updateFriend2(String oldusername, String receiver) {
		String query = "update friends set receiver = ? where receiver = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, receiver);
			ps.setString(2, oldusername);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	
	public static void main(String[] args) {
		//FriendDAO friendDAO = new FriendDAO();
	}
}
