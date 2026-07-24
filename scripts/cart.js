// === Sneak District — логика корзины ===
// Состояние живёт в памяти вкладки. Хотите, чтобы корзина переживала
// перезагрузку страницы — замените `let cart = []` на чтение/запись
// localStorage (закомментированные подсказки ниже).

let cart = [];
// let cart = JSON.parse(localStorage.getItem('sneak-cart') || '[]');

const cartItemsEl = document.getElementById('cart-items');
const cartEmptyEl = document.getElementById('cart-empty');
const cartTotalEl = document.getElementById('cart-total');
const cartBadgeEl = document.getElementById('cart-badge');
const cartOverlayEl = document.getElementById('cart-overlay');
const cartToggleBtn = document.getElementById('cart-toggle');

function formatPrice(value) {
    return value.toLocaleString('ru-RU') + ' ₽';
}

function saveCart() {
    // localStorage.setItem('sneak-cart', JSON.stringify(cart));
}

function addToCart(name, price, image) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, image, qty: 1 });
    }
    saveCart();
    renderCart();
    openCart();
}

function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.name !== name);
    }
    saveCart();
    renderCart();
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    saveCart();
    renderCart();
}

function renderCart() {
    // Счётчик в иконке хедера
    const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
    if (totalCount > 0) {
        cartBadgeEl.textContent = totalCount;
        cartBadgeEl.hidden = false;
    } else {
        cartBadgeEl.hidden = true;
    }

    // Список товаров в панели
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '';
        cartItemsEl.appendChild(cartEmptyEl);
    } else {
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="cart-item" data-item="${item.name}">
                <div class="cart-item-photo">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" data-action="decrease" data-name="${item.name}" aria-label="Уменьшить количество">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" data-action="increase" data-name="${item.name}" aria-label="Увеличить количество">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-action="remove" data-name="${item.name}" aria-label="Удалить товар">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    // Сумма
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    cartTotalEl.textContent = formatPrice(total);
}

function openCart() {
    cartOverlayEl.classList.add('is-open');
    cartToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartOverlayEl.classList.remove('is-open');
    cartToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Клик по любой кнопке "Добавить в корзину" на карточках товара
document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
        const { name, price, image } = btn.dataset;
        addToCart(name, Number(price), image);
    });
});

// Открытие/закрытие панели
cartToggleBtn.addEventListener('click', () => {
    cartOverlayEl.classList.contains('is-open') ? closeCart() : openCart();
});

document.querySelectorAll('[data-cart-close]').forEach(el => {
    el.addEventListener('click', closeCart);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
});

// Делегирование кликов внутри списка товаров (плюс/минус/удалить)
cartItemsEl.addEventListener('click', e => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const { action, name } = target.dataset;
    if (action === 'increase') changeQty(name, 1);
    if (action === 'decrease') changeQty(name, -1);
    if (action === 'remove') removeFromCart(name);
});

// Оформление заказа — заглушка (нет бэкенда для реальной отправки)
document.getElementById('cart-checkout').addEventListener('click', () => {
    if (cart.length === 0) return;
    alert('Демо-режим: оформление заказа пока не подключено к реальному бэкенду.');
});

renderCart();

// === Бургер-меню ===
const burgerToggleBtn = document.getElementById('burger-toggle');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

function openMobileMenu() {
    mobileMenuOverlay.classList.add('active');
    burgerToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    burgerToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Открытие/закрытие меню
burgerToggleBtn.addEventListener('click', () => {
    mobileMenuOverlay.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
});

// Закрытие через backdrop и кнопку закрытия
document.querySelectorAll('[data-menu-close]').forEach(el => {
    el.addEventListener('click', closeMobileMenu);
});

// Закрытие по Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Закрытие меню при клике на ссылку (для лучшего UX)
document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

