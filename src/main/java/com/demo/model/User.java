package com.demo.model;

public class User {
	public String username;
	public String password;
	public String avatar;
	public String online;

	public User() {
	}

	public User(String username, String password, String avatar, String online) {
		this.username = username;
		this.password = password;
		this.avatar = avatar;
		this.online = online;
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

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public String getOnline() {
		return online;
	}

	public void setOnline(String online) {
		this.online = online;
	}

	@Override
	public String toString() {
		return "User [username=" + username + ", password=" + password + ", avatar=" + avatar + ", online=" + online
				+ "]";
	}

	
	
	
	

}
