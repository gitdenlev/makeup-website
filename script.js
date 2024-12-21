// Инициализация переменных
let cart = [];
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.querySelector('.cart-total span');

// Открытие/закрытие корзины
cartIcon.addEventListener('click', () => {
    cartModal.classList.toggle('show');
    // Добавляем анимацию при открытии
    if (cartModal.classList.contains('show')) {
        cartModal.classList.add('animate__animated', 'animate__fadeIn');
    }
});

// Закрытие корзины при клике вне её
document.addEventListener('click', (e) => {
    if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
        cartModal.classList.remove('show');
    }
});

// Функция добавления товара в корзину
function addToCart(product) {
    // Проверяем, есть ли уже такой товар в корзине
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity++;
        showNotification(`Количество ${product.name} увеличено!`);
    } else {
        cart.push(product);
        showNotification(`${product.name} добавлен в корзину!`);
    }
    
    updateCart();
    saveCartToLocalStorage();
}

// Функция удаления товара из корзины
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        const removedProduct = cart[index];
        // Анимация удаления
        const cartItem = document.querySelector(`[data-cart-id="${productId}"]`);
        cartItem.classList.add('animate__animated', 'animate__fadeOutRight');
        
        cartItem.addEventListener('animationend', () => {
            cart.splice(index, 1);
            updateCart();
            saveCartToLocalStorage();
            showNotification(`${removedProduct.name} удален из корзины!`);
        });
    }
}

// Обновление отображения корзины
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item animate__animated animate__fadeIn" data-cart-id="${item.id}">
                <img src="/api/placeholder/100/100" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} грн x ${item.quantity}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</div>
            </div>
        `;
    });

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = total;
    
    // Анимация счетчика
    cartCount.classList.add('animate__animated', 'animate__bounce');
    setTimeout(() => {
        cartCount.classList.remove('animate__animated', 'animate__bounce');
    }, 1000);
}

// Функция обновления количества товара
function updateQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        const newQuantity = product.quantity + change;
        if (newQuantity > 0) {
            product.quantity = newQuantity;
            updateCart();
            saveCartToLocalStorage();
        } else if (newQuantity === 0) {
            removeFromCart(productId);
        }
    }
}

// Добавление обработчиков для кнопок "Добавить в корзину"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const product = {
            id: e.target.dataset.id,
            name: e.target.dataset.name,
            price: parseInt(e.target.dataset.price),
            quantity: 1
        };

        // Анимация кнопки
        e.target.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            e.target.classList.remove('animate__animated', 'animate__pulse');
        }, 800);

        addToCart(product);

        // Анимация иконки корзины
        cartIcon.classList.add('animate__animated', 'animate__bounce');
        setTimeout(() => {
            cartIcon.classList.remove('animate__animated', 'animate__bounce');
        }, 800);
    });
});

// Функция для показа уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification animate__animated animate__fadeInRight';
    notification.innerHTML = message;
    
    // Добавляем стили через JavaScript
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#ff69b4';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('animate__fadeInRight');
        notification.classList.add('animate__fadeOutRight');
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }, 3000);
}

// Сохранение корзины в localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('makeupCart', JSON.stringify(cart));
}

// Загрузка корзины из localStorage при загрузке страницы
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('makeupCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Загружаем корзину при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCartFromLocalStorage);
