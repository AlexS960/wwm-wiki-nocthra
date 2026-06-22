# SEO и регистрация в поисковых системах



Краткое руководство для владельца сайта **WWM Вики** (`https://wwm-wiki-nocthra.ru`).



## Что уже настроено на сайте



| Файл | Назначение |

|------|------------|

| `src/seo/routes.json` | Единый список страниц: URL, title, description, keywords, priority |

| `scripts/generate-seo.mjs` | Генерирует `public/sitemap.xml` и `public/robots.txt` перед сборкой |

| `src/lib/seo.ts` + `usePageSeo` | Мета-теги, Open Graph, canonical, JSON-LD на каждой странице |

| `public/robots.txt` | Разрешает индексацию, закрывает `/admin` и `/staffchat` |

| `public/sitemap.xml` | Карта сайта: 18 разделов + 111 карточек вики (129 URL) |



После изменения маршрутов или мета-данных:



```bash

npm run build

# или только SEO-файлы:

npm run seo:generate

```



Деплой обновлённых `dist/sitemap.xml` и `dist/robots.txt` на сервер обязателен.



### SSL-сертификат



Для SEO и регистрации в поисковиках **не нужен платный SSL от REG.RU**. На сервере достаточно бесплатного **Let's Encrypt** (certbot) — Google и Яндекс одинаково доверяют HTTPS с любым валидным сертификатом.



---



## Публичные URL в sitemap



### Разделы (18 страниц)



| URL | Раздел | priority | changefreq |

|-----|--------|----------|------------|

| `/` | Главная | 1.0 | daily |

| `/guides` | Гайды | 0.9 | daily |

| `/wwmwiki` | Оглавление вики | 0.9 | weekly |

| `/weapons` | Оружие | 0.85 | weekly |

| `/builds` | Билды | 0.85 | weekly |

| `/sects` | Секты | 0.85 | weekly |

| `/bosses` | Боссы | 0.85 | weekly |

| `/npcs` | NPC | 0.85 | weekly |

| `/riddles` | Загадки | 0.85 | weekly |

| `/innerpath` | Внутренний путь | 0.8 | weekly |

| `/mystic` | Мистические арты | 0.8 | weekly |

| `/cooking` | Готовка | 0.8 | weekly |

| `/lifeskills` | Жизненные навыки | 0.8 | weekly |

| `/tips` | Советы и коды | 0.75 | weekly |

| `/guilds` | Гильдии | 0.7 | weekly |

| `/faq` | FAQ | 0.65 | monthly |

| `/suggestions` | Предложения | 0.6 | daily |

| `/users` | Пользователи | 0.5 | weekly |



**Не индексируются:** `/admin`, `/staffchat` (закрыты в `robots.txt` и `noindex`).



### Карточки вики (111 deep links)



Скрипт `generate-seo.mjs` автоматически добавляет URL вида:



```

https://wwm-wiki-nocthra.ru/weapons#wiki-card-nameless-sword

https://wwm-wiki-nocthra.ru/bosses#wiki-card-dalang

https://wwm-wiki-nocthra.ru/innerpath#wiki-card-phantom-rally

```



Разделы с карточками: оружие, билды, секты, боссы, мистические арты, готовка, советы, жизненные навыки, внутренний путь. Priority: **0.55**, changefreq: **monthly**.



NPC и загадки используют модальные окна без `#wiki-card-…` — отдельные URL для них не генерируются.



---



## Проверка robots.txt



Откройте в браузере:



```

https://wwm-wiki-nocthra.ru/robots.txt

```



Ожидаемое содержимое:



```

User-agent: *

Allow: /



Disallow: /admin

Disallow: /staffchat



Sitemap: https://wwm-wiki-nocthra.ru/sitemap.xml

```



Если файл недоступен или устарел — пересоберите проект (`npm run build`) и задеплойте `dist/`.



---



## Google Search Console



**Сайт:** [search.google.com/search-console](https://search.google.com/search-console)



### 1. Добавить ресурс



1. «Добавить ресурс» → выберите **Домен** (`wwm-wiki-nocthra.ru`) или **URL-префикс** (`https://wwm-wiki-nocthra.ru/`).

2. Для домена нужна DNS-запись; для префикса — HTML-файл или мета-тег.



### 2. Подтверждение владения



**DNS (рекомендуется):**



1. Search Console покажет TXT-запись вида `google-site-verification=...`.

2. В панели REG.RU (DNS домена) или на FirstVDS добавьте TXT-запись для `wwm-wiki-nocthra.ru`.

3. Подождите 5–30 минут (иногда до 24 ч), нажмите «Подтвердить».



**HTML-файл (альтернатива):** скачайте файл от Google, положите в `public/` (например `public/google123.html`), соберите и задеплойте. Файл будет доступен по `https://wwm-wiki-nocthra.ru/google123.html`.



**Мета-тег (альтернатива):** вставьте тег в `<head>` файла `index.html`, соберите и задеплойте.



### 3. Отправить sitemap



1. Меню слева → **Файлы Sitemap** → «Добавить новую карту сайта».

2. Укажите: `https://wwm-wiki-nocthra.ru/sitemap.xml`

3. Статус «Успешно» может появиться через несколько часов.



### 4. Полезные разделы



- **Проверка URL** — проверить, видит ли Google конкретную страницу.

- **Эффективность** — запросы и клики (данные появятся после индексации).

- **Индексирование → Страницы** — сколько URL в индексе и есть ли ошибки.



---



## Яндекс Вебмастер



**Сайт:** [webmaster.yandex.ru](https://webmaster.yandex.ru)



### 1. Добавить сайт



1. «+ Добавить сайт» → `https://wwm-wiki-nocthra.ru`

2. Подтверждение — на выбор:

   - **DNS TXT** (как в Google — добавить запись в REG.RU);

   - **HTML-файл** в `public/`;

   - **мета-тег** в `index.html`.



### 2. Отправить sitemap



1. **Индексирование → Файлы Sitemap**

2. Добавьте: `https://wwm-wiki-nocthra.ru/sitemap.xml`



### 3. Дополнительно



- **Индексирование → Переобход страниц** — ускорить проверку главной и ключевых разделов (`/`, `/guides`, `/weapons`).

- **Настройки индексирования** — регион «Россия», главное зеркало `https://wwm-wiki-nocthra.ru` (без `www`, если так настроен nginx).

- **Оригинальные тексты** — при желании подтвердить авторство материалов вики.



---



## Bing Webmaster Tools



**Сайт:** [bing.com/webmasters](https://www.bing.com/webmasters)



1. Добавьте сайт `https://wwm-wiki-nocthra.ru`.

2. Подтвердите через XML-файл, мета-тег или DNS (аналогично Google).

3. **Sitemaps** → Submit: `https://wwm-wiki-nocthra.ru/sitemap.xml`



> Совет: после верификации в Google можно импортировать сайт из Search Console в Bing («Import from Google Search Console») — быстрее, чем настраивать заново.



---



## Чего ожидать после регистрации



| Этап | Срок |

|------|------|

| Подтверждение владения | Минуты–часы (DNS до 24 ч) |

| Первый обход sitemap | 1–3 дня |

| Появление страниц в индексе | 3–14 дней (иногда дольше) |

| Стабильные позиции и трафик | Недели–месяцы |



**SPA (React):** поисковики выполняют JavaScript, но индексация SPA медленнее статических сайтов. На WWM Вики уже есть:



- уникальные title/description на каждом маршруте;

- canonical URL;

- JSON-LD (WebSite, WebPage, FAQPage, CollectionPage);

- sitemap (129 URL) и robots.txt.



---



## Чек-лист после деплоя



- [ ] `https://wwm-wiki-nocthra.ru/sitemap.xml` открывается и содержит 129 URL

- [ ] `https://wwm-wiki-nocthra.ru/robots.txt` указывает на sitemap

- [ ] HTTPS работает (Let's Encrypt — достаточно, платный SSL не нужен)

- [ ] Сайт зарегистрирован в Google Search Console

- [ ] Sitemap отправлен в Google

- [ ] Сайт зарегистрирован в Яндекс Вебмастер

- [ ] Sitemap отправлен в Яндекс

- [ ] (Опционально) Bing Webmaster + sitemap

- [ ] Через 1–2 недели проверить «Покрытие» / «Страницы в поиске»



---



## Как добавить новую страницу в SEO



1. Добавьте маршрут в `src/seo/routes.json` (`id`, `path`, `title`, `description`, `keywords`, `priority`, `changefreq`).

2. Убедитесь, что тот же `path` работает в приложении (`src/lib/appRoutes.ts` читает этот файл).

3. Запустите `npm run build` — sitemap обновится автоматически.

4. Карточки вики из сидов подхватываются автоматически при сборке — правки в `scripts/wikiSeeds.ts` или `scripts/data/innerPathRu.json`.

5. После деплоя переотправите sitemap в Search Console / Вебмастер (или дождитесь автоматического переобхода).



Служебные страницы помечайте `"noindex": true` — они не попадут в sitemap.


