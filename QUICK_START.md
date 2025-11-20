# Quick Start Guide

## Prerequisites
- Ubuntu 20.04+ or Linux server
- SSH access with sudo privileges
- Cloudflare account

## Quick Deployment (Automated)

### Step 1: Upload Files to Server

From your local machine:
```bash
# Using rsync (recommended)
rsync -avz --progress ./ user@your-server:/tmp/guild-audit/

# Or using SCP
scp -r . user@your-server:/tmp/guild-audit/
```

### Step 2: Run Setup Scripts on Server

SSH into your server:
```bash
ssh user@your-server
cd /tmp/guild-audit
chmod +x setup.sh cloudflare-tunnel-setup.sh
./setup.sh
```

### Step 3: Configure Cloudflare Tunnel

After the main setup completes:
```bash
./cloudflare-tunnel-setup.sh
```

Follow the prompts to:
1. Authenticate with Cloudflare (browser will open)
2. Create a tunnel
3. Configure your domain (optional)

## Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed manual setup instructions.

## Verification

1. **Run verification script (recommended):**
   ```bash
   ./verify-deployment.sh
   ```
   This will check all services, connections, and configuration.

2. **Test locally:**
   ```bash
   curl http://localhost:9001
   ```

3. **Test via server IP:**
   ```bash
   curl http://YOUR_SERVER_IP:9001
   ```
   (Make sure firewall allows port 9001)

4. **Check services:**
   ```bash
   sudo systemctl status nginx
   sudo systemctl status cloudflared
   ```

4. **View logs:**
   ```bash
   # Nginx
   sudo tail -f /var/log/nginx/access.log
   
   # Cloudflare Tunnel
   sudo journalctl -u cloudflared -f
   ```
   
   **Note:** Some connection warnings in Cloudflare Tunnel logs are normal. Look for "Registered tunnel connection" - at least one should be registered.

## Troubleshooting

- **Nginx not working?** Check: `sudo nginx -t` and `sudo systemctl status nginx`
- **Tunnel not connecting?** Check: `sudo journalctl -u cloudflared -n 50`
- **Permission errors?** Run: `sudo chown -R www-data:www-data /var/www/guild-audit`

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md).

