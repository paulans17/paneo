# paNeo · Qué hacer ahora (para Pau)

Web + app (PWA) hechas con HTML/CSS/JS sin build. **Todo funciona ya en modo demo** (sin Google Sheet), así que se puede enseñar aunque no hayas hecho los pasos 1–3.

- **Web:** `index.html` + `como-funciona.html`
- **App:** `app/` (login de prueba en modo demo: **AA000001 / 1234**; también AA000002 / 2345 con 8 sellos y AA000003 / 3456 con el bono completo)
- **Backend:** `apps-script/Code.gs`

---

## 0. Publicar (GitHub Pages, 0 €)

No pude publicar desde aquí porque `gh` no tiene sesión iniciada. Son dos comandos en la Terminal, dentro de esta carpeta:

```bash
gh auth login
./publicar.sh
```

Crea el repo público `paneo`, sube todo y activa Pages. En 1–2 minutos estará en:

- Web: `https://TU_USUARIO.github.io/paneo/`
- App: `https://TU_USUARIO.github.io/paneo/app/`

**Plan B, sin GitHub:** entra en <https://app.netlify.com/drop> y arrastra la carpeta `paNeo` entera (sin la carpeta `referencias`). Si no creas cuenta, Netlify borra la web a la hora, así que crea una gratis.

## 1. Crear la base de datos (Google Sheet)

1. Crea una Google Sheet llamada **paNeo BD**.
2. **Extensiones → Apps Script**. Borra lo que haya y pega entero `apps-script/Code.gs`. Guarda.
3. Elige la función **`setup`** arriba y pulsa **Ejecutar**. Acepta los permisos (Avanzado → Ir a paNeo (no seguro) → Permitir: es tu propio script).
4. Vuelve a la hoja: verás las pestañas **Clientes, Productos, Pedidos y Encuesta** con datos de ejemplo.

## 2. Publicar la API

1. En Apps Script: **Implementar → Nueva implementación → ⚙ → Aplicación web**.
2. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**.
3. **Implementar** y copia la URL (acaba en `/exec`).

> Si cambias `Code.gs` más adelante: Implementar → **Gestionar implementaciones** → lápiz → Versión: **Nueva versión**. Así la URL no cambia.

## 3. Conectar la app y la web

1. Abre `app/config.js` y pega la URL:
   `const API_URL = "https://script.google.com/macros/s/…/exec";`
2. Es el único sitio: la carta de la web también lee de ese archivo.
3. Sube el cambio:

```bash
git commit -am "Conectar con Google Sheets" && git push
```

En cuanto hay URL, los clientes de prueba de `config.js` dejan de valer y manda la Sheet.

## 4. Uso diario de la Sheet (para el equipo)

| Quiero… | Qué hago |
|---|---|
| **Dar de alta a un cliente** | Fila nueva en **Clientes**: `id` (2 letras + 6 números, p. ej. AA000004), `pin` (4 cifras), `nombre`, `apellidos`, `sellos` = 0, `canjeado` = FALSE. Dale su ID y PIN en la tienda. |
| **Poner un sello** | Suma 1 en la columna `sellos` (un sello por visita con compra, no por producto). Al llegar a **10**, el script escribe solo la `fecha_completado` y empieza la cuenta atrás de **30 días**. |
| **Entregar el regalo** | `canjeado` = TRUE. |
| **Empezar una tarjeta nueva** | `sellos` = 0, borra `fecha_completado` y `canjeado` = FALSE. |
| **Crear un pedido** | Fila nueva en **Pedidos**: `numero` (CD00002…), `id_cliente`, `estado`, `dias_envio`, `fecha` (dd/mm/aaaa). |
| **Cambiar el estado del pedido** | En la columna `estado` elige del desplegable: cocina → horno → listo para recoger → entregado. |
| **Cambiar productos** | Pestaña **Productos**. Las etiquetas (`sin_gluten`, `vegano`…) y `especial_hoy`, `oferta` y `novedad` son TRUE/FALSE. `imagen` = `assets/productos/archivo.jpg` o una URL de imagen. |
| **Ver las encuestas** | Pestaña **Encuesta** (la app la rellena sola). |

La app solo **lee** sellos y pedidos; nunca los modifica. El backend no devuelve nunca el PIN ni los datos de otros clientes.

## 5. Instalar la app en el iPhone

1. Abre la URL de la app en **Safari**.
2. Pulsa **Compartir** (el cuadrado con la flecha).
3. **«Añadir a pantalla de inicio»**. Aparece el icono del pan con la N y se abre a pantalla completa.

## 6. Pendiente para Alba (placeholders)

- [ ] **Precios**: solo es seguro el de la tarta de zanahoria (34,99 €). El resto están a `0` en la Sheet y salen como «Consultar precio».
- [ ] **Dirección** y **horario**: en `index.html` busca `[DIRECCIÓN]` y `[HORARIO]` (se ven resaltados en naranja en la web).
- [ ] **Etiquetas de alérgenos de cada producto**: solo es seguro que la tarta es vegana. Las demás son **provisionales** (copiadas del mock aprobado para que los filtros enseñen algo): muffins de arándanos (sin gluten), muffins con chocolate (vegano), cupcakes (0 azúcar), cookies (sin gluten + vegano), croissant (sin gluten), cheesecake (sin gluten + 0 azúcar). Revisa también `sin_lactosa`.
- [ ] Qué productos van en **Ofertas**, **Novedades** y **Especial de hoy** (ahora: ofertas = tarta, muffins de arándanos y cookies; novedades = muffins con chocolate, cupcakes, croissant y cheesecake).
- [ ] Fotos: si queréis las del Canva, sustituid los archivos de `assets/productos/` manteniendo el nombre.

---

## Decisiones que tomé (porque no estaban claras)

1. **Fotos de producto**: no había `canva-hd/` y las capturas del Canva son de muy baja resolución, así que descargué **fotos libres de Unsplash** al repo (nada enlazado en caliente). Autores: tarta de zanahoria (Logan Clark), muffins de arándanos (Tayla Brand), muffins con chocolate (Anton), cupcakes (Brooke Lark), cookies (Jennifer Pallian), croissant (Conor Brown), cheesecake (Orkun Orcan). Licencia Unsplash: uso libre, sin atribución obligatoria.
2. **Precio 0** → se muestra «Consultar precio» en lugar de «0 €».
3. **PIN fuera de la URL**: el backend acepta `login`/`cliente`/`pedidos` por GET como pide el encargo, pero la app los pide por **POST** (`text/plain`, sin preflight) para que el PIN no quede en historiales ni logs.
4. **Modo demo**: si `API_URL` no está puesta, la app usa los datos de `config.js` y guarda favoritos y encuesta en el propio móvil. La pista «Modo demo · AA000001 / 1234» solo aparece en el login mientras no haya API.
5. **Recomendaciones**: alergia a gluten → solo sin gluten; lactosa → sin lactosa o vegano; huevo → vegano; dieta vegana → vegano; sin azúcar → 0 azúcar. Frutos secos, soja, cacahuete y sésamo **no filtran** porque la Sheet no tiene esas columnas (si las queréis, se añaden). Los gustos ordenan los resultados.
6. **Pestaña %** de la barra inferior → tarjeta de sellos, con los cupones -50 % que se van desbloqueando (casillas 4 y 8).
7. **Pantalla 7 (pedido)** no venía en las capturas: la hice con la misma cabecera de ficha que el perfil y un seguimiento en 4 pasos. Con varios pedidos se puede elegir de una lista.
8. **Foto de perfil** (icono de cámara): se guarda solo en el móvil, no se sube a ningún sitio.
9. **Rueda de ajustes**: «Actualizar datos» y «Cerrar sesión».
10. **Mapa**: el de la web es el dibujado del mock (el de `mapa-ubicacion.png` es una captura de Google Maps y no lo publiqué por derechos). Lo dejé en `referencias/`.
11. **`referencias/`** (con el Word completo) **no se publica** (`.gitignore`). El repo es público.
12. La captura del móvil de `como-funciona.html` es una captura real de la app (`assets/captura-app.jpg`).

## Comprobado

Playwright con Chrome a **390×844** y **1440×900**: web, «Cómo funciona» y las 8 vistas de la app se ven bien; **0 errores en consola**; los filtros funcionan (carta web: Vegano → 3 productos, Sin gluten → 4; app: Sin gluten + Vegano → Cookies); el login de ejemplo entra y un PIN incorrecto da error; la encuesta guarda y genera recomendaciones. **Sin probar**: el backend real de Apps Script (necesita tu cuenta de Google) y la instalación en un iPhone de verdad.
