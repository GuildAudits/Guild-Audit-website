# Guild Audit Website

Static website for Guild Audits - Full stack Web3 security services.

## Project Structure

This is a static website built with Framer, containing:
- Main HTML files (`index.html`, `about-us.html`, `form.html`)
- Static assets (CSS, JavaScript, images, fonts)
- External dependencies from Framer CDN

## Deployment

### Quick Start

For a quick automated setup, see [QUICK_START.md](./QUICK_START.md).

### Detailed Guide

For comprehensive deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Server Requirements

- **OS:** Ubuntu 20.04+ or any Linux distribution
- **Web Server:** Nginx (installed by setup script)
- **Tunnel:** Cloudflare Tunnel (cloudflared)
- **Storage:** ~500MB for website files
- **Port:** 9001 (configurable)

## Deployment Options

### Option 1: Automated Setup (Recommended)

1. Upload files to server
2. Run `./setup.sh` to set up Nginx and website
3. Run `./cloudflare-tunnel-setup.sh` to configure Cloudflare Tunnel

### Option 2: Manual Setup

Follow the step-by-step instructions in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Files

- `setup.sh` - Automated setup script for Nginx and website deployment
- `cloudflare-tunnel-setup.sh` - Automated Cloudflare Tunnel configuration
- `change-port.sh` - Script to change the port of an existing deployment
- `verify-deployment.sh` - Script to verify deployment status
- `troubleshoot-tunnel.sh` - Script to troubleshoot Cloudflare Tunnel issues
- `DEPLOYMENT.md` - Comprehensive deployment guide
- `QUICK_START.md` - Quick reference for deployment

## Local Development

This is a static website. To test locally:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Maintenance

### Updating the Website

1. Upload new files to `/var/www/guild-audit` on the server
2. Set permissions: `sudo chown -R www-data:www-data /var/www/guild-audit`
3. No service restart needed for static files

### Updating Cloudflare Tunnel

```bash
# Update cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
sudo systemctl restart cloudflared
```

## Support

For deployment issues, refer to the troubleshooting section in [DEPLOYMENT.md](./DEPLOYMENT.md).

