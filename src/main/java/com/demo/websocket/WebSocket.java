package com.demo.websocket;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import com.demo.dao.*;
import java.util.ArrayList;
import java.util.List;


@ServerEndpoint(value = "/ChatSocket")
public class WebSocket {
	private static Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
	
	@OnOpen
	public void onOpen(Session session) {
		System.out.println("NEW Connection with client: " + session.getId());
		sessions.add(session);
		// sessionIds.put(session, session.getId());
	}

	@OnClose
	public void onClose(Session session) {
		sessions.remove(session);
		// sessionIds.remove(session);
	}

	@OnMessage
	public void onMessage(String message, Session session) throws Exception {
		System.out.println("Client " + session.getId() + ": " + message);
		if (message.startsWith("#")) {
			String username = message.substring(1).trim();
			session.getUserProperties().put("username", username);
			System.out.println("da gan '" + username + "' cho session " + session.getId());
		} else if (message.startsWith("@")) {
			String[] parts = message.substring(1).split(",");
			String sender = parts[0].trim();
			String receiver = parts[1].trim();
			String messTosend = parts[2].trim();

			for (Session client : sessions) {
				String receiver_name = (String) client.getUserProperties().get("username");
				if (receiver_name != null && receiver_name.equals(receiver) && client.isOpen()) {
					client.getBasicRemote().sendText(message);
				}
			}
		} else if (message.startsWith("&")){
			String[] parts = message.substring(1).split(",");
			String sender = parts[0].trim();
			String groupID = parts[1].trim();
			String messTosend = parts[2].trim();
			
			DAO dao = new DAO();
			List<String> userFromGroup = dao.getAllUserFromGroup(groupID);
			String present_user = (String) session.getUserProperties().get("username");
			//System.out.println(present_user + " " + message);
			for(String receiver : userFromGroup) {
				if(!receiver.equals(present_user)) {
					for (Session client : sessions) {
						String receiver_name = (String) client.getUserProperties().get("username");
						if (receiver_name != null && receiver_name.equals(receiver) && client.isOpen()) {
							client.getBasicRemote().sendText(message);
						}
					}
				}
			}
			
			
		} else {
			
		}
	}
}