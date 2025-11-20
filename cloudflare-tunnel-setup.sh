#!/bin/bash

# Cloudflare Tunnel Setup Script
# Run this after the main setup.sh script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "Cloudflare Tunnel Setup"
echo "========================================="

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}cloudflared is not installed. Please run setup.sh first.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Authenticating with Cloudflare...${NC}"
echo "This will open a browser window. Please log in and authorize the tunnel."
cloudflared tunnel login

echo ""
read -p "Enter your tunnel name (default: guild-audit-tunnel): " TUNNEL_NAME
TUNNEL_NAME=${TUNNEL_NAME:-guild-audit-tunnel}

echo -e "${GREEN}Step 2: Creating tunnel '$TUNNEL_NAME'...${NC}"
TUNNEL_OUTPUT=$(cloudflared tunnel create "$TUNNEL_NAME" 2>&1)
TUNNEL_ID=$(echo "$TUNNEL_OUTPUT" | grep -oP '(?<=Created tunnel )[a-f0-9-]+' || echo "")

if [ -z "$TUNNEL_ID" ]; then
    echo -e "${YELLOW}Could not automatically extract tunnel ID.${NC}"
    echo "Please enter the tunnel ID manually:"
    read TUNNEL_ID
fi

echo -e "${GREEN}Tunnel ID: $TUNNEL_ID${NC}"

echo ""
read -p "Enter your domain (e.g., example.com) or press Enter to skip DNS setup: " DOMAIN

echo -e "${GREEN}Step 3: Creating tunnel configuration...${NC}"
sudo mkdir -p /etc/cloudflared

# Find the credentials file
CREDENTIALS_FILE="$HOME/.cloudflared/${TUNNEL_ID}.json"
if [ ! -f "$CREDENTIALS_FILE" ]; then
    # Try to find it
    CREDENTIALS_FILE=$(find "$HOME/.cloudflared" -name "*.json" | head -n 1)
fi

if [ -z "$DOMAIN" ]; then
    # No domain, just localhost
    sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
tunnel: $TUNNEL_ID
credentials-file: $CREDENTIALS_FILE

ingress:
  - service: http://localhost:80
  - service: http_status:404
EOF
else
    # With domain
    sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
tunnel: $TUNNEL_ID
credentials-file: $CREDENTIALS_FILE

ingress:
  - hostname: $DOMAIN
    service: http://localhost:80
  - service: http_status:404
EOF

    echo -e "${GREEN}Step 4: Setting up DNS record...${NC}"
    echo "Do you want to automatically create the DNS record? (y/n)"
    read -p "> " CREATE_DNS
    
    if [ "$CREATE_DNS" = "y" ] || [ "$CREATE_DNS" = "Y" ]; then
        cloudflared tunnel route dns "$TUNNEL_NAME" "$DOMAIN"
        echo -e "${GREEN}DNS record created!${NC}"
    else
        echo -e "${YELLOW}Please manually create a CNAME record in Cloudflare:${NC}"
        echo "  Type: CNAME"
        echo "  Name: @ (or your subdomain)"
        echo "  Target: ${TUNNEL_ID}.cfargotunnel.com"
        echo "  Proxy: Proxied"
    fi
fi

echo -e "${GREEN}Step 5: Installing Cloudflare Tunnel as a service...${NC}"
sudo cloudflared service install

echo -e "${GREEN}Step 6: Starting Cloudflare Tunnel service...${NC}"
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

echo -e "${GREEN}Step 7: Checking service status...${NC}"
sleep 2
sudo systemctl status cloudflared --no-pager

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Cloudflare Tunnel setup completed!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Useful commands:"
echo "  - View logs: sudo journalctl -u cloudflared -f"
echo "  - Restart: sudo systemctl restart cloudflared"
echo "  - Status: sudo systemctl status cloudflared"
echo ""

if [ -n "$DOMAIN" ]; then
    echo -e "${GREEN}Your website should be available at: https://$DOMAIN${NC}"
else
    echo -e "${YELLOW}To get your Cloudflare Tunnel URL, check the logs or Cloudflare dashboard.${NC}"
fi

