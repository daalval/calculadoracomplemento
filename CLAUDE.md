# calculadoracomplemento.es — Contexto del proyecto

## Qué es esto
Sitio de utilidad pública en español: calcula el complemento de pensión por
brecha de género (España). Forma parte de un portfolio de herramientas SEO
de coste cero monetizadas con AdSense. Público objetivo: pensionistas 55+,
asume poca alfabetización digital.

## Restricciones técnicas — innegociables
- **Sin backend, sin build step.** HTML/CSS/JS puro. Se sirve desde GitHub
  Pages como ficheros estáticos.
- **Sin frameworks, sin npm, sin bundlers.** Cada página es un único fichero
  `index.html` autocontenido (CSS y JS inline en el mismo fichero).
- **Sin localStorage/sessionStorage salvo para el consentimiento de cookies**
  (ya implementado, no tocar su lógica salvo que se pida explícitamente).
- Todo cálculo ocurre en el navegador del usuario. Nunca añadir llamadas a
  APIs externas para la lógica de negocio.

## Estructura del repo
```
/index.html                          → calculadora principal (hub)
/1-hijo/index.html                   → variante programática
/2-hijos/index.html                  → variante programática
/3-hijos/index.html                  → variante programática
/4-hijos/index.html                  → variante programática
/soy-elegible/index.html             → verificador de elegibilidad (4 preguntas)
/como-solicitar-complemento-inss/    → artículo editorial
/complemento-para-hombres/           → artículo editorial
/inss-deniega-complemento/           → artículo editorial
/complemento-irpf-declaracion/       → artículo editorial
/funcionarios-clases-pasivas/        → artículo editorial
/privacidad/index.html               → política de privacidad y cookies
/favicon.svg
/robots.txt
/sitemap.xml                         → ACTUALIZAR cada vez que se añade/quita una URL
```
Cada carpeta nueva = una URL nueva (`/nombre-carpeta/`), con `index.html` dentro.

## Sistema de diseño — usar exactamente estos tokens
```css
--ink:#1a1814; --ink-2:#4a4740; --ink-3:#8a8780; --rule:#e8e6e0;
--bg:#faf9f6; --bg-2:#f2f0eb; --accent:#1a6b4a; --accent-light:#e8f2ec;
--warn:#b85c00; --warn-light:#fdf0e0;
--serif:'DM Serif Display',Georgia,serif; --sans:'DM Sans',system-ui,sans-serif;
```
Google Fonts import: `DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500`.
Estilo minimalista, editorial, sin sombras duras ni gradientes llamativos.
No reinventar el sistema de diseño por página — copiar el `<style>` de una
página existente y ajustar solo lo necesario.

## IDs de servicios (no regenerar, son reales)
- Google Analytics: `G-854J0T42H0`
- Google AdSense: `ca-pub-5030748322562598`
- Dominio: `calculadoracomplemento.es`

## Snippets obligatorios en cada página nueva
1. **Head:** favicon (`<link rel="icon" type="image/svg+xml" href="/favicon.svg">`),
   AdSense script, meta description específica (no genérica), canonical,
   Open Graph, `og:url` con la ruta real.
2. **Footer:** enlace a `/privacidad/`, disclaimer de que el contenido es
   orientativo y no asesoramiento jurídico/fiscal.
3. **Banner de cookies:** copiar el bloque completo (CSS + HTML + script) tal
   cual aparece en `index.html` al final del `<body>`, sustituyendo nada
   salvo que se indique lo contrario. Usa `localStorage` con la key
   `cc_consent` y solo carga GA si el usuario acepta.
4. **Botones:** siempre `type="button"` explícito. Sin esto, algunos
   navegadores los tratan como submit y rompen la interacción.

## Formato numérico — regla estricta
Nunca usar `toLocaleString('es-ES')` para formatear miles — es inconsistente
entre navegadores. Usar siempre esta función (o su equivalente ya presente
en el fichero):
```js
function fmt(n, dec = 2) {
  var p = n.toFixed(dec).split('.');
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return p.join(',') + ' €';
}
```
Separador de miles = punto, decimal = coma. Siempre.

## Datos legales — verificar antes de asumir, nunca hardcodear de memoria
Las cifras del complemento de brecha de género se revalorizan cada año
(BOE, enero-febrero). Antes de escribir cualquier cifra legal o fiscal:
1. Buscar la cifra actual, no asumir que sigue vigente la del último commit.
2. Citar la fuente (BOE, Real Decreto, STS/STJUE) en el propio texto.
3. Si cambia una cifra, actualizar TODAS las páginas que la mencionen —
   buscar con grep antes de dar por terminada la tarea.

Cifras de referencia (verificadas a julio 2026, pueden quedar desactualizadas
— comprobar si ha pasado más de unos meses):
- Cuantía 2026: 36,90€/hijo/mes, máx. 4 hijos, 14 pagas.
- Histórico: 2021=27,58 · 2022=29,40 · 2023=31,00 · 2024=33,20 · 2025=35,90 · 2026=36,90
- Régimen antiguo (pensiones 2016–feb.2021): 5%/10%/15% según 2/3/4+ hijos, mín. 2 hijos.
- Retroactividad: completa si pensión anterior al 15/05/2025; 3 meses si es posterior.
- STS 3173/2025: 25 de junio de 2025. STJUE: 15 de mayo de 2025 (C-623/23, C-626/23).
- Solo UN progenitor puede cobrarlo por el mismo hijo (se lo queda quien
  tenga la pensión, o suma de pensiones, más baja).

## SEO — checklist por página nueva
- [ ] `<title>` único, con keyword + año, bajo 60 caracteres
- [ ] `meta description` única, 140-160 caracteres
- [ ] `canonical` con la URL completa y `/` final
- [ ] Mínimo 300 palabras de contenido único (no reutilizar párrafos enteros
      de otras páginas)
- [ ] Enlaces internos hacia/desde el hub (`/`) y páginas relacionadas
- [ ] Añadir la URL a `/sitemap.xml` con `lastmod` de hoy
- [ ] Tras publicar: recordar al usuario solicitar indexación manual en
      Search Console si es urgente (puede tardar semanas si no)

## Antes de dar una tarea por terminada
1. Verificar sintaxis JS (`node --check`) de cada `<script>` inline.
2. Verificar que las etiquetas `<div>` abiertas y cerradas cuadran.
3. Verificar que no hay IDs duplicados en la página.
4. Si se tocan cifras legales, verificar con búsqueda web que siguen vigentes.
5. Actualizar `sitemap.xml` si se añadió o eliminó una URL.

## Qué NO hacer nunca
- No usar frameworks ni introducir un paso de build.
- No mover el banner de cookies fuera del `<body>` ni cambiar su lógica sin
  que se pida explícitamente.
- No inventar cifras legales ni fechas de sentencias — buscar y citar.
- No romper el diseño minimalista con estilos ad-hoc que no usen las
  variables CSS ya definidas.
- No olvidar `type="button"` en botones que no deben enviar formularios.