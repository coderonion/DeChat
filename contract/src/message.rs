use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, Timestamp};

#[derive(Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Message {
	pub sender: String,
	pub timestamp: Timestamp,
	pub text: String,
}

impl Message {
	pub fn new(sender: String, text: String) -> Message {
		Message {
			sender,
			timestamp: env::block_timestamp(),
			text,
		}
	}
}