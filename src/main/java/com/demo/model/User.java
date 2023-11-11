package com.demo.model;

public class User {
	public String username;
	public String password;
	public String isOnline;

	public User() {
	}

	public User(String username, String password, String isOnline) {
		this.username = username;
		this.password = password;
		this.isOnline = isOnline;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getIsOnline() {
		return isOnline;
	}

	public void setIsOnline(String isOnline) {
		this.isOnline = isOnline;
	}

	@Override
	public String toString() {
		return "User [username=" + username + ", password=" + password + ", isOnline=" + isOnline + "]";
	}
	
	

}
