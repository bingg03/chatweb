package com.demo.context;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class DBContext {
    
    public static void main(String[] args) {
    	try {
            Class.forName("com.mysql.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/chat", "root", "");
            Statement stmt = con.createStatement();
            
            
            
            ResultSet rs = stmt.executeQuery("select * from user");
            while (rs.next()) {
                String username = rs.getString(1); 
                String password = rs.getString(2);
                String is = rs.getString(3);
      
                System.out.println(username + " " + password + " " + is);
            }
            
            con.close();
        } catch (Exception e) {
            System.out.println(e);
        }
	}
}
