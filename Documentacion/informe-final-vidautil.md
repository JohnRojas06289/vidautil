# VidaÚtil — Informe Final
**Interacción Persona y Computador · Universidad de La Sabana · 2026-I**
**Equipo:** Andrey Conejo · Juan Dimate · John Rojas

---

## 1. Concepto de Diseño Final

### Definición
**VidaÚtil** es una aplicación móvil que hace visible el impacto ambiental invisible del celular que el usuario ya tiene — y lo premia por ello.

> *"Premia lo que ya hacés bien. Te muestra lo que aún no ves."*

El concepto surge de una observación central identificada en las etapas HEAR y DEFINE: el 85–95% del impacto ambiental de un smartphone ocurre durante su fabricación, no durante su uso. Sin embargo, esta huella es completamente invisible para el usuario en el momento de tomar decisiones de reemplazo. VidaÚtil hace ese dato concreto, personal y celebratorio — sin culpa ni coerción.

### Reto de Diseño (DEFINE)
> *¿Cómo podríamos ayudar a los usuarios de smartphone a tomar decisiones más sostenibles sobre el uso, la carga y el reemplazo de su dispositivo, sin asumir que ya les interesa el tema ambiental?*

### Relación con User Needs (Insights de HEAR)

| # | Insight identificado | Cómo VidaÚtil lo responde |
|---|---------------------|--------------------------|
| 1 | La electricidad no se percibe como contaminación: el impacto energético diario es invisible | Muestra el CO₂ evitado de forma concreta: un número real, en kg, por modelo de dispositivo |
| 2 | Heredar un celular extiende su vida útil, pero la batería deteriorada puede consumir más que un equipo nuevo | La pregunta de uso diario (horas/día) ajusta el cálculo de huella anual con un multiplicador real |
| 3 | El criterio ambiental está ausente en la decisión de compra | Al momento de mostrar el QR (acción de registrar el dispositivo), el overlay del laptop muestra el costo ambiental en tiempo real |
| 4 | El "por si acaso" paraliza el reciclaje: nadie sabe cómo hacerlo | La Guía de Descarte (pantalla 4) elimina esa fricción: pasos concretos para reciclar, donar o vender |
| 5 | La intención de cambio es el momento clave | La pregunta "¿Pensás cambiarte?" personaliza el mensaje: quien quiere cambiarse ve el costo exacto; quien quiere quedarse recibe refuerzo positivo |

### Por qué es Human-Centered Design
VidaÚtil fue diseñada explícitamente para **no** culpar ni avergonzar al usuario. En la etapa HEAR identificamos que las soluciones punitivas generan desinstalación inmediata. El enfoque es de **refuerzo positivo**: el sistema premia lo que el usuario ya hace bien (mantener su celular) y le da información para decidir — no para obedecer.

El sistema de medallas (Bronce 2 años → Plata 3 años → Oro 4+ años) convierte un comportamiento ambiental invisible en un logro visible y compartible, usando la misma mecánica de reconocimiento social que los usuarios ya conocen de otras apps.

---

## 2. Proceso de Ideación y Evaluación

### Crazy 8 — Divergencia sin filtro
El equipo generó 16 ideas en sesión cronometrada de Crazy 8, agrupadas en 6 clusters por problema que atacan:

- **Castigo/Barrera** (2 ideas) → Concepto: Barrera de Cambio
- **Concientización** (4 ideas) → Concepto: CO₂ Espejo
- **Economía Circular** (2 ideas) → Concepto: Mercado Verde
- **Incentivos Económicos** (4 ideas) → Concepto: EcoRecompensa
- **Reconocimiento Social** (2 ideas) → Concepto: EcoCredits Sociales
- **Competencia** (2 ideas) → Concepto: EcoRivalidad

### Evaluación — Matriz de Pugh (2 iteraciones)

**Iteración 1:** Mercado Verde lideró (+4). CO₂ Espejo y EcoRecompensa cubrieron necesidades complementarias (+3 cada uno). Barrera de Cambio y EcoRivalidad fueron descartados por usar vergüenza y coerción — contrario al insight de HEAR.

**Iteración 2 (conceptos híbridos):** Se creó **VidaÚtil** como híbrido de CO₂ Espejo + EcoRecompensa. Resultado: **+6 sin ningún criterio negativo** — el único concepto que superó claramente la referencia.

---

## 3. Prototipo Final

### Descripción General
VidaÚtil es un prototipo de alta fidelidad web/móvil construido con Next.js 15, desplegado en Vercel. Funciona en el celular del usuario (flujo de encuesta) y en el laptop del evaluador (overlay AR en cámara), simulando la experiencia completa sin hardware adicional.

**URL del prototipo:** https://app-next-khaki.vercel.app

### Flujo Completo — 4 Pantallas

#### Pantalla 1: Onboarding (4 pasos)
El usuario responde 4 preguntas en su celular:
1. **¿Cuál es tu celular?** — selección de chips rápidos (15 modelos populares) o texto libre
2. **¿Cuántos años llevás con él?** — 8 opciones con preview animado de CO₂ en tiempo real
3. **¿Cuántas horas al día lo usás?** — 4 niveles (Poco/Normal/Bastante/Todo el día) con multiplicador de cálculo (0.7x–1.6x)
4. **¿Pensás cambiarte pronto?** — 3 opciones que personalizan el mensaje de resultados

#### Pantalla 2: Mi Huella
Muestra:
- **Medalla de tiempo** (Bronce/Plata/Oro) con animación de entrada
- **Contador animado** de kg de CO₂ evitados (número grande, protagonista visual)
- **Equivalencias** en km de auto y árboles absorbiendo CO₂ un año
- **Mensaje personalizado** según intención de cambio
- **Botón Compartir** (Web Share API / clipboard) — medalla compartible sin backend
- **Botón Guía de Descarte** — prominente si planea cambiarse

#### Pantalla 3: ¿Cambiarte ya? (integrado en Mi Huella)
El mensaje se personaliza dinámicamente:
- **"No quiero cambiarme"** → refuerzo positivo: cuánto CO₂ evitaría cada año adicional
- **"Tal vez"** → muestra el costo en kg + meses de uso equivalentes
- **"Sí, ya busco"** → alerta clara: costo exacto + CTA directo a Guía de Descarte

#### Pantalla 4: Guía de Descarte
Tres opciones con pasos concretos, eliminando el "por si acaso":
- **Reciclar** — cómo hacerlo correctamente (restablecimiento + punto certificado)
- **Donar** — criterios y organizaciones receptoras
- **Vender** — consejos prácticos de segunda mano

#### Pantalla extra: Proyector AR (laptop)
El evaluador abre `/proyector` en el laptop. La webcam detecta el QR del celular y superpone en tiempo real:
- Overlay de CO₂ evitado + modelo + medalla
- Nube de partículas CO₂ animada alrededor del celular (canvas 2D)
- Sonido de detección (Web Audio API, sin archivos externos)
- **Modo demo** (tecla D): inyecta datos sin necesitar el QR — Mago de Oz explícito

### Cómo se relaciona con el concepto de diseño
Cada pantalla resuelve exactamente un insight:

| Pantalla | Insight que resuelve |
|----------|---------------------|
| Onboarding 4 pasos | El dato debe ser personal, no genérico |
| Mi Huella — número grande | Hace visible lo invisible (insight 1) |
| Medalla compartible | Reconocimiento social sin comparación negativa |
| Mensaje personalizado | Momento clave de decisión de compra (insight 5) |
| Guía de Descarte | Elimina el "por si acaso" (insight 4) |
| Overlay AR | Muestra el costo ambiental en el momento de registrar |

---

## 4. Tecnologías y Técnicas de Prototipado

### Técnicas de Prototipado Aplicadas

| Técnica | Descripción | Evidencia |
|---------|-------------|-----------|
| **Paper Prototyping** | 4 wireframes de baja fidelidad dibujados a mano antes de codificar | Foto en sección anterior del informe CREATE |
| **Prototipo de Alta Fidelidad** | Web app interactiva completa, navegable en celular real | URL: app-next-khaki.vercel.app |
| **Fiducial Marker Tracking** | Detección de marcadores QR con webcam (equivalente a Reactivision) para overlay AR | Componente `jsQR` + Canvas API en `/proyector` |
| **Experience Prototype** | El usuario vive el flujo completo en su propio celular; el evaluador opera el laptop como "proyector" | Demo en vivo |
| **Mago de Oz** | Tecla `D` en el proyector inyecta manualmente una sesión de prueba, simulando detección automática sin usuario real | Modo demo en `/proyector` |
| **Prototipo Táctil** | Vibración háptica (`navigator.vibrate`) en la revelación de la medalla — simula respuesta física del dispositivo | Implementado en `/huella` |
| **Wizard of Oz Social** | Web Share API simula compartir la medalla a redes sociales sin backend ni integración real | Botón "Compartir" en `/huella` |

### Tecnologías Utilizadas

| Tecnología | Rol en el prototipo |
|------------|-------------------|
| **Next.js 15** (App Router) | Framework principal, SSR + cliente |
| **TypeScript** | Tipado estático en toda la base de código |
| **Tailwind CSS** | Sistema de diseño responsive, mobile-first |
| **Framer Motion** | Animaciones de transición entre pantallas |
| **jsQR** | Detección de códigos QR desde la webcam (fiducial marker tracking) |
| **Canvas API (2D)** | Overlay AR: video espejado + partículas + HUD |
| **Web Audio API** | Sonido de detección sintetizado sin archivos externos |
| **qrcode (npm)** | Generación del QR con datos de sesión embebidos en base64 |
| **Vercel** | Deploy continuo desde GitHub, URL pública para demo |
| **Figma** | Wireframes de alta fidelidad y sistema de colores (ver Anexos) |

### Calidad del cálculo
Los datos de CO₂ son reales, por modelo de dispositivo, basados en estudios de ciclo de vida (LCA) de fabricantes. El cálculo de huella evitada usa:

```
CO₂_evitado = max(años_uso - 2, 0) × (65 kg / 2)
huella_anual = (CO₂_producción / años_uso) + CO₂_uso_anual × multiplicador_horas
```

---

## 5. Participación del Equipo

| Integrante | Rol | Contribuciones principales |
|-----------|-----|--------------------------|
| **Andrey Conejo** | Research Lead | Coordinación de entrevistas de usuario (etapa HEAR), síntesis de los 5 insights clave, facilitación de la Matriz de Pugh en ambas iteraciones, redacción del concepto de diseño final |
| **Juan Dimate** | Design Lead | Facilitación de la sesión Crazy 8, construcción del mapa de afinidad, wireframes en papel (paper prototyping), sistema de colores y tipografía en Figma, revisión de la jerarquía visual del prototipo |
| **John Rojas** | Development Lead | Implementación del prototipo en Next.js, algoritmo de cálculo de CO₂ por modelo, integración de jsQR para detección en cámara, overlay AR con Canvas API, sistema de partículas, despliegue en Vercel, modo demo (Mago de Oz) |

### Uso de Inteligencia Artificial
Se utilizó **Claude AI (Anthropic)** como herramienta de asistencia en el desarrollo:
- Generación de código para componentes de React (Canvas AR overlay, sistema de partículas, detección QR)
- Depuración de la integración jsQR con el viewport espejado de la webcam
- Refactorización del algoritmo de cálculo para incluir multiplicador de uso diario

El equipo mantuvo decisiones de diseño, arquitectura de la información y criterios de evaluación como responsabilidad humana. La IA ejecutó; el equipo dirigió.

---

## 6. Conclusiones

VidaÚtil demuestra que hacer visible lo invisible no requiere inteligencia artificial generativa ni hardware adicional. Requiere el dato correcto, en el momento correcto, sin juzgar al usuario.

**Lo que aprendimos:**
- El enfoque de refuerzo positivo es más efectivo que la culpa — el diseño HCD validó esto desde las entrevistas
- La técnica de Mago de Oz permitió probar la experiencia del overlay AR antes de tener detección perfecta
- Embebiendo los datos en el QR eliminamos la dependencia de red en el proyector, haciéndolo más robusto para demo

**Limitaciones del prototipo:**
- No incluye login ni sincronización entre dispositivos (fuera del alcance definido)
- El cálculo de CO₂ usa factores promedio por modelo; un sistema real usaría datos del propio dispositivo
- La Guía de Descarte muestra puntos de reciclaje genéricos, no geolocalizados

---

## Anexos

- **Figma — Sistema de diseño y wireframes de alta fidelidad:** https://figma.com/file/vidautil-hci-2026 *(ver diseño completo)*
- **Repositorio:** GitHub privado del equipo
- **Deploy en producción:** https://app-next-khaki.vercel.app
- **Documento CREATE (etapa anterior):** incluye Crazy 8, Mapa de Afinidad, Matrices de Pugh y wireframes en papel
