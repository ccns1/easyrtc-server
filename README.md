# Установка
## Требования к ПО
Для корректной работы требуются:
+ NodeJS 6.x
+ MongoDB 3.x
+ Сертефикат https (прописываются в server.js)

Все остальное прописанно в package.json
### Особенности архитектуры
Папка с видесервером находится внутри папки с SDK. Так посчитали логичнее разработчики SDK, отучить не пробовал (пока). 

## Установка
Для установки и корректной работы в папку, где будет находится рабочая папка проекта выполняем комманды в терминале:
> $ git clone https://github.com/priologic/easyrtc && npm install

После этого выполняем комманды: 
> $ git clone https://gl.sdvor.com/dshevelev/nodejs-videochat.git && cd nodejs-videochat && npm install

Старт проект выполняется коммандой:
> $ node server

Настройки подключения к базе находтся в файле mongo-express-config.js.