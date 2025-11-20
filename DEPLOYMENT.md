# Deployment Guide: Guild Audit Website on Ubuntu/Linux with Cloudflare Tunnel

This guide will help you deploy the Guild Audit website on an Ubuntu/Linux server and expose it through Cloudflare Tunnel.

## Prerequisites

- Ubuntu 20.04+ or any Linux distribution
- Root or sudo access
- A Cloudflare account
- Domain name managed by Cloudflare (optional, but recommended)

## Step 1: Server Setup

### 1.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Required Packages

```bash
sudo apt install -y nginx curl wget unzip
```

## Step 2: Deploy Website Files

### 2.1 Create Website Directory

```bash
sudo mkdir -p /var/www/guild-audit
sudo chown -R $USER:$USER /var/www/guild-audit
```

### 2.2 Upload Website Files

You can use one of these methods:

**Option A: Using Git (if repository is available)**
```bash
cd /var/www/guild-audit
git clone <your-repo-url> .
```

**Option B: Using SCP (from your local machine)**
```bash
# From your local machine
scp -r /path/to/Guild-Audit-website/* user@your-server:/var/www/guild-audit/
```

**Option C: Using rsync (from your local machine)**
```bash
# From your local machine
rsync -avz --progress /path/to/Guild-Audit-website/ user@your-server:/var/www/guild-audit/
```

### 2.3 Set Proper Permissions

```bash
sudo chown -R www-data:www-data /var/www/guild-audit
sudo chmod -R 755 /var/www/guild-audit
```

## Step 3: Configure Nginx

### 3.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/guild-audit
```

Add the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;  # Replace with your domain if you have one
    
    root /var/www/guild-audit;
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
        try_files $uri $uri/ /index.html;
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
```

### 3.2 Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/guild-audit /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 3.3 Verify Nginx is Running

```bash
sudo systemctl status nginx
```

You should see the website at `http://your-server-ip` (if firewall allows).

## Step 4: Install and Configure Cloudflare Tunnel

### 4.1 Install cloudflared

```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install it
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

### 4.2 Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will open a browser window. Log in to your Cloudflare account and authorize the tunnel.

### 4.3 Create a Tunnel

```bash
# Create a new tunnel (replace 'guild-audit-tunnel' with your preferred name)
cloudflared tunnel create guild-audit-tunnel
```

Note the tunnel ID that is displayed.

### 4.4 Create Tunnel Configuration

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Add the following configuration:

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /home/$USER/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: your-domain.com  # Replace with your domain
    service: http://localhost:80
  - service: http_status:404
```

**Note:** Replace `<YOUR_TUNNEL_ID>` with the actual tunnel ID from step 4.3, and `your-domain.com` with your actual domain.

### 4.5 Configure DNS (if you have a domain)

```bash
cloudflared tunnel route dns guild-audit-tunnel your-domain.com
```

Or manually add a CNAME record in Cloudflare DNS:
- Type: CNAME
- Name: @ (or subdomain)
- Target: `<TUNNEL_ID>.cfargotunnel.com`
- Proxy status: Proxied

### 4.6 Install Cloudflare Tunnel as a Service

```bash
sudo cloudflared service install
```

### 4.7 Start and Enable the Service

```bash
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
sudo systemctl status cloudflared
```

## Step 5: Firewall Configuration (if using UFW)

```bash
# Allow SSH (important - don't lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP (for local testing, Cloudflare Tunnel doesn't need this)
sudo ufw allow 80/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

**Note:** Cloudflare Tunnel doesn't require opening ports 80/443 on your firewall since it creates an outbound connection. However, you may want to keep port 80 open for local testing.

## Step 6: Verify Deployment

1. **Test locally on server:**
   ```bash
   curl http://localhost
   ```

2. **Test through Cloudflare Tunnel:**
   Visit your domain in a browser (e.g., `https://your-domain.com`)

3. **Check logs:**
   ```bash
   # Nginx logs
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   
   # Cloudflare Tunnel logs
   sudo journalctl -u cloudflared -f
   ```

## Troubleshooting

### Nginx Issues

- **Check Nginx configuration:**
  ```bash
  sudo nginx -t
  ```

- **Restart Nginx:**
  ```bash
  sudo systemctl restart nginx
  ```

- **Check Nginx status:**
  ```bash
  sudo systemctl status nginx
  ```

### Cloudflare Tunnel Issues

- **Check tunnel status:**
  ```bash
  sudo systemctl status cloudflared
  ```

- **View tunnel logs:**
  ```bash
  sudo journalctl -u cloudflared -n 50
  ```

- **Test tunnel manually:**
  ```bash
  sudo cloudflared tunnel --config /etc/cloudflared/config.yml run
  ```

- **List tunnels:**
  ```bash
  cloudflared tunnel list
  ```

### Permission Issues

If you encounter permission errors:
```bash
sudo chown -R www-data:www-data /var/www/guild-audit
sudo chmod -R 755 /var/www/guild-audit
```

## Maintenance

### Updating the Website

1. Upload new files to `/var/www/guild-audit`
2. Set proper permissions:
   ```bash
   sudo chown -R www-data:www-data /var/www/guild-audit
   ```
3. No need to restart services for static files

### Updating Cloudflare Tunnel

```bash
# Update cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
sudo systemctl restart cloudflared
```

## Security Recommendations

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use HTTPS (Cloudflare Tunnel provides this automatically)**

3. **Regular backups:**
   ```bash
   # Create a backup script
   tar -czf /backup/guild-audit-$(date +%Y%m%d).tar.gz /var/www/guild-audit
   ```

4. **Monitor logs regularly**

5. **Consider using fail2ban for additional security**

## Additional Resources

- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Cloudflare Zero Trust](https://www.cloudflare.com/products/zero-trust/)

