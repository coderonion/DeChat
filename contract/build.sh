#!/bin/sh

echo ">> Building contract"

cargo build --all --target wasm32-unknown-unknown --release