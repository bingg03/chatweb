var socket = new WebSocket('ws://localhost:8080/spring-mvc/ChatSocket');

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


socket.onopen = function(event) {
	username = document.getElementById("username").textContent;
	console.log(username);
	//???Chua lam avatar
	var usernameElement = document.getElementById("username");
	var usernameValue = usernameElement.innerText;

	socket.send("#" + usernameValue);
};

socket.onmessage = function(event) {
	var message = event.data;
	//console.log(sender_message);
	
	
	if(message[0] === "&") {
		console.log(message);
		setMessageGroup(message.substring(1));
		
	} else if (message[0] === "@") {
		console.log(message);
		setMessage(message.substring(1));	
	} else {
		
	}
	
};

function cleanUp() {
	username = null;
	socket = null;
	receiver = null;
}

function setReceiver(element) {
	receiver = element.id;
	console.log(receiver);
	var status = 'online';

	var rightSide = '<div class="user-contact">' + '<div class="back">'
		+ '<i class="fa fa-arrow-left"></i>'
		+ '</div>'
		+ '<div class="user-contain">'
		+ '<div class="user-img">'
		+ '<img src="https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg" '
		+ 'alt="Image of user">'
		+ '<div class="user-img-dot ' + status + '"></div>'
		+ '</div>'
		+ '<p id="usernameReceiver" style="display: none">' + receiver + '</p>'
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
	handleResponsive();

}

function setGroup(element) {
	receiver = null;
	groupName = element.getAttribute("data-name");
	groupId = element.getAttribute("data-id");

	receiverAvatar = document.getElementById("img-group-" + groupId).src;

	listUserAdd = [];

	numberMember = parseInt(element.getAttribute("data-number"));


	fetch("http://localhost:3000" + "/conversations?id=" + groupId)
		.then(data => data.json())
		.then(data => {
			//let findObject = data.find(element => element.username == username);
			let isAdmin = false;
			if(username === "admin") isAdmin = true;

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
				+ '<form class="form-send-message" onsubmit="return sendMessageGroup(event)">'
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

			//displayFiles();

			handleResponsive();
		})
		.catch(ex => console.log(ex));
}

function sendMessage(e) {
	e.preventDefault();

	var Receiver = document.getElementById('usernameReceiver');
	var receiverName = Receiver.innerText;

	var usernameElement = document.getElementById("username");
	var sender = usernameElement.innerText;

	var inputText = document.getElementById("message").value;
	document.getElementById("message").value = '';
	socket.send("@" + sender + "," + receiverName + "," + inputText);

	setMessage(sender + "," + receiverName + "," + inputText);
	
	const url = 'http://localhost:3000/messages';
	const xhttp = new XMLHttpRequest();
	xhttp.open("POST", url);

	var data = {
		sender: sender,
		receiver: receiver,
		group_id: null,
		message: inputText,
		message_type: "text"
	}

	xhttp.responseType = 'json';
	if (data) {
		xhttp.setRequestHeader('Content-Type', 'application/json');
	}

	xhttp.send(JSON.stringify(data));

}

function sendMessageGroup(e) {
	e.preventDefault();
	
	var inputText = document.getElementById("message").value;
	document.getElementById("message").value = '';
	socket.send("&" + username + "," + groupId + "," + inputText);
	//console.log("&" + username + "," + groupId + "," + inputText);
	setMessageGroup(username + "," + groupId + "," + inputText);
	
	const url = 'http://localhost:3000/messages';
	const xhttp = new XMLHttpRequest();
	xhttp.open("POST", url);

	var data = {
		sender: username,
		receiver: null,
		group_id: Number(groupId),
		message: inputText,
		message_type: "text"
	}

	xhttp.responseType = 'json';
	if (data) {
		xhttp.setRequestHeader('Content-Type', 'application/json');
	}

	xhttp.send(JSON.stringify(data));

}

function setMessageGroup(msg) {
	var ar = msg.split(',');
	var sender = ar[0];
	var group_id = ar[1];
	var message = ar[2];

	var currentChat = document.getElementById('chat').innerHTML;
	var newChatMsg = '';
	if (message != null) {
		newChatMsg = customLoadMessageGroup(sender, group_id, message, "");
	}
	
	document.getElementById('chat').innerHTML = currentChat
		+ newChatMsg;
	goLastestMsg();
}



function setMessage(msg) {
	var ar = msg.split(',');
	var sender = ar[0];
	var receiver = ar[1];
	var message = ar[2];

	var currentChat = document.getElementById('chat').innerHTML;
	var newChatMsg = '';
	if (receiver != null) {
		newChatMsg = customLoadMessage(sender, message);
	}
	//	else {
	//		newChatMsg = customLoadMessageGroup(msg.username, msg.groupId, msg.message, msg.avatar);
	//	}
	document.getElementById('chat').innerHTML = currentChat
		+ newChatMsg;
	goLastestMsg();
}

function customLoadMessage(sender, message) {
	var username = username = document.getElementById("username").textContent;
	var imgSrc = "https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg";
	var msgDisplay = '<li>'
		+ '<div class="message';
	if (receiver != sender && username != sender) {
		return '';
	}
	else if (receiver == sender) {
		msgDisplay += '">';
	} else {
		imgSrc = "https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg";
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
	let imgSrc = 'https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg';
	var msgDisplay = '<li>'
		+ '<div class="message';
	if (groupIdFromServer != groupId) {
		return '';
	}
	if (username != sender) {
		msgDisplay += '">';
	} else {
		imgSrc = 'https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg';
		msgDisplay += ' right">';
	}
	return msgDisplay + '<div class="message-img">'
		+ '<img src="' + imgSrc + '" alt="">'
		+ '<div class="sender-name">'+ sender +'</div>'
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
					chatbox += customLoadMessageGroup(msg.sender, msg.group_id, msg.message, ""); // cuoi la msg.avatar
				} catch (ex) {

				}
			});
			currentChatbox.innerHTML = chatbox;
			goLastestMsg();
		}
	};
	xhttp.open("GET", "http://localhost:3000/messages?group_id=" + groupId, true);
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
	xhttp.open("GET", "http://localhost:3000" + "/messages", true);
	xhttp.send();
}

function setOnline(username, isOnline) {
	let ele = document.getElementById('status-' + username);

	if (isOnline === true) {
		ele.classList.add('online');
	} else {
		ele.classList.remove('online');
	}
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
}


function chatOne(ele) {
	typeChat = "user";
	resetChat();
	ele.classList.add("active");
	searchFriendByKeyword("");
	rightSide = null;
	listFiles = [];
}

function chatGroup(ele) {
	typeChat = "group";
	resetChat();
	ele.classList.add("active");
	fetchGroup();
	rightSide = null;
	listFiles = [];
}
function fetchGroup() {
	fetch("http://localhost:3000/conversations_users?username=" + username)
		.then(function(data) {
			return data.json();
		})
		.then(data => {

			document.querySelector(".left-side .list-user").innerHTML = "";
			data.forEach(function(data) {
				let numberMember = 3;

				//let findObject = data.users.find(element => element.username == username);
				let isAdmin = data.is_admin;

				let imgSrc = ' src="https://cdn-icons-png.flaticon.com/512/69/69589.png"';
				let appendUser = '<li id="group-' + data.conversations_id + '">'
					+ '<div class="user-contain" data-id="' + data.conversations_id + '" data-number="' + numberMember + '" data-name="' + "group1" + '" onclick="setGroup(this);">'
					+ '<div class="user-img">'
					+ '<img id="img-group-' + data.conversations_id + '"'
					+ imgSrc
					+ ' alt="Image of user">'
					+ '</div>'
					+ '<div class="user-info" style="flex-grow:1 ;">'
					+ '<span class="user-name">' + "group1" + '</span>'
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
	fetch("http://localhost:3000/friends?sender=" + username)
		.then(function(data) {
			return data.json();
		})
		.then(data => {

			document.querySelector(".left-side .list-user").innerHTML = "";
			data.forEach(function(data) {
				var status = "";
				if (data.status) status = "online";
				else status = "";

				let appendUser = '<li id="' + data.receiver + '" onclick="setReceiver(this);">'
					+ '<div class="user-contain">'
					+ '<div class="user-img">'
					+ '<img id="img-' + data.receiver + '"'
					+ ' src="https://www.kkday.com/vi/blog/wp-content/uploads/chup-anh-dep-bang-dien-thoai-25.jpg"'
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
