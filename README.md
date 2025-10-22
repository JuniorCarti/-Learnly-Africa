# Learnly Africa - Linux Administration Assessment

## Student Information
| **Field** | **Details** |
|-----------|-------------|
| **Name** | Ridge Junior Abuto |
| **Email** | ridgejunior204@gmail.com |
| **GitHub** | [JuniorCarti](https://github.com/JuniorCarti) |
| **Assessment** | Linux System Administration |
| **Organization** | Learnly Africa |

## Deployment Information
| **Resource** | **Details** |
|-------------|-------------|
| **EC2 Public IP** | `34.222.107.92` |
| **EC2 Private IP** | `10.0.10.25` |
| **Website URL** | http://34.222.107.92 |
| **GitHub Repository** | https://github.com/JuniorCarti/-Learnly-Africa.git |
| **AWS Region** | us-west-2 |

## Assessment Overview
This project demonstrates comprehensive Linux system administration skills through the deployment of a containerized WordPress application on AWS EC2. The assessment covers all aspects of modern DevOps practices from infrastructure setup to application deployment.
### Part 1: GitHub Account Setup
- ✅ Professional GitHub account created
- ✅ Repository established: `Learnly-Africa`

### Part 2: AWS EC2 Setup
- ✅ EC2 instance named "learnly" created
- ✅ Sandbox environment utilized
- ✅ Instance running with public IP: `34.222.107.92`

### Part 3: SSH Access and Shell Customization
- ✅ Secure SSH connection established
- ✅ Shell prompt customized (`$` to `#`)
- ✅ Terminal environment configured

### Part 4: User Management
- ✅ New user `learnly` created
- ✅ Full permissions (read, write, execute) configured
- ✅ User switching and privilege management

### Part 5: Bash Scripting and Docker Installation
- ✅ `install_docker.sh` script created and executed
- ✅ Automated system updates and package management
- ✅ Docker service installed, configured, and verified

### Part 6: Docker Configuration
- ✅ WordPress and MySQL containers deployed
- ✅ Docker networking configured

## 🛠️ Technical Implementation
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
| `mysql-db` | `mysql:8.0` | Database Server | ✅ Running |
| `wordpress-app` | `wordpress:latest` | Web Application | ✅ Running |

## 📁 Project Structure
```
Learnly-Africa/
├── 📄 README.md                    # Project documentation
├── ⚡ install_docker.sh            # Docker installation automation
├── 🚀 deploy_wordpress.sh         # Application deployment script
```

## 🚀 Quick Start Guide

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

# Check system status
./verify.sh
```

## 🐳 Docker Commands Reference

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

## 🔧 Scripts Documentation

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
- 
- **GitHub Issues**: [Create Issue](https://github.com/JuniorCarti/-Learnly-Africa/issues)

## 📄 License & Attribution

This project is part of the Learnly Africa Linux Administration assessment. All work is original and completed by Ridge Junior Abuto for educational purposes.
*Student: Ridge Junior Abuto*
