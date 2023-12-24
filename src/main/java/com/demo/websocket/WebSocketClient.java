package com.demo.websocket;

import javax.websocket.ClientEndpoint;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import java.io.IOException;

@ClientEndpoint
public class WebSocketClient {

    private Session session;

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
    }

    @OnMessage
    public void onMessage(String message) {
        // Xử lý tin nhắn đến nếu cần
    }

    public void sendMessage(String message) {
    	try {
            if (session != null && session.isOpen()) {
                session.getBasicRemote().sendText(message);
            } else {
                System.out.println("Session is closed. Cannot send message.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
