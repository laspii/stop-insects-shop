const tg = window.Telegram.WebApp;
tg.expand();

// ВСТАВЬТЕ СЮДА ВАШ URL ИЗ ШАГА 1
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ВАШ_ДЛИННЫЙ_ID/exec'; 

let currentLang = 'uk';
let cart = {}; 
let lastOrderData = null; // Для PDF

const translations = {
    uk: {
        brand: "Служба відновлення дому",
        hero: "Ми повертаємо відчуття безпеки та контролю.",
        currency: "грн",
        add: "Додати",
        checkoutTitle: "Оформлення замовлення",
        contactTitle: "Контактні дані",
        deliveryTitle: "Доставка Нова Пошта",
        namePlace: "Ім'я",
        surnamePlace: "Прізвище",
        cityPlace: "Місто (напр. Харків)",
        branchPlace: "№ Відділення (напр. 5)",
        mainBtnOrder: "Оформити",
        mainBtnPay: "Підтвердити замовлення",
        emptyCart: "Кошик порожній",
        total: "Разом",
        processing: "Відправка...",
        successTitle: "Замовлення прийнято!",
        successDesc: "Дані успішно передані менеджеру."
    },
    ru: {
        brand: "Служба восстановления дома",
        hero: "Мы возвращаем ощущение безопасности и контроля.",
        currency: "грн",
        add: "Добавить",
        checkoutTitle: "Оформление заказа",
        contactTitle: "Контактные данные",
        deliveryTitle: "Доставка Новая Почта",
        namePlace: "Имя",
        surnamePlace: "Фамилия",
        cityPlace: "Город (напр. Киев)",
        branchPlace: "№ Отделения (напр. 10)",
        mainBtnOrder: "Оформить",
        mainBtnPay: "Подтвердить заказ",
        emptyCart: "Корзина пуста",
        total: "Итого",
        processing: "Отправка...",
        successTitle: "Заказ принят!",
        successDesc: "Данные успешно переданы менеджеру."
    }
};

const products = [
    {
        id: 'basic', price: 450, tag: { uk: 'Старт', ru: 'Старт' },
        price: 450,
        img: 'flakon01.jpg', // Сюда вставьте ссылку на ваше фото
        title: { uk: 'Набір "Базовий"', ru: 'Набор "Базовый"' },
        desc: { uk: '6 флаконів. Локальна обробка.<br>
Вбивця клопів №1. Засіб «Метод» — аналог професійної дезінсекції, але в 3 рази дешевше. Вбиває комах за 4 хвилини, захищає до 21 дня. Працює проти резистентних популяцій. Оригінал.
', ru: '6 флаконов. Локальная обработка.' },
        marketing: { uk: 'Швидкий старт.', ru: 'Быстрый старт.' }
    },
    {
        id: 'reinforced', price: 900, tag: { uk: 'Хіт', ru: 'Хит' },
        price: 850,
        img: 'flakon05.jpg', // Сюда вставьте ссылку на ваше фото
        title: { uk: 'Набір "Посилений"', ru: 'Набор "Усиленный"' },
        desc: { uk: '12 флаконів. 1 кімната.', ru: '12 флаконов. 1 комната.' },
        marketing: { uk: 'Максимальна сила.', ru: 'Максимальная сила.' }
    },
    {
        id: 'pro', price: 1800, tag: { uk: 'Pro', ru: 'Pro' },
        price: 1600,
        img: 'flakon10.jpg', // Сюда вставьте ссылку на ваше фото
        title: { uk: 'Набір "Професійний"', ru: 'Набор "Профессиональный"' },
        desc: { uk: '20 флаконів. Тотальна зачистка.', ru: '20 флаконов. Тотальная зачистка.' },
        marketing: { uk: 'Повний контроль.', ru: 'Полный контроль.' }
    },
     {
        id: 'respirator', price: 50,
        price: 450,
        img: 'respirator.webp', // Сюда вставьте ссылку на ваше фото
        title: { uk: 'Респіратор', ru: 'Респиратор' },
        desc: { uk: "Захист дихання.", ru: 'Защита дыхания.' },
        marketing: { uk: 'Безпека.', ru: 'Безопасность.' }
    }
];

// --- ЛОГИКА ---

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick="setLanguage('${lang}')"]`).classList.add('active');

    const t = translations[lang];
    document.getElementById('brandTitle').textContent = t.brand;
    document.getElementById('heroText').textContent = t.hero;
    document.getElementById('checkoutTitle').textContent = t.checkoutTitle;
    document.getElementById('contactTitle').textContent = t.contactTitle;
    document.getElementById('deliveryTitle').textContent = t.deliveryTitle;
    document.getElementById('successTitle').textContent = t.successTitle;
    document.getElementById('successDesc').textContent = t.successDesc;
    
    document.getElementById('firstName').placeholder = t.namePlace;
    document.getElementById('lastName').placeholder = t.surnamePlace;
    document.getElementById('cityInput').placeholder = t.cityPlace;
    document.getElementById('branchInput').placeholder = t.branchPlace;

    renderProducts();
    updateCartButton();
    if (!document.getElementById('checkout-view').classList.contains('hidden')) renderCartSummary();
}

function renderProducts() {
    const container = document.getElementById('productList');
    container.innerHTML = '';
    const t = translations[currentLang];

    products.forEach(p => {
        const qty = cart[p.id] || 0;
        let buttonHtml = qty === 0 
            ? `<button class="add-btn" onclick="addToCart('${p.id}')">${t.add}</button>`
            : `<div class="qty-control">
                <button class="qty-btn" onclick="updateQty('${p.id}', -1)">-</button>
                <span class="qty-val">${qty}</span>
                <button class="qty-btn" onclick="updateQty('${p.id}', 1)">+</button>
               </div>`;

        const tagHtml = p.tag ? `<div class="card-tag">${p.tag[currentLang]}</div>` : '';
        const priceHtml = `${p.price} ${t.currency}`;

        const card = document.createElement('div');
        card.className = 'card';
        // Внутри renderProducts, перед созданием card.innerHTML
        const imgHtml = p.img ? `<img src="${p.img}" alt="${p.title[currentLang]}" style="width:100%; height:150px; object-fit:contain; margin-bottom:10px; border-radius:8px;">` : '';
        card.innerHTML = `
            ${tagHtml}
            ${imgHtml}
            <h3 class="card-title">${p.title[currentLang]}</h3>
            <div class="card-desc">${p.desc[currentLang]}</div>
            <div class="card-marketing">${p.marketing[currentLang]}</div>
            <div class="card-footer"><span class="price">${priceHtml}</span>${buttonHtml}</div>
        `;
        container.appendChild(card);
    });
}

function addToCart(id) {
    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    renderProducts();
    updateCartButton();
}

function updateQty(id, delta) {
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    renderProducts();
    updateCartButton();
    if (!document.getElementById('checkout-view').classList.contains('hidden')) renderCartSummary();
}

function updateCartButton() {
    const t = translations[currentLang];
    let totalSum = 0;
    for (const [id, qty] of Object.entries(cart)) {
        const product = products.find(p => p.id === id);
        if (product) totalSum += product.price * qty;
    }

    if (totalSum > 0) {
        if (document.getElementById('checkout-view').classList.contains('hidden')) {
            tg.MainButton.setText(`${t.mainBtnOrder} (${totalSum} ${t.currency})`);
            tg.MainButton.onClick(showCheckout);
            tg.MainButton.show();
        } else {
            tg.MainButton.setText(`${t.mainBtnPay} ${totalSum} ${t.currency}`);
            tg.MainButton.onClick(submitOrder);
            tg.MainButton.show();
        }
    } else {
        tg.MainButton.hide();
    }
}

function showCheckout() {
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('checkout-view').classList.remove('hidden');
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
        document.getElementById('checkout-view').classList.add('hidden');
        document.getElementById('main-view').classList.remove('hidden');
        tg.BackButton.hide();
        tg.MainButton.offClick(submitOrder);
        updateCartButton();
    });
    renderCartSummary();
    updateCartButton();
}

function renderCartSummary() {
    const container = document.getElementById('cartSummary');
    container.innerHTML = '';
    const t = translations[currentLang];
    let total = 0;

    for (const [id, qty] of Object.entries(cart)) {
        const product = products.find(p => p.id === id);
        const sum = product.price * qty;
        total += sum;
        container.innerHTML += `<div class="cart-item"><span>${product.title[currentLang]} x ${qty}</span><span>${sum} ${t.currency}</span></div>`;
    }
    container.innerHTML += `<div style="text-align:right; font-weight:bold; margin-top:10px;">${t.total}: ${total} ${t.currency}</div>`;
}

// ОТПРАВКА ДАННЫХ
function submitOrder() {
    const t = translations[currentLang];
    const phone = document.getElementById('phone').value;
    const name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
    const city = document.getElementById('cityInput').value;
    const branch = document.getElementById('branchInput').value;

    if (!phone || !name || !city || !branch) {
        tg.showAlert(currentLang === 'uk' ? 'Заповніть усі поля!' : 'Заполните все поля!');
        return;
    }

    tg.MainButton.showProgress();
    
    // Собираем данные
    let cartItems = [];
    let totalSum = 0;
    for (const [id, qty] of Object.entries(cart)) {
        const product = products.find(p => p.id === id);
        cartItems.push({ title: product.title[currentLang], qty: qty, price: product.price });
        totalSum += product.price * qty;
    }

    const orderId = 'ORD-' + Math.floor(Math.random() * 100000);
    
    const dataToSend = {
        orderId: orderId,
        contact: { name, phone, city, branch },
        cart: cartItems,
        totalSum: totalSum,
        lang: currentLang
    };

    lastOrderData = dataToSend; // Сохраняем для PDF

    // Отправка в Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Важно для Google Apps Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    })
    .then(() => {
        // Успех
        tg.MainButton.hideProgress();
        tg.MainButton.hide();
        
        document.getElementById('checkout-view').classList.add('hidden');
        document.getElementById('success-view').classList.remove('hidden');

        // Опционально: отправить данные и боту тоже, чтобы он видел
        // tg.sendData(JSON.stringify(dataToSend));
    })
    .catch(err => {
        tg.MainButton.hideProgress();
        tg.showAlert('Error: ' + err);
    });
}

// ГЕНЕРАЦИЯ PDF (Исправленная и защищенная версия)
function downloadPDF() {
    try {
        // 1. Проверка данных
        if (!lastOrderData) {
            tg.showAlert("Помилка: Дані замовлення відсутні.");
            return;
        }

        // 2. Проверка библиотеки
        if (!window.jspdf) {
            tg.showAlert("Помилка: Бібліотека PDF не завантажена. Перевірте інтернет.");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const d = lastOrderData;
        let y = 10;

        // 3. Формирование чека (ИСПОЛЬЗУЕМ ТОЛЬКО ЛАТИНИЦУ/ТРАНСЛИТ)
        // Кириллица без подключения шрифта сломает PDF, поэтому используем транслит
        
        doc.setFontSize(16);
        doc.text(`Order #${d.orderId}`, 10, y);
        y += 10;
        
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, y);
        y += 10;
        doc.text("------------------------------------------------", 10, y);
        y += 10;

        // Блок клиента
        doc.text(`Customer: ${transliterate(d.contact.name)}`, 10, y);
        y += 7;
        doc.text(`Phone: ${d.contact.phone}`, 10, y);
        y += 7;
        // Проверка на случай пустых полей
        const safeCity = d.contact.city ? transliterate(d.contact.city) : "";
        const safeBranch = d.contact.branch ? transliterate(d.contact.branch) : "";
        
        doc.text(`City: ${safeCity}`, 10, y);
        y += 7;
        doc.text(`Branch: ${safeBranch}`, 10, y);
        y += 10;
        
        doc.text("------------------------------------------------", 10, y);
        y += 10;
        
        doc.text("Items:", 10, y);
        y += 7;
        
        // Блок товаров
        d.cart.forEach(item => {
            // Очищаем название от лишних символов и транслитерируем
            const cleanTitle = item.title ? transliterate(item.title) : "Item";
            const line = `${cleanTitle} x${item.qty} - ${item.price * item.qty} UAH`;
            
            // Если строка слишком длинная, обрезаем
            if (line.length > 40) {
                 doc.text(line.substring(0, 40) + "...", 10, y);
            } else {
                 doc.text(line, 10, y);
            }
            y += 7;
        });
        
        y += 5;
        doc.setFontSize(14);
        doc.text(`TOTAL: ${d.totalSum} UAH`, 10, y);
        
        y += 10;
        doc.setFontSize(10);
        doc.text("Dyakuyemo za zamovlennya!", 10, y); // Спасибо за заказ транслитом

        // 4. Сохранение
        doc.save(`Order_${d.orderId}.pdf`);

    } catch (error) {
        // Если произошла ошибка, показываем её пользователю
        tg.showAlert("Помилка створення PDF: " + error.message);
        console.error(error);
    }
}


function closeApp() {
    tg.close();
}

// Простая функция транслитерации для PDF (чтобы избежать проблем со шрифтами без бэкенда)
function transliterate(word) {
    if(!word) return "";
    const a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu","ї":"yi","і":"i","є":"ye","ґ":"g","Ї":"YI","І":"I","Є":"YE","Ґ":"G"};
    return word.split('').map(function (char) { 
        return a[char] || char; 
    }).join("");
}

setLanguage('uk');
