function login_button() {
	// Collect data from inputs
	var public_key = document.getElementById("public_key");
	var private_key = document.getElementById("private_key");

	if (public_key.value.indexOf(".testnet") == -1 || private_key.value.indexOf("ed25519:") == -1) {
		alert("Public key or private key is incorrect");
		public_key.value = "";
		private_key.value = "";
	} else {
		// Relocate to messenger page with this data in URL (pretty bad solution)
		window.location.replace("./messenger.html" + "?id=" + public_key.value + "&priv=" + private_key.value);
	}
}