function navigateToAddress() {
    var address = '海口市龙华区国贸大道48号新达商务大厦';
    var url = 'https://map.baidu.com/search/新达商务大厦';
    
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
    initNavbar();
    initSmoothScroll();
    initCarousel();
    initAboutCarousel();
    initContactForm();
    initLoginForm();
    initAdminPage();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initCarousel() {
    const heroSlides = document.querySelectorAll('.carousel-slide');
    const heroDots = document.querySelectorAll('.carousel-dot');
    if (heroSlides.length === 0) return;

    let currentIndex = 0;
    let interval = setInterval(nextSlide, 5000);

    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));
        heroSlides[index].classList.add('active');
        heroDots[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % heroSlides.length;
        showSlide(currentIndex);
    }

    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            clearInterval(interval);
            currentIndex = index;
            showSlide(currentIndex);
            interval = setInterval(nextSlide, 5000);
        });
    });
}

function initAboutCarousel() {
    const aboutSlides = document.querySelectorAll('.about-slide');
    if (aboutSlides.length === 0) return;

    let currentIndex = 0;
    setInterval(function() {
        aboutSlides.forEach(slide => slide.classList.remove('active'));
        currentIndex = (currentIndex + 1) % aboutSlides.length;
        aboutSlides[currentIndex].classList.add('active');
    }, 3000);
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            company: document.getElementById('company').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value,
            createdAt: new Date().toLocaleString('zh-CN')
        };

        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        customers.push(formData);
        localStorage.setItem('customers', JSON.stringify(customers));

        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            setTimeout(function() {
                successMessage.style.display = 'none';
            }, 3000);
        }

        contactForm.reset();
    });
}

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('loggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.textContent = '用户名或密码错误';
                errorMessage.style.display = 'block';
            }
        }
    });
}

function initAdminPage() {
    if (!window.location.href.includes('admin.html')) return;

    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!loggedIn) {
        window.location.href = 'login.html';
        return;
    }

    loadCustomers();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCustomers(this.value.toLowerCase());
        });
    }
}

function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const tableBody = document.getElementById('customerTableBody');
    const emptyMessage = document.getElementById('emptyMessage');

    if (!tableBody) return;

    if (customers.length === 0) {
        tableBody.innerHTML = '';
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    tableBody.innerHTML = customers.map(function(customer, index) {
        return '<tr>' +
            '<td>' + (index + 1) + '</td>' +
            '<td>' + escapeHtml(customer.name) + '</td>' +
            '<td>' + escapeHtml(customer.company || '-') + '</td>' +
            '<td>' + escapeHtml(customer.phone) + '</td>' +
            '<td>' + escapeHtml(customer.email || '-') + '</td>' +
            '<td>' + getServiceName(customer.service) + '</td>' +
            '<td>' + escapeHtml(customer.message || '-') + '</td>' +
            '<td>' + escapeHtml(customer.createdAt) + '</td>' +
            '<td><button class="delete-btn" onclick="deleteCustomer(' + index + ')">删除</button></td>' +
            '</tr>';
    }).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getServiceName(service) {
    const map = {
        'audit': '审计服务',
        'tax': '税务服务',
        'consulting': '财务咨询',
        'capital': '验资服务',
        'forensic': '司法鉴定',
        'final': '竣工财务决算',
        'inventory': '资产清查',
        'performance': '绩效评价',
        'special': '专项审计'
    };
    return map[service] || service || '-';
}

function filterCustomers(keyword) {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const filtered = customers.filter(function(c) {
        return (c.name && c.name.toLowerCase().includes(keyword)) ||
               (c.company && c.company.toLowerCase().includes(keyword)) ||
               (c.phone && c.phone.includes(keyword));
    });

    const tableBody = document.getElementById('customerTableBody');
    const emptyMessage = document.getElementById('emptyMessage');

    if (!tableBody) return;

    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    tableBody.innerHTML = filtered.map(function(customer, index) {
        return '<tr>' +
            '<td>' + (index + 1) + '</td>' +
            '<td>' + escapeHtml(customer.name) + '</td>' +
            '<td>' + escapeHtml(customer.company || '-') + '</td>' +
            '<td>' + escapeHtml(customer.phone) + '</td>' +
            '<td>' + escapeHtml(customer.email || '-') + '</td>' +
            '<td>' + getServiceName(customer.service) + '</td>' +
            '<td>' + escapeHtml(customer.message || '-') + '</td>' +
            '<td>' + escapeHtml(customer.createdAt) + '</td>' +
            '<td><button class="delete-btn" onclick="deleteCustomer(' + customers.indexOf(customer) + ')">删除</button></td>' +
            '</tr>';
    }).join('');
}

function deleteCustomer(index) {
    if (confirm('确定要删除该客户信息吗？')) {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        customers.splice(index, 1);
        localStorage.setItem('customers', JSON.stringify(customers));
        loadCustomers();
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}