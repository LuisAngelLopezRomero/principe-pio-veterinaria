# Revisión farmacológica — 30/10/2026

Candidatos documentales en `research.json`; reglas adaptadas al motor en `research-rules.json`. La validación documental no confirma el envase físico de clínica. Exigir confirmación de nombre, concentración y forma antes de calcular.

## Alcance y fuentes

- Popandog 50/144/200 mg, 3169 ESP. Ficha técnica AEMPS, revisión **10/2026**. Leídas secciones clínicas y farmacéuticas completas; tabla visual revisada en páginas 3–4. https://cimavet.aemps.es/cimavet/pdfs/es/ft/3169%2BESP/FT_3169%2BESP.pdf
- Firodyl 62,5 mg, 3849 ESP, y 250 mg, 3850 ESP. Ambas fichas AEMPS revisión **10/2025**. Leídas secciones clínicas completas y cotejada tablas visuales de ambas presentaciones, página 4. https://cimavet.aemps.es/cimavet/pdfs/es/ft/3849%20ESP/FT_3849%20ESP.pdf y https://cimavet.aemps.es/cimavet/pdfs/es/ft/3850%20ESP/FT_3850%20ESP.pdf
- Los registros CIMAvet correspondientes devuelven estado autorizado. La fecha de consulta no es la fecha de revisión de ficha ni una garantía de futuras actualizaciones.

## Límites de implementación

Popandog solo utiliza filas publicadas entre 2 y 40 kg. La tabla prescribe masas distintas del cálculo teórico mg/kg en parte del intervalo; mostrar ambos por separado. No intercambiar pirantel base y embonato.

Firodyl tiene una fila exactamente **3,1 kg**. La contraindicación de peso inferior a 3 kg no autoriza por sí sola calcular a 3,0 kg: ese peso carece de fila. Hay huecos reales entre límites a décimas; conservarlos. En 250 mg no rellenar el intervalo 12,6–21,5 kg, correspondiente a 62,5 mg. No extrapolar por equivalencia de concentración.

Se habilita únicamente la pauta de osteoartritis de Firodyl. La pauta perioperatoria está investigada en `research.json`, pero no integrada hasta incorporar selección de cirugía/fase e interacción con anestesia.

Deben añadirse al bloque de condiciones: `bleeding`, `hypotension`, `previousAntiInflammatory`, `puppy`, `debilitated`. La gestación de Popandog queda en revisión manual porque se requiere fase gestacional. La condición de cachorro se pregunta; no se inventa un umbral universal. Las precauciones requieren confirmación veterinaria; otras condiciones positivas sin regla específica quedan en revisión, nunca se etiquetan como contraindicación documental.

## Pendientes concretos

Clindaseptin 25 mg/ml, FT revisión 02/2026: discrepancia entre equivalencias aproximadas ml/kg y cálculo por concentración en §3.9. Mantener bloqueado hasta aclaración. https://cimavet.aemps.es/cimavet/pdfs/es/ft/2512%2BESP/FT_2512%2BESP.pdf

Prevomax y Credelio gatos: páginas regulatorias accesibles; documentos UPD requieren comprobación humana. Los antiguos PDF EMA contienen solamente un aviso de traslado. No presentar el prospecto vigente como leído ni calcular a partir de fragmentos indexados.

Las rutas UPD comprobadas se conservan en research.json. No se han reutilizado fórmulas de fuentes comerciales.
