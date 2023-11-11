<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">


<link rel="stylesheet" type="text/css"
	href="<c:url value="/template/web/css/style.css"/>" />

<link rel="icon" type="image/png"
	href="<c:url value="/template/web/images/icon.jpg"/>" />

<title>Login</title>
</head>
<body>
	<h1>${message}</h1>
	
	<div class="container">
		<div class="form-container">
			<h2 class="form-title">Star Messenger</h2>
			<div class="tab-control">
				<h3 class="active tab-control-btn login">Sign in</h3>
				<h3 class="tab-control-btn register">
					<a href="<c:url value="/users/register"/>" style="color: white;">Sign
						up</a>
				</h3>
			</div>
			<div class="login-form form active">
				<p style="color: red; font-size: 15px; margin-left: 70px;">${messageError}</p>
				<form action="<c:url value="/chat" />" method="POST">
					<input type="text" class="txt-input border" placeholder="Username"
						name="username"> <input type="password"
						class="txt-input border" placeholder="Password" name="password">
					<button type="submit" class="btn btn-login border">Sign in</button>
				</form>
			</div>
		</div>
	</div>

</body>
</html>