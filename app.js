// Application State and Data Management
class InventoryApp {
    constructor() {
        this.products = [];
        this.sales = [];
        this.entries = []; // Initialize entries array
        this.stores = ['151', '168'];
        this.currentStore = '151';
        this.currentSection = 'dashboard';
        
        // Don't call init() here - it will be called manually after DOM load
    }

    init() {
        console.log('Initializing app...');
        this.loadData();
        this.setupEventListeners();
        this.showSection('dashboard');
        this.updateDashboard();
        this.populateProductSelects();
        this.updateInventoryTable();
        this.updateSalesTable();
        this.updateEntryTable();
        this.setupDateInputs();
        this.hideLoading();
        console.log('App initialization complete');
    }

    // Data Management
    loadData() {
        console.log('Loading data from localStorage...');
        
        const savedProducts = localStorage.getItem('inventory_products');
        const savedSales = localStorage.getItem('inventory_sales');
        const savedEntries = localStorage.getItem('inventory_entries');
        
        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
            console.log('Loaded products:', this.products.length);
        } else {
            // Initialize with sample data based on Excel file
            this.products = [
                { id: 1, name: 'فندی رضا', category: 'کفش ورزشی', initialQuantity: 3, currentStock: 3, totalSold: 0, createdAt: this.getCurrentPersianDateISO() },
                { id: 2, name: 'هوتیک سه سگک رضا', category: 'کفش ورزشی', initialQuantity: 6, currentStock: 6, totalSold: 0, createdAt: this.getCurrentPersianDateISO() },
                { id: 3, name: 'هرمس تخت رضا', category: 'کفش رسمی', initialQuantity: 8, currentStock: 8, totalSold: 0, createdAt: this.getCurrentPersianDateISO() },
                { id: 4, name: 'زارا جلو بسته رضا', category: 'کفش روزمره', initialQuantity: 7, currentStock: 7, totalSold: 0, createdAt: this.getCurrentPersianDateISO() },
                { id: 5, name: 'دو سگک ویزون رضا', category: 'کفش تابستانی', initialQuantity: 1, currentStock: 1, totalSold: 0, createdAt: this.getCurrentPersianDateISO() }
            ];
            console.log('Initialized products with sample data');
            this.saveData();
        }
        
        if (savedSales) {
            this.sales = JSON.parse(savedSales);
            console.log('Loaded sales:', this.sales.length);
        } else {
            this.sales = [];
        }
        
        if (savedEntries) {
            this.entries = JSON.parse(savedEntries);
            console.log('Loaded entries:', this.entries.length);
        } else {
            this.entries = [];
            console.log('Initialized empty entries array');
        }
    }

    saveData() {
        localStorage.setItem('inventory_products', JSON.stringify(this.products));
        localStorage.setItem('inventory_sales', JSON.stringify(this.sales));
        localStorage.setItem('inventory_entries', JSON.stringify(this.entries || []));
    }

    // Event Listeners
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
                this.updateNavigation(e.currentTarget);
            });
        });

        // Sales form
        const salesForm = document.getElementById('salesForm');
        if (salesForm) {
            console.log('Sales form found, adding event listener');
            salesForm.addEventListener('submit', (e) => this.handleSalesSubmit(e));
        } else {
            console.log('Sales form NOT found');
        }

        // Add product form
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            console.log('Add product form found, adding event listener');
            addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
        } else {
            console.log('Add product form NOT found');
        }

        // Entry form
        const entryForm = document.getElementById('entryForm');
        if (entryForm) {
            console.log('Entry form found, adding event listener');
            entryForm.addEventListener('submit', (e) => {
                console.log('Entry form submit event triggered');
                this.handleEntrySubmit(e);
            });
        } else {
            console.log('Entry form NOT found');
        }

        // Edit product form
        const editProductForm = document.getElementById('editProductForm');
        if (editProductForm) {
            editProductForm.addEventListener('submit', (e) => this.handleEditProduct(e));
        }

        // Search and filter
        const searchInput = document.getElementById('searchProducts');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterProducts(e.target.value));
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterProductsByStatus(e.target.getAttribute('data-filter'));
            });
        });

        // Store tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentStore = e.target.getAttribute('data-store');
            });
        });

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Import button
        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.showImportModal());
        }

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    this.closeModal(modal);
                });
            }
        });
    }

    // Navigation
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            
            // Update section-specific data
            if (sectionName === 'dashboard') {
                this.updateDashboard();
            } else if (sectionName === 'inventory') {
                this.updateInventoryTable();
            } else if (sectionName === 'sales') {
                this.updateSalesTable();
                this.populateProductSelects();
            }
        }
    }

    updateNavigation(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Dashboard
    updateDashboard() {
        const totalProducts = this.products.length;
        const todaySales = this.getTodaySales().length;
        const lowStock = this.products.filter(p => p.currentStock < 10 && p.currentStock > 0).length;
        const monthlySales = this.getMonthlySales().length;

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('todaySales').textContent = todaySales;
        document.getElementById('lowStock').textContent = lowStock;
        document.getElementById('monthlySales').textContent = monthlySales;

        this.updateActivityList();
    }

    updateActivityList() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const recentActivities = this.sales
            .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
            .slice(0, 5);

        let html = '';
        if (recentActivities.length === 0) {
            html = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                        </svg>
                    </div>
                    <div class="activity-content">
                        <p>هنوز فروشی ثبت نشده است</p>
                        <small>امروز</small>
                    </div>
                </div>
            `;
        } else {
            html = recentActivities.map(sale => {
                const product = this.products.find(p => p.id === sale.productId);
                const date = new Date(sale.saleDate).toLocaleDateString('fa-IR');
                return `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"/>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                        </div>
                        <div class="activity-content">
                            <p>فروش ${product ? product.name : 'محصول نامشخص'} - مغازه ${sale.storeId}</p>
                            <small>${date}</small>
                        </div>
                    </div>
                `;
            }).join('');
        }

        activityList.innerHTML = html;
    }

    // Product Management
    handleAddProduct(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const productData = {
            id: Date.now(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            initialQuantity: parseInt(document.getElementById('initialQuantity').value),
            currentStock: parseInt(document.getElementById('initialQuantity').value),
            totalSold: 0,
            createdAt: new Date().toISOString()
        };

        this.products.push(productData);
        this.saveData();
        this.updateInventoryTable();
        this.updateDashboard();
        this.populateProductSelects();
        this.closeAddProductModal();
        this.showNotification('محصول با موفقیت اضافه شد', 'success');
    }

    handleEditProduct(e) {
        e.preventDefault();
        
        const productId = parseInt(document.getElementById('editProductId').value);
        const product = this.products.find(p => p.id === productId);
        
        if (product) {
            product.name = document.getElementById('editProductName').value;
            product.currentStock = parseInt(document.getElementById('editCurrentQuantity').value);
            product.category = document.getElementById('editProductCategory').value;
            
            this.saveData();
            this.updateInventoryTable();
            this.updateDashboard();
            this.populateProductSelects();
            this.closeEditProductModal();
            this.showNotification('محصول با موفقیت ویرایش شد', 'success');
        }
    }

    updateInventoryTable() {
        const tbody = document.getElementById('inventoryTable');
        if (!tbody) return;

        let html = '';
        this.products.forEach(product => {
            const status = this.getStockStatus(product.currentStock);
            html += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.currentStock}</td>
                    <td>${product.initialQuantity}</td>
                    <td>${product.totalSold}</td>
                    <td>
                        <span class="status-badge ${status.class}">${status.text}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-edit" onclick="app.editProduct(${product.id})">
                                ویرایش
                            </button>
                            <button class="btn btn-small btn-delete" onclick="app.deleteProduct(${product.id})">
                                حذف
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html || '<tr><td colspan="6">هیچ محصولی یافت نشد</td></tr>';
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            document.getElementById('editProductId').value = product.id;
            document.getElementById('editProductName').value = product.name;
            document.getElementById('editCurrentQuantity').value = product.currentStock;
            document.getElementById('editProductCategory').value = product.category;
            this.showModal('editProductModal');
        }
    }

    deleteProduct(id) {
        if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveData();
            this.updateInventoryTable();
            this.updateDashboard();
            this.populateProductSelects();
            this.showNotification('محصول حذف شد', 'success');
        }
    }

    filterProducts(searchTerm) {
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderFilteredProducts(filteredProducts);
    }

    filterProductsByStatus(status) {
        let filteredProducts = this.products;
        
        switch (status) {
            case 'low':
                filteredProducts = this.products.filter(p => p.currentStock < 10 && p.currentStock > 0);
                break;
            case 'out':
                filteredProducts = this.products.filter(p => p.currentStock === 0);
                break;
            default:
                filteredProducts = this.products;
        }
        
        this.renderFilteredProducts(filteredProducts);
    }

    renderFilteredProducts(products) {
        const tbody = document.getElementById('inventoryTable');
        if (!tbody) return;

        let html = '';
        products.forEach(product => {
            const status = this.getStockStatus(product.currentStock);
            html += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.currentStock}</td>
                    <td>${product.initialQuantity}</td>
                    <td>${product.totalSold}</td>
                    <td>
                        <span class="status-badge ${status.class}">${status.text}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-edit" onclick="app.editProduct(${product.id})">
                                ویرایش
                            </button>
                            <button class="btn btn-small btn-delete" onclick="app.deleteProduct(${product.id})">
                                حذف
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html || '<tr><td colspan="6">هیچ محصولی یافت نشد</td></tr>';
    }

    getStockStatus(stock) {
        if (stock === 0) {
            return { class: 'out-of-stock', text: 'تمام شده' };
        } else if (stock < 10) {
            return { class: 'low-stock', text: 'کم' };
        } else {
            return { class: 'in-stock', text: 'موجود' };
        }
    }

    // Sales Management
    handleSalesSubmit(e) {
        e.preventDefault();
        
        const productId = parseInt(document.getElementById('productSelect').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const saleDate = document.getElementById('saleDate').value;
        const notes = document.getElementById('notes').value;

        const product = this.products.find(p => p.id === productId);
        
        if (!product) {
            this.showNotification('محصول انتخاب شده معتبر نیست', 'error');
            return;
        }

        if (product.currentStock < quantity) {
            this.showNotification('موجودی کافی نیست', 'error');
            return;
        }

        const sale = {
            id: Date.now(),
            productId,
            storeId: this.currentStore,
            quantity,
            saleDate: saleDate || this.getCurrentPersianDateISO(),
            notes,
            createdAt: new Date().toISOString()
        };

        this.sales.push(sale);
        
        // Update product stock and sales
        product.currentStock -= quantity;
        product.totalSold += quantity;
        
        this.saveData();
        this.updateInventoryTable();
        this.updateSalesTable();
        this.updateDashboard();
        this.clearSalesForm();
        this.showNotification('فروش با موفقیت ثبت شد', 'success');
    }

    // Entry Management
    handleEntrySubmit(e) {
        e.preventDefault();
        console.log('=== ENTRY FORM SUBMITTED ===');
        
        try {
            const productIdStr = document.getElementById('entryProductSelect').value;
            const quantityStr = document.getElementById('entryQuantity').value;
            const entryDate = document.getElementById('entryDate').value;
            const notes = document.getElementById('entryNotes').value;

            console.log('Raw form data:', { productIdStr, quantityStr, entryDate, notes });
            
            // Validate required fields
            if (!productIdStr || !quantityStr) {
                console.error('Missing required fields');
                alert('لطفاً تمام فیلدهای ضروری را پر کنید');
                return;
            }
            
            const productId = parseInt(productIdStr);
            const quantity = parseInt(quantityStr);
            
            console.log('Parsed data:', { productId, quantity });

            if (isNaN(productId) || isNaN(quantity)) {
                console.error('Invalid number format');
                alert('لطفاً اعداد معتبر وارد کنید');
                return;
            }
            
            if (quantity <= 0) {
                console.error('Invalid quantity');
                alert('تعداد باید بیشتر از صفر باشد');
                return;
            }

            const product = this.products.find(p => p.id === productId);
            
            if (!product) {
                console.error('Product not found for ID:', productId);
                this.showNotification('محصول انتخاب شده معتبر نیست', 'error');
                return;
            }
            
            console.log('Found product:', product.name);

            const entry = {
                id: Date.now(),
                productId,
                quantity,
                entryDate: entryDate || this.getCurrentPersianDateISO(),
                notes,
                createdAt: new Date().toISOString()
            };

            console.log('Created entry object:', entry);

            // Ensure entries array exists
            if (!this.entries) {
                this.entries = [];
                console.log('Initialized empty entries array');
            }
            this.entries.push(entry);
            console.log('Added entry to array. Total entries:', this.entries.length);
            
            // Update product stock
            const oldStock = product.currentStock;
            product.currentStock += quantity;
            console.log(`Updated product stock: ${oldStock} -> ${product.currentStock}`);
            
            this.saveData();
            console.log('Data saved to localStorage');
            
            this.updateInventoryTable();
            this.updateEntryTable();
            this.updateDashboard();
            this.clearEntryForm();
            
            console.log('=== ENTRY SUBMITTED SUCCESSFULLY ===');
            this.showNotification('ورود با موفقیت ثبت شد', 'success');
            
        } catch (error) {
            console.error('Error in handleEntrySubmit:', error);
            alert('خطا در ثبت ورود: ' + error.message);
        }
    }

    updateEntryTable() {
        const tbody = document.getElementById('entryTable');
        if (!tbody) return;

        if (!this.entries) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">هیچ ورودی ثبت نشده</td></tr>';
            return;
        }

        const recentEntries = this.entries
            .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
            .slice(0, 10);

        if (recentEntries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">هیچ ورودی ثبت نشده</td></tr>';
            return;
        }

        tbody.innerHTML = recentEntries.map(entry => {
            const product = this.products.find(p => p.id === entry.productId);
            const productName = product ? product.name : 'محصول حذف شده';
            
            return `
                <tr>
                    <td>${this.formatDate(entry.entryDate)}</td>
                    <td>${productName}</td>
                    <td>${entry.quantity}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteEntry(${entry.id})">
                            حذف
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Persian Date Functions
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return this.gregorianToPersian(date);
    }

    gregorianToPersian(date) {
        const d = new Date(date);
        const gregorian = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate()
        };

        // تبدیل میلادی به شمسی
        let persian = this.convertToPersian(gregorian.year, gregorian.month, gregorian.day);
        
        // تبدیل اعداد به فارسی
        const persianYear = this.convertToPersianNumbers(persian.year.toString());
        const persianMonth = this.convertToPersianNumbers(persian.month.toString().padStart(2, '0'));
        const persianDay = this.convertToPersianNumbers(persian.day.toString().padStart(2, '0'));
        
        return `${persianYear}/${persianMonth}/${persianDay}`;
    }

    convertToPersian(gregorianYear, gregorianMonth, gregorianDay) {
        // الگوریتم تبدیل میلادی به شمسی
        const persianMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
        const leapMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
        
        // محاسبه سال شمسی
        let persianYear = gregorianYear - 622;
        let startDate = new Date(gregorianYear, 0, 1);
        let endDate = new Date(gregorianYear, 11, 31);
        let daysPassed = Math.floor((startDate.getTime() - new Date(1978, 2, 21).getTime()) / (1000 * 60 * 60 * 24));
        
        // تنظیم تقریبی
        if (daysPassed > 78) {
            persianYear++;
            daysPassed -= 365;
        }
        
        // محاسبه ماه و روز
        let remainingDays = daysPassed;
        let persianMonth = 1;
        let isLeapYear = this.isLeapYear(persianYear);
        const months = isLeapYear ? leapMonths : persianMonths;
        
        for (let i = 0; i < 12; i++) {
            if (remainingDays < months[i]) {
                persianMonth = i + 1;
                break;
            }
            remainingDays -= months[i];
        }
        
        const persianDay = remainingDays + 1;
        
        return { year: persianYear, month: persianMonth, day: persianDay };
    }

    isLeapYear(year) {
        // بررسی سال کبیسه شمسی
        return ((year - 1394) % 4 === 0) || ((year - 1394) % 4 === 3 && (year - 1394) % 100 === 1);
    }

    convertToPersianNumbers(englishNumber) {
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return englishNumber.replace(/[0-9]/g, (match) => {
            return persianNumbers[parseInt(match)];
        });
    }

    getCurrentPersianDate() {
        // تاریخ امروز به شمسی
        const today = new Date();
        return this.gregorianToPersian(today);
    }

    getCurrentPersianDateISO() {
        // تاریخ امروز به فرمت YYYY/MM/DD شمسی
        const today = new Date();
        const persian = this.convertToPersian(today.getFullYear(), today.getMonth() + 1, today.getDate());
        return `${persian.year}/${String(persian.month).padStart(2, '0')}/${String(persian.day).padStart(2, '0')}`;
    }

    calculateDaysDifference(date1, date2) {
        // محاسبه اختلاف روزها بین دو تاریخ شمسی
        const year1 = date1.year;
        const year2 = date2.year;
        const month1 = date1.month;
        const month2 = date2.month;
        const day1 = date1.day;
        const day2 = date2.day;
        
        // تبدیل به روزهای کل
        const totalDays1 = year1 * 365 + (year1 - 1) / 4 + this.getDaysInMonths(date1.year, date1.month) + date1.day;
        const totalDays2 = year2 * 365 + (year2 - 1) / 4 + this.getDaysInMonths(date2.year, date2.month) + date2.day;
        
        return Math.abs(totalDays1 - totalDays2);
    }

    getDaysInMonths(year, month) {
        // محاسبه مجموع روزهای ماه‌های قبل از ماه جاری
        const persianMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
        const leapMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
        
        const isLeap = this.isLeapYear(year);
        const months = isLeap ? leapMonths : persianMonths;
        
        let totalDays = 0;
        for (let i = 0; i < month - 1; i++) {
            totalDays += months[i];
        }
        return totalDays;
    }



    deleteEntry(entryId) {
        if (confirm('آیا از حذف این ورود اطمینان دارید؟')) {
            const entry = this.entries.find(e => e.id === entryId);
            if (entry) {
                const product = this.products.find(p => p.id === entry.productId);
                if (product) {
                    product.currentStock -= entry.quantity;
                }
                
                this.entries = this.entries.filter(e => e.id !== entryId);
                this.saveData();
                this.updateInventoryTable();
                this.updateEntryTable();
                this.updateDashboard();
                this.showNotification('ورود با موفقیت حذف شد', 'success');
            }
        }
    }

    clearEntryForm() {
        document.getElementById('entryProductSelect').value = '';
        document.getElementById('entryQuantity').value = '';
        document.getElementById('entryDate').value = '';
        document.getElementById('entryNotes').value = '';
    }

    updateSalesTable() {
        const tbody = document.getElementById('salesTable');
        if (!tbody) return;

        const recentSales = this.sales
            .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
            .slice(0, 10);

        let html = '';
        recentSales.forEach(sale => {
            const product = this.products.find(p => p.id === sale.productId);
            const date = this.formatDate(sale.saleDate);
            html += `
                <tr>
                    <td>${date}</td>
                    <td>${product ? product.name : 'محصول حذف شده'}</td>
                    <td>مغازه ${sale.storeId}</td>
                    <td>${sale.quantity}</td>
                    <td>
                        <button class="btn btn-small btn-delete" onclick="app.deleteSale(${sale.id})">
                            حذف
                        </button>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html || '<tr><td colspan="5">هیچ فروشی ثبت نشده است</td></tr>';
    }

    deleteSale(id) {
        if (confirm('آیا از حذف این فروش اطمینان دارید؟')) {
            const saleIndex = this.sales.findIndex(s => s.id === id);
            if (saleIndex !== -1) {
                const sale = this.sales[saleIndex];
                const product = this.products.find(p => p.id === sale.productId);
                
                if (product) {
                    product.currentStock += sale.quantity;
                    product.totalSold -= sale.quantity;
                }
                
                this.sales.splice(saleIndex, 1);
                this.saveData();
                this.updateInventoryTable();
                this.updateSalesTable();
                this.updateDashboard();
                this.showNotification('فروش حذف شد', 'success');
            }
        }
    }

    clearSalesForm() {
        document.getElementById('salesForm').reset();
    }

    // Reports
    generateDailyReport() {
        const selectedDate = document.getElementById('dailyReportDate').value;
        const resultDiv = document.getElementById('dailyReportResult');
        
        if (!selectedDate) {
            resultDiv.innerHTML = '<p>لطفاً تاریخ را انتخاب کنید</p>';
            return;
        }

        const daySales = this.sales.filter(sale => 
            sale.saleDate === selectedDate
        );

        if (daySales.length === 0) {
            resultDiv.innerHTML = '<p>فروشی برای این تاریخ ثبت نشده است</p>';
            return;
        }

        let totalQuantity = 0;
        let html = '<div style="text-align: right;">';
        html += `<h4>گزارش فروش روزانه - ${this.formatDate(selectedDate)}</h4>`;
        html += '<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">';
        html += '<tr style="background-color: #f3f4f6;"><th style="padding: 8px; text-align: right;">محصول</th><th style="padding: 8px; text-align: right;">مغازه</th><th style="padding: 8px; text-align: right;">تعداد</th></tr>';

        daySales.forEach(sale => {
            const product = this.products.find(p => p.id === sale.productId);
            totalQuantity += sale.quantity;
            html += `<tr><td style="padding: 8px;">${product ? product.name : 'محصول حذف شده'}</td><td style="padding: 8px;">${sale.storeId}</td><td style="padding: 8px;">${sale.quantity}</td></tr>`;
        });

        html += `<tr style="font-weight: bold; background-color: #e6f0ff;"><td colspan="2" style="padding: 8px;">مجموع:</td><td style="padding: 8px;">${totalQuantity}</td></tr>`;
        html += '</table></div>';

        resultDiv.innerHTML = html;
    }

    generateMonthlyReport() {
        const month = document.getElementById('monthlyReportMonth').value;
        const year = document.getElementById('monthlyReportYear').value;
        const resultDiv = document.getElementById('monthlyReportResult');
        
        if (!month || !year) {
            resultDiv.innerHTML = '<p>لطفاً ماه و سال را انتخاب کنید</p>';
            return;
        }

        const monthSales = this.sales.filter(sale => {
            const saleDate = this.convertToPersian(new Date(sale.saleDate).getFullYear(), new Date(sale.saleDate).getMonth() + 1, new Date(sale.saleDate).getDate());
            return saleDate.month == month && saleDate.year == year;
        });

        if (monthSales.length === 0) {
            resultDiv.innerHTML = '<p>فروشی برای این ماه ثبت نشده است</p>';
            return;
        }

        const monthNames = [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ];

        let totalQuantity = 0;
        let html = '<div style="text-align: right;">';
        html += `<h4>گزارش فروش ماهانه - ${monthNames[month - 1]} ${year}</h4>`;
        html += '<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">';
        html += '<tr style="background-color: #f3f4f6;"><th style="padding: 8px; text-align: right;">تاریخ</th><th style="padding: 8px; text-align: right;">مغازه</th><th style="padding: 8px; text-align: right;">تعداد فروش</th></tr>';

        const dailyStats = {};
        monthSales.forEach(sale => {
            totalQuantity += sale.quantity;
            if (!dailyStats[sale.saleDate]) {
                dailyStats[sale.saleDate] = { count: 0, stores: new Set() };
            }
            dailyStats[sale.saleDate].count += sale.quantity;
            dailyStats[sale.saleDate].stores.add(sale.storeId);
        });

        Object.keys(dailyStats).forEach(date => {
            const stats = dailyStats[date];
            html += `<tr><td style="padding: 8px;">${this.formatDate(date)}</td><td style="padding: 8px;">${Array.from(stats.stores).join(', ')}</td><td style="padding: 8px;">${stats.count}</td></tr>`;
        });

        html += `<tr style="font-weight: bold; background-color: #e6f0ff;"><td colspan="2" style="padding: 8px;">مجموع:</td><td style="padding: 8px;">${totalQuantity}</td></tr>`;
        html += '</table></div>';

        resultDiv.innerHTML = html;
    }

    generateProductReport() {
        const period = parseInt(document.getElementById('productReportPeriod').value);
        const resultDiv = document.getElementById('productReportResult');
        
        // فیلتر بر اساس تاریخ شمسی
        const currentPersianDate = this.getCurrentPersianDate();
        const periodSales = this.sales.filter(sale => {
            const saleDate = this.convertToPersian(new Date(sale.saleDate).getFullYear(), new Date(sale.saleDate).getMonth() + 1, new Date(sale.saleDate).getDate());
            
            // محاسبه تفاوت تاریخ‌ها (فقط تقریبی برای روزها)
            const daysDiff = this.calculateDaysDifference(saleDate, currentPersianDate);
            return daysDiff <= period && daysDiff >= 0;
        });

        const productStats = {};
        periodSales.forEach(sale => {
            if (!productStats[sale.productId]) {
                productStats[sale.productId] = { totalSold: 0, sales: 0 };
            }
            productStats[sale.productId].totalSold += sale.quantity;
            productStats[sale.productId].sales += 1;
        });

        const sortedProducts = Object.keys(productStats)
            .map(productId => {
                const product = this.products.find(p => p.id == productId);
                return {
                    product: product ? product.name : 'محصول حذف شده',
                    ...productStats[productId]
                };
            })
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 10);

        let html = '<div style="text-align: right;">';
        html += `<h4>عملکرد محصولات (${period} روز گذشته)</h4>`;
        
        if (sortedProducts.length === 0) {
            html += '<p>فروشی در این بازه ثبت نشده است</p>';
        } else {
            html += '<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">';
            html += '<tr style="background-color: #f3f4f6;"><th style="padding: 8px; text-align: right;">رتبه</th><th style="padding: 8px; text-align: right;">محصول</th><th style="padding: 8px; text-align: right;">تعداد فروش</th></tr>';

            sortedProducts.forEach((product, index) => {
                html += `<tr><td style="padding: 8px;">${index + 1}</td><td style="padding: 8px;">${product.product}</td><td style="padding: 8px;">${product.totalSold}</td></tr>`;
            });
            html += '</table>';
        }
        html += '</div>';

        resultDiv.innerHTML = html;
    }

    // Utility Functions
    populateProductSelects() {
        const salesSelects = document.querySelectorAll('#productSelect');
        salesSelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">محصول را انتخاب کنید</option>';
            this.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (موجودی: ${product.currentStock})`;
                select.appendChild(option);
            });
            select.value = currentValue;
        });

        // Populate entry product select
        const entrySelect = document.getElementById('entryProductSelect');
        if (entrySelect) {
            const currentValue = entrySelect.value;
            entrySelect.innerHTML = '<option value="">محصول را انتخاب کنید</option>';
            this.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (موجودی: ${product.currentStock})`;
                entrySelect.appendChild(option);
            });
            entrySelect.value = currentValue;
        }
    }

    setupDateInputs() {
        // تنظیم تاریخ پیش‌فرض شمسی برای فرم‌ها
        const todayPersian = this.getCurrentPersianDateISO();
        
        // تاریخ فروش
        const saleDateInput = document.getElementById('saleDate');
        if (saleDateInput) {
            saleDateInput.value = todayPersian;
        }
        
        // تاریخ ورود
        const entryDateInput = document.getElementById('entryDate');
        if (entryDateInput) {
            entryDateInput.value = todayPersian;
        }
        
        // تاریخ گزارش روزانه
        const dailyReportInput = document.getElementById('dailyReportDate');
        if (dailyReportInput) {
            dailyReportInput.value = todayPersian;
        }
        
        // تاریخ گزارش ماهانه - تنظیم ماه و سال جاری شمسی
        const monthlyReportMonth = document.getElementById('monthlyReportMonth');
        const monthlyReportYear = document.getElementById('monthlyReportYear');
        
        if (monthlyReportMonth && monthlyReportYear) {
            const currentPersianDate = this.getCurrentPersianDate();
            
            // تنظیم ماه جاری
            monthlyReportMonth.value = currentPersianDate.month.toString();
            
            // تنظیم سال جاری
            monthlyReportYear.value = currentPersianDate.year.toString();
        }
    }

    getTodaySales() {
        const today = this.getCurrentPersianDateISO();
        return this.sales.filter(sale => sale.saleDate === today);
    }

    getMonthlySales() {
        const currentPersianDate = this.getCurrentPersianDate();
        return this.sales.filter(sale => {
            const saleDate = this.convertToPersian(new Date(sale.saleDate).getFullYear(), new Date(sale.saleDate).getMonth() + 1, new Date(sale.saleDate).getDate());
            return saleDate.month === currentPersianDate.month && saleDate.year === currentPersianDate.year;
        });
    }

    // Data Export/Import
    exportData() {
        const data = {
            products: this.products,
            sales: this.sales,
            exportDate: this.getCurrentPersianDateISO(),
            version: '1.1' // نسخه جدید با تاریخ شمسی
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `inventory_backup_${this.getCurrentPersianDateISO()}.json`;
        link.click();
        
        this.showNotification('اطلاعات با موفقیت خارج شد', 'success');
    }

    showImportModal() {
        this.showModal('importModal');
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.products && Array.isArray(data.products)) {
                    if (confirm('آیا می‌خواهید محصولات موجود جایگزین شوند؟')) {
                        this.products = data.products;
                    } else {
                        // Merge products (avoid duplicates)
                        data.products.forEach(newProduct => {
                            const existing = this.products.find(p => p.name === newProduct.name);
                            if (!existing) {
                                this.products.push({ ...newProduct, id: Date.now() + Math.random() });
                            }
                        });
                    }
                }
                
                if (data.sales && Array.isArray(data.sales)) {
                    if (confirm('آیا می‌خواهید فروش‌های موجود جایگزین شوند؟')) {
                        this.sales = data.sales;
                    } else {
                        // Add new sales
                        const existingIds = new Set(this.sales.map(s => s.id));
                        data.sales.forEach(newSale => {
                            if (!existingIds.has(newSale.id)) {
                                this.sales.push(newSale);
                            }
                        });
                    }
                }
                
                this.saveData();
                this.updateDashboard();
                this.updateInventoryTable();
                this.updateSalesTable();
                this.populateProductSelects();
                this.closeModal('importModal');
                this.showNotification('اطلاعات با موفقیت وارد شد', 'success');
                
            } catch (error) {
                this.showNotification('خطا در خواندن فایل', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeModal(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (modal) {
            modal.classList.remove('show');
        }
    }

    openAddProductModal() {
        this.showModal('addProductModal');
    }

    closeAddProductModal() {
        this.closeModal('addProductModal');
        document.getElementById('addProductForm').reset();
    }

    closeEditProductModal() {
        this.closeModal('editProductModal');
        document.getElementById('editProductForm').reset();
    }

    closeImportModal() {
        this.closeModal('importModal');
        document.getElementById('importFile').value = '';
    }

    // Notification System
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const messageEl = document.getElementById('notificationMessage');
        
        if (notification && messageEl) {
            messageEl.textContent = message;
            notification.className = `notification notification-${type} show`;
            
            setTimeout(() => {
                this.hideNotification();
            }, 5000);
        }
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('show');
        }
    }

    // Loading Management
    hideLoading() {
        const loading = document.getElementById('loading');
        const app = document.getElementById('app');
        
        if (loading) {
            loading.style.display = 'none';
        }
        if (app) {
            app.classList.remove('hidden');
        }
    }
}

// Global Functions (for HTML onclick handlers)
function openAddProductModal() {
    app.openAddProductModal();
}

function closeAddProductModal() {
    app.closeAddProductModal();
}

function closeEditProductModal() {
    app.closeEditProductModal();
}

function clearSalesForm() {
    app.clearSalesForm();
}

function clearEntryForm() {
    app.clearEntryForm();
}

function hideNotification() {
    app.hideNotification();
}

function generateDailyReport() {
    app.generateDailyReport();
}

function generateMonthlyReport() {
    app.generateMonthlyReport();
}

function generateProductReport() {
    app.generateProductReport();
}

function handleFileImport(event) {
    app.handleFileImport(event);
}

function closeImportModal() {
    app.closeImportModal();
}

function hideNotification() {
    app.hideNotification();
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating app...');
    app = new InventoryApp();
    window.app = app; // Make app globally accessible
    console.log('App created:', !!app);
    app.init(); // Initialize after DOM is ready
    console.log('App fully initialized');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}