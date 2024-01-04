var socket = new WebSocket('ws://192.168.225.1:8080/spring-mvc/ChatSocket');

var hostname = 'https://7c75lr-3000.csb.app/';
var server_name = 'http://192.168.225.1/file/';

var receiver = null;
var username = null;

var userAvatar = null;
var receiverAvatar = null;

var groupName = null;
var groupId = null;

var back = null;
var rightSide = null;
var leftSide = null;
var conversation = null;

var attachFile = null;
var imageFile = null;
var file = null;
var listFile = [];
var typeFile = "image";
var deleteAttach = null;

var typeChat = "user";

var listUserAdd = [];
var listUserDelete = [];
var numberMember = 0;

let allgroup;
let allconversations_users;
let alluser;
let relationship;
let friends;

socket.onopen = function(event) {
	username = document.getElementById("username").textContent;
	userAvatar = document.getElementById("userAvatar").textContent;

	//patch
	fetch(hostname + "user")
				.then(function(data) {
					return data.json();
				})
				.then(data => {
					
					const updateData = {
						online: 1
					};
					
					
					data.forEach(user => {
			            // Kiểm tra điều kiện và thực hiện PATCH
			            if (user.username === username){
			                fetch(hostname + "user/" + user.id, {
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
	//
	
	console.log(username);
	console.log(leftSide);
	console.log(rightSide);
	socket.send("#" + username);
	socket.send("+" + username);
	fetch(hostname + 'user')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			alluser = data;
		}).catch(ex => {
			console.log(ex);
		});

	fetch(hostname + 'friends')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			friends = data;
		}).catch(ex => {
			console.log(ex);
		});
};

function LogOut() {
	username = document.getElementById("username").textContent;
	console.log("-" + username);
	socket.send("-" + username);
	//patch
	fetch(hostname + "user")
				.then(function(data) {
					return data.json();
				})
				.then(data => {
					
					const updateData = {
						online: 0
					};
					
					
					data.forEach(user => {
			            // Kiểm tra điều kiện và thực hiện PATCH
			            if (user.username === username){
			                fetch(hostname + "user/" + user.id, {
			                    method: 'PATCH',
			                    headers: {
			                        'Content-Type': 'application/json;charset=utf-8'
			                    },
			                    body: JSON.stringify(updateData)
			                })
			                    .then(response => response.json())
			                    .then(updatedData => {
			                        //console.log(`PATCH successful for message with ID ${message.id}`);
			                        window.location.href = "/spring-mvc/login";
			                    })
			                    .catch(error => {
			                        //console.error(`Error PATCHing message with ID ${message.id}:`, error);
			                    });
			            }

			        });
				}).catch(ex => {
					console.log(ex);
				});
	//
	
}

socket.onmessage = function(event) {
	var message = event.data;
	try {
		const messageJSON = JSON.parse(message);


		var messageType = messageJSON.type;

		var messageContent = messageJSON.message;
		//console.log(messageJSON.message);
		if (messageType.startsWith("text")) {

		} else if (messageType.startsWith("audio")) {
			messageJSON.message = '<audio controls>'
				+ '<source src="' + server_name + messageContent + '" type="' + messageType + '">'
				+ '</audio>';
		} else if (messageType.startsWith("video")) {
			messageJSON.message = '<video width="400" controls>'
				+ '<source src="' + server_name + messageContent + '" type="' + messageType + '">'
				+ '</video>';
		} else if (messageType.startsWith("image")) {
			messageJSON.message = '<img src="' + server_name + messageContent +
				'" type="' + messageType + '" alt="">';
		}
		else {
			messageJSON.message = '<a href= "' + server_name + messageContent + '">' + messageContent + '</a>'
		}

		console.log(messageJSON);

		var currentChat = document.getElementById('chat').innerHTML;
		var newChatMsg = '';

		let avatar_withName = alluser.find(user => user.username === messageJSON.username);

		if (messageJSON.groupId != 0) {
			newChatMsg = customLoadMessageGroup(messageJSON.username, messageJSON.groupId, messageJSON.message, avatar_withName.avatar);
			//console.log("Da chat group here");
			//console.log(messageJSON.groupId);
		}
		else {
			newChatMsg = customLoadMessage(messageJSON.username, messageJSON.message);
			//console.log("Da chat user here");
			//console.log(messageJSON.groupId);
		}
		document.getElementById('chat').innerHTML = currentChat
			+ newChatMsg;
		goLastestMsg();

	} catch (error) {
		console.error('Error parsing JSON:', error);
		console.log(message);
		if(message.startsWith("+")) {
			setOnline(message.substring(1), true);
		} else if(message.startsWith("-")) {
			setOnline(message.substring(1), false);
		}
	}
};

function cleanUp() {
	username = null;
	socket = null;
	receiver = null;
}

function setReceiver(element) {
	groupId = null;
	receiver = element.id;
	receiverAvatar = document.getElementById('img-' + receiver).src;
	console.log(receiver);
	var status = '';
	if (document.getElementById('status-' + receiver).classList.contains('online')) {
		status = 'online';
	}

	var rightSide = '<div class="user-contact">' + '<div class="back">'
		+ '<i class="fa fa-arrow-left"></i>'
		+ '</div>'
		+ '<div class="user-contain">'
		+ '<div class="user-img">'
		+ '<img src="' + receiverAvatar + '" '
		+ 'alt="Image of user">'
		+ '<div class="user-img-dot ' + status + '"></div>'
		+ '</div>'
		+ '<div class="user-info">'
		+ '<span class="user-name">' + receiver + '</span>'
		+ '</div>'
		+ '</div>'
		+ '<div class="setting">'
		+ '<i class="fa fa-cog"></i>'
		+ '</div>'
		+ '</div>'
		+ '<div class="list-messages-contain">'
		+ '<ul id="chat" class="list-messages">'
		+ '</ul>'
		+ '</div>'
		+ '<form class="form-send-message" onsubmit="return sendMessage(event)">'
		+ '<ul class="list-file"></ul> '
		+ '<input type="text" id="message" class="txt-input" placeholder="Type message...">'
		+ '<label class="btn btn-image" for="attach"><i class="fa fa-file"></i></label>'
		+ '<input type="file" multiple id="attach">'
		+ '<label class="btn btn-image" for="image"><i class="fa fa-file-image-o"></i></label>'
		+ '<input type="file" accept="image/*" multiple id="image">'
		+ '<button type="submit" class="btn btn-send">'
		+ '<i class="fa fa-paper-plane"></i>'
		+ '</button>'
		+ '</form>';

	document.getElementById("receiver").innerHTML = rightSide;

	loadMessages();

	displayFiles();

	handleResponsive();
	makeFriend(rightSide);
}

function makeFriend(rightSide) {
	fetch(hostname + "friends?sender=" + username + "&receiver=" + receiver)
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			var status = '';
			if (document.getElementById('status-' + receiver).classList.contains('online')) {
				status = 'online';
			}
			if (!data || data.length === 0) {
				rightSide = '<div class="user-contact">' + '<div class="back">'
					+ '<i class="fa fa-arrow-left"></i>'
					+ '</div>'
					+ '<div class="user-contain">'
					+ '<div class="user-img">'
					+ '<img src="' + receiverAvatar + '" '
					+ 'alt="Image of user">'
					+ '<div class="user-img-dot ' + status + '"></div>'
					+ '</div>'
					+ '<div class="user-info">'
					+ '<span class="user-name">' + receiver + '</span>'
					+ '</div>'
					+ '</div>'
					+ '<form id="addFriendForm" action="" method="post" >'
					+ '<input type="hidden" name="sender" value="' + username + '">'
					+ '<input type="hidden" name="receiver" value="' + receiver + '">'
					+ '<input type="hidden" name="status" value="false">'
					+ '<input type="hidden" name="isAccept" value="false">'
					+ '<input class="btn" type="submit" value="Add Friend">'
					+ '</form>'
					+ '</div>'
					+ '<div class="list-messages-contain">'
					+ '<ul id="chat" class="list-messages">'
					+ '</ul>'
					+ '</div>';
				document.getElementById("receiver").innerHTML = rightSide;

				document.getElementById("addFriendForm").addEventListener("submit", function(event) {
					event.preventDefault(); // Ngăn chặn form gửi yêu cầu mặc định
					UserAddFriend(); // Gọi hàm addFriend khi form được submit
				});
			} else {
				if (data[0].status === 2) {
					rightSide = '<div class="user-contact">' + '<div class="back">'
						+ '<i class="fa fa-arrow-left"></i>'
						+ '</div>'
						+ '<div class="user-contain">'
						+ '<div class="user-img">'
						+ '<img src="' + receiverAvatar + '" '
						+ 'alt="Image of user">'
						+ '<div class="user-img-dot ' + status + '"></div>'
						+ '</div>'
						+ '<div class="user-info">'
						+ '<span class="user-name">' + receiver + '</span>'
						+ '</div>'
						+ '</div>'
						+ '<span style="font-size:1.8rem">Sent Request</span>'
						+ '</form>'
						+ '</div>'
						+ '<div class="list-messages-contain">'
						+ '<ul id="chat" class="list-messages">'
						+ '</ul>'
						+ '</div>';

					document.getElementById("receiver").innerHTML = rightSide;

				} else if (data[0].status === 0) {
					rightSide = '<div class="user-contact">' + '<div class="back">'
						+ '<i class="fa fa-arrow-left"></i>'
						+ '</div>'
						+ '<div class="user-contain">'
						+ '<div class="user-img">'
						+ '<img src="' + receiverAvatar + '" '
						+ 'alt="Image of user">'
						+ '<div class="user-img-dot ' + status + '"></div>'
						+ '</div>'
						+ '<div class="user-info">'
						+ '<span class="user-name">' + receiver + '</span>'
						+ '</div>'
						+ '</div>'
						+ '<form id="acceptFriendForm" action="" method="post" >'
						+ '<input type="hidden" name="sender" value="' + username + '">'
						+ '<input type="hidden" name="receiver" value="' + receiver + '">'
						+ '<input type="hidden" name="status" value="true">'
						+ '<input type="hidden" name="isAccept" value="true">'
						+ '<input class="btn" type="submit" value="Accept Friend Request">'
						+ '</form>'
						+ '</div>'
						+ '<div class="list-messages-contain">'
						+ '<ul id="chat" class="list-messages">'
						+ '</ul>'
						+ '</div>';
					document.getElementById("receiver").innerHTML = rightSide;
					document.getElementById("acceptFriendForm").addEventListener("submit", function(event) {
						event.preventDefault(); // Ngăn chặn form gửi yêu cầu mặc định
						UserAcceptFriend(); // Gọi hàm addFriend khi form được submit
					});
				}
			}
			handleResponsive();
		})
		.catch(ex => console.log(ex));
}

function UserAddFriend() {
	console.log("user dang add friend");
	socket.send("&" + username + "," + receiver);
	fetch(hostname + 'user')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			alluser = data;
		}).catch(ex => {
			console.log(ex);
		});
	let online_username = alluser.find(user => user.username === username);
	let online_receiver = alluser.find(user => user.username === receiver);

	const url = hostname + "friends";
	const xhttp = new XMLHttpRequest();
	xhttp.open("POST", url);
	var data = {
		sender: username,
		receiver: receiver,
		status: 2,
		online: online_username.online
	}
	xhttp.responseType = 'json';
	if (data) { xhttp.setRequestHeader('Content-Type', 'application/json'); }
	xhttp.send(JSON.stringify(data));

	
	const xhttp1 = new XMLHttpRequest();
	xhttp1.open("POST", url);
	var data1 = {
		sender: receiver,
		receiver: username,
		status: 0,
		online: online_receiver.online
	}
	xhttp1.responseType = 'json';
	if (data1) { xhttp1.setRequestHeader('Content-Type', 'application/json'); }
	xhttp1.send(JSON.stringify(data1));

	resetChat();
	searchFriendByKeyword("");
	rightSide = null;
	document.getElementById("receiver").innerHTML = rightSide;
}
function UserAcceptFriend() {
	console.log("user dang accept friend");
	socket.send("!" + username + "," + receiver);
	let pair_friend1 = friends.find(friend => (friend.sender === username && friend.receiver === receiver));

	let pair_friend2 = friends.find(friend => (friend.sender === receiver && friend.receiver === username));

	const updatedData = {
		status: 1
	};
	fetch(`${hostname}friends/${pair_friend1.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedData),
	})
		.then(response => response.json())
		.then(data => {
		})
		.catch(error => {
		});

	fetch(`${hostname}friends/${pair_friend2.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedData),
	})
		.then(response => response.json())
		.then(data => {
		})
		.catch(error => {
		});

	rightSide = null;
	document.getElementById("receiver").innerHTML = rightSide;
}

function setGroup(element) {
	//console.log("hihihi");
	receiver = null;
	groupName = element.getAttribute("data-name");
	groupId = element.getAttribute("data-id");
	console.log(groupName);
	console.log(groupId);
	receiverAvatar = document.getElementById("img-group-" + groupId).src;

	listUserAdd = [];

	numberMember = parseInt(element.getAttribute("data-number"));


	fetch(hostname + "conversations?id=" + groupId)
		.then(data => data.json())
		.then(data => {
			let isAdmin = false;
			if (username === "admin") isAdmin = true;

			var rightSide = '<div class="user-contact">' + '<div class="back">'
				+ '<i class="fa fa-arrow-left"></i>'
				+ '</div>'
				+ '<div class="user-contain">'
				+ '<div class="user-img">'
				+ '<img id="img-group-' + groupId + '" src="' + receiverAvatar + '"'
				+ 'alt="Image of user">'
				+ '</div>'
				+ '<div class="user-info">'
				+ '<a href="http://' + window.location.host + '/conversation?conversationId=' + groupId + '" class="user-name">' + groupName + '</a>'
				+ '</div>'
				+ '</div>'
				+ '<div class="invite-user">'
				+ '<span class="total-invite-user">' + numberMember + ' paticipants</span>'
				+ '<span data-id="add-user" onclick="toggleModal(this, true); searchMemberByKeyword(``);" class="invite toggle-btn">Invite</span>'
				+ '</div>'
				+ '<div class="setting toggle-btn" data-id="manage-user" onclick="toggleModal(this, true);  fetchUser();">'
				+ '<i class="fa fa-cog"></i>'
				+ '</div>'
				+ '</div>'
				+ '<div class="list-messages-contain">'
				+ '<ul id="chat" class="list-messages">'
				+ '</ul>'
				+ '</div>'
				+ '<form class="form-send-message" onsubmit="return sendMessage(event)">'
				+ '<ul class="list-file"></ul> '
				+ '<input type="text" id="message" class="txt-input" placeholder="Type message...">'
				+ '<label class="btn btn-image" for="attach"><i class="fa fa-file"></i></label>'
				+ '<input type="file" multiple id="attach">'
				+ '<label class="btn btn-image" for="image"><i class="fa fa-file-image-o"></i></label>'
				+ '<input type="file" accept="image/*" multiple id="image">'
				+ '<button type="submit" class="btn btn-send">'
				+ '<i class="fa fa-paper-plane"></i>'
				+ '</button>'
				+ '</form>';

			document.getElementById("receiver").innerHTML = rightSide;

			loadMessagesGroup();

			displayFiles();

			handleResponsive();
		})
		.catch(ex => console.log(ex));
}

function sendMessage(e) {
	e.preventDefault();
	
	fetch(hostname + 'user')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			alluser = data;
		}).catch(ex => {
			console.log(ex);
		});
		
	var inputText = document.getElementById("message").value;

	if (inputText != '') {
		sendText();
	} else {
		sendAttachments();
	}

}
function sendText() {
	//console.log("đang gửi");
	var messageContent = document.getElementById("message").value;
	var messageType = "text";
	document.getElementById("message").value = '';
	var message = buildMessageToJson(messageContent, messageType);
	setMessage(message);
	console.log(message);
	socket.send(JSON.stringify(message));

	const url = hostname + "messages";
	const xhttp = new XMLHttpRequest();
	xhttp.open("POST", url);
	var data = {
		sender: message.username,
		receiver: message.receiver,
		group_id: message.groupId,
		message: message.message,
		message_type: message.type
	}
	xhttp.responseType = 'json';
	if (data) { xhttp.setRequestHeader('Content-Type', 'application/json'); }
	xhttp.send(JSON.stringify(data));

}

function sendAttachments() {
	var messageType = "attachment";
	for (file of listFile) {
		messageContent = file.name.trim();
		messageType = file.type;
		var message = buildMessageToJson(messageContent, messageType);
		
		console.log(messageType);
		console.log(messageContent);
		
		if(messageType.startsWith("image")) {
			
		} else {
			socket.send('filename:' + messageContent);
			var reader = new FileReader();
			var rawData = new ArrayBuffer();
			reader.loadend = function() {
	
			}
			reader.onload = function(e) {
				rawData = e.target.result;
				socket.send(rawData);
				socket.send('filename:end');
			}
			reader.readAsArrayBuffer(file);
		}
		/*
		socket.send('filename:' + messageContent);
		var reader = new FileReader();
		var rawData = new ArrayBuffer();
		reader.loadend = function() {

		}
		reader.onload = function(e) {
			rawData = e.target.result;
			socket.send(rawData);
			socket.send('filename:end');
		}

		reader.readAsArrayBuffer(file);
		*/
		//socket.send(JSON.stringify(message));

		
		let src_file = server_name + messageContent;
		if (messageType.startsWith("audio")) {
			message.message = '<audio controls>'
				+ '<source src="' + src_file + '" type="' + messageType + '">'
				+ '</audio>';
		} else if (messageType.startsWith("video")) {
			message.message = '<video width="400" controls>'
				+ '<source src="' + src_file + '" type="' + messageType + '">'
				+ '</video>';
		} else if (messageType.startsWith("image")) {
			message.message = '<img src="' + src_file + '" alt="">';
		}
		else {
			message.message = '<a href= "' + src_file + '">' + messageContent + '</a>'
		}
		console.log(message.message);
		setMessage(message);

		const url = hostname + "messages";
		const xhttp = new XMLHttpRequest();
		xhttp.open("POST", url);
		var data = {
			sender: message.username,
			receiver: message.receiver,
			group_id: message.groupId,
			message: message.message,
			message_type: message.type
		}
		xhttp.responseType = 'json';
		if (data) { xhttp.setRequestHeader('Content-Type', 'application/json'); }
		xhttp.send(JSON.stringify(data));

	}

	for (file of listFile) {
		messageContent = file.name.trim();
		messageType = file.type;
		var message = buildMessageToJson(messageContent, messageType);
		socket.send(JSON.stringify(message));
	}


	file = document.querySelector(".list-file");
	file.classList.remove("active");
	file.innerHTML = "";
	listFile = [];
}

function buildMessageToJson(message, type) {
	return {
		username: username,
		message: message,
		type: type,
		receiver: receiver,
		groupId: Number(groupId)
	};
}

function displayFiles() {
	attachFile = document.getElementById("attach");
	imageFile = document.getElementById("image");
	file = document.querySelector(".list-file");
	deleteAttach = document.querySelectorAll(".delete-attach");

	attachFile.addEventListener("change", function(e) {
		let filesInput = e.target.files;

		for (const file of filesInput) {
			listFile.push(file);
		}

		typeFile = "file";
		renderFile("attach");

		this.value = null;
	});

	imageFile.addEventListener("change", function(e) {
		let filesImage = e.target.files;

		for (const file of filesImage) {
			listFile.push(file);
		}
		typeFile = "image";
		renderFile("image");
		this.value = null;
	});



}

function deleteFile(idx) {
	if (!isNaN(idx)) listFile.splice(idx, 1);
	renderFile(typeFile);
}

function renderFile(typeFile) {
	let listFileHTML = "";
	let idx = 0;

	if (typeFile == "image") {
		for (const file of listFile) {
			listFileHTML += '<li><img src="' + URL.createObjectURL(file)
				+ '" alt="Image file"><span data-idx="'
				+ (idx) + '" onclick="deleteFile('
				+ idx + ')" class="delete-attach">X</span></li>';
			idx++;
		}
	} else {
		for (const file of listFile) {
			listFileHTML += '<li><div class="file-input">' + file.name
				+ '</div><span data-idx="'
				+ (idx) + '" onclick="deleteFile('
				+ idx + ')" class="delete-attach">X</span></li>';
			idx++;
		}
	}


	if (listFile.length == 0) {
		file.innerHTML = "";
		file.classList.remove("active");
	} else {
		file.innerHTML = listFileHTML;
		file.classList.add("active");
	}

	deleteAttach = document.querySelectorAll(".delete-attach");
}




function setMessage(msg) {
	var currentChat = document.getElementById('chat').innerHTML;
	var newChatMsg = '';
	if (msg.groupId == 0) {
		//console.log("Đang custom User");
		newChatMsg = customLoadMessage(msg.username, msg.message);
	} else {
		//console.log("Đang custom Group")
		let avatar_withName = alluser.find(user => user.username === msg.username);
		newChatMsg = customLoadMessageGroup(msg.username, msg.groupId, msg.message, avatar_withName.avatar);
	}
	document.getElementById('chat').innerHTML = currentChat
		+ newChatMsg;
	goLastestMsg();
	//goLastestMsg();
}

function customLoadMessage(sender, message) {
	var imgSrc = receiverAvatar;
	var msgDisplay = '<li>'
		+ '<div class="message';
	if (receiver != sender && username != sender) {
		return '';
	}
	else if (receiver == sender) {
		msgDisplay += '">';
	} else {
		console.log(userAvatar);
		//console.log(userAvatar.substring(21));
		imgSrc = server_name + "avatar/" + userAvatar.substring(21);
		msgDisplay += ' right">';
	}
	return msgDisplay + '<div class="message-img">'
		+ '<img src="' + imgSrc + '" alt="">'
		+ ' </div>'
		+ '<div class="message-text">' + message + '</div>'
		+ '</div>'
		+ '</li>';
}

function customLoadMessageGroup(sender, groupIdFromServer, message, avatar) {
	console.log(sender + "," + groupIdFromServer + "," + message + "," + avatar);
	let imgSrc = server_name + "avatar/" + sender + "/" + avatar;
	var msgDisplay = '<li>'
		+ '<div class="message';
	if (groupIdFromServer != groupId) {
		return '';
	}
	if (username != sender) {
		msgDisplay += '">';
	} else {
		//imgSrc = userAvatar;
		imgSrc = server_name + "avatar/" + userAvatar.substring(21);
		msgDisplay += ' right">';
	}
	return msgDisplay + '<div class="message-img">'
		+ '<img src="' + imgSrc + '" alt="">'
		+ '<div class="sender-name">' + sender + '</div>'
		+ ' </div>'
		+ '<div class="message-text">' + message + '</div>'
		+ '</div>'
		+ '</li>';
}


function goLastestMsg() {
	var msgLiTags = document.querySelectorAll(".message");
	var last = msgLiTags[msgLiTags.length - 1];
	try {
		last.scrollIntoView();
	} catch (ex) { }
}

function loadMessagesGroup() {
	var currentChatbox = document.getElementById("chat");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var messages = JSON.parse(this.responseText);
			var chatbox = "";
			messages.forEach(msg => {
				try {
					let avatar_withName = alluser.find(user => user.username === msg.sender);
					chatbox += customLoadMessageGroup(msg.sender, msg.group_id, msg.message, avatar_withName.avatar);
				} catch (ex) {

				}
			});
			currentChatbox.innerHTML = chatbox;
			goLastestMsg();
		}
	};
	xhttp.open("GET", hostname + "messages?group_id=" + groupId, true);
	xhttp.send();
}

function loadMessages() {
	var currentChatbox = document.getElementById("chat");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var messages = JSON.parse(this.responseText);
			var chatbox = "";
			messages.forEach(msg => {
				try {
					if ((msg.sender === username && msg.receiver === receiver)
						|| (msg.sender === receiver && msg.receiver === username)) {
						chatbox += customLoadMessage(msg.sender, msg.message);
					}

					//chatbox += customLoadMessage(msg.username, msg.message);
				} catch (ex) {

				}
			});
			currentChatbox.innerHTML = chatbox;
			goLastestMsg();
		}
	};
	xhttp.open("GET", hostname + "messages", true);
	xhttp.send();
}



function displayFiles() {
	attachFile = document.getElementById("attach");
	imageFile = document.getElementById("image");
	file = document.querySelector(".list-file");
	deleteAttach = document.querySelectorAll(".delete-attach");

	attachFile.addEventListener("change", function(e) {
		let filesInput = e.target.files;

		for (const file of filesInput) {
			listFile.push(file);
		}

		typeFile = "file";
		renderFile("attach");

		this.value = null;
	});

	imageFile.addEventListener("change", function(e) {
		let filesImage = e.target.files;

		for (const file of filesImage) {
			listFile.push(file);
		}

		typeFile = "image";

		renderFile("image");

		this.value = null;
	});

}

function createGroup(e) {
	e.preventDefault();

	let groupName = document.querySelector(".txt-group-name").value;

	toggleAllModal();
	console.log(groupName);
	var current_id;
	//get id group
	var xhttp1 = new XMLHttpRequest();
	xhttp1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var messages = JSON.parse(this.responseText);
			console.log(messages);
			console.log(messages.length);
			current_id = messages.length + 1;

			//add user vao group
			var xhttp2 = new XMLHttpRequest();
			const url = hostname + 'conversations_users';
			console.log(url);
			xhttp2.open("POST", url);
			var data1 = {
				conversations_id: messages.length + 1,
				username: username,
				is_admin: true
			}
			socket.send('@' + username + ',' + (messages.length + 1) + ',' + groupName);
			xhttp2.responseType = 'json';
			if (data1) { xhttp2.setRequestHeader('Content-Type', 'application/json'); }
			xhttp2.send(JSON.stringify(data1));


		} else {
			console.error("Error fetching conversations:", this.status);
		}

	};
	xhttp1.open("GET", hostname + "conversations", true);
	xhttp1.send();



	//add group
	var object = {
		name: groupName,
		avatar: 'group.png'
	}
	
	fetch(hostname + "conversations", {
		method: "post",
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(object)
	})
		.then(function(data) {
			return data.json();
		})
		.then(function(data) {

			if (typeChat != "group") return;

			let numberMember = 1;

			console.log(data);
			let imgSrc = ' src="' + server_name + 'group/group.png"';
			let appendUser = '<li id="group-' + data.id + '">'
				+ '<div class="user-contain" data-id="' + data.id + '" data-number="' + numberMember + '" data-name="' + data.name + '" onclick="setGroup(this);">'
				+ '<div class="user-img">'
				+ '<img id="img-group-' + data.id + '"'
				+ imgSrc
				+ ' alt="Image of user">'
				+ '</div>'
				+ '<div class="user-info" style="flex-grow:1 ;">'
				+ '<span class="user-name">' + data.name + '</span>'
				+ '</div>'
				+ '</div>'
				+ '<div class="group-delete border" data-id="' + data.id + '" onclick="deleteGroup(this)">Delete</div>'
				+ '</li>';
			document.querySelector(".left-side .list-user").innerHTML += appendUser;
			document.querySelector(".txt-group-name").value = "";
		});
}

function deleteGroup(ele) {
	let grpId = ele.getAttribute("data-id");
	console.log(grpId);
	if (grpId == groupId) document.querySelector(".right-side").innerHTML = "";
	let groupNumber = document.getElementById("group-" + grpId);
	if (groupNumber) groupNumber.outerHTML = "";
	socket.send('$' + grpId);
	/*
	fetch(hostname + "conversations/" + grpId, {
		method: 'delete'
	})
		.then(function(data) {
			return data.json();
		})
		.then(function(data) {
			console.log(data);
			let groupNumber = document.getElementById("group-" + grpId);
			if (groupNumber) groupNumber.outerHTML = "";

		})
		.catch(ex => console.log(ex));
	*/
		
	//sua lai cai nay
	var xhttp1 = new XMLHttpRequest();
	xhttp1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var messages = JSON.parse(this.responseText);
			console.log(messages);
			messages.forEach(msg => {
				try {
					console.log(msg.id);
					const url = `${hostname}conversations_users/${msg.id}`;

					fetch(url, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						},
					})
						.then(response => {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.json();
						})
						.then(data => {
							console.log('Deleted:', data);
						})
						.catch(error => {
							console.error('There was a problem with the fetch operation:', error);
						});
				} catch (ex) {
				}
			});
		} else {
			console.error("Error fetching conversations:", this.status);
		}

	};
	xhttp1.open("GET", hostname + "conversations_users?conversations_id=" + grpId, true);
	xhttp1.send();
}


function resetChat() {
	let chatBtn = document.querySelectorAll(".tab-control i");
	let searchTxt = document.querySelector(".list-user-search input");
	let addGroupBtn = document.querySelector(".add-group");

	searchTxt.value = "";

	chatBtn.forEach(function(ele) {
		ele.classList.remove("active");
	});

	if (typeChat == "group") {
		addGroupBtn.classList.add("active");
	} else {
		addGroupBtn.classList.remove("active");
	}
	fetch(hostname + 'user')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			alluser = data;
		}).catch(ex => {
			console.log(ex);
		});

	fetch(hostname + 'friends')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			friends = data;
		}).catch(ex => {
			console.log(ex);
		});
}

function toggleAllModal() {
	let modalBox = document.querySelectorAll(".modal-box");

	modalBox.forEach(function(modal) {
		modal.classList.remove("active");
	});

}

function toggleModal(ele, mode) {
	let modalBox = document.querySelectorAll(".modal-box");
	let id = ele.getAttribute("data-id");

	modalBox.forEach(function(modal) {
		modal.classList.remove("active");
	});


	if (mode) document.getElementById(id).classList.add("active");
	else document.getElementById(id).classList.remove("active");
}



function chatOne(ele) {
	typeChat = "user";
	resetChat();
	ele.classList.add("active");
	searchFriendByKeyword("");
	listFiles = [];
	rightSide = null;
	console.log(leftSide);
	console.log(rightSide);
	document.getElementById("receiver").innerHTML = rightSide;
}

function chatGroup(ele) {
	console.log("Hien all group here");
	typeChat = "group";
	resetChat();
	ele.classList.add("active");
	fetchGroup();
	listFiles = [];
	rightSide = null;
	console.log(leftSide);
	console.log(rightSide);
	document.getElementById("receiver").innerHTML = rightSide;
}
function fetchGroup() {
	fetch(hostname + 'conversations')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			allgroup = data;
			//console.log(allgroup);
		}).catch(ex => {
			console.log(ex);
		});

	fetch(hostname + 'conversations_users')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			allconversations_users = data;
		}).catch(ex => {
			console.log(ex);
		});

	fetch(hostname + 'conversations_users?username=' + username)
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			document.querySelector(".left-side .list-user").innerHTML = "";
			data.forEach(function(data) {

				let conversations_copy = allconversations_users;
				let isAdmin = data.is_admin;
				let matchedGroup = allgroup.find(group => group.id === data.conversations_id);
				let conversations_withId = conversations_copy.filter(conversation => conversation.conversations_id === data.conversations_id);
				//console.log(matchedGroup);
				//console.log(matchedGroup.avatar);
				console.log(allconversations_users);
				console.log(conversations_withId);
				let numberMember = conversations_withId.length;
				console.log(numberMember);
				let imgSrc = `src="${server_name}group/${matchedGroup.avatar}"`;
				let appendUser = '<li id="group-' + data.conversations_id + '">'
					+ '<div class="user-contain" data-id="' + data.conversations_id + '" data-number="' + numberMember + '" data-name="' + matchedGroup.name + '" onclick="setGroup(this);">'
					+ '<div class="user-img">'
					+ '<img id="img-group-' + data.conversations_id + '"'
					+ imgSrc
					+ ' alt="Image of user">'
					+ '</div>'
					+ '<div class="user-info" style="flex-grow:1 ;">'
					+ '<span class="user-name">' + matchedGroup.name + '</span>'
					+ '</div>'
					+ '</div>';
				if (isAdmin) {
					appendUser += '<div class="group-delete border" data-id="' + data.conversations_id + '" onclick="deleteGroup(this)">Delete</div>';
				}
				appendUser += '</li>';
				document.querySelector(".left-side .list-user").innerHTML += appendUser;
			});
		}).catch(ex => {
			console.log(ex);
		});
}


function searchFriendByKeyword(keyword) {
	fetch(hostname + "friends?sender=" + username)
		.then(function(data) {
			return data.json();
		})
		.then(data => {

			document.querySelector(".left-side .list-user").innerHTML = "";
			data.forEach(function(data) {
				var status = "";
				//if (data.online) status = "online";
				//else status = "";
				//console.log(data.online + "," + status);
				
				let avatar_withName = alluser.find(user => user.username === data.receiver);
				if (avatar_withName.online) status = "online";
				else status = "";
				console.log(avatar_withName);
				console.log(status);
				let src_avatar = server_name + "avatar/" + data.receiver + "/" + avatar_withName.avatar;

				let appendUser = '<li id="' + data.receiver + '" onclick="setReceiver(this);">'
					+ '<div class="user-contain">'
					+ '<div class="user-img">'
					+ '<img id="img-' + data.receiver + '"'
					+ ' src="' + src_avatar + '"'
					+ 'alt="Image of user">'
					+ '<div id="status-' + data.receiver + '" class="user-img-dot ' + status + '"></div>'
					+ '</div>'
					+ '<div class="user-info">'
					+ '<span class="user-name">' + data.receiver + '</span>'
					+ '</div>'
					+ '</div>'
					+ '</li>';
				document.querySelector(".left-side .list-user").innerHTML += appendUser;
			});
		});
}

function handleResponsive() {
	back = document.querySelector(".back");
	rightSide = document.querySelector(".right-side");
	leftSide = document.querySelector(".left-side");

	if (back) {
		back.addEventListener("click", function() {
			rightSide.classList.remove("active");
			leftSide.classList.add("active");
			listFile = [];
			//renderFile();
		});
	}

	rightSide.classList.add("active");
	leftSide.classList.remove("active");

}

function searchNotFriendByKeyword(keyword) {
	fetch(hostname + "friends?sender=" + username)
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			relationship = data;
		});
	fetch(hostname + "user")
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			console.log(relationship);
			document.querySelector(".left-side .list-user").innerHTML = "";
			data.forEach(function(data) {
				console.log(data);
				//var status = "";
				//if (data.online) status = "online";
				//else status = "";

				const isUserInFriends = relationship.some(friend => friend.receiver === data.username);
				if (!isUserInFriends && data.username !== username && data.username.includes(keyword)) {
					console.log(isUserInFriends);
					var status;
					let src_avatar = server_name + 'avatar/' + data.username + '/' + data.avatar;
					if (data.online == 1) status = 'online';
					else status = '';
					let appendUser = '<li id="' + data.username + '" onclick="setReceiver(this);">'
						+ '<div class="user-contain">'
						+ '<div class="user-img">'
						+ '<img id="img-' + data.username + '"'
						+ ' src="' + src_avatar + '"'
						+ 'alt="Image of user">'
						+ '<div id="status-' + data.username + '" class="user-img-dot ' + status + '"></div>'
						+ '</div>'
						+ '<div class="user-info">'
						+ '<span class="user-name">' + data.username + '</span>'
						+ '</div>'
						+ '</div>'
						+ '</li>';
					document.querySelector(".left-side .list-user").innerHTML += appendUser;
				}


			});
		});
}


function searchUser(ele) {
	if (typeChat == "user") {
		searchNotFriendByKeyword(ele.value);
	} else {
		if (ele.value == "") {
			fetchGroup();
		} else {
			searchGroupByKeyword(ele.value);
		}
	}
}


function searchMemberByKeyword(ele) {
	console.log(groupId);
	let keyword = ele.value;
	let memberGroup;

	fetch(hostname + 'user')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			alluser = data;
		}).catch(ex => {
			console.log(ex);
		});

	fetch(hostname + "conversations_users?conversations_id=" + groupId)
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			memberGroup = data;
		}).catch(ex => {
			console.log(ex);
		});



	fetch(hostname + "friends?sender=" + username + "&status=1")
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			console.log(memberGroup);
			document.querySelector(".add-member-body .list-user ul").innerHTML = "";
			data.forEach(function(data) {
				if (data.online) status = "online";
				else status = "";
				//console.log(data);


				let check = "";
				if (listUserAdd.indexOf(data.receiver) >= 0) check = "checked";
				let userNotInGroup = memberGroup.find(member => member.username === data.receiver);
				let userCurrent = alluser.find(user => user.username === data.receiver);
				let src_avatar = server_name + "avatar/" + data.receiver + "/" + userCurrent.avatar;

				if (!userNotInGroup) {
					let appendUser = '<li>'
						+ '<input id="member-' + data.receiver + '" type="checkbox" ' + check + ' value="' + data.receiver + '" onchange="addUserChange(this)">'
						+ '<label for="member-' + data.receiver + '">'
						+ '<div class="user-contain">'
						+ '<div class="user-img">'
						+ '<img '
						+ ' src="' + src_avatar + '"'
						+ 'alt="Image of user">'
						+ '</div>'
						+ '<div class="user-info">'
						+ '<span class="user-name">' + data.receiver + '</span>'
						+ '</div>'
						+ '</div>'
						+ '</label>'
						+ '<div class="user-select-dot"></div>'
						+ '</li>';
					document.querySelector(".add-member-body .list-user ul").innerHTML += appendUser;
				}

			});
		});
}

function addUserChange(e) {
	if (e.checked) {
		listUserAdd.push(e.value);
	} else {
		let index = listUserAdd.indexOf(e.value);
		listUserAdd.splice(index, 1);
	}
	console.log(listUserAdd);

}
function addMember(e) {
	e.preventDefault();

	let object = new Object();
	object.name = groupName;
	object.id = groupId;
	object.users = [];


	listUserAdd.forEach(function(username) {
		console.log(username);
		socket.send("(" + username + "," + groupId);
		const url = hostname + "conversations_users";
		const xhttp = new XMLHttpRequest();
		xhttp.open("POST", url);
		var data = {
			conversations_id: Number(groupId),
			username: username,
			is_admin: false
		}
		xhttp.responseType = 'json';
		if (data) { xhttp.setRequestHeader('Content-Type', 'application/json'); }
		xhttp.send(JSON.stringify(data));
		toggleAllModal();
	});
}

function fetchUser() {
	fetch(hostname + 'user')
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			alluser = data;
		}).catch(ex => {
			console.log(ex);
		});

	fetch(hostname + "conversations_users?conversations_id=" + groupId)
		.then(data => data.json())
		.then(users => {
			document.querySelector(".manage-member-body .list-user ul").innerHTML = "";

			if (users.length == 1) {
				document.querySelector(".manage-member-body .list-user ul").innerHTML = "No members in group";
				document.querySelector(".manage-member-body .list-user ul").style = "text-align: center; font-size: 1.8rem;";
			} else {
				document.querySelector(".manage-member-body .list-user ul").style = "";
			}

			users.forEach(function(data) {
				if (data.username == username) return;

				let userOf = alluser.find(user => user.username === data.username);
				let src_avatar = server_name + "avatar/" + data.username + "/" + userOf.avatar;
				let appendUser = '<li>'
					+ '<div class="user-contain">'
					+ '<div class="user-img">'
					+ '<img '
					+ ' src="' + src_avatar + '"'
					+ 'alt="Image of user">'
					+ '</div>'
					+ '<div class="user-info" style="flex-grow: 1;">'
					+ '<span class="user-name">' + data.username + '</span>'
					+ '</div>';

				if (!data.is_admin)
					appendUser += '<div class="user-delete" style="font-weight: 700;" data-username="' + data.username + '" onclick="deleteMember(this)">Delete</div>'

				appendUser += '</div></li>';

				document.querySelector(".manage-member-body .list-user ul").innerHTML += appendUser;
			});

		})
		.catch(ex => console.log(ex));
}

function deleteMember(ele) {
	let username = ele.getAttribute("data-username");
	let deleteId;
	socket.send(")" + username + "," + groupId);
	fetch(hostname + "conversations_users?username=" + username + "&conversations_id=" + groupId)
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			console.log(data[0].id);
			deleteId = data[0].id;

			fetch(hostname + "conversations_users/" + data[0].id, {
				method: 'delete'
			})
				.then(function(data) {
					return data.json();
				})
				.then(function(data) {
					toggleAllModal();

				})
				.catch(ex => console.log(ex));
		}).catch(ex => {
			console.log(ex);
		});
	/*
	fetch("http://" + window.location.host + "/conversations-rest-controller?conversationId=" + groupId + "&username=" + username, {
		method: 'delete'
	})
		.then(function(data) {
			return data.json();
		})
		.then(function(data) {

			numberMember -= 1;

			let inviteNumber = document.querySelector(".total-invite-user");
			if (inviteNumber) inviteNumber.innerHTML = numberMember + " paticipants";

			toggleAllModal();
		})
		.catch(ex => console.log(ex));
		
	*/

	
}

function setOnline(username, isOnline) {
	let ele = document.getElementById('status-' + username);

	if (isOnline === true) {
		ele.classList.add('online');
	} else {
		ele.classList.remove('online');
	}
}
