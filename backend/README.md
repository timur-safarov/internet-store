# Keystone Project Starter
Репозиторий взят отсюдва и переделан под работу с PostgreSQL
https://github.com/keystonejs/create-keystone-app/tree/main/create-keystone-app/starter

Установить node 16.13
Установить сборщик пакетов npm

Установить
Postgres + Pgadmin
Создать таблицу wb_user
model wb_user {
  id       Int     @id @default(autoincrement())
  username String  @default("")
  email    String  @unique @default("")
  password String?
}

/**=================================================================================**/

Создадим папку node_modules
npm install
или
npm i

/**=================================================================================**/

Удаляем порт если он был запущен
npx kill-port 3000

/**=================================================================================**/

Запускаем проект
npm run dev

/**=================================================================================**/

Можно скачать репозиторий отсюдва
https://github.com/keystonejs/create-keystone-app/

И поставить его так

Зайти в create-keystone-app/

cd create-keystone-app/

/**=================================================================================**/

Запустить инициализацию keystone
npm init keystone-app

/**=================================================================================**/

Указать папку при установки
После установки перейти в папку
И запустить проект так же как выше
Но поменять keystone.ts
url: 'postgres://postgres:postgres@localhost:5432/wes-bos',
idField: { kind: 'autoincrement' }

А также в файле schema.prisma
model wb_user {
  id       Int     @id @default(autoincrement())
  username String  @default("")
  email    String  @unique @default("")
  password String?
}

/**=================================================================================**/


