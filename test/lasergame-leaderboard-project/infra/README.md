# Infrastructure Setup for Laser Game Leaderboard Project

This directory contains the necessary files and documentation for setting up the infrastructure of the Laser Game Leaderboard project.

## Overview

The infrastructure setup includes scripts and configurations for deploying the backend application on an Azure virtual machine, as well as setting up Nginx for serving the frontend and reverse proxying requests to the backend.

## Directory Structure

- **azure/**: Contains files related to the Azure virtual machine setup.
  - **vm-setup.sh**: A shell script that automates the installation of required packages and dependencies on the Azure VM.
  - **nginx.conf**: Configuration file for Nginx, which serves the frontend and proxies requests to the backend.
  - **systemd/**: Contains the service definition for managing the backend application.
    - **lasergame-backend.service**: A systemd service file that ensures the backend application runs on startup and can be managed easily.

## Setup Instructions

1. **Azure VM Setup**:
   - Use the `vm-setup.sh` script to set up your Azure virtual machine. This script will install necessary packages, including Python, Flask, and Nginx.

2. **Nginx Configuration**:
   - Update the `nginx.conf` file with your domain or IP address as needed.
   - Ensure that Nginx is configured to serve the frontend files and proxy requests to the backend API.

3. **Systemd Service**:
   - Place the `lasergame-backend.service` file in the appropriate systemd directory (usually `/etc/systemd/system/`).
   - Enable and start the service to ensure the backend application runs on startup.

4. **Testing**:
   - After setting up the infrastructure, test the application by accessing the frontend in your web browser and ensuring that the leaderboard functionality works as expected.

## Additional Notes

- Ensure that your Azure VM has the necessary firewall rules to allow traffic on the required ports (e.g., HTTP, HTTPS).
- Monitor the logs for both Nginx and the backend application to troubleshoot any issues that may arise during setup or runtime.