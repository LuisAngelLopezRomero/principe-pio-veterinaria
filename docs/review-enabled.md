# Revisión de las reglas ya habilitadas

Fecha: 30/10/2026. Alcance: cotejo de las 15 reglas presentes al inicio de esta revisión con las secciones clínicas y posológicas de las copias oficiales guardadas. Se revisaron composición, especie, divisibilidad, dosis, frecuencia, duración, tablas y restricciones. No se afirma una comprobación administrativa en tiempo real de todas las autorizaciones. Solo Doxybactin50 y Clavaseptin50 se reabrieron además en CIMAvet en esta revisión.

## Corrección concreta

**Doxybactin50 y200, todas sus reglas:** la administración con alimentos es una instrucción general de las secciones3.5 y3.9, no exclusiva de animales con enfermedad gastrointestinal. La app la muestra actualmente en el aviso condicionado a `gi=yes`; añadirla al aviso permanente y al resultado de administración. La dosis y la duración de las seis reglas concuerdan con los documentos. No debe interpretarse el total diario como cantidad por toma.

## Cotejo por medicamento

| Producto / documentos guardados | Resultado del cotejo | Límites de la implementación |
|---|---|---|
| Clavaseptin50,250,500 (`clavaseptin.pdf`, `clavaseptin250.pdf`, `clavaseptin500.pdf`; revisión12/2024) | Componentes40+10,200+50 y400+100mg correctos; referencia10+2,5mg/kg cada12h,5–7d; mitades. Especies correctas:50perro/gato,250/500perro. Filas coinciden, incluido inicio30,1kg para500mg. Restricciones principales y resistencia representadas. | No aplica duplicación por gravedad ni cursos crónicos2–4semanas. Los huecos decimales se bloquean. En renal/hepático la ficha pide evaluación del uso y posología; el cálculo estándar no demuestra que sea apropiado ni ajusta dosis. |
| Metrobactin250/500 (`metrobactin.pdf`, `metrobactin500.pdf`; revisión12/2024) |50mg/kg/día, opción25mg/kg cada12h,5–7d, mitades/cuartos; perro/gato. Hepatopatía bloquea. Gestación/lactancia quedan en revisión por uso no recomendado, correctamente diferenciadas de contraindicación formal. | Solo opción dividida cada12h. Bloqueo de pesos no representables con cuartos es conservador; no existe redondeo automático autorizado en la regla. |
| Doxybactin50/200 (`doxybactin.pdf`, `doxybactin200.pdf`; revisión09/2025) |10mg/kg/día y tabla diaria. Infección aguda: continuar2–3d tras curación;5–7d es tiempo de respuesta, no duración fija. Leptospira14d; C.felis mínimo28d.50perro/gato,200solo perro. Tabla visual cotejada en `doxy200-table.png`;200solo aparece en bandas>15–20,>25–30 y>30–35kg. | Corregir instrucción general con comida. No calcula combinaciones50+200/400 ni pauta por toma. Crónicos/resistentes excluidos explícitamente. |
| Synulox40+10mg/ml (`synulox.pdf`; revisión11/2025) |0,25ml/kg cada12h corresponde10+2,5mg/kg. Duración habitual5–7d; reconstitución15ml agua y precauciones presentes. Tabla0,5–4kg tiene rangos volumétricos y gotas aproximadas. | Intersección entre fórmula, rango y pasos0,05ml es deliberadamente conservadora:0,5kg y valores intermedios pueden bloquearse. No afirmar que ese bloqueo es contraindicación oficial. Doble dosis respiratoria y cursos crónicos no implementados. |
| Popandog (`popandog.pdf`; revisión10/2026) | Componentes50/144/200mg; referencia5/14,4/20mg/kg; tabla2–40kg coincide; administración única y repetición14d cuando helmintiasis diagnosticada. Edad<6semanas es precaución, no contraindicación. Gestación exige precisar fase; cachorro y debilitado requieren valoración. | Fuera de tabla no extrapola. `other` bloquea hasta identificar tratamientos; la ficha excluye piperazina, fosfatos orgánicos, dietilcarbamazina y morantel. Desechar fracción de blíster es correcto; el envase de polietileno tiene conservación distinta, no debe generalizarse. |
| Firodyl62,5/250 (`firodyl.pdf`, `research_sources/firodyl250.pdf`; revisión10/2025) |5mg/kg cada24h, tabla oficial por concentración; cuartos. Edad<10semanas y peso<3kg contraindicados. Filas, huecos y restricciones principales coinciden. Duración en osteoartritis según respuesta;90d describe estudios, no pauta fija. | Solo osteoartritis. Posoperatorio está documentado pero no habilitado: hasta3d según necesidad, inicio≈2h antes; continuación ortopédica individual. No añadirlo bajo la regla OA. Peso3kg no contraindicado por peso, pero carece de fila aplicable: bloqueo de cobertura, no contraindicación. |

## Riesgos de interpretación que conviene conservar visibles

1. Una dosis calculada con precaución renal/hepática aceptada sigue siendo una pauta estándar. El motor no ofrece ajuste individual de posología. En Clavaseptin, cuyo RCM pide valorar también la posología, sería más conservador usar revisión manual si no existe un mecanismo que registre la decisión de mantener la pauta estándar.
2. Condiciones positivas sin regla específica se bloquean por falta de automatización, no por contraindicación demostrada. No transformar ese mensaje en «no usar».
3. Las tablas requieren presentación exacta. Igual principio activo no permite heredar especies, bandas, fracciones o duración de otra concentración.
4. Los documentos contienen además advertencias para personas manipuladoras, efectos adversos y conservación no transcritos exhaustivamente en los avisos de cálculo. La ficha completa debe seguir accesible.

## Referencias oficiales reabiertas

- Doxybactin50: https://cimavet.aemps.es/cimavet/pdfs/es/ft/3578%20ESP/FT_3578%20ESP.pdf (secciones3.5 y3.9).
- Clavaseptin50: https://cimavet.aemps.es/cimavet/pdfs/es/ft/1662%20ESP/FT_1662%20ESP.pdf.

Las fuentes exactas del resto y sus fechas constan en `dist/rules.json`; esta revisión no altera esas fechas ni certifica vigencia administrativa. No se han modificado reglas ni código desde este informe.
