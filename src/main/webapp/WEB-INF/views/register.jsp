<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet"
	href="<c:url value="/template/web/css/style.css" />">
<link rel="icon" type="image/png"
	href="<c:url value="/template/web/images/icon.jpg" />">

<title>Register User</title>
</head>
<body>
	<div class="container">
		<div class="form-container">
			<div class="tab-control">
				<h3 class="tab-control-btn register">Enter your information</h3>
			</div>
			<div class="register-form form active">
				<form action="<c:url value="/registerservlet" />"
					enctype="multipart/form-data" method="POST">

					<input type="text" class="txt-input border"
						placeholder="Username" name="username"> <input
						type="password" class="txt-input border" placeholder="Password"
						name="password"> <input type="password"
						class="txt-input border" placeholder="Re Password"> <label
						for="image"> <img
						src="<c:url value="/template/web/images/user-male.jpg" />"
						class="image-profile" alt="">
					</label> <input type="file" accept="image/*" name="avatar" id="image"
						class="image-file">

					<button type="submit" class="btn btn-login border">Register</button>

					<a href="<c:url value="/login" />" class="btn btn-login border"
						style="background-color: grey; text-align: center;">Go back</a>

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
				
				var socket = new WebSocket('ws://localhost:8080/spring-mvc/ChatSocket');
				// Kiểm tra nếu chưa có kết nối WebSocket hoặc đang ở trạng thái CONNECTING
		        if (!socket || socket.readyState === WebSocket.CONNECTING) {
		            // Tạo đối tượng WebSocket
		            socket = new WebSocket('ws://localhost:8080/spring-mvc/ChatSocket');

		            // Xử lý sự kiện khi WebSocket đã kết nối
		            socket.onopen = function(event) {
		                // Gửi dữ liệu thông điệp sau khi kết nối thành công
		                socket.send('?' + username + ',' + password + ',' + avatar);

		                var redirectURL = "<c:url value='/registerservlet' />";  // Chắc chắn rằng cú pháp JSTL này hoạt động như mong đợi

		                // Tạo URL với tham số
		                redirectURL += '?username=' + encodeURIComponent(username) +
		                               '&password=' + encodeURIComponent(password) +
		                               '&avatar=' + encodeURIComponent(avatar);

		                // Chuyển hướng tới URL mới
		                window.location.href = redirectURL;
		            };
		        } else if (socket.readyState === WebSocket.OPEN) {
		            // Nếu WebSocket đã ở trạng thái OPEN, gửi dữ liệu thông điệp
		            socket.send('?' + username + ',' + password + ',' + avatar);

		         // Thêm chúng vào URL
		            var redirectURL = "<c:url value='/registerservlet' />";  // Chắc chắn rằng cú pháp JSTL này hoạt động như mong đợi

		            // Tạo URL với tham số
		            redirectURL += '?username=' + encodeURIComponent(username) +
		                           '&password=' + encodeURIComponent(password) +
		                           '&avatar=' + encodeURIComponent(avatar);

		            // Chuyển hướng tới URL mới
		            window.location.href = redirectURL;
		        }
				
			});
		});
	</script>
</body>
</html>