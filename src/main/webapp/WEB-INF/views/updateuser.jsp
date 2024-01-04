<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="<c:url value="/template/web/css/style.css" />">
<link rel="icon" type="image/png"
	href="<c:url value="/template/web/images/icon.jpg" />">

<title>Update User</title>
</head>
<body>
	<div class="container">
		<div class="form-container">
			<div class="tab-control">
				<h3 class="tab-control-btn register">Update your information</h3>
			</div>
			<div class="register-form form active">
				<form action="" enctype="multipart/form-data" method="POST">
					
					<input type="text" class="txt-input border"
                        placeholder="Username" name="oldusername" value="${username}" style="display: none;"> 
                	
					
					<input type="text" class="txt-input border"
								placeholder="Username" name="username" value="${username}"> 
					 
					<input type="password" class="txt-input border"
						placeholder="Password" name="password"> <input
						type="password" class="txt-input border" placeholder="Re Password">
					
					<input type="text" class="txt-input border"
                        placeholder="" name="oldavatar" value="${oldavatar}" style="display: none;"> 
					<label for="image"> <img
						src="${linkimage}"
						class="image-profile" alt="">
					</label> <input type="file" accept="image/*" name="avatar" id="image"
						class="image-file">

					<button type="submit" class="btn btn-login border">Update</button>
					
				</form>
				
				<form id="hiddenForm" action="<c:url value='/update-user' />" method="post">
    				<input type="hidden" name="oldusername" id="oldusername" value="">
    				<input type="hidden" name="username" id="username" value="">
    				<input type="hidden" name="password" id="password" value="">
    				<input type="hidden" name="avatar" id="avatar" value="">
				</form>
				
			</div>
		</div>
	</div>

	<script type="text/javascript"
		src="<c:url value="/template/web/js/user-form.js" />" charset="utf-8"></script>
		
	<script type="text/javascript">
		document.addEventListener("DOMContentLoaded", function() {
			// Lấy ra biểu mẫu
			var form = document.querySelector('.register-form form');

			// Thêm sự kiện submit cho biểu mẫu
			form.addEventListener('submit', function(event) {
				// Ngăn chặn hành động mặc định của biểu mẫu (tránh tải lại trang)
				event.preventDefault();
				
				var oldusername = form.querySelector('[name="oldusername"]').value;
				var oldavatar = form.querySelector('[name="oldavatar"]').value;
				// Lấy giá trị từ trường username
				var username = form.querySelector('[name="username"]').value;

				// Lấy giá trị từ trường password
				var password = form.querySelector('[name="password"]').value;

				// Lấy giá trị từ trường avatar
				var avatar = form.querySelector('[name="avatar"]').value;
				var completeAvatar;
				// Hiển thị giá trị trên console
				if(avatar === "") {
					completeAvatar = oldavatar;
				} else {
					completeAvatar = avatar.substring(12);
				}
				var hostname = "https://7c75lr-3000.csb.app/";
				console.log('Old username' + oldusername);
				console.log('Username: ' + username);
				console.log('Password: ' + password);
				console.log('New Avatar: ' + completeAvatar);
				
				
				//cap nhat messages
				fetch(hostname + "messages")
				.then(function(data) {
					return data.json();
				})
				.then(data => {
					
					const updateData1 = {
						sender: username
					};
					const updateData2 = {
						receiver: username		
					};
					
					data.forEach(message => {
			            // Kiểm tra điều kiện và thực hiện PATCH
			            if (message.sender === oldusername){
			                fetch(hostname + "messages/" + message.id, {
			                    method: 'PATCH',
			                    headers: {
			                        'Content-Type': 'application/json;charset=utf-8'
			                    },
			                    body: JSON.stringify(updateData1)
			                })
			                    .then(response => response.json())
			                    .then(updatedData => {
			                        //console.log(`PATCH successful for message with ID ${message.id}`);
			                    })
			                    .catch(error => {
			                        //console.error(`Error PATCHing message with ID ${message.id}:`, error);
			                    });
			            }

			            if (message.receiver === oldusername) {
			                fetch(hostname + "messages/" + message.id, {
			                    method: 'PATCH',
			                    headers: {
			                        'Content-Type': 'application/json;charset=utf-8'
			                    },
			                    body: JSON.stringify(updateData2)
			                })
			                    .then(response => response.json())
			                    .then(updatedData => {
			                        //console.log(`PATCH successful for message with ID ${message.id}`);
			                    })
			                    .catch(error => {
			                        //console.error(`Error PATCHing message with ID ${message.id}:`, error);
			                    });
			            }
			        });
				}).catch(ex => {
					console.log(ex);
				});
				
				
				//cap nhat friends
				fetch(hostname + "friends")
				.then(function(data) {
					return data.json();
				})
				.then(data => {
					
					const updateData1 = {
						sender: username
					};
					const updateData2 = {
						receiver: username		
					};
					
					data.forEach(friend => {
			            // Kiểm tra điều kiện và thực hiện PATCH
			            if (friend.sender === oldusername){
			                fetch(hostname + "friends/" + friend.id, {
			                    method: 'PATCH',
			                    headers: {
			                        'Content-Type': 'application/json;charset=utf-8'
			                    },
			                    body: JSON.stringify(updateData1)
			                })
			                    .then(response => response.json())
			                    .then(updatedData => {
			                        //console.log(`PATCH successful for message with ID ${message.id}`);
			                    })
			                    .catch(error => {
			                        //console.error(`Error PATCHing message with ID ${message.id}:`, error);
			                    });
			            }

			            if (friend.receiver === oldusername) {
			                fetch(hostname + "friends/" + friend.id, {
			                    method: 'PATCH',
			                    headers: {
			                        'Content-Type': 'application/json;charset=utf-8'
			                    },
			                    body: JSON.stringify(updateData2)
			                })
			                    .then(response => response.json())
			                    .then(updatedData => {
			                        //console.log(`PATCH successful for message with ID ${message.id}`);
			                    })
			                    .catch(error => {
			                        //console.error(`Error PATCHing message with ID ${message.id}:`, error);
			                    });
			            }
			        });
				}).catch(ex => {
					console.log(ex);
				});
				
				//cap nhat conversations_users
				fetch(hostname + "conversations_users")
				.then(function(data) {
					return data.json();
				})
				.then(data => {
					
					const updateData = {
						username: username
					};
					
					
					data.forEach(user => {
			            // Kiểm tra điều kiện và thực hiện PATCH
			            if (user.username === oldusername){
			                fetch(hostname + "conversations_users/" + user.id, {
			                    method: 'PATCH',
			                    headers: {
			                        'Content-Type': 'application/json;charset=utf-8'
			                    },
			                    body: JSON.stringify(updateData)
			                })
			                    .then(response => response.json())
			                    .then(updatedData => {
			                        //console.log(`PATCH successful for message with ID ${message.id}`);
			                    })
			                    .catch(error => {
			                        //console.error(`Error PATCHing message with ID ${message.id}:`, error);
			                    });
			            }

			        });
				}).catch(ex => {
					console.log(ex);
				});
				
				let alluser;
				//cap nhat user
				fetch(hostname + "user")
				.then(function(data) {
					return data.json();
				})
				.then(data => {
					alluser = data;
					let userCurrent = data.find(user => user.username === oldusername);
					const updateData = {
							username: username,
							password: password,
							avatar: completeAvatar
						};
					console.log(updateData);
					console.log(userCurrent);
					console.log(userCurrent.id);
						fetch(hostname + "user/" + userCurrent.id, {
							method: 'PATCH',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(updateData),
						})
							.then(response => response.json())
							.then(data => {
								/*
								var redirectURL = "<c:url value='/update-user' />";  
				                
				                redirectURL += '?oldusername=' + encodeURIComponent(oldusername) +
				                				'&username=' + encodeURIComponent(username) +
				                               '&password=' + encodeURIComponent(password) +
				                               '&avatar=' + encodeURIComponent(completeAvatar);

				      			
				                window.location.href = redirectURL;
				                */
				                
								document.getElementById("oldusername").value = oldusername;
								document.getElementById("username").value = username;
								document.getElementById("password").value = password;
								document.getElementById("avatar").value = completeAvatar;
								document.getElementById("hiddenForm").submit();
								
				                
							})
							.catch(error => {
							});
					
				}).catch(ex => {
					console.log(ex);
				});
				
				
				
				 
				
				
			});
		});
	</script>
</body>
</html>