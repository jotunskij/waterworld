#!/usr/bin/env bash

# Update apt and dist
sudo apt-get update
sudo apt-get dist-upgrade

# Remove old stuff
sudo apt-get remove nodejs
sudo rm -rf /opt/node
sudo rm -rf /opt/bin 

# Install node and npm
sudo mkdir /opt/bin 
cd /tmp
wget https://nodejs.org/dist/v6.2.0/node-v6.2.0-linux-armv7l.tar.gz
tar -xvzf node-v6.2.0-linux-armv7l.tar.gz
sudo mv node-v6.2.0-linux-armv7l /opt/node
sudo ln -s /opt/node/bin/* /opt/bin/

echo "Run: sudo nano /etc/profile"
echo "And add /opt/bin to the PATH"
echo "Then run: source /etc/profile"
