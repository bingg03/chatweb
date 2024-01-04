document.addEventListener("DOMContentLoaded", function() {
			// Lấy ra biểu mẫu
			var form = document.querySelector('.register-form form');

			// Thêm sự kiện submit cho biểu mẫu
			form.addEventListener('submit', function(event) {
				// Ngăn chặn hành động mặc định của biểu mẫu (tránh tải lại trang)
				event.preventDefault();

				// Lấy giá trị từ trường username
				var username = form.querySelector('[name="username"]').value;

				// Lấy giá trị từ trường password
				var password = form.querySelector('[name="password"]').value;

				// Lấy giá trị từ trường avatar
				var avatar = form.querySelector('[name="avatar"]').value;

				// Hiển thị giá trị trên console
				console.log('Username: ' + username);
				console.log('Password: ' + password);
				console.log('Avatar: ' + avatar);
				
				
				var completeAvatar = avatar.substring(12);
				
				var object = {
						username: username,
						password: password,
						avatar: completeAvatar,
						online: 0
				}
				fetch("https://7c75lr-3000.csb.app/user", {
				    method: "post",
				    cache: 'no-cache',
				    headers: {
				        'Content-Type': 'application/json;charset=utf-8'
				    },
				    body: JSON.stringify(object)
				})
				    .then(function(response) {
				        if (!response.ok) {
				            throw new Error('Network response was not ok');
				        }
				        return response.json();
				    })
				    .then(function(data) {
				        console.log(data);
				    })
				    .catch(function(error) {
				        console.error('There has been a problem with your fetch operation:', error);
				    });
		        
		        var redirectURL = "<c:url value='/registerservlet' />";  
		                
		        redirectURL += '?username=' + encodeURIComponent(username) +
		                       '&password=' + encodeURIComponent(password) +
		                       '&avatar=' + encodeURIComponent(avatar);

		      			
		        window.location.href = redirectURL;
		            
				
			});
		});