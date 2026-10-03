# Une las piezas de la escena en cadena2.html (y deja _check.js para validar la sintaxis).
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
h1=open('_h1.js').read().replace("const W=1080,H=1920,DUR=158;","const W=1080,H=1920;let DUR=158;")
pc=open('_pc.js').read().replace("x.fillStyle=PCPAT;x.fillRect(-200,-200,W+400,H+400);x.restore();","x.fillStyle=PCPAT;x.fillRect(-1500,-1500,W+3000,H+3000);x.restore();")
head='''<!doctype html>
<meta charset="utf-8">
<link rel="stylesheet" href="fuentes.css">
<link rel="stylesheet" href="fuentes-kagit.css">
<style>html,body{margin:0;background:#f3eee4}canvas{display:block}</style>
<canvas id="c" width="1080" height="1920"></canvas>
<script>
// LA CADENA v2 — estilos del catálogo: tek çizgi (8), kâğıt kesik (9), karakalem (10).
// Los textos fijan la duración de cada escena (regla de lectura); video y música comparten la línea de tiempo.
'''
body=h1+open('_tek.js').read()+open('_a.js').read()+pc+open('_b.js').read()+open('_lp.js').read()+open('_c.js').read()
open('cadena2.html','w',encoding='utf8').write(head+body)
open('_check.js','w').write((head+body).split('<script>',1)[1].rsplit('</script>',1)[0])
