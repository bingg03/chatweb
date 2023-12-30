package com.demo.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class UserService {
	public void createUserFolder(String username, String password, String avatar) {
		
	        String baseDirectory = "D:\\xampp\\htdocs\\file\\avatar";
	        createAvatarDirectory(baseDirectory, username);
	        
	        String userDirectoryPath = Paths.get(baseDirectory, username).toString();
	        String avatarPath = "D:\\xampp\\htdocs\\file\\" + avatar;

	        
	        try {
	            Path sourcePath = Paths.get(avatarPath);
	            Path destinationPath = Paths.get(userDirectoryPath, avatar);

	            Files.copy(sourcePath, destinationPath, StandardCopyOption.REPLACE_EXISTING);
	            
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	}

	private static void createAvatarDirectory(String baseDirectory, String username) {
        String userDirectoryPath = Paths.get(baseDirectory, username).toString();

        
        Path userDirectory = Paths.get(userDirectoryPath);

        try {
            
            if (!Files.exists(userDirectory)) {
                Files.createDirectories(userDirectory);
                
            } else {
            	
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
