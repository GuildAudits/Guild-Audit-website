#!/bin/bash

# Guild Audit Website Setup Script for Ubuntu/Linux
# This script automates the deployment process

set -e  # Exit on error

echo "========================================="
echo "Guild Audit Website Setup Script"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run this script as root. It will use sudo when needed.${NC}"
   exit 1
fi

# Variables
WEBSITE_DIR="/var/www/guild-audit"
NGINX_SITE="guild-audit"
CURRENT_DIR=$(pwd)

echo -e "${GREEN}Step 1: Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${GREEN}Step 2: Installing required packages...${NC}"
sudo apt install -y nginx curl wget unzip

echo -e "${GREEN}Step 3: Creating website directory...${NC}"
sudo mkdir -p "$WEBSITE_DIR"
sudo chown -R $USER:$USER "$WEBSITE_DIR"

echo -e "${GREEN}Step 4: Copying website files...${NC}"
echo -e "${YELLOW}Copying files from $CURRENT_DIR to $WEBSITE_DIR${NC}"
sudo cp -r "$CURRENT_DIR"/* "$WEBSITE_DIR/" 2>/dev/null || true
sudo cp -r "$CURRENT_DIR"/.* "$WEBSITE_DIR/" 2>/dev/null || true

echo -e "${GREEN}Step 5: Setting proper permissions...${NC}"
sudo chown -R www-data:www-data "$WEBSITE_DIR"
sudo chmod -R 755 "$WEBSITE_DIR"

echo -e "${GREEN}Step 6: Creating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/$NGINX_SITE > /dev/null <<EOF
server {
    listen 9001;
    listen [::]:9001;
    server_name _;
    
    root $WEBSITE_DIR;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Main location block
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

echo -e "${GREEN}Step 7: Enabling Nginx site...${NC}"
sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default  # Remove default site if exists

echo -e "${GREEN}Step 8: Testing Nginx configuration...${NC}"
sudo nginx -t

echo -e "${GREEN}Step 9: Restarting Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl enable nginx

echo -e "${GREEN}Step 10: Installing Cloudflare Tunnel...${NC}"
# Check if cloudflared is already installed
if command -v cloudflared &> /dev/null; then
    echo -e "${YELLOW}cloudflared is already installed. Skipping installation.${NC}"
    cloudflared --version
else
    # Download latest cloudflared
    CLOUDFLARED_VERSION=$(curl -s https://api.github.com/repos/cloudflare/cloudflared/releases/latest | grep tag_name | cut -d '"' -f 4)
    ARCH=$(uname -m)
    if [ "$ARCH" = "x86_64" ]; then
        ARCH="amd64"
    elif [ "$ARCH" = "aarch64" ]; then
        ARCH="arm64"
    fi

    echo "Downloading cloudflared version $CLOUDFLARED_VERSION for $ARCH..."
    wget -q "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH}.deb" -O /tmp/cloudflared.deb
    sudo dpkg -i /tmp/cloudflared.deb || sudo apt-get install -f -y
    rm /tmp/cloudflared.deb
    echo -e "${GREEN}cloudflared installed successfully!${NC}"
fi

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test Nginx: curl http://localhost"
echo "2. Set up Cloudflare Tunnel:"
echo "   - Run: cloudflared tunnel login"
echo "   - Run: cloudflared tunnel create guild-audit-tunnel"
echo "   - Configure: sudo nano /etc/cloudflared/config.yml"
echo "   - Install service: sudo cloudflared service install"
echo "   - Start service: sudo systemctl start cloudflared"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."

