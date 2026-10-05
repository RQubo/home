# RQubo — sitio institucional

Landing page de un estudio de tres desarrolladores. Hecha con **HTML5, CSS3, JavaScript y Bootstrap 5.3.8**, sin backend. Las cards de proyectos usan React; los archivos compilados están incluidos para abrir y publicar el sitio directamente.

## Abrir y publicar

Abrí `index.html` directamente en el navegador. Bootstrap, la tipografía, los iconos y las imágenes se sirven desde archivos del proyecto; no hace falta un servidor ni conexión para visualizar la página. Los enlaces externos y el envío de correo sí requieren los servicios correspondientes.

Para publicar en GitHub Pages:

1. Subí el contenido de esta carpeta al repositorio.
2. En **Settings → Pages**, elegí **Deploy from a branch**.
3. Seleccioná la rama principal y **/ (root)** como carpeta.
4. Guardá y esperá la publicación de GitHub. La URL aparecerá en esa misma sección.

Todas las referencias a archivos locales son relativas, por lo que el sitio también funciona en `https://usuario.github.io/nombre-del-repositorio/`. `.nojekyll` permite servir los archivos estáticos directamente.

## Estructura

```text
/
├── index.html
├── css/
│   ├── styles.css
│   ├── bootstrap.min.css
│   └── BOOTSTRAP-LICENSE.txt
├── js/
│   ├── main.js
│   └── bootstrap.bundle.min.js
├── assets/
│   ├── fonts/
│   ├── images/
│   └── logo/
├── RQubo_logo.png          # Original recibido, conservado
├── .nojekyll
└── README.md
```

## Contacto

El correo configurado es **rqubosoftware@gmail.com**.

Los canales opcionales se configuran al principio de `js/main.js`:

```js
const RQUBO_CONTACT = Object.freeze({
  email: "rqubosoftware@gmail.com",
  whatsapp: "", // REEMPLAZAR: número internacional, solo dígitos.
  linkedin: ""  // REEMPLAZAR: URL HTTPS de la página o perfil de RQubo.
});
```

Cuando los valores están vacíos, el sitio los identifica como **Por configurar**, sin enlaces falsos. Al agregar un número de WhatsApp válido (8–15 dígitos) o una URL HTTPS de LinkedIn, se activan los enlaces automáticamente. No se usa el teléfono ni el LinkedIn de ninguna organización como contacto de RQubo.

El formulario **prepara un correo** y abre la aplicación de email del visitante mediante `mailto:`. No envía mensajes automáticamente, no almacena información y no consulta ningún backend. Los campos se conservan después de preparar la consulta. Si el visitante no tiene una aplicación de correo configurada, puede usar la dirección visible o el botón para copiarla.

Si cambiás el email, actualizá también sus enlaces y texto de respaldo en `index.html`, para que el contacto siga funcionando sin JavaScript.

## Contenido y fuentes

Investigación realizada el **4 de octubre de 2026**. Se consultaron los perfiles, README y manifiestos de los repositorios públicos mediante GitHub y su API pública. No se consulta GitHub durante la navegación del sitio.

| Fuente | Información utilizada |
| --- | --- |
| [Tomás Rando](https://github.com/TomasRandoM) | Nombre y proyectos públicos de backend y mobile. |
| [Victor Ramírez](https://github.com/VictorRamirez26) | Nombre y proyectos públicos de sistemas web, Java y Flutter. |
| [Joaquín Ruiz](https://github.com/JoacoR7) | Nombre y proyectos públicos de interfaces React, JavaScript, Java y Python. |
| [restaurantServer](https://github.com/TomasRandoM/restaurantServer) | API del ecosistema de restaurantes; Spring Boot, Java, MySQL, JWT, Spring Security, Docker y JPA/Hibernate. |
| [restaurantEmployeeApp](https://github.com/TomasRandoM/restaurantEmployeeApp) | Aplicación de empleados: generación de QR, recibos e inasistencias; React Native, Expo, TypeScript y SQLite; funciones offline. |
| [qrRestaurantScanner](https://github.com/TomasRandoM/qrRestaurantScanner) | Validación QR en Android, comunicación HTTP y modo offline; Kotlin, Jetpack Compose y SQLite. |
| [staffManagement](https://github.com/JoacoR7/staffManagement) | Dashboard de administración con React y JavaScript, adaptado de una plantilla según su README. |
| [sistema-gestion-barrio](https://github.com/VictorRamirez26/sistema-gestion-barrio) | Proyecto académico colaborativo con Victor Ramírez, Joaquín Ruiz y Adrián Zangla. Registro de inmuebles, residentes y visitas; Java, Spring Boot, MySQL, Thymeleaf, Bootstrap y JPA/Hibernate. |
| [TP-U3-Flutter](https://github.com/VictorRamirez26/TP-U3-Flutter) | Ejercicios públicos de Flutter/Dart, con un proyecto de películas en `EjercicioC/Victor/app_movies`. No se presentan como experiencia comercial. |
| [CITSAS](https://citsas.co/) | Colombia International Trading SAS: empresa de logística y envíos internacionales. |
| [APUAYE](https://www.apuaye.org.ar/web/) | Asociación de Profesionales Universitarios del Agua y la Energía Eléctrica. |
| [OSPUAYE](https://www.ospuaye.org.ar/) | Obra social de los profesionales universitarios del agua y la energía eléctrica. |

La relación del equipo con **CITSAS, APUAYE y OSPUAYE fue proporcionada por la empresa**. Las fuentes públicas verifican el contexto de cada organización, pero no el alcance específico del trabajo del equipo. Por eso las tarjetas dicen «experiencia vinculada»: no atribuyen desarrollo de sus sitios, funcionalidades, stacks, resultados ni fechas que no se hayan confirmado. Sus cubiertas son composiciones tipográficas de RQubo, no logotipos oficiales ni capturas de productos.

La experiencia del equipo incluye proyectos individuales y colaborativos; no se afirma que todos sean trabajos comerciales de RQubo. Tampoco se agregaron cifras de clientes, años de experiencia, testimonios, títulos profesionales ni tecnologías inferidas únicamente de un fork sin evidencia adicional.

## Identidad visual

El logo original define la paleta: azul eléctrico `#075BFF`, azul noche `#071342` y blanco, con superficies azul claro `#F3F6FC`. La tipografía Manrope, los bordes suaves, la grilla y el proceso conectado extienden la geometría del cubo. Los recortes del isotipo y del nombre preservan la marca original; el favicon utiliza el mismo isotipo reducido.

La navegación, la grilla y el formulario usan Bootstrap, con estilos propios en `css/styles.css`. Los iconos son SVG locales. Las animaciones usan `IntersectionObserver`, se ejecutan una sola vez y respetan `prefers-reduced-motion`. Sin JavaScript el contenido permanece visible.

## SEO y edición

`index.html` incluye título, descripción, Open Graph básico, idioma, favicon y estructura semántica. No se inventó una URL canónica ni se agregó una imagen social que dependa de un dominio aún desconocido. Cuando tengas la URL definitiva, podés agregar `og:url` y un enlace `canonical` con esa dirección.

Los servicios, proyectos y perfiles se editan directamente en `index.html`. Los colores, radios, tipografía y espaciados principales están centralizados en las variables de `css/styles.css`.

### Galería de proyectos

La sección «Proyectos en acción» muestra una card por proyecto, con imágenes, título y descripción. Las cards se elevan suavemente al pasar el puntero. El carrusel exterior muestra dos proyectos en escritorio y uno en móvil; sus flechas avanzan de a un proyecto y vuelven al inicio o al final al llegar a un extremo. Las flechas exteriores aparecen cuando hay más proyectos que espacios visibles. Los proyectos con varias imágenes tienen sus propias flechas y puntos; las imágenes avanzan automáticamente cada cinco segundos y se pausan mientras el puntero o el foco están sobre la card, cuando la card no está visible, cuando se amplía una imagen, cuando la pestaña no está visible o si se prefiere movimiento reducido.

Para sumar un proyecto:

1. Guardá sus capturas en `assets/images/projects/`.
2. En `index.html`, duplicá un `article[data-project]` dentro de `#projects-gallery`.
3. Actualizá el título, la descripción y los enlaces con sus imágenes y textos alternativos. Cada enlace dentro de `.project-showcase-media` añade una imagen al carrusel. No hace falta recompilar para cambiar proyectos o imágenes.

Los controles de ambos carruseles funcionan con mouse, toque y teclado. Un clic o toque sobre la imagen abre la captura completa en un popup dentro de la página. Se cierra con el botón de cierre, Escape o un clic fuera del popup; el foco vuelve a la imagen. Sin JavaScript, las cards se pueden recorrer desplazando horizontalmente la fila y muestran sus textos y todas las capturas como enlaces.

El código fuente está en `src/projects/`. Para cambiar el componente o su configuración, ejecutá `npm ci` y `npm run build:gallery`. El resultado se guarda en `js/projects-gallery.js` y `css/projects-gallery.css`. No hace falta Node.js para abrir o publicar el sitio; solo para recompilar estos archivos.

## Dependencias y licencias

- [Bootstrap 5.3.8](https://getbootstrap.com/docs/5.3/getting-started/download/): distribución oficial lista para usar, licencia MIT incluida en `css/BOOTSTRAP-LICENSE.txt`.
- [Manrope](https://github.com/sharanda/manrope): fuente variable servida localmente, SIL Open Font License 1.1 incluida en `assets/fonts/OFL.txt`.
- React y React DOM se incluyen en el bundle local de las cards; sus avisos se conservan en `js/projects-gallery.js.LEGAL.txt` y las licencias MIT de React, React DOM y Scheduler en `src/projects/licenses/`. esbuild se utiliza para compilar y no se carga en el navegador.
- Avatares: `js/main.js` consulta los perfiles públicos de GitHub y muestra sus fotos actuales en la portada y las tarjetas. Las copias WebP locales se usan sin JavaScript o si GitHub falla; podés reemplazarlas conservando los nombres de archivo.

No se agregaron analytics, cookies, formularios externos ni almacenamiento de datos personales.

## Verificación realizada

- Apertura directa de `index.html` mediante `file://` en Chrome, con Bootstrap y tipografía locales cargados.
- Diseño comprobado a 320, 390, 768, 820, 1024, 1280 y 1440 píxeles de ancho, sin desbordes horizontales ni imágenes rotas.
- Menú móvil: apertura, cierre al elegir una sección y atributos de accesibilidad.
- Acceso por teclado al enlace para saltar al contenido.
- Formulario: validación, preparación de la consulta y conservación de los campos; no se envió ningún correo.
- Animaciones de entrada y preferencia de movimiento reducido.
- Contenido visible sin JavaScript, navegación móvil disponible y contacto directo por email.
- Ampliación de texto al 200% en escritorio y móvil, sin desborde de página.
- Sin errores de JavaScript, IDs duplicados ni anclas rotas. Las fotos del equipo ahora pueden consultar GitHub durante la carga.

Las herramientas y capturas de revisión se guardaron en `.qa/`, que está excluida por `.gitignore` y no forma parte de la web publicada.
