# 🚂 استقرار CHOPEX روی Railway

این راهنما نحوهٔ دیپلوی پیام‌رسان CHOPEX روی [Railway](https://railway.app) را قدم‌به‌قدم توضیح می‌دهد.
پروژه شامل `Dockerfile` و `railway.json` آماده است؛ Railway به‌صورت خودکار آن را تشخیص داده و Build می‌کند.

---

## 🎯 روش ۱: دیپلوی با Railway Dashboard (پیشنهادی — بدون نصب چیزی)

### قدم ۱: آپلود سورس روی GitHub
1. فایل `CHOPEX-railway.zip` را دانلود و استخراج کنید.
2. محتوای آن را به یک مخزن **خصوصی (Private)** روی GitHub خودتان پوش کنید:

```bash
unzip CHOPEX-railway.zip -d chopex
cd chopex
git init
git add .
git commit -m "CHOPEX messenger — initial release"
git branch -M main
git remote add origin https://github.com/<نام-کاربری-شما>/chopex.git
git push -u origin main
```

### قدم ۲: ساخت پروژه در Railway
1. وارد [railway.app](https://railway.app) شوید (با GitHub).
2. **New Project** ← **Deploy from GitHub repo** ← مخزن `chopex` را انتخاب کنید.
3. Railway به‌طور خودکار `Dockerfile` ریشه را می‌سازد (چند دقیقه طول می‌کشد).

### قدم ۳: افزودن دیتابیس PostgreSQL
1. در همان پروژه: **New** ← **Database** ← **Add PostgreSQL**.
2. روی سرویس CHOPEX کلیک کنید ← تب **Variables** ← متغیرهای زیر را اضافه کنید:

| متغیر | مقدار |
|---|---|
| `POSTGRES_URL` | `${{Postgres.DATABASE_URL}}` |
| `POSTGRES_SSL` | `true` |
| `APP_ENV` | `production` |
| `BIND_ADDRESS` | `0.0.0.0` |
| `STORAGE_PROCESSING_MODE` | `auto` |
| `REMOTE_CHANNEL_TICK_MODE` | `true` |

> 💡 `${{Postgres.DATABASE_URL}}` یک **Reference Variable** است؛ Railway خودش آدرس دیتابیس را جایگزین می‌کند.

### قدم ۴: ساختن دامنه عمومی
1. سرویس CHOPEX ← تب **Settings** ← بخش **Networking** ← **Generate Domain**.
2. Railway یک دامنه مثل `chopex-production.up.railway.app` می‌دهد و به پورت داخلی `5174` وصلش می‌کند (متغیر `PORT` خودکار تزریق می‌شود).
3. برنامه را باز کنید؛ صفحهٔ ورود CHOPEX باید بالا بیاید. 🎉

### قدم ۵: ساخت حساب مالک (Owner)
اولین کاربری که ثبت‌نام می‌کند مالک سرور می‌شود و به پنل مدیریت دسترسی دارد.

---

## 🖥️ روش ۲: دیپلوی با Railway CLI (بدون GitHub)

```bash
npm i -g @railway/cli
railway login
unzip CHOPEX-railway.zip -d chopex && cd chopex
railway init                      # پروژه جدید بسازید
railway add --database postgres   # دیتابیس اضافه کنید
railway variables --set "POSTGRES_URL=${{Postgres.DATABASE_URL}}" \
  --set "POSTGRES_SSL=true" \
  --set "APP_ENV=production" \
  --set "BIND_ADDRESS=0.0.0.0" \
  --set "STORAGE_PROCESSING_MODE=auto"
railway up                        #Build و دیپلوی
railway domain                    # ساخت دامنه عمومی
```

---

## ⚙️ متغیرهای محیطی اختیاری

| متغیر | پیش‌فرض | توضیح |
|---|---|---|
| `SIGN_UP` | `true` | اجازهٔ ثبت‌نام کاربران جدید |
| `MESSAGE_MAX_CHARS` | `4000` | حداکثر طول هر پیام (۱ تا ۲۰۰۰۰) |
| `FILE_UPLOAD_TRANSCODE_VIDEOS` | `true` | تبدیل ویدیوها با ffmpeg |
| `WORKER_PORT` | `8080` | پورت ورکر پردازش مدیا (داخلی) |
| `APP_DEBUG` | `false` | حالت دیباگ |

اگر می‌خواهید فایل‌ها روی S3/R2 ذخیره شوند به‌جای دیسک محلی، متغیرهای `STORAGE_DRIVER=remote` و کلیدهای R2 را طبق مستندات اصلی پروژه تنظیم کنید.
دیتای روی دیسک (حالت SQLite یا آپلودهای لوکال) بین دیپلوی‌ها **دوام نمی‌آورد**؛ برای محیط واقعی حتماً PostgreSQL و در صورت نیاز Object Storage استفاده کنید.

---

## 📊 پلن و منابع پیشنهادی

| پلن | مناسب برای |
|---|---|
| `Hobby` (512MB RAM) | تست و استفادهٔ خانگی چند نفره |
| `Developer` (2GB RAM) | تا ده‌ها کاربر فعال + ترنسکد ویدیو |

Health-check روی مسیر `/api/health` تنظیم شده و در صورت کرش، Railway سرویس را خودکار ری‌استارت می‌کند (`restartPolicyType: ON_FAILURE`).

---

## 🇮🇷 نکتهٔ دسترسی از ایران
دامنه‌های `*.up.railway.app` معمولاً بدون تحریم و بدون نیاز به تغییر DNS در دسترس‌اند؛ در صورت اختلال می‌توانید یک دامنهٔ اختصاصی (Custom Domain) به سرویس وصل کنید.

---

## ✅ چک‌لیست بعد از دیپلوی
- [ ] صفحهٔ ورود باز می‌شود و لوگوی CHOPEX دیده می‌شود.
- [ ] اولین حساب ساخته شد (مالک).
- [ ] از تنظیمات ← **زبان** ← **فارسی** کل رابط راست‌چین شد.
- [ ] ارسال پیام، عکس و فایل تست شد.
- [ ] پنل مدیریت (`/admin`) باز می‌شود.
