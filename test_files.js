#!/usr/bin/env node

// تست ساده برای بررسی صحت فایل‌ها
const fs = require('fs');
const path = require('path');

console.log('=== تست فایل‌های وب‌اپلیکیشن ===\n');

// بررسی وجود فایل‌های اصلی
const requiredFiles = [
    'index.html',
    'app.js',
    'styles.css'
];

console.log('1. بررسی فایل‌های اصلی:');
requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    const status = exists ? '✅' : '❌';
    console.log(`   ${status} ${file} ${exists ? 'موجود است' : 'وجود ندارد'}`);
});

// بررسی ساختار HTML
console.log('\n2. بررسی ساختار HTML:');
try {
    const html = fs.readFileSync('index.html', 'utf8');
    
    const checks = [
        { name: 'DOCTYPE', pattern: /<!DOCTYPE html>/i },
        { name: 'Meta charset', pattern: /<meta[^>]*charset[^>]*>/i },
        { name: 'Loading div', pattern: /<div[^>]*id=["']loading["'][^>]*>/i },
        { name: 'App div', pattern: /<div[^>]*id=["']app["'][^>]*>/i },
        { name: 'App.js script', pattern: /<script[^>]*src=["']app\.js["'][^>]*>/i }
    ];
    
    checks.forEach(check => {
        const found = check.pattern.test(html);
        const status = found ? '✅' : '❌';
        console.log(`   ${status} ${check.name} ${found ? 'موجود است' : 'وجود ندارد'}`);
    });
    
} catch (error) {
    console.log('   ❌ خطا در خواندن HTML:', error.message);
}

// بررسی ساختار JavaScript
console.log('\n3. بررسی ساختار JavaScript:');
try {
    const js = fs.readFileSync('app.js', 'utf8');
    
    const checks = [
        { name: 'Class InventoryApp', pattern: /class\s+InventoryApp/i },
        { name: 'Constructor', pattern: /constructor\s*\(\s*\)/i },
        { name: 'init method', pattern: /init\s*\(\s*\)/i },
        { name: 'DOMContentLoaded listener', pattern: /DOMContentLoaded/i },
        { name: 'getCurrentPersianDateISO', pattern: /getCurrentPersianDateISO\s*\(\s*\)/i },
        { name: 'convertToPersianNumbers', pattern: /convertToPersianNumbers\s*\(/i }
    ];
    
    checks.forEach(check => {
        const found = check.pattern.test(js);
        const status = found ? '✅' : '❌';
        console.log(`   ${status} ${check.name} ${found ? 'موجود است' : 'وجود ندارد'}`);
    });
    
} catch (error) {
    console.log('   ❌ خطا در خواندن JavaScript:', error.message);
}

// بررسی syntax JavaScript
console.log('\n4. بررسی syntax JavaScript:');
const { execSync } = require('child_process');

try {
    execSync('node -c app.js', { stdio: 'pipe' });
    console.log('   ✅ Syntax جاوااسکریپت درست است');
} catch (error) {
    console.log('   ❌ خطا در syntax جاوااسکریپت:', error.message);
}

console.log('\n=== پایان تست ===');
console.log('\nاگر همه چیز درست باشد، وب‌اپلیکیشن باید به راحتی بارگیری شود.');
console.log('برای تست: http://localhost:8000/comprehensive_test.html');