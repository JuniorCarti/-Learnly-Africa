#!/bin/bash
echo "=== DOCKER INSTALLATION SCRIPT ==="
echo "Student: Ridge Junior Abuto"
echo "EC2 IP: 35.89.184.161"

echo "1. Updating system..."
sudo yum update -y

echo "2. Installing Docker..."
sudo yum install docker -y

echo "3. Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker

echo "4. Adding user to docker group..."
sudo usermod -aG docker $USER

echo "5. Verifying installation..."
docker --version

echo "=== DOCKER INSTALLATION COMPLETE ==="
echo "Log out and back in for group changes."
