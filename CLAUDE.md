# paNeo · Web + App (PWA) con Google Sheets

> Encargo para Claude Code. Léelo entero antes de empezar. **Hay que entregarlo HOY por la tarde**, así que lo prioritario es que funcione y se vea bien; lo perfecto, después.

## 0. Contexto

**paNeo** es un trabajo de emprendimiento de Alba Navarro, Lucía Baró y Hernán de Lorenzo: una pastelería **apta para todos** (celíacos, veganos, intolerantes, alérgicos, sin azúcar) con **cero contaminación cruzada**. "Pan" = todo (griego) + "Neo" = nuevo.

Hay que construir **dos cosas en un solo repositorio**, todo **gratis (0 €)**:

1. **Web pública** (landing muy animada + página "Cómo funciona").
2. **App PWA** (se añade a la pantalla de inicio desde Safari) que **recrea EXACTAMENTE el prototipo de Canva** + una pantalla nueva de **tarjeta de sellos**, todo conectado a **Google Sheets** como base de datos.

Material en esta carpeta:

```
CLAUDE.md                          ← este archivo
assets/
  logo-paneo.jpeg                  ← logo oficial (fondo blanco, dibujado a mano)
  bono-cara-cliente.png            ← bono de sellos en papel, cara delantera
  bono-cara-sellos.png             ← bono de sellos en papel, cara de las casillas
  mapa-ubicacion.png               ← mapa del Word (Madrid centro)
referencias/
  paNeo.docx                       ← el trabajo escrito completo (fuente de los textos)
  mock-web-landing.html            ← mock aprobado de la landing (ver §2)
  canva/pantalla-1..6.png          ← capturas del prototipo de la app (baja resolución)
  canva-hd/  (opcional)            ← si Pau añade las pantallas del Canva en alta, úsalas
```

Prototipo de Canva (solo lectura): https://canva.link/uhkb5qc74boykxr

## 1. Stack y estructura (no compliques)

- **HTML + CSS + JS a pelo, sin build**. Nada de Next/React: tiene que estar hoy y publicarse arrastrando una carpeta o con GitHub Pages.
- Animaciones de la web: **GSAP 3 + ScrollTrigger desde cdnjs** (versión fija, p. ej. 3.12.5). Respeta `prefers-reduced-motion`.
- Fuentes de Google Fonts: **Gloock** (títulos) y **Jost** (texto). Se parecen a las del Canva.
- **Rutas siempre relativas** (se publicará en `https://<usuario>.github.io/paneo/`).

```
/index.html             ← landing
/como-funciona.html     ← página "Dos formas de darte un capricho"
/css/web.css
/js/web.js
/assets/...             ← logo, iconos PWA, fotos de producto
/app/index.html         ← la PWA (SPA con vistas por hash: #inicio, #buscar, #encuesta, #perfil, #favoritos, #sellos, #pedido)
/app/app.css
/app/app.js
/app/config.js          ← const API_URL = "PEGAR_AQUI_URL_APPS_SCRIPT";
/app/manifest.webmanifest
/app/sw.js
/apps-script/Code.gs    ← backend para pegar en Google Apps Script
/LEEME.md               ← pasos para Pau (Sheet, despliegue y publicación)
```

### Paleta (sacada del Canva y del logo)

| Token | Hex | Uso |
|---|---|---|
| chocolate | `#3E1A0E` | fondos oscuros, cabecera de la app (en el Canva, `#4E2212` aprox.) |
| marrón | `#8A4420` | fondo principal de la app, tarjetas |
| crema | `#F7F0E3` | tarjetas claras, texto sobre oscuro |
| tostado | `#E6B37C` | iconos de filtros, detalles |
| dorado | `#F2B33D` | acentos |
| naranja | `#E8761E` | botones principales (color de la N del logo) |

### Erratas a corregir en todos los textos
- "Búsca" → **"Busca"**
- "glutén" → **"gluten"**

## 2. WEB (landing): `index.html`

**Referencia visual obligatoria: `referencias/mock-web-landing.html`.** Ese archivo es un mock hecho en una herramienta de diseño (usa etiquetas propias como `<x-dc>`, `<sc-for>`, `{{...}}` y un `support.js` que NO existe aquí). **No lo copies tal cual: tradúcelo a HTML/CSS/JS normal** manteniendo textos, colores, tipografías, layout y animaciones. Pau ya lo ha aprobado ("está súper").

Secciones, en orden (sale todo del mock):

1. **Nav**: logo en una píldora blanca, enlaces (La idea, Carta, Cómo funciona, Dónde) y botón naranja "Abrir la app" que lleva a `app/`.
2. **Hero**: "Pan para todos." con las palabras entrando de una en una, el pan SVG con la N flotando y vapor animado, las migas subiendo y las 4 etiquetas orbitando (Sin gluten, Vegano, 0 azúcar, Sin lactosa). Dos botones: **"Ver la carta"** (ancla) y **"Cómo funciona"**, que **enlaza a `como-funciona.html`** (cambio pedido por Pau).
3. **Dos marquees** inclinados en sentidos opuestos.
4. **El nombre**: "pan" entra desde la izquierda y "neo" desde la derecha con scroll, y un "paNeo" gigante en contorno con parallax detrás.
5. **Promesa**: frase grande + 01/02/03 (contaminación cruzada, filtros, ecológico).
6. **Carta**: "¿Qué te apetece hoy?" con **filtros funcionales** (Todo / Sin gluten / Vegano / 0 azúcar) y tarjetas de producto que entran con zoom. **Lee los productos del Google Sheet** (misma API que la app, acción `productos`); si falla, usa una lista de respaldo en el JS. Fotos reales en lugar de los círculos con inicial.
7. ~~Dos formas de darte un capricho~~ → **NO va aquí. Se mueve a `como-funciona.html`.**
8. **Dónde estamos**: "Nos vemos en Madrid", mapa dibujado con pin que late, y [DIRECCIÓN] / [HORARIO] como placeholders bien visibles para que Alba los rellene.
9. **Footer**: "paNeo" gigante + "Un proyecto de Lucía Baró, Hernán de Lorenzo y Alba Navarro".

Mejoras sobre el mock, ya con GSAP: entradas con `ScrollTrigger` en vez de `animation-timeline` (que en Safari antiguo no va), un poco de parallax en el pan del hero y micro-interacciones al hacer hover en tarjetas y botones. Que vaya fluido en el móvil.

### `como-funciona.html`
Mismo estilo, nav y footer. Contenido (tomado de la sección "Dos formas de darte un capricho" del mock):
- Título "Dos formas de darte un capricho".
- Tarjeta crema **En la tienda**: porciones individuales para tomar o llevar y el **mostrador de novedades** para probar cosas nuevas.
- Tarjeta chocolate **En la app**: encargos grandes con antelación, cupones, **tarjeta de sellos**, recomendaciones y perfil, con el móvil animado (aquí puede ir una captura real de la app) y el botón "Abrir la app".
- 3 pasos para instalarla: **1. Abre paNeo en Safari · 2. Pulsa Compartir · 3. "Añadir a pantalla de inicio"**.
- Bloque del **bono de sellos** explicado (ver §4): con cada visita en la que compras, un sello; en las casillas 4 y 8, un **-50 %**; al completar las 10, un **artículo especial** con **30 días** para canjearlo.

## 3. APP (PWA): `app/`

**Recrea EXACTAMENTE el prototipo de Canva** (`referencias/canva/`, y `canva-hd/` si existe): mismas formas redondeadas, colores, tipografías, iconos y distribución. Diseño de móvil (414×896 en Canva). En el ordenador, centra el "móvil" en la pantalla.

### Estructura común
- **Cabecera** chocolate con las esquinas de abajo redondeadas y un **buscador** crema ("BUSCA TU PRODUCTO…") con botón de lupa.
- **Barra inferior** flotante crema en forma de píldora con 4 iconos en círculos tostados: **tienda** (inicio), **%** (cupones → pantalla de sellos), **persona** (perfil) y **cesta** (pedido). El icono activo va relleno de marrón.
- Los iconos los dibujas tú en SVG inline con estilo de trazo, parecidos a los del Canva.

### Pantallas del Canva
1. **Inicio** (`#inicio`, pantallas 1 y 2): bloque crema con "¿Qué te apetece hoy?", "TE OFRECEMOS MUCHAS VARIEDADES" y la foto de las cookies. Debajo, **FILTROS** con 3 tarjetas cuadradas crema (0 AZÚCAR, VEGANO, SIN GLUTEN) con icono, **ESPECIAL DE HOY** (tarjeta grande: foto + nombre + precio), **OFERTAS** y **NOVEDADES** (carruseles horizontales con los puntitos de paginación) y **RECOMENDACIONES** con el botón "Encuesta de preferencias ▶". Todos los datos vienen del Sheet `Productos`.
2. **Búsqueda / filtros** (`#buscar`, pantalla 4): al buscar ("MUFFINS") o pulsar un filtro salen las tarjetas marrones con foto y nombre en dorado, alternando la foto a izquierda y derecha. Abajo, los 3 filtros en tostado; el activo con el borde punteado.
3. **Encuesta de preferencias** (`#encuesta`, pantalla 3, vacía en el Canva): **rellénala tú** con el mismo estilo. Lleva checkboxes de alergias e intolerancias (gluten, lactosa, huevo, frutos secos, soja…), dieta (vegana, vegetariana, sin azúcar) y gustos (chocolate, frutas, cremas…), y un botón "Guardar". Se guarda en el Sheet `Encuesta` y se usa para las **recomendaciones** del inicio (productos que cumplen sus filtros).
4. **Ficha del cliente** (`#perfil`, pantalla 5): cabecera con la foto (icono de cámara), el **ID** (AA000000), "nombre y apellidos" y la rueda de ajustes (cerrar sesión). Debajo, "FICHA DEL CLIENTE", pestañas **i / ♥ / cesta** y la tarjeta "tiempo restante cupones" con el contador de **días** (= días que quedan para canjear el regalo, ver §4; si no aplica, 0).
5. **Favoritos** (`#favoritos`, pantalla 6, pestaña ♥): tarjetas marrones con foto (cookies, croissant, cheesecake…) a partir de la columna `favoritos` del cliente. Un corazón en cada producto de la app permite añadir y quitar favoritos.
6. **Seguimiento de pedido** (`#pedido`, pantalla 7, pestaña cesta o icono cesta): misma cabecera de ficha con "número de pedido: CD00000", "tu pedido se encuentra en: **cocina**" y "días de envío: **0 días**". Si tiene varios pedidos, el último o una lista. Los datos vienen del Sheet `Pedidos`.

### Pantalla NUEVA: Tarjeta de sellos (`#sellos`, icono %)
No existe en el Canva: **diséñala con el mismo lenguaje visual que el resto de la app** (marrón, crema y dorado, NO el azul del bono de papel). Basada en `assets/bono-cara-sellos.png` y `bono-cara-cliente.png`:
- Título "Bono canjeable" y nombre e ID del cliente.
- **10 casillas** en 2 filas de 5. Las casillas llenas llevan un sello (un pan con la N, por ejemplo) con una animación de "estampado" la primera vez que se ve un sello nuevo (guarda en localStorage el último número visto).
- Etiquetas en las casillas **4 y 8: "-50 %"** y en la **10: "Artículo especial"**. Cuando se alcanza una, se muestra el cupón activo.
- Al completar las 10: "¡Bono completo! Tienes **X días** para canjear tu artículo especial" (30 días desde `fecha_completado`). Es el mismo dato que el contador del perfil.
- Debajo, en pequeño: "El sello se pone por cada visita en la que compras, no por producto."
- **Los sellos NO se ponen desde la app**: los pone el personal editando el Google Sheet. La app solo lee.

### Login
- Pantalla de entrada con el logo: **ID de cliente (AA000000) + PIN de 4 cifras**. Los clientes los da de alta el equipo directamente en el Sheet (no hay registro desde la app).
- Guardar la sesión en `localStorage`. Es un proyecto de clase: el PIN en claro en el Sheet es aceptable, pero que el backend **nunca devuelva el PIN** ni datos de otros clientes.

### PWA
- `manifest.webmanifest` con name "paNeo", `display: standalone`, `theme_color #3E1A0E`, `background_color #8A4420` e iconos 192/512 generados a partir del logo (pan con la N recortado sobre crema).
- `<link rel="apple-touch-icon">`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` y `viewport-fit=cover` con safe-area para el notch.
- `sw.js`: cache del shell (HTML/CSS/JS/fuentes/imágenes) y **red primero para la API**.

## 4. Google Sheets + Apps Script (backend gratis)

Una sola Google Sheet llamada **"paNeo BD"** con estas pestañas. La fila 1 son las cabeceras exactas:

**Clientes**
| id | pin | nombre | apellidos | sellos | fecha_completado | canjeado | favoritos |
|---|---|---|---|---|---|---|---|
| AA000001 | 1234 | Lucía | Baró | 3 | | FALSE | P01,P05 |

- `sellos`: 0–10, lo edita el personal a mano.
- `fecha_completado`: la pone el script automáticamente cuando `sellos` llega a 10 (o a mano).
- `canjeado`: TRUE cuando se ha entregado el regalo. Para reiniciar la tarjeta se pone `sellos = 0`, se vacía la fecha y `canjeado = FALSE`.

**Productos**
| id | nombre | categoria | precio | sin_gluten | vegano | cero_azucar | sin_lactosa | imagen | especial_hoy | oferta | novedad | descripcion |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

`imagen` = ruta relativa (`assets/productos/tarta-zanahoria.jpg`) o URL. Precarga los productos del Canva: Tarta de zanahoria vegana (34,99 €, vegano, especial de hoy), Muffins de arándanos, Muffins con chocolate, Cupcakes decorativos, Cookies, Croissant y Cheesecake. Los precios que no se conocen van como `0` y se marcan en el LEEME para que Alba los cambie. Lo mismo con las etiquetas sin gluten/vegano/etc.: solo es seguro que la tarta es vegana.

**Pedidos**
| numero | id_cliente | estado | dias_envio | fecha |
|---|---|---|---|---|
| CD00001 | AA000001 | cocina | 2 | 14/10/2026 |

`estado`: cocina / horno / listo para recoger / entregado.

**Encuesta**
| fecha | id_cliente | alergias | dieta | gustos |
|---|---|---|---|---|

### `apps-script/Code.gs`
- `doGet(e)` con `action`:
  - `productos` → todos los productos (público).
  - `login&id=&pin=` → datos del cliente sin el pin + `dias_restantes` (30 − días desde `fecha_completado`, mínimo 0).
  - `cliente&id=&pin=` → lo mismo (para refrescar).
  - `pedidos&id=&pin=` → los pedidos de ese cliente.
- `doPost(e)` con body JSON en **`Content-Type: text/plain`** (para evitar el preflight de CORS): `encuesta` (añade una fila) y `favorito` (añade o quita un id en `favoritos`). Ambos validan id+pin.
- Un **trigger `onEdit`** que, cuando `sellos` llega a 10 y `fecha_completado` está vacía, escribe la fecha de hoy.
- Respuestas con `ContentService.createTextOutput(JSON.stringify(...)).setMimeType(ContentService.MimeType.JSON)`.
- Incluye una función `setup()` que crea las 4 pestañas con sus cabeceras y unos datos de ejemplo (2–3 clientes, los 7 productos y 1 pedido), para que Pau solo tenga que ejecutarla una vez.

## 5. Publicación (0 €)

- Opción por defecto: **GitHub Pages**. Crea el repo público `paneo`, haz push y activa Pages (rama `main`, raíz) con `gh`. Si `gh` no está autenticado, deja todo listo y explica en el LEEME cómo hacerlo, o como alternativa **Netlify Drop** (arrastrar la carpeta a app.netlify.com/drop).
- URLs finales: web en `/paneo/`, app en `/paneo/app/`.

## 6. `LEEME.md` para Pau (corto y paso a paso)
1. Crear la Google Sheet "paNeo BD" → Extensiones → Apps Script → pegar `Code.gs` → ejecutar `setup()` y aceptar los permisos.
2. Implementar → Nueva implementación → Aplicación web → Ejecutar como: **yo**, Acceso: **cualquier usuario** → copiar la URL.
3. Pegar la URL en `app/config.js` (y en la web, si la carta la lee de ahí) → subir los cambios.
4. Cómo dar de alta a un cliente, poner un sello, crear un pedido y cambiar su estado.
5. Cómo instalar la app en el iPhone (Safari → Compartir → Añadir a pantalla de inicio).
6. Lista de **placeholders pendientes** para Alba: precios, dirección, horario y etiquetas de alérgenos de cada producto.

## 7. Fotos de producto
- Si existe `referencias/canva-hd/`, **recorta de ahí** las fotos (cookies, tarta de zanahoria, muffins, cupcakes, croissant, cheesecake) a `assets/productos/` en .jpg/.webp optimizado.
- Si no, usa las capturas de `referencias/canva/` solo como referencia de encuadre y pon **fotos libres de Unsplash** del mismo producto (descargadas al repo, nunca enlazadas en caliente), y apúntalo en el LEEME.

## 8. Orden de trabajo (por la hora)
1. Estructura del repo + `Code.gs` + `config.js` con **datos de respaldo locales** si `API_URL` no está puesta, para que la app se vea entera aunque no haya backend todavía.
2. App: login → inicio → búsqueda → sellos → perfil/favoritos → pedido → encuesta.
3. Landing + `como-funciona.html`.
4. PWA (manifest, iconos, SW).
5. Publicar y escribir el LEEME.
6. Comprobar con Playwright a 390×844 y 1440×900 que todo se ve, que no hay errores en consola, que los filtros funcionan y que el login de ejemplo entra. Al final, resumen con las URLs y lo que falta.
