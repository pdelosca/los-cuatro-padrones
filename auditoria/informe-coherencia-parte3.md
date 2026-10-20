# Auditoría de coherencia y cohesión: Parte 3

Texto auditado: `nota-revisada.md`, sin modificar. La versión revisada completa está en `auditoria/version-revisada.md`.

## 1. Diagnóstico general

El argumento está bien armado y avanza en orden: escena, problema, costo, andamio, dispositivo, experiencias, rol institucional y cierre. La escena del domingo abre y cierra la nota con eficacia. Los problemas son locales y de tres tipos:

- Un párrafo de dos líneas (el del novato) repite lo que ya dijo el párrafo anterior y termina en un «por eso» que no se sostiene.
- La sección «Quién cuida el camino» salta del tiempo docente a las herramientas y de vuelta al tiempo, en un orden que obliga al lector a reacomodarse.
- Varios párrafos arrancan con «Pero» o «Y», y hay oraciones partidas en dos («Y hace dos cosas a la vez. Sostiene…») que le dan un ritmo de lista.

Ninguno de estos problemas cambia el contenido. Se resuelven reordenando, fusionando y ajustando los conectores.

## 2. Esquema inverso

| # | Idea del párrafo |
|---|---|
| 1 | Un profesor recibe treinta textos iguales, prolijos y sin marcas. |
| 2 | Son superficie lisa: sin las marcas de quien piensa, podrían ser de cualquiera. |
| 3 | Por eso un texto hecho en casa ya no es evidencia de aprendizaje. |
| 4 | No es trampa: los estudiantes usan la IA porque les sirve, como todos. |
| 5 | En la enseñanza, útil es otra cosa; la herramienta tiene que estar diseñada para enseñar. |
| 6 | Sin ese diseño, la IA es un atajo que deja deuda cognitiva (estudio chino). |
| 7 | El costo no es igual: acelera al que sabe y le estorba al novato. |
| 8 | El novato, además, cree que entendió (metacognición). |
| 9 | *(Repite 7 y 8: el esfuerzo es el aprendizaje y la deuda pesa más sobre el novato.)* |
| 10 | Hay que mirar el proceso, pero el profesor no puede con trescientos caminos; entra el andamio. |
| 11 | Qué es un andamio (obra, Vygotsky, Wood, Bruner y Ross). |
| 12 | Sostiene sin bajar la exigencia y se retira a tiempo. |
| 13 | Los WebQuest fueron andamios digitales que se vaciaron. |
| 14 | Hoy, prohibir sin cambiar la tarea repite ese error («yo avisé»). |
| 15 | Un andamio de verdad conserva la fricción y deja el camino a la vista. |
| 16 | Estar disponible no alcanza; rinde más con una persona (tutores). |
| 17 | Dispositivo según Souto; se acerca a la tutoría uno a uno. |
| 18 | Tres experiencias: IA comercial con andariveles. |
| 19 | EscribeLab. |
| 20 | Python, del lado del estudiante. |
| 21 | Python, del lado del docente. |
| 22 | Maestro Virtual. |
| 23 | No hay garantías; avanzar despacio y medir. |
| 24 | El peso no puede recaer en los docentes; lo sostienen las instituciones. |
| 25 | Hoy los docentes están solos (datos de Ceibal). |
| 26 | Gemini y NotebookLM ayudan, pero falta una formación que no sea solo instrumental. |
| 27 | El marco de Ceibal orienta a los docentes; el novato necesita andamios. |
| 28 | *(Vuelve al tiempo docente y a invertir en docentes.)* |
| 29 | Cinco preguntas. |
| 30 | Lo que no se delega y la brecha. |
| 31 | El domingo, ahora con algo que mirar. |
| 32 | Las cicatrices y el cierre alentador. |

## 3. Tabla de problemas

| Gravedad | Párrafo | Cita | Tipo | Por qué traba |
|---|---|---|---|---|
| Alta | 9 | «Pasar de novato a experto cuesta… Por eso la deuda pesa más sobre quien recién empieza.» | Coherencia | Repite el párrafo 7 («Ese costo no es igual para todos»). Además, «por eso» no se deduce de la oración anterior. Es un párrafo de dos líneas que suena a resumen. |
| Alta | 10 | «Si el producto ya no muestra el aprendizaje, hay que mirar el proceso…» | Cohesión | Retoma el párrafo 3, saltando toda la sección del costo. El lector no ve por qué la sección termina en «mirar el proceso». |
| Alta | 26–28 | Orden: formación → marco → «El tiempo que herramientas como Maestro Virtual…» | Coherencia | La sección habla de tiempo, después de herramientas y de alumnos, y vuelve al tiempo. El párrafo 28 queda desconectado de lo que lo rodea. |
| Media | 15 | «Y hace dos cosas a la vez. Sostiene…» | Mecanicidad | Una oración partida en dos que suena a lista. |
| Media | 16 | «Pero no alcanza con que…» | Mecanicidad | Es el cuarto «Pero» al comienzo de oración en la nota. |
| Media | 16 | «La IA no hizo el trabajo por ellos. Los ayudó a hacerlo mejor.» | Mecanicidad | Dos oraciones cortas que funcionan como remate efectista. |
| Media | 18 | «Las tres parten de una misma idea. No hace falta inventar otra IA.» | Mecanicidad | Corte que suena a placa de presentación. |
| Media | 6 | «Un estudio lo muestra con claridad.» | Mecanicidad | «Con claridad» es relleno. |
| Media | 23 | «…el rediseño de consignas que propusimos antes.» | Cohesión | «Antes» es ambiguo: puede ser esta nota o la anterior. |
| Baja | 26 | «Y a la velocidad con que cambian…» | Mecanicidad | Otro arranque con «Y». |

## 4. Las 10 intervenciones de mayor impacto

1. **Absorber el párrafo 9 en el 8.**
   - Original: «Lo que se resiente ahí es la metacognición, que es saber qué se entendió y qué no.» + párrafo aparte: «Pasar de novato a experto cuesta, y ese esfuerzo es, precisamente, el aprendizaje. Por eso la deuda pesa más sobre quien recién empieza.»
   - Propuesta: «Lo que se resiente ahí es la metacognición, que es saber qué se entendió y qué no. Pasar de novato a experto cuesta, y ese esfuerzo es, precisamente, el aprendizaje que el atajo se saltea.»
   - Alternativas que probé: mover la frase al párrafo 6, donde se repetía con la deuda, o borrarla; las dos perdían la idea del esfuerzo como aprendizaje. «Que el atajo se saltea» retoma la imagen que abre la sección.

2. **Enlazar el cierre de la sección con su título.**
   - Original: «Si el producto ya no muestra el aprendizaje, hay que mirar el proceso…»
   - Propuesta: «Como ese costo no se ve en el producto, hay que mirar el proceso…»
   - Así el párrafo retoma «El costo que no se ve a tiempo» y la conclusión sale de la sección.

3. **Reordenar «Quién cuida el camino».** El orden pasa a ser: peso institucional → los docentes están solos → **tiempo e inversión en docentes** → Gemini y formación → marco y novatos → preguntas. Al párrafo del tiempo le agregué un arranque que lo engancha con el anterior.
   - Propuesta: «Respaldarlos empieza por el tiempo. El que herramientas como Maestro Virtual les devuelven no puede llenarse con más trabajo. Y si hay que elegir dónde poner los recursos, conviene invertir más en docentes que en herramientas. Nunca se necesitó tanto su criterio para decidir qué entra al aula y qué no.»
   - Con este orden, «invertir en docentes» prepara «Eso ayuda, pero falta formación», y el marco de Ceibal, que termina en los novatos, lleva directo a las preguntas.

4. **Unir el andamio de verdad en una sola oración.**
   - Original: «Y hace dos cosas a la vez. Sostiene al estudiante mientras recorre el camino y, como ordena el trabajo en pasos, deja ese camino a la vista del docente.»
   - Propuesta: «Además, como ordena el trabajo en pasos, sostiene al estudiante mientras recorre el camino y deja ese camino a la vista del docente.»

5. **Sacar el «Pero» inicial.**
   - Original: «Pero no alcanza con que un andamio digital esté disponible.»
   - Propuesta: «Que un andamio digital esté disponible no alcanza.»

6. **Suavizar el remate de los tutores.**
   - Original: «La IA no hizo el trabajo por ellos. Los ayudó a hacerlo mejor.»
   - Propuesta: «La IA no hizo el trabajo por ellos; los ayudó a hacerlo mejor.»

7. **Integrar la idea común de las tres experiencias.**
   - Original: «Las tres parten de una misma idea. No hace falta inventar otra IA.»
   - Propuesta: «Las tres parten de la misma idea, que no hace falta inventar otra IA.»

8. **Quitar el relleno.**
   - Original: «Un estudio lo muestra con claridad.»
   - Propuesta: «Un estudio reciente lo muestra.»

9. **Precisar la referencia.**
   - Original: «…el rediseño de consignas que propusimos antes.»
   - Propuesta: «…que propusimos en la nota anterior.»

10. **Un «Y» inicial menos.**
    - Original: «Y a la velocidad con que cambian estas tecnologías…»
    - Propuesta: «A la velocidad con que cambian estas tecnologías…»

## 5. Versión completa revisada

Está en `auditoria/version-revisada.md`. Aplica las 10 intervenciones y nada más. Se conservan todos los enlaces y todos los elementos de la lista de restricciones.

## 6. Lo que no toqué y por qué

- **«Pero» que sí sostienen un contraste real**: el del estudio chino («Pero rindieron peor»), el del profesor («Pero el profesor del domingo»), el de la tarea («Pero si la tarea queda igual»), el de las cuentas personales y el del marco («Pero un marco orienta…»). Sin ellos se pierde el giro.
- **Los remates del cierre** («Su criterio es el mismo de siempre…», «Si nadie las ve…») y «podría ser de cualquiera». Son efectistas a propósito: son las frases que el lector se lleva.
- **«Gran parte del partido»**: es la palabra del autor y retoma a Tabárez.
- **El orden de las secciones principales**: la progresión ya es sólida.
- **La lista de preguntas**: ya está clara y respeta las restricciones.
