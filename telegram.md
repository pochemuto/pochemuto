---
layout: page
title: Прокси для Telegram
permalink: /telegram
---

Быстрый старт
-------------
Прежде всего попробуйте открыть эту ссылку:
[Merkel-Telegram-Proxy](https://t.me/socks?server=merkel.pochemuto.com&port=1080&username=public&password=story-of-my-life)
Это самый простой способ настроить телеграм, но он может работать нестабильно. Например, иногда не сохраняются логин и пароль. Если по каким-то причинам этот способ не подошел, ниже инструкции как настроить вручную.

Общая информация
----------------
- Сервер `merkel.pochemuto.com`, порт `1080`
- Имя пользователя `public`, пароль `story-of-my-life`

iOS
------------------
- Настройки
- Данные и диск

![iOS step 1]({{ "/img/telegram/telegram-ios-step1.png" | absolute_url }}){:width="400px"}
- Прокси - SOCK5

![iOS step 2]({{ "/img/telegram/telegram-ios-step2.png" | absolute_url }}){:width="400px"}
- Установить SOCK5
- Соедниение, server: `merkel.pochemuto.com`, порт `1080`
- Имя пользователя `public`, пароль `story-of-my-life`

![iOS step 3]({{ "/img/telegram/telegram-ios-step3.png" | absolute_url }}){:width="400px"}

macOS
------------------

- Настройки
- Конфиденциальность
- Использовать прокси

![macOS step 1]({{ "/img/telegram/telegram-osx-step1.png" | absolute_url }})

- SOCK5
- Сервер `merkel.pochemuto.com`, порт `1080`
- Имя пользователя `public`, пароль `story-of-my-life`

![macOS step 2]({{ "/img/telegram/telegram-osx-step2.png" | absolute_url }})
