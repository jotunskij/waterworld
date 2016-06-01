#!/usr/bin/env bash

# Update apt and dist
sudo apt-get update
sudo apt-get dist-upgrade

# Install node and npm
cd /tmp
wget https://nodejs.org/dist/v4.4.5/node-v4.4.5-linux-armv7l.tar.gz
tar -xvzf node-v4.4.5-linux-armv7l.tar.gz
sudo mv node-v4.4.5-linux-armv7l /opt/node
 sudo mkdir /opt/bin 
sudo ln -s /opt/node/bin/* /opt/bin/

echo "Run: sudo nano /etc/profile"
echo "And add /opt/bin to the PATH"