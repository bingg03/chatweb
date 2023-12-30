var socket = new WebSocket('ws://localhost:8080/spring-mvc/ChatSocket');

var hostname = 'http://localhost:3000/';
var server_name = 'http://localhost/file/';

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

socket.onopen = function(event) {
	username = document.getElementById("username").textContent;
	userAvatar = document.getElementById("userAvatar").textContent;
	console.log(username);

	socket.send("#" + username);
};

socket.onmessage = function(event) {
	var message = event.data;
	try {
		const messageJSON = JSON.parse(message);

		var checking = '<img src="' + 'http://localhost/file/a.png' + '" alt="">';

		var messageType = messageJSON.type;

		var messageContent = messageJSON.message;
		//console.log(messageJSON.message);
		if (messageType.startsWith("text")) {

		} else if (messageType.startsWith("audio")) {
			messageJSON.message = '<audio controls>'
				+ '<source src="' + 'http://localhost/file/' + messageContent + '" type="' + messageType + '">'
				+ '</audio>';
		} else if (messageType.startsWith("video")) {
			messageJSON.message = '<video width="400" controls>'
				+ '<source src="' + 'http://localhost/file/' + messageContente + '" type="' + messageType + '">'
				+ '</video>';
		} else if (messageType.startsWith("image")) {
			messageJSON.message = '<img src="' + 'http://localhost/file/' + messageContent +
				'" type="' + messageType + '" alt="">';
		}
		else {
			messageJSON.message = '<a href= "' + 'http://localhost/file/' + messageContent + '">' + messageContent + '</a>'
		}
		if (messageJSON.message === checking) console.log("Hellllllllll");
		console.log(messageJSON);
		//setMessage(messageJSON);

		var currentChat = document.getElementById('chat').innerHTML;
		var newChatMsg = '';



		if (messageJSON.groupId != 0) {
			newChatMsg = customLoadMessageGroup(messageJSON.username, messageJSON.groupId, messageJSON.message, "");
			console.log("Da chat group here");
			console.log(messageJSON.groupId);
		}
		else {
			newChatMsg = customLoadMessage(messageJSON.username, messageJSON.message);
			console.log("Da chat user here");
			console.log(messageJSON.groupId);
		}
		document.getElementById('chat').innerHTML = currentChat
			+ newChatMsg;
		goLastestMsg();

	} catch (error) {
		console.error('Error parsing JSON:', error);
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

}

function setGroup(element) {
	console.log("hihihi");
	receiver = null;
	groupName = element.getAttribute("data-name");
	groupId = element.getAttribute("data-id");

	receiverAvatar = document.getElementById("img-group-" + groupId).src;

	listUserAdd = [];

	numberMember = parseInt(element.getAttribute("data-number"));


	fetch("http://localhost:3000" + "/conversations?id=" + groupId)
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

	var inputText = document.getElementById("message").value;

	if (inputText != '') {
		sendText();
	} else {
		sendAttachments();
	}

}
function sendText() {
	var messageContent = document.getElementById("message").value;
	var messageType = "text";
	document.getElementById("message").value = '';
	var message = buildMessageToJson(messageContent, messageType);
	setMessage(message);
	console.log(message);
	socket.send(JSON.stringify(message));

	const url = '${hostname}messages';
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


		if (messageType.startsWith("audio")) {
			message.message = '<audio controls>'
				+ '<source src="' + URL.createObjectURL(file) + '" type="' + messageType + '">'
				+ '</audio>';
		} else if (messageType.startsWith("video")) {
			message.message = '<video width="400" controls>'
				+ '<source src="' + URL.createObjectURL(file) + '" type="' + messageType + '">'
				+ '</video>';
		} else if (messageType.startsWith("image")) {
			message.message = '<img src="' + URL.createObjectURL(file) + '" alt="">';
		}
		else {
			message.message = '<a href= "' + URL.createObjectURL(file) + '">' + messageContent + '</a>'
		}
		//console.log(message.message);
		var currentChat = document.getElementById('chat').innerHTML;
		var newChatMsg = '';

		newChatMsg = customLoadMessage(message.username, message.message);

		document.getElementById('chat').innerHTML = currentChat
			+ newChatMsg;
		goLastestMsg();

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
		newChatMsg = customLoadMessageGroup(msg.username, msg.groupId, msg.message, msg.avatar);
	}
	document.getElementById('chat').innerHTML = currentChat
		+ newChatMsg;
	goLastestMsg();
	goLastestMsg();
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
		imgSrc = userAvatar;
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
					chatbox += customLoadMessageGroup(msg.sender, msg.group_id, msg.message, "");
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
	socket.send('$' + grpId);
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
	rightSide = null;
	searchFriendByKeyword("");
	listFiles = [];
}

function chatGroup(ele) {
	//console.log("hehe");
	typeChat = "group";
	resetChat();
	ele.classList.add("active");
	rightSide = null;
	fetchGroup();

	listFiles = [];
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
	
	
	fetch(hostname + 'conversations_users?username=' + username)
		.then(function(data) {
			return data.json();
		})
		.then(data => {
			document.querySelector(".left-side .list-user").innerHTML = "";
			data.forEach(function(data) {
				let numberMember = 2;
				//console.log(allgroup);
				//let findObject = data.users.find(element => element.username == username);
				let isAdmin = data.is_admin;
				let matchedGroup = allgroup.find(group => group.id === data.conversations_id);
				//console.log(matchedGroup);
				//console.log(matchedGroup.avatar);
				
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

/*
function searchMemberByKeyword(ele) {
	let keyword = ele.value;
	fetch(hostname + "friends?username=" + username + "&keyword=" + keyword + "&c)
		.then(function(data) {
			return data.json();
		})
		.then(data => {

			document.querySelector(".add-member-body .list-user ul").innerHTML = "";
			data.forEach(function(data) {
				if (data.online) status = "online";
				else status = "";

				let check = "";
				if (listUserAdd.indexOf(data.username) >= 0) check = "checked";

				let appendUser = '<li>'
					+ '<input id="member-' + data.username + '" type="checkbox" ' + check + ' value="' + data.username + '" onchange="addUserChange(this)">'
					+ '<label for="member-' + data.username + '">'
					+ '<div class="user-contain">'
					+ '<div class="user-img">'
					+ '<img '
					+ ' src="http://' + window.location.host + '/files/' + data.username + '/' + data.avatar + '"'
					+ 'alt="Image of user">'
					+ '</div>'
					+ '<div class="user-info">'
					+ '<span class="user-name">' + data.username + '</span>'
					+ '</div>'
					+ '</div>'
					+ '</label>'
					+ '<div class="user-select-dot"></div>'
					+ '</li>';
				document.querySelector(".add-member-body .list-user ul").innerHTML += appendUser;
			});
		});
}
*/
