# Никита & Маргарита — сайт-приглашение

Мобильный сайт-приглашение на свадьбу (17.07.2027) для хостинга на **GitHub Pages**.  
Стартовый экран с конвертом, таймер, расписание, карта, dress code и **форма RSVP + опрос**.


## Быстрый старт

1. Откройте `index.html` локально или поднимите любой static-сервер.
2. Для формы:
   - зарегистрируйтесь на [web3forms.com](https://web3forms.com);
   - скопируйте Access Key;
   - вставьте его в `js/config.js` → `web3formsKey`.
3. Ответы гостей придут на email, указанный в кабинете Web3Forms.

Альтернатива Formspree: в `formEndpoint` укажите `https://formspree.io/f/ВАШ_ID` (ключ Web3Forms тогда не нужен).

## Публикация на GitHub Pages

```bash
git init
git add .
git commit -m "Add wedding invitation site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

В репозитории: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / root**.

Сайт будет доступен по адресу:

`https://USERNAME.github.io/REPO/`

Если репозиторий называется `USERNAME.github.io`, сайт откроется на корневом домене.

## Что можно поменять

| Файл | Что править |
|------|-------------|
| `js/config.js` | Имена, дата, адрес, ключ формы, музыка |
| `index.html` | Тексты, расписание, вопросы опроса |
| `css/styles.css` | Цвета и типографика |
| `assets/hero.png` | Картинка стартового экрана |
| `assets/music.mp3` | Фоновая музыка |

## Структура

```
index.html
css/styles.css
js/config.js
js/app.js
assets/
  hero.png
  music.mp3
  icons/
```

Форма работает без собственного бэкенда — GitHub Pages отдаёт только статику, а отправку делает Web3Forms / Formspree.
