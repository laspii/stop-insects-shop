const tg = window.Telegram.WebApp;
tg.expand();

// ВСТАВЬТЕ СЮДА ВАШ URL ИЗ ШАГА 1
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzpwUDqv-ndmUR6Uf3kemQS0oTECJbR1QoyM_NbAFE_yLWP3TvnXuf8zztXnVTL7NnYgA/exec'; 

let currentLang = 'uk';
let cart = {}; 
let lastOrderData = null;

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
        successDesc: "Дані успішно передані менеджеру.",
        pdfTitle: "Звіт та Інструкція",
        pdfDesc: "Доказова база: як засіб знищує клопів та їхні яйця. Покроковий план.",
        pdfBtn: "📄 Завантажити звіт (PDF)",
        doubtsTitle: "🤔 Маєте сумніви, чи засіб допоможе?",
        doubtsText: "Дізнайтеся, як він знищує яйця комах та чому це надійніше за виклик служби.",
        doubtsBtn: "Читати детальніше →",
        priceDisclaimer: "* Ціни вказані без урахування вартості доставки та податків.",
        seoText: "Це повна версія магазину. Щоб оформити замовлення, перейдіть у наш Telegram-бот 👇",
        seoBtn: "🤖 Відкрити в Telegram"
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
        successDesc: "Данные успешно переданы менеджеру.",
        pdfTitle: "Отчет и Инструкция",
        pdfDesc: "Доказательная база: как средство уничтожает клопов и их яйца. Пошаговый план.",
        pdfBtn: "📄 Скачать отчет (PDF)",
        doubtsTitle: "🤔 Сомневаетесь, поможет ли средство?",
        doubtsText: "Узнайте, как оно уничтожает яйца насекомых и почему это надежнее вызова службы.",
        doubtsBtn: "Читать подробнее →",
        priceDisclaimer: "* Цены указаны без учета стоимости доставки и налогов.",
        seoText: "Это полная версия магазина. Чтобы оформить заказ, перейдите в наш Telegram-бот 👇",
        seoBtn: "🤖 Открыть в Telegram"
},
    en: {
        brand: "Home Pest Control",
        hero: "We restore your sense of safety and control.",
        currency: "UAH",
        add: "Add",
        checkoutTitle: "Checkout",
        contactTitle: "Contact Information",
        deliveryTitle: "Nova Poshta Delivery",
        namePlace: "First Name",
        surnamePlace: "Last Name",
        cityPlace: "City (e.g. Kyiv)",
        branchPlace: "Branch No. (e.g. 5)",
        mainBtnOrder: "Checkout",
        mainBtnPay: "Confirm Order",
        emptyCart: "Cart is empty",
        total: "Total",
        processing: "Processing...",
        successTitle: "Order Accepted!",
        successDesc: "Your details have been successfully sent to the manager.",
        pdfTitle: "Report & Guide",
        pdfDesc: "Evidence base: how the product destroys bedbugs and their eggs. Step-by-step plan.",
        pdfBtn: "📄 Download Report (PDF)",
        doubtsTitle: "🤔 Doubting if it works?",
        doubtsText: "Learn how it destroys insect eggs and why it's more reliable than calling a pest control service.",
        doubtsBtn: "Read more →",
        priceDisclaimer: "* Prices do not include shipping costs and taxes.",
        seoText: "This is the full version of the store. To place an order, please go to our Telegram bot 👇",
        seoBtn: "🤖 Open in Telegram"
    }
};

const products = [
    {
        id: 'test', price: 150, tag: { uk: 'Тест', ru: 'Тест', en: 'Test' },
        img: 'flakon01.jpg',
        title: { uk: 'Один флакон, тестовий', ru: 'Один флакон, тестовый', en: 'One bottle, test' },
        desc: { 
            uk: 'Один флакон. Локальна обробка.<br>Вбивця клопів №1. Засіб «Метод» — аналог професійної дезінсекції, але в 3 рази дешевше. Вбиває комах за 4 години, захищає до 21 дня. Працює проти резистентних популяцій. Оригінал.', 
            ru: 'Один флакон. Локальная обработка.', 
            en: 'One bottle. Local treatment.<br>Professional grade alternative, but 3 times cheaper. Kills insects in 4 hours, protects for up to 21 days. Works against resistant populations. Original.' 
        },
        marketing: { uk: 'Протестувати.', ru: 'Протестировать.', en: 'Test it out.' }
    },
    {
        id: 'basic', price: 550, tag: { uk: 'Старт', ru: 'Старт', en: 'Basic' },
        img: 'flakon05.jpg',
        title: { uk: 'Набір "Базовий"', ru: 'Набор "Базовый"', en: 'Basic Kit' },
        desc: { 
            uk: '5 флаконів. Локальна обробка.<br>Вбивця клопів №1. Засіб «Метод» — аналог професійної дезінсекції, але в 3 рази дешевше. Вбиває комах за 4 години, захищає до 21 дня. Працює проти резистентних популяцій. Оригінал.', 
            ru: '5 флаконов. Локальная обработка.', 
            en: '5 bottles. Local treatment.<br>Professional grade alternative, but 3 times cheaper. Kills insects in 4 hours, protects for up to 21 days.' 
        },
        marketing: { uk: 'Швидкий старт.', ru: 'Быстрый старт.', en: 'Quick start.' }
    },
    {
        id: 'reinforced', price: 1000, tag: { uk: 'Хіт', ru: 'Хит', en: 'Best' },
        img: 'flakon10.jpg',
        title: { uk: 'Набір "Посилений"', ru: 'Набор "Усиленный"', en: 'Reinforced Kit' },
        desc: { 
            uk: '10 флаконів. Повна обробка квартири.<br>Тотальна зачистка. Цього обсягу вистачить на ретельну обробку всієї 1-кімнатної квартири (кімната + кухня) або на подвійний удар по найскладніших вогнищах. Знищує навіть яйця комах, запобігаючи їх поверненню.', 
            ru: '10 флаконов. Полная обработка квартиры.<br>Тотальная зачистка. Этого объема хватит на тщательную обработку всей 1-комнатной квартиры (комната + кухня) или на двойной удар по самым сложным очагам. Уничтожает даже яйца насекомых, предотвращая их возвращение.',
            en: '10 bottles. Full apartment treatment.<br>Total clearance. Enough volume to thoroughly treat a 1-room apartment or double-strike the toughest spots. Destroys even insect eggs, preventing their return.'        
        },
        marketing: { uk: 'Максимальна сила.', ru: 'Максимальная сила.', en: 'Maximum power.' }
    },
    {
        id: 'pro', price: 1800, tag: { uk: 'Pro', ru: 'Pro', en: 'Pro' },
        img: 'flakon20.jpg',
        title: { uk: 'Набір "Професійний"', ru: 'Набор "Профессиональный"', en: 'Professional Kit' },
        desc: { uk: '20 флаконів. Тотальна зачистка.', ru: '20 флаконов. Тотальная зачистка.', en: '20 bottles. Total clearance.' },
        marketing: { uk: 'Повний контроль.', ru: 'Полный контроль.', en: 'Full control.' }
    },
    {
        id: 'respirator', price: 500, tag: { uk: 'Захист', ru: 'Защита', en: 'Safety' },
        img: 'respirator.webp',
        title: { uk: 'Респіратор', ru: 'Респиратор', en: 'Respirator mask' },
        desc: { uk: "Захист дихання.", ru: 'Защита дыхания.', en: 'Respiratory protection.' },
        marketing: { uk: 'Безпека.', ru: 'Безопасность.', en: 'Safety first.' }
    }
];

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector('.lang-btn[onclick="setLanguage(\'' + lang + '\')"]');
    if(activeBtn) activeBtn.classList.add('active');

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

    if(document.getElementById('pdfTitle')) {
        document.getElementById('pdfTitle').textContent = t.pdfTitle;
        document.getElementById('pdfDesc').textContent = t.pdfDesc;
        document.getElementById('pdfBtn').textContent = t.pdfBtn;
    }

    if(document.getElementById('doubtsTitle')) {
        document.getElementById('doubtsTitle').innerHTML = t.doubtsTitle;
        document.getElementById('doubtsText').textContent = t.doubtsText;
        document.getElementById('doubtsBtn').textContent = t.doubtsBtn;
    }
    
    if(document.getElementById('seoText')) {
        document.getElementById('seoText').textContent = t.seoText;
        document.getElementById('seoBtn').textContent = t.seoBtn;
    }
    
    if(document.getElementById('priceDisclaimer')) {
        document.getElementById('priceDisclaimer').textContent = t.priceDisclaimer;
    }

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
            ? '<button class="add-btn" onclick="addToCart(\'' + p.id + '\')">' + t.add + '</button>'
            : '<div class="qty-control">' +
                '<button class="qty-btn" onclick="updateQty(\'' + p.id + '\', -1)">-</button>' +
                '<span class="qty-val">' + qty + '</span>' +
                '<button class="qty-btn" onclick="updateQty(\'' + p.id + '\', 1)">+</button>' +
              '</div>';

        const tagHtml = p.tag && p.tag[currentLang] ? '<div class="card-tag">' + p.tag[currentLang] + '</div>' : '';
        const priceHtml = p.price + ' ' + t.currency;

        const card = document.createElement('div');
        card.className = 'card';
        const imgHtml = p.img ? '<img src="' + p.img + '" onclick="openImage(\'' + p.img + '\')" alt="Product" style="width:100%; height:150px; object-fit:contain; margin-bottom:10px; border-radius:8px; cursor:pointer;">' : '';
        card.innerHTML = 
            tagHtml +
            imgHtml +
            '<h3 class="card-title">' + p.title[currentLang] + '</h3>' +
            '<div class="card-desc">' + p.desc[currentLang] + '</div>' +
            '<div class="card-marketing">' + p.marketing[currentLang] + '</div>' +
            '<div class="card-footer"><span class="price">' + priceHtml + '</span>' + buttonHtml + '</div>';
        
        container.appendChild(card);
    });
}

function addToCart(id) {
    let currentQty = cart[id] ? parseInt(cart[id]) : 0;
    cart[id] = currentQty + 1;
    renderProducts();
    updateCartButton();
}

function updateQty(id, delta) {
    let currentQty = cart[id] ? parseInt(cart[id]) : 0;
    let newQty = currentQty + delta;
    cart[id] = newQty;
    if (cart[id] <= 0) {
        delete cart[id];
    }
    renderProducts();
    updateCartButton();
}

function updateCartButton() {
    const t = translations[currentLang];
    let totalSum = 0;
    
    for (const [id, qty] of Object.entries(cart)) {
        const product = products.find(p => p.id === id);
        if (product) {
            totalSum += product.price * parseInt(qty);
        }
    }

    const tgBtn = window.Telegram.WebApp.MainButton;
    
    if (totalSum > 0) {
        if (document.getElementById('checkout-view').classList.contains('hidden')) {
            tgBtn.setText(t.mainBtnOrder + ' (' + totalSum + ' ' + t.currency + ')');
            tgBtn.show();
            tgBtn.onClick(showCheckout);
        } else {
            tgBtn.setText(t.mainBtnPay + ' ' + totalSum + ' ' + t.currency);
            tgBtn.show();
            tgBtn.onClick(submitOrder);
        }
    } else {
        tgBtn.hide();
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
        container.innerHTML += '<div class="cart-item"><span>' + product.title[currentLang] + ' x ' + qty + '</span><span>' + sum + ' ' + t.currency + '</span></div>';
    }
    container.innerHTML += '<div style="text-align:right; font-weight:bold; margin-top:10px;">' + t.total + ': ' + total + ' ' + t.currency + '</div>';
}

function submitOrder() {
    const phone = document.getElementById('phone').value;
    const name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
    const city = document.getElementById('cityInput').value;
    const branch = document.getElementById('branchInput').value;

    if (!phone || !name || !city || !branch) {
        tg.showAlert(currentLang === 'uk' ? 'Заповніть усі поля!' : (currentLang === 'ru' ? 'Заполните все поля!' : 'Please fill in all fields!'));
        return;
    }

    tg.MainButton.showProgress();
    
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

    lastOrderData = dataToSend;

    if (typeof gtag === 'function') {
        gtag('event', 'purchase', {
            'transaction_id': orderId,
            'value': totalSum,
            'currency': 'UAH'
        });
    }
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    })
    .then(() => {
        tg.MainButton.hideProgress();
        tg.MainButton.hide();
        
        document.getElementById('checkout-view').classList.add('hidden');
        document.getElementById('success-view').classList.remove('hidden');
    })
    .catch(err => {
        tg.MainButton.hideProgress();
        tg.showAlert('Error: ' + err);
    });
}

function downloadPDF() {
    try {
        if (!lastOrderData) {
            tg.showAlert("Помилка: Дані замовлення відсутні.");
            return;
        }

        if (!window.jspdf) {
            tg.showAlert("Помилка: Бібліотека PDF не завантажена. Перевірте інтернет.");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const d = lastOrderData;
        let y = 10;
        
        doc.setFontSize(16);
        doc.text("Order #" + d.orderId, 10, y);
        y += 10;
        
        doc.setFontSize(10);
        doc.text("Date: " + new Date().toLocaleDateString(), 10, y);
        y += 10;
        doc.text("------------------------------------------------", 10, y);
        y += 10;

        doc.text("Customer: " + transliterate(d.contact.name), 10, y);
        y += 7;
        doc.text("Phone: " + d.contact.phone, 10, y);
        y += 7;
        
        const safeCity = d.contact.city ? transliterate(d.contact.city) : "";
        const safeBranch = d.contact.branch ? transliterate(d.contact.branch) : "";
        
        doc.text("City: " + safeCity, 10, y);
        y += 7;
        doc.text("Branch: " + safeBranch, 10, y);
        y += 10;
        
        doc.text("------------------------------------------------", 10, y);
        y += 10;
        doc.text("Items:", 10, y);
        y += 7;
        
        d.cart.forEach(item => {
            const cleanTitle = item.title ? transliterate(item.title) : "Item";
            const line = cleanTitle + " x" + item.qty + " - " + (item.price * item.qty) + " UAH";
            
            if (line.length > 40) {
                 doc.text(line.substring(0, 40) + "...", 10, y);
            } else {
                 doc.text(line, 10, y);
            }
            y += 7;
        });
        
        y += 5;
        doc.setFontSize(14);
        doc.text("TOTAL: " + d.totalSum + " UAH", 10, y);
        
        y += 10;
        doc.setFontSize(10);
        doc.text("Dyakuyemo za zamovlennya!", 10, y);

        doc.save("Order_" + d.orderId + ".pdf");

    } catch (error) {
        tg.showAlert("Помилка створення PDF: " + error.message);
        console.error(error);
    }
}

function closeApp() {
    tg.close();
}

function transliterate(word) {
    if(!word) return "";
    const a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu","ї":"yi","і":"i","є":"ye","ґ":"g","Ї":"YI","І":"I","Є":"YE","Ґ":"G"};
    return word.split('').map(function (char) { 
        return a[char] || char; 
    }).join("");
}

function openImage(imgSrc) {
    const viewer = document.getElementById('image-viewer');
    const fullImg = document.getElementById('full-image');
    fullImg.src = imgSrc;
    viewer.classList.remove('hidden');
}

function closeImage() {
    document.getElementById('image-viewer').classList.add('hidden');
}

function checkEnvironment() {
    const seoBanner = document.getElementById('seo-banner');
    if (!tg.initData) {
        seoBanner.classList.remove('hidden');
    }
}

checkEnvironment();
setLanguage('uk');
