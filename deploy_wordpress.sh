#!/bin/bash
echo "=== WORDPRESS DEPLOYMENT SCRIPT ==="
echo "EC2: 35.89.184.161"

echo "Step 1: Pulling images..."
sudo docker pull wordpress:latest
sudo docker pull mysql:8.0

echo "Step 2: Creating network..."
sudo docker network create wordpress-network 2>/dev/null || echo "Network exists"

echo "Step 3: Cleaning existing containers..."
sudo docker stop mysql-db wordpress-app 2>/dev/null || true
sudo docker rm mysql-db wordpress-app 2>/dev/null || true

echo "Step 4: Starting MySQL..."
sudo docker run -d --name mysql-db --network wordpress-network \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=wordpress \
  -e MYSQL_USER=wordpress \
  -e MYSQL_PASSWORD=wordpresspassword \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0

sleep 20

echo "Step 5: Starting WordPress..."
sudo docker run -d --name wordpress-app --network wordpress-network \
  -e WORDPRESS_DB_HOST=mysql-db:3306 \
  -e WORDPRESS_DB_USER=wordpress \
  -e WORDPRESS_DB_PASSWORD=wordpresspassword \
  -e WORDPRESS_DB_NAME=wordpress \
  -p 80:80 \
  wordpress:latest

sleep 10

echo "Step 6: Verifying..."
sudo docker ps

echo "=== DEPLOYMENT COMPLETE ==="
echo "Access: http://35.89.184.161"
