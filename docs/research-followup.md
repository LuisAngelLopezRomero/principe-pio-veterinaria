# Auditoría independiente y líquidos — 30/10/2026

## Comprobaciones

`research-audit.mjs` ejecutado contra las 8 reglas habilitadas de `principe-pio/dist/rules.json`: **254 comprobaciones superadas**. Comprueba bloqueos declarados por contraindicación, condiciones desconocidas, especie no autorizada, deshabilitación y casos límite independientes de Popandog/Firodyl. Resultado en `research-audit-results.json`.

Las filas de Popandog y Firodyl y la separación mg teóricos/mg por tabla coinciden con las fuentes oficiales revisadas. Clavaseptin 50 y Metrobactin 250 coinciden en dosis, especies y condiciones principales con las fichas abiertas durante esta investigación. Para 250/500 de Clavaseptin y 500 de Metrobactin, las comprobaciones automáticas no constituyen una segunda revisión documental completa independiente.

## Ajustes recomendados al propietario del proyecto

- Metrobactin: gestación/lactancia figuran como no recomendadas en §3.7. En la regla actual una confirmación genérica de precauciones permite calcular. Para el flujo habitual conviene utilizar `review` y dejar la decisión excepcional fuera del cálculo estándar, conservando claramente que no es una contraindicación formal.
- Edad: la conversión de meses a 30,4375 días es aproximada. Para un valor próximo al límite de 10 semanas de Firodyl, exigir semanas exactas o fecha de nacimiento; un aviso textual no garantiza precisión. No hay que bloquear adultos por utilizar años.

## Investigación de líquidos

Meloxidyl 1,5 mg/ml: registro UPD autorizado y documento español publicado 02/10/2026. https://medicines.health.europa.eu/veterinary/en/600000000031
Documento: https://medicines.health.europa.eu/veterinary/en/documents/download/152d666e-a4a9-4608-bab2-0f42e7771b62

Rheumocam 0,5 mg/ml gatos: registro UPD autorizado, documento español publicado 13/03/2026. https://medicines.health.europa.eu/veterinary/es/600000000235
Documento: https://medicines.health.europa.eu/veterinary/es/documents/download/60923ad9-856d-4574-8421-f7999b3fe27f

Las aperturas devuelven 429; una descarga directa devuelve HTML con comprobación humana, no PDF. No se ha validado contenido integral vigente ni generado `rules-liquid.json`. Los extractos del registro no sustituyen el prospecto. Mantener cálculos bloqueados.
