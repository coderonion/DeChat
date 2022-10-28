function get_login_data() {
	var url_string = window.location;
	var url = new URL(url_string);
	var id = url.searchParams.get("id");
	var priv = url.searchParams.get("priv");

	return [id, priv];
} 

const { keyStores, KeyPair } = nearApi;
const { connect } = nearApi;
const { Contract } = nearApi;

var account = undefined;
var contract = undefined;
var message_input = null;

var last_message = 0;

async function init() {
	await initNear();
	load_contract();

	message_input = document.getElementById("message_input");
	message_input.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
			send_button();
		}
	});

	setInterval(await get_messages, 500);
}

async function initNear() {
	try {
		const myKeyStore = new keyStores.InMemoryKeyStore();
		const [WALLET_ID, PRIVATE_KEY] = get_login_data();

		// creates a public/private key pair using the provided private key
		const keyPair = KeyPair.fromString(PRIVATE_KEY);
		// adds the keyPair you created yo keyStore
		await myKeyStore.setKey("testnet", WALLET_ID, keyPair);

		//connect
		const connectionConfig = {
			networkId: "testnet",
			keyStore: myKeyStore, //first create a key store
			nodeUrl: "https://rpc.testnet.near.org",
			walletUrl: "https://wallet.testnet.near.org",
			helperUrl: "https://helper.testnet.near.org",
			explorerUrl: "https://explorer.testnet.near.org"
		};

		const nearConnection = await connect(connectionConfig);

		account = await nearConnection.account(WALLET_ID);
		await account.getAccessKeys();
	}
	catch (e) {
		alert("Unable to connect. Check your wallet id or private key");
		document.location.replace("login.html");
	}
}

function load_contract() {
	contract = new Contract(
		account,
		"dev-1666899882969-95441471419684", // deployed contract address (coming soon)
		{
			viewMethods: ["get_messages"], // view methods of contract that doesn't change contract state
			changeMethods: ["send_message"] // methods that can change contract state
		}
	);
}

function display_sent_message(time, text) { // Diplay message ignoring HTML tags in it
	const timestamp = new Date(time);
	const messages = document.querySelector("main");
	const message = `<div class="message sent"><div class="message_text"><p></p><time></time></div></div>`;

	messages.innerHTML += message;

	var _temp = messages.querySelectorAll("div");
	_temp = _temp[_temp.length-1];
	_temp.querySelector("p").innerText = text;
	_temp.querySelector("time").innerText = `${timestamp.toLocaleTimeString()}`;
}

function display_received_message(sender, time, text) {
	const timestamp = new Date(time);
	const messages = document.querySelector("main");
	const message = '<div class="message received"><div class="message_text"><p><strong></strong><a></a></p><time></time></div></div>';

	messages.innerHTML += message;

	var _temp = messages.querySelectorAll("div");
	_temp = _temp[_temp.length-1];
	_temp.querySelector("p").querySelector("strong").innerText = `${sender}`;
	_temp.querySelector("p").querySelector("a").innerText = text;
	_temp.querySelector("time").innerText = `${timestamp.toLocaleTimeString()}`;
}

async function send_button() {
	text = document.getElementById("message_input").value;
	if (text == "") return;
	document.getElementById("message_input").value = ""; //clear message input

	try {
		await contract.send_message(
			{
				message: text
			},
			"300000000000000"
		)
	} catch(e) {
		alert("Unable to connect. Check your wallet id or private key");
		document.location.replace("login.html");
	}
}

async function get_messages() {
	const all_messages = await contract.get_messages();

	if (all_messages.length > last_message) {
		const new_messages = all_messages.slice(last_message-all_messages.length);
		

		new_messages.map(function(item) {
			if (item.sender == account.accountId) {
				display_sent_message(item.timestamp/1000000, item.text);
			} else {
				display_received_message(item.sender, item.timestamp/1000000, item.text);
			}

			last_message++;
		});

		document.querySelector("main").scrollTop = document.querySelector("main").scrollHeight;
	}
}