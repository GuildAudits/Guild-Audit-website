#!/bin/bash

# Cloudflare Tunnel Troubleshooting Script

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "Cloudflare Tunnel Troubleshooting"
echo "========================================="
echo ""

# Check if config file exists
if [ ! -f "/etc/cloudflared/config.yml" ]; then
    echo -e "${RED}Error: Config file not found at /etc/cloudflared/config.yml${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Checking configuration file...${NC}"
echo "Current config:"
echo "----------------------------------------"
sudo cat /etc/cloudflared/config.yml
echo "----------------------------------------"
echo ""

# Extract tunnel ID from config
TUNNEL_ID=$(sudo grep -E "^tunnel:" /etc/cloudflared/config.yml | awk '{print $2}' | tr -d '"' | tr -d "'")
CREDENTIALS_PATH=$(sudo grep -E "^credentials-file:" /etc/cloudflared/config.yml | awk '{print $2}' | tr -d '"' | tr -d "'")

echo -e "${GREEN}Step 2: Checking tunnel ID and credentials...${NC}"
echo "Tunnel ID from config: $TUNNEL_ID"
echo "Credentials file path: $CREDENTIALS_PATH"
echo ""

# Check if credentials file exists
if [ -z "$CREDENTIALS_PATH" ]; then
    echo -e "${RED}Error: credentials-file not found in config${NC}"
    exit 1
fi

if [ ! -f "$CREDENTIALS_PATH" ]; then
    echo -e "${RED}Error: Credentials file not found at $CREDENTIALS_PATH${NC}"
    echo ""
    echo -e "${YELLOW}Looking for credentials files in ~/.cloudflared/...${NC}"
    ls -la ~/.cloudflared/*.json 2>/dev/null || echo "No .json files found in ~/.cloudflared/"
    echo ""
    echo "Please check if the credentials file path is correct."
    exit 1
else
    echo -e "${GREEN}Credentials file exists${NC}"
fi

# Check if tunnel ID matches credentials file
CREDENTIALS_TUNNEL_ID=$(basename "$CREDENTIALS_PATH" .json)
if [ "$TUNNEL_ID" != "$CREDENTIALS_TUNNEL_ID" ]; then
    echo -e "${YELLOW}Warning: Tunnel ID in config ($TUNNEL_ID) doesn't match credentials filename ($CREDENTIALS_TUNNEL_ID)${NC}"
fi

echo ""
echo -e "${GREEN}Step 3: Listing all tunnels...${NC}"
cloudflared tunnel list
echo ""

echo -e "${GREEN}Step 4: Checking service status...${NC}"
sudo systemctl status cloudflared --no-pager -l
echo ""

echo -e "${GREEN}Step 5: Recent logs (last 20 lines)...${NC}"
sudo journalctl -u cloudflared -n 20 --no-pager
echo ""

echo "========================================="
echo "Troubleshooting Steps:"
echo "========================================="
echo ""
echo "1. Verify the tunnel ID matches:"
echo "   - Config file tunnel ID: $TUNNEL_ID"
echo "   - Check: cloudflared tunnel list"
echo ""
echo "2. Verify credentials file:"
echo "   - Path: $CREDENTIALS_PATH"
echo "   - Should match tunnel ID: ${TUNNEL_ID}.json"
echo ""
echo "3. If tunnel ID is wrong, update config:"
echo "   sudo nano /etc/cloudflared/config.yml"
echo ""
echo "4. If credentials are missing, re-authenticate:"
echo "   cloudflared tunnel login"
echo ""
echo "5. After fixing, restart service:"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl restart cloudflared"
echo ""

