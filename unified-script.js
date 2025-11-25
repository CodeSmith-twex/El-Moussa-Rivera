/*
 * وتد الكيان العقارية - ملف JavaScript الموحد
 * وظائف تفاعلية لجميع الصفحات
 */

// انتظار تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    
    // تهيئة جميع الوظائف
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initMortgageCalculator();
    initContactForms();
    initScrollToTop();
    initPropertyStatusFilter();
    initPartnersSlider();
    initHeaderScroll();
    
});

// قائمة الهاتف المحمول
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('is-active');
        });
        
        // إغلاق القائمة عند النقر على رابط
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('is-active');
                }
            });
        });
    }
}

// تغيير مظهر الهيدر عند التمرير في الصفحة الرئيسية
function initHeaderScroll() {
    // شغّل هذا السلوك فقط على الصفحة الرئيسية
    if (!document.body.classList.contains('home')) return;

    const header = document.querySelector('header');
    if (!header) return;

    const SCROLL_THRESHOLD = 50; // المسافة بالبكسل قبل تغيير الهيدر

    function onScrollToggleHeader() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // تحقق من الحالة عند تحميل الصفحة وأثناء التمرير
    window.addEventListener('scroll', onScrollToggleHeader);
    onScrollToggleHeader(); // للتحقق من الحالة عند إعادة تحميل الصفحة وهي ليست في الأعلى
}


// التمرير السلس
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// تأثيرات التمرير
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scroll-reveal');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// حاسبة التمويل العقاري
function initMortgageCalculator() {
    const calculator = document.getElementById('mortgage-calculator');
    
    if (calculator) {
        calculator.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const propertyPrice = parseFloat(document.getElementById('property-price').value);
            const downPayment = parseFloat(document.getElementById('down-payment').value);
            const loanTerm = parseFloat(document.getElementById('loan-term').value);
            const interestRate = parseFloat(document.getElementById('interest-rate').value);
            
            if (propertyPrice && downPayment && loanTerm && interestRate) {
                const loanAmount = propertyPrice - downPayment;
                const monthlyRate = interestRate / 100 / 12;
                const numberOfPayments = loanTerm * 12;
                
                if (monthlyRate === 0) {
                    // بدون فائدة
                    const monthlyPayment = loanAmount / numberOfPayments;
                    const totalPayment = loanAmount;
                    const totalInterest = 0;
                    
                    displayResults(monthlyPayment, totalPayment, totalInterest);
                } else {
                    // مع فائدة
                    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
                    const totalPayment = monthlyPayment * numberOfPayments;
                    const totalInterest = totalPayment - loanAmount;
                    
                    displayResults(monthlyPayment, totalPayment, totalInterest);
                }
            }
        });
    }
}

// عرض نتائج الحاسبة
function displayResults(monthlyPayment, totalPayment, totalInterest) {
    const resultsDiv = document.querySelector('.calculator-results');
    const monthlyPaymentEl = document.getElementById('monthly-payment');
    const totalPaymentEl = document.getElementById('total-payment');
    const totalInterestEl = document.getElementById('total-interest');
    
    if (resultsDiv && monthlyPaymentEl && totalPaymentEl && totalInterestEl) {
        monthlyPaymentEl.textContent = formatCurrency(monthlyPayment);
        totalPaymentEl.textContent = formatCurrency(totalPayment);
        totalInterestEl.textContent = formatCurrency(totalInterest);
        
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// تنسيق العملة
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// نماذج الاتصال
function initContactForms() {
    const contactForm = document.getElementById('contact-form-short');
    const contactFormFull = document.querySelector('.modern-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
        });
    }
    
    if (contactFormFull) {
        contactFormFull.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.');
        });
    }
}

// معالجة إرسال النماذج
function handleFormSubmission(form, successMessage) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // محاكاة إرسال البيانات
    showLoading(form);
    
    setTimeout(() => {
        hideLoading(form);
        showSuccessMessage(successMessage);
        form.reset();
    }, 2000);
}

// عرض حالة التحميل
function showLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    }
}

// إخفاء حالة التحميل
function hideLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.innerHTML.replace(/<i class="fas fa-spinner fa-spin"><\/i> جاري الإرسال\.\.\./, 'إرسال');
    }
}

// عرض رسالة النجاح
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    // إضافة الأنماط
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    // إزالة الرسالة بعد 5 ثوان
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 500);
    }, 5000);
}

// زر العودة للأعلى
function initScrollToTop() {
    // إنشاء زر العودة للأعلى
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3A5A5C, #BFA57B);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // إظهار/إخفاء الزر عند التمرير
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // النقر للعودة للأعلى
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// تأثيرات إضافية للتمرير
function addScrollEffects() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // أضف كلا الصنفين لضمان ظهور العناصر
                entry.target.classList.add('fade-in', 'visible');
            } else {
                // عند الخروج من المجال، أزل الظهور (اختياري)
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach((section) => observer.observe(section));
}

// تحسين الأداء
function optimizePerformance() {
    // تحميل الصور بشكل كسول
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// إضافة أنماط CSS للرسائل والتحميل
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .slide-in-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: all 0.6s ease;
        }
        
        .slide-in-left.visible {
            opacity: 1;
            transform: translateX(0);
        }
        
        .slide-in-right {
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.6s ease;
        }
        
        .slide-in-right.visible {
            opacity: 1;
            transform: translateX(0);
        }
        
        .scroll-reveal {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .scroll-reveal.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazy.loaded {
            opacity: 1;
        }
    `;
    
    document.head.appendChild(style);
}

// تهيئة الأنماط الديناميكية
addDynamicStyles();

// تهيئة التأثيرات الإضافية
addScrollEffects();
optimizePerformance();

// فلترة العقارات حسب الحالة (تم الإنشاء / تحت الإنشاء)
function initPropertyStatusFilter() {
    const tabsContainer = document.querySelector('.status-tabs');
    if (!tabsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.status-tab');
    const propertyCards = document.querySelectorAll('.property-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // تحديث حالة الزر النشط
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterStatus = tab.dataset.status;

            propertyCards.forEach(card => {
                const isConstruction = card.querySelector('.status-construction') !== null;
                
                // إخفاء البطاقة مؤقتًا لتأثير الظهور
                card.style.display = 'none';

                if (filterStatus === 'all') {
                    card.style.display = 'block';
                } else if (filterStatus === 'construction' && isConstruction) {
                    card.style.display = 'block';
                } else if (filterStatus === 'completed' && !isConstruction) {
                    card.style.display = 'block';
                }
            });
        });
    });

    // تفعيل الفلتر الافتراضي عند تحميل الصفحة
    tabsContainer.querySelector('.status-tab.active').click();
}

// تهيئة سلايدر الشركاء
function initPartnersSlider() {
    if (typeof Swiper === 'undefined') return;

    new Swiper('.partners-slider', {
        loop: true,
        spaceBetween: 30,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: { slidesPerView: 2, spaceBetween: 20 },
            480: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 30 },
            1024: { slidesPerView: 6, spaceBetween: 30 },
        }
    });
}
