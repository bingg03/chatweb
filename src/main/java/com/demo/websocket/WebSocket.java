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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;


@ServerEndpoint(value = "/ChatSocket")
public class WebSocket {
	private static Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
	
	@OnOpen
	public void onOpen(Session session) {
		//System.out.println("NEW Connection with client: " + session.getId());
		sessions.add(session);
	}

	@OnClose
	public void onClose(Session session) {
		sessions.remove(session);
	}

	@OnMessage
	public void onMessage(String message, Session session) throws Exception {
		System.out.println("Client " + session.getId() + ": " + message);
		if(isJson(message)) {
			ObjectMapper objectMapper = new ObjectMapper();
	        try {
	            JsonNode jsonNode = objectMapper.readTree(message);
	            
	            String receiver = jsonNode.get("receiver").asText();
	            String groupId = jsonNode.get("groupId").asText();

	            if(groupId != null) {
	    			for (Session client : sessions) {
	    				String receiver_name = (String) client.getUserProperties().get("username");
						if (receiver_name != null && receiver_name.equals(receiver) && client.isOpen()) {
							client.getBasicRemote().sendText(message);
						}
	    			}
	            } else {
	    			DAO dao = new DAO();
	    			List<String> userFromGroup = dao.getAllUserFromGroup(groupId);
	    			String present_user = (String) session.getUserProperties().get("username");
	    	
	    			for(String RECEIVER : userFromGroup) {
	    				if(!RECEIVER.equals(present_user)) {
	    					for (Session client : sessions) {
	    						String receiver_name = (String) client.getUserProperties().get("username");
	    						if (receiver_name != null && receiver_name.equals(RECEIVER) && client.isOpen()) {
	    							client.getBasicRemote().sendText(message);
	    						}
	    					}
	    				}
	    			}
	            }
	            

	        } catch (Exception e) {
	            e.printStackTrace();
	        }
			
			
		} else {
			if (message.startsWith("#")) {
				String username = message.substring(1).trim();
				session.getUserProperties().put("username", username);
			}
		}
	}
	
	private boolean isJson(String message) {
        try {
            return message.startsWith("{") && message.endsWith("}");
        } catch (Exception e) {
            return false;
        }
    }
	
}