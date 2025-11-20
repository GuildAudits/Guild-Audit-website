#!/bin/bash

# Script to change the port of an existing deployment
# Usage: ./change-port.sh [new_port]

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

NEW_PORT=${1:-9001}

echo "========================================="
echo "Changing Nginx Port to $NEW_PORT"
echo "========================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run this script as root. It will use sudo when needed.${NC}"
   exit 1
fi

# Check if Nginx config exists
if [ ! -f "/etc/nginx/sites-available/guild-audit" ]; then
    echo -e "${RED}Error: Nginx config not found at /etc/nginx/sites-available/guild-audit${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Updating Nginx configuration...${NC}"
# Backup current config
sudo cp /etc/nginx/sites-available/guild-audit /etc/nginx/sites-available/guild-audit.backup

# Update port in config
sudo sed -i "s/listen [0-9]*;/listen $NEW_PORT;/g" /etc/nginx/sites-available/guild-audit
sudo sed -i "s/listen \[::\]:[0-9]*;/listen [::]:$NEW_PORT;/g" /etc/nginx/sites-available/guild-audit

echo -e "${GREEN}Step 2: Testing Nginx configuration...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}   ✓ Configuration is valid${NC}"
else
    echo -e "${RED}   ✗ Configuration test failed. Restoring backup...${NC}"
    sudo cp /etc/nginx/sites-available/guild-audit.backup /etc/nginx/sites-available/guild-audit
    exit 1
fi

echo -e "${GREEN}Step 3: Restarting Nginx...${NC}"
sudo systemctl restart nginx

echo -e "${GREEN}Step 4: Updating Cloudflare Tunnel configuration...${NC}"
if [ -f "/etc/cloudflared/config.yml" ]; then
    # Backup tunnel config
    sudo cp /etc/cloudflared/config.yml /etc/cloudflared/config.yml.backup
    
    # Update port in tunnel config
    sudo sed -i "s|service: http://localhost:[0-9]*|service: http://localhost:$NEW_PORT|g" /etc/cloudflared/config.yml
    
    echo -e "${GREEN}   ✓ Tunnel config updated${NC}"
    echo -e "${YELLOW}   Restarting Cloudflare Tunnel...${NC}"
    sudo systemctl daemon-reload
    sudo systemctl restart cloudflared
else
    echo -e "${YELLOW}   ⚠ Tunnel config not found. Skipping tunnel update.${NC}"
fi

echo -e "${GREEN}Step 5: Updating firewall (if UFW is active)...${NC}"
if sudo ufw status | grep -q "Status: active"; then
    echo -e "${YELLOW}   UFW is active. You may need to allow port $NEW_PORT:${NC}"
    echo "   Run: sudo ufw allow $NEW_PORT/tcp"
else
    echo -e "${GREEN}   UFW is not active. No firewall changes needed.${NC}"
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Port change completed!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Your website is now running on port $NEW_PORT"
echo ""
echo "Test it:"
echo "  - Local: curl http://localhost:$NEW_PORT"
echo "  - Via IP: curl http://YOUR_SERVER_IP:$NEW_PORT"
echo ""
echo "If you need to allow the port in firewall:"
echo "  sudo ufw allow $NEW_PORT/tcp"
echo ""

