# CloudDisk

## Описание
**CloudDisk** — это пет-проект на **React** с максимально простым дизайном, частично взятым с Google Диск. Проект позволяет загружать, управлять и организовывать файлы в облачном хранилище.

## Технологии
**Frontend:**
- React
- React Router
- Redux Toolkit
- React Hook Form + Zod
- React-PDF (просмотр PDF)
- Bootstrap (UI)
- Axios (запросы к серверу)

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT 
- bcryptjs
- Express-validator
- Express-fileupload (загрузка файлов)
- Nodemailer (отправка письма на почту)

## Запуск
   **Запуск клиента/сервера:**
   ```bash
   cd client/server
   npm run dev
   ```
   Для работы сервера необходим файл **.env**. Можно посмотреть файл **.env.d.ts**, чтобы понять, какие переменные нужно добавить.

## Основные фичи
- Регистрация и авторизация (JWT + email-подтверждение)
- Загрузка файлов с возможностью организации в папки + drag&drop
- Отображение списка файлов и папок
- Просмотр pdf,txt,png-файлов прямо в интерфейсе
- Фильтрация и поиск по файлам
- Удаление файлов и папок
---
## Примечания
- Стили ровно как и верстка сделаны через ИИ
- Сделано все максимально просто
- Нужен рефакторинг, но его не будет(



