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
        // Нові переклади:
        doubtsTitle: "🤔 Маєте сумніви, чи засіб допоможе?",
        doubtsText: "Дізнайтеся, як він знищує яйця комах та чому це надійніше за виклик служби.",
        doubtsBtn: "Читати детальніше →",
        priceDisclaimer: "* Ціни вказані без урахування вартості доставки та податків."
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
        // Нові переклади:
        doubtsTitle: "🤔 Сомневаетесь, поможет ли средство?",
        doubtsText: "Узнайте, как оно уничтожает яйца насекомых и почему это надежнее вызова службы.",
        doubtsBtn: "Читать подробнее →",
        priceDisclaimer: "* Цены указаны без учета стоимости доставки и налогов."
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
        // Нові переклади:
        doubtsTitle: "🤔 Doubting if it works?",
        doubtsText: "Learn how it destroys insect eggs and why it's more reliable than calling a pest control service.",
        doubtsBtn: "Read more →",
        priceDisclaimer: "* Prices do not include shipping costs and taxes."
    }
};

const products = [
    {
        id: 'test', price: 150, tag: { uk: 'Тест', ru: 'Тест', en: 'Test' },
        img: 'flakon01.jpg',
        title: { uk: 'Один флакон, тестовий
