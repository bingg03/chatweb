package com.demo.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class GroupDAO {
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
	public void addGroup(int groupId, String name, String avatar) {
		String query = "insert into conversations(id, name, avatar) values (?, ?, ?)";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setInt(1, groupId);
			ps.setString(2, name);
			ps.setString(3, avatar);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void addUserWithAdmin(String username, int groupId) {
		String query = "insert into conversations_users(conversations_id, username, is_admin) values (?, ?, ?)";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setInt(1, groupId);
			ps.setString(2, username);
			ps.setString(3, "1");
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void deleteGroup(int groupId) {
		String query = "delete from conversations where id = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setInt(1, groupId);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void deleteMemberGroup(int groupId) {
		String query = "delete from conversations_users where conversations_id = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setInt(1, groupId);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void addMember(String username, int groupId) {
		String query = "insert into conversations_users(conversations_id, username, is_admin) values (?, ?, ?)";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setInt(1, groupId);
			ps.setString(2, username);
			ps.setString(3, "0");
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void deleteMember(String username, int groupId) {
		String query = "delete from conversations_users where conversations_id = ? and username = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setInt(1, groupId);
			ps.setString(2, username);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	public void updateInfoMember(String oldusername, String username) {
		String query = "update conversations_users set username = ? where username = ?";
		
		try {
			Connection con = takeConnect();
			PreparedStatement ps = con.prepareStatement(query);
			ps.setString(1, username);
			ps.setString(2, oldusername);
			ps.executeUpdate();
			
		} catch (Exception e) {
			
		}
	}
	
	public static void main(String[] args) {
		
	}
}
