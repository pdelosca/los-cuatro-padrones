# Referencias evaluadas (4 de octubre de 2026)

Solo lo que sirve para nuestros videos de la familia. Cada repo se clonó y se leyó; las webs bloqueadas por la red de la sesión no se pudieron abrir.

## Sirven

### echris6/motion-video-kit (skill `business-motion-film`, MIT)
- **Medir en vez de opinar**: `scripts/loudness.sh` (EBU R128: LUFS, rango, pico verdadero), `scripts/frozen-time.sh` (cuánto tiempo no cambia la imagen), `scripts/contact-sheet.sh`. Nuestro v2 midió −15,1 LUFS, 5 LU, pico −7,4 dBFS y 54 % de tiempo casi congelado (esperable en un video para leer).
- **Bucle de crítica independiente (Gauntlet)**: quien construye no juzga; un revisor nuevo ve solo el render y el encargo; otro verifica punto por punto; se lleva un registro (ronda, hallazgos, cambios, medida).
- **Reglas**: el cuadro 0 es una composición terminada; sin cuadros vacíos; empujón lento del 3–5 % en tramos de lectura; una pasada suave por transición; sonido sin retumbos; música afín al público; entregar también música sola; decir qué se midió y qué se escuchó.
- No sirve: ofertas de negocios, Three.js, realismo de producto, mezcla de efectos pagos.

### JohnHeibel/ClaudeAnimationBase (`ANIMATION_GUIDE.md`)
- **Tiempo = «modelar al espectador»**: listar las *lecturas* de cada escena (qué tiene que entender quien mira), dar tiempo a encontrar, entender y registrar cada una; una lectura por vez; acciones rápidas, significados lentos; la última lectura necesita tiempo para caer.
- **Transiciones siempre**, también hacia el primer cuadro y fuera del último; no repetir la misma.
- **Pasa algo en cada escena**; mostrar, no escribir (un cartel que repite la historia es el fallo clásico); nada queda quieto; una sola pieza planificada.
- Nuestro video usa texto a propósito (público que necesita leer), pero la guía sirve para que el dibujo muestre más y la leyenda explique menos.

### lemomo-ai/lemo-opuscar (43 estilos, `DIRECTOR.md`, `TECHNIQUE.md`)
- **Guía de dirección**: tomar el encargo → buscar un referente → dar forma a la historia → tratamiento → probar el look → sonido como mitad de la película → la grilla de música primero → cada plano con razón → fallas comunes (sujeto chico, oscuro, subtítulos encima del sujeto, gag demasiado rápido, cuadros en blanco en transiciones, efectos que no siguen al sujeto) → lista de entrega (mp4, póster, `.srt`, `TREATMENT.md`, `CREDITS`, `build.sh`).
- **Bucle de revisión**: hojas de contacto cada 1–2 s (dos pasadas), tiras de 0,2 s en cada acción clave, `ebur128` y `blackdetect` sobre el archivo final, una vista completa a velocidad real con sonido.
- **Estilos que podrían servir para historia familiar** (cada uno trae `STYLE.md` y `DEMO.md`): `engraving` (grabado), `woodcut`, `silent-film`, `silkscreen-poster`, `midcentury-toon`, `paper-popup`, `papercut-red`, `watercolor`, `ink-wash`, `one-line`, `crayon-book`, `urban-sketch`. Lista completa: art-deco, ascii-crt, backrooms, blueprint, brick-toy, cel-anime-80s, crayon-book, dark-keynote, dataviz, engraving, game-show, glass-product, halftone-dossier, hd-2d, hologram-hud, impasto, ink-wash, iso-infographic, living-screencast, lowpoly-island, microgame, midcentury-toon, one-line, paper-lantern, paper-popup, papercut-red, pictogram-motion, pixel-rpg, risograph, rubber-hose, scifi-toon, shadow-puppet, silent-film, silkscreen-poster, spy-titles, stained-glass, swiss-motion, tilt-shift, ukiyoe, urban-sketch, watercolor, whiteboard, woodcut.
- **Voz (clave)**: `core/tts/tts.py` usa **Kokoro** sin conexión (necesita Python 3.11–3.13: acá hay 3.11). El modelo (`voice.tar`, 353 MB) está en el *release* `assets` del repo y **se puede descargar desde esta red** (HEAD 200). Kokoro v1.0 tiene voces en español (`ef_dora`, `em_alex`, `em_santa`, según recuerdo; no verificado). `asr_check.py` (Whisper) comprobaría cada línea, pero baja su modelo de Hugging Face, que está bloqueado. Sin poder escuchar ni verificar los nombres propios (Chavarría, Marincho, Sarandí), la narración sería a ciegas: hay que decirlo y pedir confirmación antes de incluirla.
- **Música con muestras reales**: `core/audio/sampler.py` toca instrumentos de bibliotecas libres (VSCO 2 CE, VCSL, FreePats, Karoryfer, Salamander Grand Piano; `tools/fetch.sh instruments <biblioteca>`, ~1,4 GB todas). Podría reemplazar la síntesis aditiva de `musica2.py` por piano y guitarra reales.
- **Mezcla final**: `core/render/mux.sh video mix out fps [grano]` hace loudnorm de dos pasadas a −14 LUFS con límite de pico; `core/render/srt.py` exporta subtítulos.

### JohnHeibel/PDoomVideo
- Todo el video musical en código con p5.js + p5.brush; `render.mjs --frames=0:156.6 --workers=4` pinta cuadros **en paralelo y reanudable**. **Idea aplicable**: nuestro `frames.js` usa un solo proceso (~10 cuadros/s) y hay 4 núcleos; con 4 trabajadores el render final bajaría de ~12 min a ~4.
- Storyboard escrito por el modelo con una regla: cada escena se transforma en la siguiente.

### yihui-dev/awesome-opus5-5-videos y athemeroy/awesome-opus-5-5-videos
- Listas de ejemplos con sus prompts (`prompts/`, 475) y guías de producción (`docs/visual-effects-fit.md`, `production-brief.md`). Ideas útiles: **criterio de aceptación por etapas** (brief y cuadros clave → muestra corta de lo más difícil → secuencia completa con handoff reproducible); y el prompt de la Market Street de 1906 que arma primero un **archivo de fuentes con nivel de confianza por dato**, igual que nuestra regla de datos.

## No sirven

- **frsorrentino/chrome-bridge**: extensión de Chrome + MCP para que Claude Code maneje *tu* navegador (con tus sesiones y cookies) y pruebe sitios web. Nuestra sesión es remota y no tiene tu Chrome; su `screencast` graba a ritmo variable, peor que nuestro render exacto; además da acceso a cuentas.
- **diggerhq/shipvideo**: un formulario que genera un video de lanzamiento (HTML renderizado en Chromium + ffmpeg). Es el mismo mecanismo que ya usamos.
- **makevoid/motion-graphics-music-video-skill**: video musical con generación de imagen y video por API (≈30 USD de créditos Fal, Ruby, claves); no aplica.
- **dgreenheck/tidewater** (juego de pesca WebGPU) y **riba2534/claude-opus-5-5-demo** (tres juegos 3D): juegos, no se clonaron.
- **skillry.dev, scrolltide.co, designmd.ai, animejs.com, mapcn.dev y los tres artículos de Opus 5.5**: la red de la sesión los bloquea; no se pudo evaluar nada.

## Pendiente

- Falta el enlace del décimo repo de la lista de Pablo (`opus-video-skills`, «una habilidad de Claude Code por estilo de video»); la búsqueda no lo encontró.
- Decidir con Pablo si se suma narración (Kokoro) y/o muestras de instrumentos reales.
