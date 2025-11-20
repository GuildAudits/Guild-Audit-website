#!/bin/bash

# Deployment Verification Script

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "Deployment Verification"
echo "========================================="
echo ""

# Check Nginx
echo -e "${GREEN}1. Checking Nginx service...${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}   ✓ Nginx is running${NC}"
else
    echo -e "${RED}   ✗ Nginx is not running${NC}"
    echo "   Run: sudo systemctl start nginx"
fi

# Check if Nginx is listening on port 9001
echo ""
echo -e "${GREEN}2. Checking if Nginx is listening on port 9001...${NC}"
if sudo netstat -tlnp 2>/dev/null | grep -q ":9001 " || sudo ss -tlnp 2>/dev/null | grep -q ":9001 "; then
    echo -e "${GREEN}   ✓ Port 9001 is listening${NC}"
else
    echo -e "${RED}   ✗ Port 9001 is not listening${NC}"
fi

# Test localhost connection
echo ""
echo -e "${GREEN}3. Testing localhost:9001 connection...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9001 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}   ✓ Localhost responds with HTTP $HTTP_CODE${NC}"
else
    echo -e "${RED}   ✗ Localhost returned HTTP $HTTP_CODE${NC}"
    echo "   Check: curl http://localhost"
fi

# Check Cloudflare Tunnel service
echo ""
echo -e "${GREEN}4. Checking Cloudflare Tunnel service...${NC}"
if systemctl is-active --quiet cloudflared; then
    echo -e "${GREEN}   ✓ Cloudflare Tunnel service is running${NC}"
else
    echo -e "${RED}   ✗ Cloudflare Tunnel service is not running${NC}"
    echo "   Run: sudo systemctl start cloudflared"
fi

# Check tunnel connections
echo ""
echo -e "${GREEN}5. Checking tunnel connection status...${NC}"
RECENT_LOGS=$(sudo journalctl -u cloudflared -n 50 --no-pager 2>/dev/null)
if echo "$RECENT_LOGS" | grep -q "Registered tunnel connection"; then
    REGISTERED_COUNT=$(echo "$RECENT_LOGS" | grep -c "Registered tunnel connection" || echo "0")
    echo -e "${GREEN}   ✓ Found $REGISTERED_COUNT registered tunnel connection(s)${NC}"
else
    echo -e "${YELLOW}   ⚠ No registered connections found in recent logs${NC}"
fi

# Check for errors
echo ""
echo -e "${GREEN}6. Checking for errors in tunnel logs...${NC}"
ERROR_COUNT=$(echo "$RECENT_LOGS" | grep -c "ERR" || echo "0")
WARN_COUNT=$(echo "$RECENT_LOGS" | grep -c "WRN" || echo "0")

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}   ⚠ Found $ERROR_COUNT error(s) in recent logs${NC}"
    echo "   Recent errors:"
    echo "$RECENT_LOGS" | grep "ERR" | tail -3 | sed 's/^/      /'
else
    echo -e "${GREEN}   ✓ No errors found${NC}"
fi

if [ "$WARN_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}   ⚠ Found $WARN_COUNT warning(s) in recent logs${NC}"
    echo "   (Some warnings are normal - Cloudflare Tunnel maintains multiple connections)"
fi

# Check config file
echo ""
echo -e "${GREEN}7. Checking tunnel configuration...${NC}"
if [ -f "/etc/cloudflared/config.yml" ]; then
    echo -e "${GREEN}   ✓ Config file exists${NC}"
    TUNNEL_ID=$(sudo grep -E "^tunnel:" /etc/cloudflared/config.yml 2>/dev/null | awk '{print $2}' | tr -d '"' | tr -d "'")
    if [ -n "$TUNNEL_ID" ]; then
        echo "   Tunnel ID: $TUNNEL_ID"
    fi
    SERVICE=$(sudo grep -E "service:" /etc/cloudflared/config.yml 2>/dev/null | head -1 | awk '{print $2}')
    if [ -n "$SERVICE" ]; then
        echo "   Service: $SERVICE"
    fi
else
    echo -e "${RED}   ✗ Config file not found${NC}"
fi

# Check website files
echo ""
echo -e "${GREEN}8. Checking website files...${NC}"
if [ -f "/var/www/guild-audit/index.html" ]; then
    echo -e "${GREEN}   ✓ Website files found${NC}"
    FILE_COUNT=$(find /var/www/guild-audit -type f | wc -l)
    echo "   Total files: $FILE_COUNT"
else
    echo -e "${RED}   ✗ Website files not found at /var/www/guild-audit${NC}"
fi

echo ""
echo "========================================="
echo "Summary"
echo "========================================="
echo ""
echo "If all checks pass, your deployment should be working!"
echo ""
echo "To test your website:"
echo "  1. Local: curl http://localhost:9001"
echo "  2. Via server IP: curl http://YOUR_SERVER_IP:9001"
echo "  3. Through tunnel: Visit your Cloudflare domain"
echo ""
echo "To view live logs:"
echo "  sudo journalctl -u cloudflared -f"
echo "  sudo journalctl -u nginx -f"
echo ""

