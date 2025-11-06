# راهنمای آپلود در GitHub

## 🚀 مراحل آپلود پروژه در GitHub

### مرحله 1: ایجاد ریپازیتوری در GitHub

1. **ورود به GitHub**
   - به [github.com](https://github.com) بروید
   - وارد حساب کاربری خود شوید (اگر حساب ندارید، بسازید)

2. **ایجاد ریپازیتوری جدید**
   - روی دکمه "New" یا "+" در بالا سمت راست کلیک کنید
   - "New repository" را انتخاب کنید

3. **تنظیمات ریپازیتوری**
   ```
   Repository name: shoe-inventory-management
   Description: سیستم مدیریت موجودی کفش - Shoe Store Inventory Management System
   Visibility: Public (یا Private اگر می‌خواهید خصوصی باشد)
   ✅ Add a README file: تیک بزنید
   ✅ Add .gitignore: Node را انتخاب کنید
   ✅ Choose a license: MIT License را انتخاب کنید
   ```

4. **ایجاد ریپازیتوری**
   - روی "Create repository" کلیک کنید

### مرحله 2: آپلود فایل‌ها

#### روش 1: آپلود مستقیم از مرورگر (ساده‌ترین روش)

1. **در صفحه ریپازیتوری تازه ایجاد شده**
   - روی "uploading an existing file" کلیک کنید
   - یا به "Add file" > "Upload files" بروید

2. **انتخاب فایل‌ها**
   - تمام فایل‌های پروژه را انتخاب کنید:
     - `index.html`
     - `styles.css`
     - `app.js`
     - `README.md`
     - `package.json`
     - `sw.js`

3. **Commit کردن**
   - در بخش "Commit message" بنویسید: `Initial commit - Shoe Inventory Management System`
   - روی "Commit changes" کلیک کنید

#### روش 2: استفاده از Git Commands (پیشرفته‌تر)

```bash
# Clone کردن ریپازیتوری
git clone https://github.com/USERNAME/shoe-inventory-management.git
cd shoe-inventory-management

# کپی کردن فایل‌ها به پوشه پروژه
# (فایل‌های پروژه را در این پوشه کپی کنید)

# Add کردن فایل‌ها
git add .

# Commit کردن
git commit -m "Initial commit - Shoe Inventory Management System"

# Push کردن به GitHub
git push origin main
```

### مرحله 3: فعال‌سازی GitHub Pages

1. **رفتن به تنظیمات**
   - در ریپازیتوری، روی تب "Settings" کلیک کنید

2. **تنظیم Pages**
   - در منوی سمت چپ، روی "Pages" کلیک کنید
   - در بخش "Source":
     - "Deploy from a branch" را انتخاب کنید
     - Branch: "main" (یا "master")
     - Folder: "/ (root)"
   - روی "Save" کلیک کنید

3. **انتشار**
   - پس از چند دقیقه، پیامی می‌بینید که سایت آماده است
   - آدرس سایت شما: `https://USERNAME.github.io/shoe-inventory-management`

### مرحله 4: بهینه‌سازی برای موبایل (اختیاری)

برای بهتر شدن تجربه کاربری در موبایل، یک فایل `manifest.json` اضافه کنید:

```json
{
  "name": "سیستم مدیریت موجودی کفش",
  "short_name": "موجودی کفش",
  "description": "سیستم مدیریت موجودی و فروش مغازه کفش",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F9FAFB",
  "theme_color": "#0066FF",
  "icons": [
    {
      "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 24 24' fill='none' stroke='%230066FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

### مرحله 5: مدیریت و به‌روزرسانی

#### آپلود تغییرات جدید:

1. **در ریپازیتوری GitHub**
   - روی "Add file" > "Upload files" کلیک کنید
   - فایل‌های جدید را انتخاب کنید
   - Commit message مناسب بنویسید
   - "Commit changes" کنید

2. **استفاده از Git (پیشرفته)**
```bash
git add .
git commit -m "Update: توضیح تغییرات"
git push origin main
```

#### پشتیبان‌گیری از داده‌ها:

```bash
# Export کردن داده‌ها از اپلیکیشن
# (در مرورگر: دکمه "خروجی گرفتن")

# Import کردن داده‌ها
# (در مرورگر: دکمه "وارد کردن" + انتخاب فایل)
```

### مرحله 6: به اشتراک‌گذاری

#### به اشتراک‌گذاری لینک:
- آدرس سایت: `https://USERNAME.github.io/shoe-inventory-management`
- این لینک را با دیگران به اشتراک بگذارید

#### اضافه کردن توضیحات:
- در README.md، آدرس سایت را اضافه کنید:
```markdown
## 🔗 لینک سایت
[مشاهده آنلاین](https://USERNAME.github.io/shoe-inventory-management)
```

## 🛠️ رفع مشکلات رایج

### مشکل: صفحه سفید یا بارگذاری نشدن
**راه‌حل:**
- مطمئن شوید فایل `index.html` در ریشه پروژه است
- نام فایل‌ها دقیق باشد (حروف کوچک و بزرگ)
- GitHub Pages را دوباره فعال کنید

### مشکل: استایل‌ها اعمال نمی‌شوند
**راه‌حل:**
- فایل `styles.css` در کنار `index.html` باشد
- Cache مرورگر را پاک کنید (Ctrl+F5)

### مشکل: JavaScript کار نمی‌کند
**راه‌حل:**
- فایل `app.js` در کنار `index.html` باشد
- Console مرورگر را چک کنید (F12)

### مشکل: Service Worker کار نمی‌کند
**راه‌حل:**
- فقط در HTTPS کار می‌کند
- در localhost یا GitHub Pages تست کنید

## 📱 قابلیت‌های پیشرفته

### نصب به عنوان PWA (Progressive Web App):
- در مرورگر موبایل، "Add to Home Screen" را انتخاب کنید
- آیکون برنامه در صفحه اصلی ظاهر می‌شود

### استفاده آفلاین:
- پس از اولین بارگذاری، آفلاین کار می‌کند
- داده‌ها در localStorage ذخیره می‌شوند

## 🔒 امنیت

- داده‌ها فقط در مرورگر شما ذخیره می‌شوند
- برای امنیت بیشتر، ریپازیتوری را Private کنید
- به طور منظم از داده‌ها پشتیبان بگیرید

## 📞 پشتیبانی

اگر مشکلی داشتید:
1. این راهنما را کاملاً مطالعه کنید
2. Console مرورگر را چک کنید (F12)
3. در GitHub Issues مطرح کنید

---

**نکته:** این راهنما برای کاربران مبتدی تا متوسط نوشته شده است. برای کاربران پیشرفته، روش‌های Git مستقیم توصیه می‌شود.