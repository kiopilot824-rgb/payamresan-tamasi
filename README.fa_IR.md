[English](/README.md) | [فارسی](/README.fa_IR.md)

<div align="center">

# <img src="./client/public/songbird-logo.svg" alt="Songbird"> Songbird

[![Version](https://img.shields.io/github/v/release/bllackbull/Songbird?label=version&color=blue)](https://github.com/bllackbull/Songbird/releases)
![Build](https://img.shields.io/github/actions/workflow/status/bllackbull/Songbird/build.yml)
[![Last commit](https://img.shields.io/github/last-commit/bllackbull/Songbird)](https://github.com/bllackbull/Songbird/commits/main/)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/bllackbull/Songbird)
[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy?repo=https://github.com/bllackbull/Songbird)

**پلتفرم پیام‌رسان امن و سبک برای میزبانی شخصی**

</div>

## قابلیت‌های کلیدی

- 💬 **انواع چت**: پیام مستقیم، گروه و کانال
- 📁 **پشتیبانی از رسانه**: آپلود فایل، پیام صوتی، تبدیل ویدئو
- 🔔 **Push Notification**: اعلان وب با VAPID
- 📡 **کانال‌های ریموت**: آینه‌کردن کانال‌های Telegram یا Songbird (نسخه v0.10.3+)
- 🛡️ **پنل مدیریت**: رابط مدیریتی کامل با نقش مالک (نسخه v0.11.0+)
- 🔒 **امنیت**: رمزنگاری، هش bcrypt، محدودیت نرخ
- 📱 **PWA**: اپلیکیشن وب نصب‌شدنی
- ☁️ **نصب ابری**: نصب به صورت PaaS و CaaS با پشتیبانی از فضای ابری
- 🌍 **چندزبانه**: پشتیبانی از انگلیسی و فارسی

## نصب سریع

ساده‌ترین روش نصب Songbird، اسکریپت نصب آسان است. روی یک سرور Ubuntu (نسخه 22.04+) با دسترسی `sudo` این دستور را اجرا کنید:

```bash
curl -fsSL https://raw.githubusercontent.com/bllackbull/Songbird/main/scripts/install.sh | bash
```

این اسکریپت پیش‌نیازها را نصب می‌کند، برنامه را build می‌کند، Nginx را کانفیگ می‌کند و می‌تواند SSL را هم برایتان راه‌اندازی کند. بعد از نصب، هر زمان با این دستور دوباره به آن دسترسی دارید:

```bash
songbird-deploy
```

> [!TIP]
> داشتن یک دامنه که به IP عمومی سرور شما اشاره کند پیشنهاد می‌شود، و برای push notification به HTTPS نیاز دارید (به‌جز روی `localhost`).

## مستندات

مستندات کامل در [CHOPEX در گیت‌هاب](https://github.com/chopex-messenger/chopex#readme) قرار دارد:

- [اسکریپت نصب](https://github.com/chopex-messenger/chopex#readme)
- [نصب از طریق Docker](https://github.com/chopex-messenger/chopex#readme)
- [نصب ابری](https://github.com/chopex-messenger/chopex#readme)
- [نصب دستی](https://github.com/chopex-messenger/chopex#readme)
- [کانفیگ Nginx](https://github.com/chopex-messenger/chopex#readme)
- [گواهی‌های SSL](https://github.com/chopex-messenger/chopex#readme)
- [اجرا پشت CDN](https://github.com/chopex-messenger/chopex#readme)
- [اجرا روی دامنه + subpath](https://github.com/chopex-messenger/chopex#readme)
- [متغیرهای محیطی](https://github.com/chopex-messenger/chopex#readme)
- [فضای ابری](https://github.com/chopex-messenger/chopex#readme)
- [ورکر مدیا](https://github.com/chopex-messenger/chopex#readme)
- [پنل مدیریت](https://github.com/chopex-messenger/chopex#readme)
- [راه‌اندازی Remote Channel](https://github.com/chopex-messenger/chopex#readme)
- [پراکسی Push Notification](https://github.com/chopex-messenger/chopex#readme)
- [به‌روزرسانی برنامه](https://github.com/chopex-messenger/chopex#readme)
- [دستورات دیتابیس](https://github.com/chopex-messenger/chopex#readme)
- [عیب‌یابی](https://github.com/chopex-messenger/chopex#readme)

## نویسنده

- سازنده: [@bllackbull](https://github.com/bllackbull)
- مشارکت کنندگان: [@nkhalili](https://github.com/nkhalili), [@modos](https://github.com/modos), [@iPmartNetwork](https://github.com/iPmartNetwork)

## مشارکت

- از تقاضای مشارکت، استقبال میشود.
- اگر قصد مشارکت دارید، اول در این آدرس issue باز کنید: `https://github.com/bllackbull/Songbird/issues`
- برای هماهنگی مستقیم، قبل از باز کردن PR با [@bllackbull](https://github.com/bllackbull) در GitHub در ارتباط باشید.
- برای اطلاعات بیشتر، راهنمای [Contributing](/CONTRIBUTING.md) را ببینید.

## حمایت

اگر این پروژه را دوست دارید، می‌توانید از آن حمایت کنید:

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

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است. برای جزئیات بیشتر، فایل [LICENSE](LICENSE) را ببینید.
