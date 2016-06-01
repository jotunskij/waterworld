#!/usr/bin/env bash

# Install sqllite
sudo apt-get install sqlite3

# Create our tables
sqlite3 waterworld.db < setup.sql