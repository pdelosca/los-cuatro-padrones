# Los cuatro padrones — memoria del proyecto

Página genealógica de la familia de Pablo de los Campos (`index.html`, publicada en https://pdelosca.github.io/los-cuatro-padrones/). Los videos viven en `video/`. Hablar en español rioplatense. Para pronombres de personas, usar la forma neutra salvo que se indique otra cosa.

## Qué se pidió y cómo pensar el video

- **Público**: Mario de los Campos (padre de Pablo, hijo de Eloy y Reina) y los parientes de los Campos. Miran en el celular. Gente mayor: la lectura tiene que ser cómoda.
- **Idea central del video actual («La cadena»)**: Eloy, el padre de Mario, fue chofer; su apellido ya figuraba en una escritura de campo de 1810. El video cuenta la cadena de padres a hijos que une las dos cosas: Miguel → Felipe Pascual → Sandalio → Delmiro → Eloy → Mario → Pablo → Facundo y Camila. Relación de cada uno con Mario: Miguel trastatarabuelo, Felipe Pascual tatarabuelo, Sandalio bisabuelo, Delmiro abuelo, Eloy padre.
- **Estilos de animación**: los del catálogo `yasinozmeen/animasyon-stil-katalogu` (20 estilos). Se pidieron el 8 (*tek çizgi*, una sola línea), el 9 (*kâğıt kesik*, papel cortado) y el 10 (*karakalem*, lápiz). El video puede ser largo (hoy ~4 min); lo que no puede es ir rápido.
- **Reglas que Pablo pidió** (no negociar sin avisar): las cartas son de **baraja española**; los textos de arriba y de abajo deben poder leerse; los cambios de color deben ayudar a la narrativa; la música tiene que ser linda; antes de renderizar se hace un plan de pulido y se audita; buscar referencias en internet.
- **Datos**: todo sale de la página. Lo que ella marca como tradición familiar (hotel de Durazno, sótano de Magallanes, Mosaicos Rivas, Club Olimpia) se dice como «según cuenta la familia» o no se afirma. Lo que la página llama «casi seguro» no se afirma.

## Cómo se construye (carpeta `video/`)

Escena en HTML+canvas, un cuadro por vez con Chromium (Playwright), unido con ffmpeg. Determinista: cada cuadro es función del tiempo.

1. `python3 ensamblar.py` une `_h1.js _tek.js _a.js _pc.js _b.js _lp.js _c.js` en `cadena2.html` (las escenas y sus textos están en `_c.js`).
2. `node auditoria.js` valida: regla de lectura (duración de leyenda = `0,9 s + palabras/2,8`, mínimo 3 s), márgenes de texto, saltos de luz entre escenas; escribe `linea-de-tiempo.json`.
3. `python3 musica2.py` (lee la línea de tiempo) → `musica-cadena2.wav`; `python3 auditoria_audio.py` valida pico, recortes, nivel por escena, silencios y empalmes.
4. `SCENE=cadena2.html NOMBRE=... DUR=<seg> FPS=30 OUT=<carpeta> FF=<ffmpeg> node frames.js render` (o `frames.js probe t1 t2 …` para cuadros sueltos). FPS=10 sirve de ensayo.
5. Mezcla: `ffmpeg -i mudo.mp4 -i musica.wav -c:v copy -c:a aac …`; versión liviana 720×1280 CRF 27 para poder enviarla (límite de envío: 30 MB).

Entorno: ffmpeg completo con `libx264` está en `/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/` (instalar `imageio-ffmpeg`); el ffmpeg de Playwright solo tiene VP8. Hacen falta `scipy` y `matplotlib` para la música y el espectrograma. Render ≈ 9–12 cuadros/s con `frames.js` (un proceso); `frames-paralelo.js` (WORKERS=4, JPEG + ffmpeg) llega a ~24 cuadros/s: el video de 4:39 salió en ~8 min. Para el ensayo de revisión usar FPS=10.

## Red de la sesión (lo que anda y lo que no)

- **Bloqueado**: scrolltide.co, designmd.ai, animejs.com, mapcn.dev, skillry.dev, substack, revid.ai, apimaster.ai, en.wikipedia.org, huggingface.co, speech.platform.bing.com (edge-tts), google. WebFetch falla en esos; `WebSearch` sí funciona.
- **Anda**: GitHub (clonado anónimo de repos públicos tras `add_repo`) y también las descargas de *release assets* (HEAD 200 por `release-assets.githubusercontent.com`); PyPI.
- No hay voz sintética disponible hoy (edge-tts y Hugging Face bloqueados). Ver `video/referencias-utiles.md` para la vía de Kokoro.

## Estado

Última versión: `video/la-cadena-v3.mp4` (4:39) y `la-cadena-v3-liviano.mp4` (720×1280, 15 MB). Guion en `guion-cadena-v2.md` (los textos exactos están en `_c.js`), plan en `plan-pulido.md`, críticas en `registro-criticas.md`. Pendientes: el décimo repo de la lista de Pablo (`opus-video-skills`, sin enlace); decidir si se suma narración (Kokoro) o muestras reales de instrumentos.

## Lecciones

- El bucle de crítica funciona: un revisor nuevo (Agent) sobre un ensayo a 10 cuadros por segundo, y otro que verifica. Encontraron cosas que yo no vi (cuadro 0 vacío, 3 y 5 confundidos en cifras antiguas, falta de puente narrativo).
- Las auditorías automáticas atraparon errores reales antes del render (leyendas inexistentes, orden cronológico, choques de armonía). Correrlas siempre.
- El audio solo se puede medir, no escuchar: decirlo.
- Un solo cambio de duración mueve la música: regenerar `linea-de-tiempo.json` y `musica2.py` antes del render final.
- No usar `pkill -f` con un patrón que aparezca en el propio comando (mata el shell).
- `git status` limpio al terminar: borrar archivos temporales (`*.whl`, wavs) antes de cerrar.

## Referencias evaluadas

Detalle y veredictos en `video/referencias-utiles.md`. Resumen: sirven *motion-video-kit* (medidas y bucle de crítica), *ClaudeAnimationBase* (reglas de tiempo y transiciones), *lemo-opuscar* (guía de dirección, estilos, voz Kokoro, muestras de instrumentos), *PDoomVideo* (render en paralelo). No sirven *chrome-bridge*, *shipvideo*, *motion-graphics-music-video-skill* (requiere créditos pagos de generación), los juegos *tidewater* y *claude-opus-5-5-demo*.
