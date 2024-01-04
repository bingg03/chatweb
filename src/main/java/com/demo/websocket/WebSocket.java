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

import org.apache.taglibs.standard.tag.common.xml.IfTag;
import org.springframework.beans.factory.annotation.Autowired;

import com.demo.dao.*;
import com.demo.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;


@ServerEndpoint(value = "/ChatSocket")
public class WebSocket {
	
	static File uploadedFile = null;
	static String fileName = null;
	static FileOutputStream fos = null;
	final static String filePath = "D:/xampp/htdocs/file/";
	final static String SRC_FILE = "http://localhost/file/";
	
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
	public void processUpload(ByteBuffer msg, boolean last, Session session) {
		while (msg.hasRemaining()) {
			try {
				fos.write(msg.get());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	
	@OnMessage
	public void onMessage(String message, Session session) throws Exception {
		//System.out.println("Client " + session.getId() + ": " + message);
		if(isJson(message)) {
			ObjectMapper objectMapper = new ObjectMapper();
	        try {
	            JsonNode jsonNode = objectMapper.readTree(message);
	            
	            String receiver = jsonNode.get("receiver").asText();
	            String groupId = jsonNode.get("groupId").asText();
	            String messageContent = jsonNode.get("message").asText();
	            String typeMessage = jsonNode.get("type").asText();


	            message = objectMapper.writeValueAsString(jsonNode);
	            System.out.println(message);
	            
	            if(groupId == "0") {
	            	
	    			for (Session client : sessions) {
	    				String receiver_name = (String) client.getUserProperties().get("username");
						if (receiver_name != null && receiver_name.equals(receiver) && client.isOpen()) {
							client.getBasicRemote().sendText(message);
							
						}
	    			}
	            } else {
	            	//System.out.println("Đang send cho 1 group");
	    			DAO dao = new DAO();
	    			List<String> userFromGroup = dao.getAllUserFromGroup(groupId);
	    			//System.out.println(userFromGroup);
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
			//gan name cho session
			if (message.startsWith("#")) {
				String username = message.substring(1).trim();
				session.getUserProperties().put("username", username);
			//nhan file va upload file
			} else if (message.startsWith("filename")) {
				String name = message.substring(message.indexOf(':') + 1);
				if (!name.equals("end")) {
					uploadedFile = new File(filePath + name);
					
					//System.out.println(uploadedFile);
					try {
						fos = new FileOutputStream(uploadedFile);
					} catch (FileNotFoundException e) {
						e.printStackTrace();
					}
				} else {
					try {
						fos.flush();
						fos.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			} else {
				//tao folder avatar 
				if(message.startsWith("?")) {
			        String processedString = message.substring(1);
			        
			        String[] parts = processedString.split(",");
			        String username = parts[0];
			        String password = parts[1];
			        String avatar = parts[2];
			        avatar = avatar.substring(12);
			        UserService userService = new UserService();
			        userService.createUserFolder(username, password, avatar);
			    //tao group
				} else if(message.startsWith("@")) {
					System.out.println(message);
					String processedString = message.substring(1);
			        
			        String[] parts = processedString.split(",");
			        String username = parts[0];
			        String groupId = parts[1];
			        String groupName = parts[2];
			        
			        GroupDAO groupDAO = new GroupDAO();
			        //add group 
			        groupDAO.addGroup(Integer.parseInt(groupId), groupName, "group.png");
			        //add user admin
			        groupDAO.addUserWithAdmin(username, Integer.parseInt(groupId));
			    //delete group
				} else if(message.startsWith("$")) {
					String processedString = message.substring(1);
			        int groupId = Integer.parseInt(processedString);
			        GroupDAO groupDAO = new GroupDAO();
			        groupDAO.deleteGroup(groupId);
			        groupDAO.deleteMemberGroup(groupId);
			    //add friend
				} else if(message.startsWith("&")) {
					System.out.println(message);
					String processedString = message.substring(1);
			        
			        String[] parts = processedString.split(",");
			        String username = parts[0];
			        String receiver = parts[1];
			        FriendDAO friendDAO = new FriendDAO();
			        friendDAO.addFriend(username, receiver);
			        friendDAO.getFriend(receiver, username);
				//accept friend
				} else if(message.startsWith("!")) {
					System.out.println(message);
					String processedString = message.substring(1);
			        
			        String[] parts = processedString.split(",");
			        String username = parts[0];
			        String receiver = parts[1];
			        FriendDAO friendDAO = new FriendDAO();
			        friendDAO.acceptFriend(username, receiver);
			        friendDAO.acceptFriend(receiver, username);
				//them member
				} else if(message.startsWith("(")) {
					System.out.println(message);
					String processedString = message.substring(1);
			        
			        String[] parts = processedString.split(",");
			        String username = parts[0];
			        String groupId = parts[1];
			        GroupDAO groupDAO = new GroupDAO();
			        groupDAO.addMember(username, Integer.parseInt(groupId));
				//delete member
				} else if(message.startsWith(")")) {
					System.out.println(message);
					String processedString = message.substring(1);
			        
			        String[] parts = processedString.split(",");
			        String username = parts[0];
			        String groupId = parts[1];
			        GroupDAO groupDAO = new GroupDAO();
			        groupDAO.deleteMember(username, Integer.parseInt(groupId));
				} else if(message.startsWith("+")) {
					String username = message.substring(1);
					//set online database
					UserDAO userDAO = new UserDAO();
					userDAO.setOnline(username);
					//send full user
					for (Session client : sessions) {		
						client.getBasicRemote().sendText(message);
	    			}
					
				} else if(message.startsWith("-")) {
					String username = message.substring(1);
					//set offline database
					UserDAO userDAO = new UserDAO();
					userDAO.setOffline(username);
					//send full user
					for (Session client : sessions) {		
						client.getBasicRemote().sendText(message);
	    			}
				}
				
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



//System.out.println(message);
//if (jsonNode.has("type")) {
//	if (typeMessage.startsWith("image")) {
//		((ObjectNode) jsonNode).put("type", typeMessage);
//        ((ObjectNode) jsonNode).put("message", "<img src=\"" + 
//        		SRC_FILE + messageContent + "\" alt=\"\">");
//	} else if(typeMessage.startsWith("video")) {
//		((ObjectNode) jsonNode).put("type", typeMessage);
//        ((ObjectNode) jsonNode).put("message", "<video width=\"400\" controls>\r\n" 
//		+ "  <source src=\"" + SRC_FILE + messageContent
//				+ "\" type=\"" + typeMessage + "\">\r\n" + "</video>");
//	} else if(typeMessage.startsWith("audio")) {
//		((ObjectNode) jsonNode).put("type", typeMessage);
//        ((ObjectNode) jsonNode).put("message", "<audio controls>\r\n" +
//		"  <source src=\"" + SRC_FILE + messageContent + "\" type=\""
//				+ typeMessage + "\">\r\n" + "</audio>");
//	} else if(typeMessage.startsWith("text")) {
//		
//	} else {
//		((ObjectNode) jsonNode).put("type", typeMessage);
//        ((ObjectNode) jsonNode).put("message", "<a href="
//		+ SRC_FILE + messageContent + ">" + messageContent + "</a>");
//	}
//    
//}