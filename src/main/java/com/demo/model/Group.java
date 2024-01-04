package com.demo.model;

public class Group {
	public String id;
	public String name;
	public String avatar;
	
	public Group() {
		
	}
	
	public Group(String id, String name, String avatar) {
		this.id = id;
		this.name = name;
		this.avatar = avatar;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	@Override
	public String toString() {
		return "Group [id=" + id + ", name=" + name + ", avatar=" + avatar + "]";
	}
	
	
}
