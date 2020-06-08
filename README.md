# Lóra

Tvorba projektu karetní hry Lóra, populární na Kladensku.
Frontend aplikace vyvíjen ve Vue.js.
Podrobné informace a pravidla Lóry zde: [Wikipedie](https://cs.wikipedia.org/wiki/L%C3%B3ra).

## Popis Hry

Hra probíhá čtyřkolově v předem určeném pořadí (viz. Pravidla hry). Uživatel hraje proti třem soupeřům ovládaným umělou inteligencí na základě jednoduchých algoritmů. Cílem hry je dosáhnout co možná nejnižšího počtu trestných bodů.

## Webpage

Ukázka Single Page Aplikace k nahlédnutí zde: [Karty Lóra](http://www.hra-lora.cz).

### Databáze výsledků

Po odehrání hry má uživatel možnost zapsat svůj výsledek do databázové tabulky rekordů. Na stránce se nachází více tabulek filtrovaných dle časových úseků pro lepší motivaci k soutěžení. Komunikace s databází probíhá pomocí knihovny Axios. Backend MongoDB databáze - API naprogramován v Node.js.

### Nastavení

Nabídka nastavení zahrnuje volbu času odezvy oponentů, uživatelského jména nebo také umožňuje automatické řazení karetního balíčku.
