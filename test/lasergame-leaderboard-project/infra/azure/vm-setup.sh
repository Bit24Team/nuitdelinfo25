#!/bin/bash

# Update the package list and install necessary packages
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv nginx

# Create a directory for the backend application
mkdir -p /var/www/lasergame-backend

# Copy the backend source code to the server
# Assuming the backend code is available in a specific location
# Replace <path_to_backend_code> with the actual path
cp -r <path_to_backend_code>/backend/src/* /var/www/lasergame-backend/

# Navigate to the backend directory
cd /var/www/lasergame-backend

# Set up a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Set up Nginx configuration
sudo cp /path/to/your/nginx.conf /etc/nginx/sites-available/lasergame
sudo ln -s /etc/nginx/sites-available/lasergame /etc/nginx/sites-enabled

# Restart Nginx to apply the changes
sudo systemctl restart nginx

# Set up the systemd service for the backend application
sudo cp /path/to/your/lasergame-backend.service /etc/systemd/system/
sudo systemctl enable lasergame-backend
sudo systemctl start lasergame-backend

echo "Setup complete. The Laser Game backend is now running."