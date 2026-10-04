/**
 * Настройки сайта-приглашения.
 * Для работы формы укажите access key от https://web3forms.com
 * (бесплатно: зарегистрируйтесь → Access Key → вставьте ниже).
 */
window.WEDDING_CONFIG = {
  // Ключ Web3Forms — без него форма покажет инструкцию
  web3formsKey: "165ebbd9-4ba7-49ef-8a8f-ff767da86e30",

  // Куда дублировать ответы (опционально): email из кабинета Web3Forms
  // Можно также указать Formspree: "https://formspree.io/f/xxxxxx"
  formEndpoint: "https://formspree.io/f/xwlpggjy",

  couple: {
    he: "Никита",
    she: "Маргарита",
  },

  event: {
    date: "2027-07-17",
    time: "11:40",
    timezone: "Europe/Moscow",
    place: "ЗАГС Красносельского района",
    address: "ул. Доблести 36",
    city: "Санкт-Петербург",
    lat: 59.847799,
    lng: 30.177085,
  },

  music: "assets/music.mp3",
};
