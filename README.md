[English](/README.md) | [فارسی](/README.fa_IR.md)

<div align="center">

# <img src="./client/public/songbird-logo.svg" alt="CHOPEX"> CHOPEX

**Secure, lightweight and self-hosted chat platform** — with full Persian (RTL) interface support.

> 🚂 **Deploying on Railway?** Read the step-by-step Persian guide: [RAILWAY-DEPLOY-FA.md](./RAILWAY-DEPLOY-FA.md)

</div>

## Key Features

- 💬 **Chat Types**: Direct messages, groups, and channels
- 📁 **Media Support**: File uploads, voice messages, video transcoding
- 🔔 **Push Notifications**: Web push with VAPID
- 📡 **Remote Channels**: Mirror Telegram channels (v0.10.3+)
- 🛡️ **Admin Panel**: Full management interface with owner role (v0.11.0+)
- 🔒 **Security**: Encryption at rest, bcrypt hashing, rate limiting
- 📱 **PWA**: Installable progressive web app
- ☁️ **Cloud Deployment**: PaaS and CaaS deployment with object storage support
- 🌍 **i18n**: English and Persian/Farsi (full RTL) support — switch from **Settings → Language**

## Quick Start

The easiest way to install Songbird is the deployment script. On an Ubuntu server (22.04+) with sudo access, run:

```bash
curl -fsSL https://raw.githubusercontent.com/bllackbull/Songbird/main/scripts/install.sh | bash
```

The script handles dependencies, builds the app, configures Nginx, and can set up SSL for you. After installation, access it again anytime with:

```bash
songbird-deploy
```

> [!TIP]
> A domain name pointing to your server's public IP is recommended, and HTTPS is required for push notifications (except on `localhost`).

## Documentation

Full documentation lives at [CHOPEX on GitHub](https://github.com/chopex-messenger/chopex#readme):

- [Deployment Script](https://github.com/chopex-messenger/chopex#readme)
- [Install via Docker](https://github.com/chopex-messenger/chopex#readme)
- [Cloud Deployment](https://github.com/chopex-messenger/chopex#readme)
- [Manual Installation](https://github.com/chopex-messenger/chopex#readme)
- [Configure Nginx](https://github.com/chopex-messenger/chopex#readme)
- [SSL Certificates](https://github.com/chopex-messenger/chopex#readme)
- [Running behind a CDN](https://github.com/chopex-messenger/chopex#readme)
- [Running behind a domain + subpath](https://github.com/chopex-messenger/chopex#readme)
- [Environment Variables](https://github.com/chopex-messenger/chopex#readme)
- [Object Storage](https://github.com/chopex-messenger/chopex#readme)
- [Media Worker](https://github.com/chopex-messenger/chopex#readme)
- [Admin Panel](https://github.com/chopex-messenger/chopex#readme)
- [Remote Channel Setup](https://github.com/chopex-messenger/chopex#readme)
- [Push Notification Proxy](https://github.com/chopex-messenger/chopex#readme)
- [Updating the deployed app](https://github.com/chopex-messenger/chopex#readme)
- [Database Commands](https://github.com/chopex-messenger/chopex#readme)
- [Troubleshooting](https://github.com/chopex-messenger/chopex#readme)

## Author

- Maintainer: [@bllackbull](https://github.com/bllackbull)
- Contributors: [@nkhalili](https://github.com/nkhalili), [@modos](https://github.com/modos), [@iPmartNetwork](https://github.com/iPmartNetwork)

## Contributing

- Contributions are welcome.
- If you want to contribute, contact the maintainer first by opening an issue at: `https://github.com/bllackbull/Songbird/issues`
- For direct coordination, reach out to [@bllackbull](https://github.com/bllackbull) on GitHub before opening a PR.
- Checkout [Contributing](/CONTRIBUTING.md) guideline for more information.

## Support

If you like this project which I hope you do, consider supporting your favorite project:

<a href="https://nowpayments.io/donation?api_key=0b61dd3e-6508-4849-ad92-1dde65442937" target="_blank" rel="noreferrer noopener">
    <img src="https://nowpayments.io/images/embeds/donation-button-black.svg" alt="Crypto donation button by NOWPayments">
</a>

### TRX:

```
TPf1bEhipKpGkjo5N2Scj9nufNNh5TNrwX
```

### BTC:

```
bc1q9hupvcc39juhf0k7rgzn6phn8s8jez365kzmuj
```

### TON:

```
UQDzQ3xbWzKQvw8X8sWU82dksBeYqTHrT9sLzhBOyaESPjVy
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
