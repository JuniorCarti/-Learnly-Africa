# Learnly Africa - Linux Administration Assessment
### Part 1: GitHub Account Setup
- GitHub account created
- Repository created: `Learnly-Africa`

### Part 2: AWS EC2 Setup
![EC2 Instance Running](Images/EC2%20instance%20running.png)
- EC2 instance named "learnly" created
- Sandbox environment utilized
- Instance running with public IP: `34.222.107.92`

### Part 3: SSH Access and Shell Customization
![SSH Connection 1](Images/SSH%20connection%20&%20shell%20prompt%20(%23).png)
![SSH Connection 2](Images/SSH%20connection%20&%20shell%20prompt%20(%23)1.png)
![SSH Connection 3](Images/SSH%20connection%20&%20shell%20prompt%20(%23)2.png)
- Secure SSH connection established
- Shell prompt customized (`$` to `#`)
- Terminal environment configured

### Part 4: User Management
![User Management](Images/User%20management%20(learnly%20user).png)
- New user `learnly` created
- Full permissions (read, write, execute) configured
- User switching and privilege management

### Part 5: Bash Scripting and Docker Installation
![Docker Script 1](Images/Docker%20script%20and%20output1.png)
![Docker Script 2](Images/Docker%20script%20and%20output2.png)
![Docker Script 3](Images/Docker%20script%20and%20output3.png)
![Docker Script 4](Images/Docker%20script%20and%20output4.png)
![Docker Script 5](Images/Docker%20script%20and%20output5.png)
-  `install_docker.sh` script created and executed
-  Automated system updates and package management
- Docker service installed, configured, and verified

### Part 6: Docker Configuration
![WordPress Setup 1](Images/WordPress%20setup%20page1.png)
![WordPress Setup 2](Images/WordPress%20setup%20page2.png)
![WordPress Setup 3](Images/WordPress%20setup%20page3.png)
![WordPress Setup 4](Images/WordPress%20setup%20page4.png)
![WordPress Setup 5](Images/WordPress%20setup%20page5.png)
- WordPress and MySQL containers deployed
- Docker networking configured
- Persistent data volumes established
- Application accessible at http://34.222.107.92

## Technical Implementation

### Architecture Overview
```
AWS EC2 Instance (34.222.107.92)
├── Docker Engine
│   ├── MySQL Container (mysql-db)
│   │   ├── Database: wordpress
│   │   ├── User: wordpress
│   │   └── Persistent Volume: mysql_data
│   └── WordPress Container (wordpress-app)
│       ├── Port: 80:80
│       ├── Network: wordpress-network
│       └── Connected to MySQL database
```

### Container Specifications
| **Container** | **Image** | **Purpose** | **Status** |
|---------------|-----------|-------------|------------|
| `mysql-db` | `mysql:8.0` | Database Server | Running |
| `wordpress-app` | `wordpress:latest` | Web Application | Running |

## Project Structure
```
Learnly-Africa/
├── 📄 README.md                    # Project documentation
├── ⚡ install_docker.sh            # Docker installation automation
├── 🚀 deploy_wordpress.sh         # Application deployment script

## Quick Start Guide

### Prerequisites
- AWS EC2 instance running Amazon Linux
- SSH access configured
- Internet connectivity

### Deployment Steps
1. **Clone Repository**
   ```bash
   git clone https://github.com/JuniorCarti/-Learnly-Africa.git
   cd Learnly-Africa
   ```

2. **Install Docker**
   ```bash
   chmod +x install_docker.sh
   ./install_docker.sh
   ```

3. **Deploy WordPress**
   ```bash
   chmod +x deploy_wordpress.sh
   ./deploy_wordpress.sh
   ```

4. **Access Application**
   - Open browser: http://34.222.107.92
   - Complete WordPress setup

### Verification Commands
```bash
# Check Docker installation
docker --version

# Verify running containers
sudo docker ps

# Test website accessibility
curl -I http://localhost

## Docker Commands Reference

### Container Management
```bash
# View running containers
sudo docker ps

# Check container logs
sudo docker logs wordpress-app
sudo docker logs mysql-db

# Stop containers
sudo docker stop wordpress-app mysql-db

# Remove containers
sudo docker rm wordpress-app mysql-db
```

### Network and Volume Management
```bash
# Inspect network
sudo docker network inspect wordpress-network

# List volumes
sudo docker volume ls

# Cleanup resources
sudo docker system prune -a
```

## Scripts Documentation

### `install_docker.sh`
- Updates system packages
- Installs Docker CE
- Configures Docker service
- Sets up user permissions
- Verifies installation

### `deploy_wordpress.sh`
- Pulls Docker images (WordPress & MySQL)
- Creates Docker network
- Deploys database container
- Deploys WordPress container
- Configures container networking
- Verifies deployment
## Troubleshooting Guide

### Common Issues
1. **Docker Permission Denied**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Port 80 Already in Use**
   ```bash
   sudo netstat -tulpn | grep 80
   sudo systemctl stop httpd
   ```

3. **Container Startup Failures**
   ```bash
   sudo docker logs container-name
   sudo docker system prune
   ```

##License & Attribution

This project is part of the Learnly Africa Linux Administration assessment. All work is original and completed by Ridge Junior Abuto for educational purposes.
*Assessment Period: Learnly Africa Linux Administration Course*  
*Student: Ridge Junior Abuto*
