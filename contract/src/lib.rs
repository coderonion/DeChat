use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{log, near_bindgen};
use near_sdk::env;

mod message;
use message::Message;

// Define the ontract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
	messages: Vec<Message>,
}

impl Default for Contract {
	// The default trait with which to initialize the contract
	fn default() -> Self {
		Self {
			messages: vec![]
		}
	}
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
	pub fn get_messages(&self) -> Vec<Message> {
		self.messages.clone()
	}

	pub fn send_message(&mut self, message: String) {
		let sender = env::predecessor_account_id();

		log!("{} send message: {}", sender.to_string(), message);
		self.messages.push(Message::new(sender.to_string(), message));
	}
}

// The rest of this file holds the inline tests for the code above

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	pub fn get_zero_message() {
		let contract = Contract::default();

		let messages = contract.get_messages();
		
		match messages.last() {
			Some(_) => panic!("Messages vector has some message"),
			None => ()
		}
	}

	#[test]
	pub fn send_and_get_some_message() {
		let mut contract = Contract::default();

		contract.send_message("Hello, world!".to_string());
		let messages = contract.get_messages();

		assert_eq!(messages.last().unwrap().text, "Hello, world!".to_string());
	}

	#[test]
	pub fn loop_of_messages() {
		let mut contract = Contract::default();

		for i in 0..100 {
			contract.send_message(i.to_string());
		}

		let message = contract.get_messages();
		assert_eq!(message.last().unwrap().text, 99.to_string());
	}
}
