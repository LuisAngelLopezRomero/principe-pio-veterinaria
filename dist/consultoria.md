> Informe histórico v0.5. Para cobertura actual y correcciones v0.7 consultar [Estado actualizado](validation-report.md).

# Consultoría de Príncipe Pío · v0.5

Fecha: 30 de octubre de 2026. Alcance: auditoría de código, inventario, reglas, trazabilidad, flujos y pruebas automatizadas. No es una certificación clínica independiente. No se ha podido completar una prueba visual en navegador ni Safari físico: el servicio interno de vista previa no está disponible.

## Dictamen

La aplicación sigue siendo una versión de evaluación. **No se han utilizado ni validado todos los prospectos ni todas las dosis del inventario.** El principal problema pendiente es la cobertura clínica, además de las pruebas de uso reales. Compactar la interfaz no resuelve esas carencias.

- 86 entradas: clasificación provisional de 37 medicamentos, 30 complementos y 19 productos de higiene/cuidado. No procede exigir un prospecto AEMPS a cada complemento como si fuera un medicamento autorizado.
- 129 registros de presentaciones/variantes; incluyen tamaños de envase y placeholders sin identificación definitiva. No son 129 medicamentos distintos.
- 6 productos con al menos una regla: Clavaseptin, Metrobactin, Doxybactin, Popandog, Firodyl y Synulox.
- 11 presentaciones con 15 reglas limitadas a indicaciones y especies concretas; 118 registros sin cálculo. Ver coverage.json para cada entrada y validation-report.md para sus límites.
- 37 registros históricos de investigación de medicamentos. Un enlace encontrado o una descarga correcta no acredita una revisión completa ni la implementación de su posología.

## Hallazgos y acciones

| Prioridad | Hallazgo | Acción / estado |
|---|---|---|
| Alta | Cobertura clínica incompleta | Se mantiene el bloqueo. No se han añadido dosis por inferencia en esta versión. |
| Alta | Registro de fuentes inicial desactualizado respecto de reglas habilitadas | Se distingue el historial y se añade cobertura actual reproducible por producto, presentación y regla. |
| Alta | No hay verificación regulatoria automática ni revisión clínica independiente | Pendiente. Cada incorporación debe guardar documento completo, revisión, secciones, reglas y casos límite. |
| Alta | No hay comprobación visual real del rediseño | Pendiente por fallo del servicio interno. Las pruebas DOM no verifican tamaño, solapamientos o teclado de iPhone. |
| Media | Formulario largo, textos repetidos, tarjetas enormes | Paneles compactos; paciente y medicamento juntos en pantallas amplias, condiciones visibles en rejilla, resultado lateral y acción fija en móvil. |
| Media | Resultados de búsqueda permanecían al seleccionar producto | Ocultados tras selección; volver a escribir abre la búsqueda. |
| Media | Botón podía conservar estado deshabilitado al cambiar desde un producto pendiente | Estado recalculado al editar búsqueda/paciente. |
| Media | Comparar envases repetía fuentes largas | Fuentes desplegables, cantidades y alertas permanecen visibles. |
| Media | Dos confirmaciones antes de resultado final | Se conservan: revisión clínica y cotejo de envase no son equivalentes. La aceptación de precauciones no anula contraindicaciones. |
| Media | Persistencia dependiente del navegador | Borrador local 12 h. No se garantiza entre Safari y navegador interno, sesiones privadas o almacenamiento eliminado. |

## Dosis: alcance de la comprobación

Se han revisado la estructura de las 15 reglas, sus referencias y la correspondencia con las presentaciones; se ejecuta de nuevo la batería de cálculo. Esto **no equivale a releer hoy íntegramente los 11 documentos originales y cotejar cada frase**. Se conservan dosis, duración, tablas, fracciones y bloqueos existentes.

Limitaciones relevantes: Doxybactin ofrece total diario, no dosis por toma; Synulox solo un subconjunto de pesos compatible con la fórmula y la medición documentada; tablas con huecos no interpoladas; condiciones o interacciones sin regla suficiente requieren valoración individual. “Pendiente” significa trabajo documental no terminado en la app, no una contraindicación del medicamento.

## Comprobación regulatoria adicional

La antigua URL PDF de EMA para Meloxidyl devuelve actualmente una página que remite a Veterinary Medicines Information, no la ficha técnica completa. Por tanto, comprobar solamente que la URL devuelve un PDF habría sido un criterio incorrecto de validación. La consulta directa al registro UPD devolvió 429; no se incorporó una pauta nueva desde el extracto del buscador.

Fuentes consultadas:
- https://www.ema.europa.eu/en/documents/product-information/meloxidyl-epar-product-information_en.pdf
- https://www.ema.europa.eu/en/medicines/veterinary/EPAR/meloxidyl
- https://medicines.health.europa.eu/veterinary/en/600000000031
- https://www.ema.europa.eu/en/veterinary-regulatory-overview/veterinary-medicinal-products-regulation/union-product-database

## Siguiente orden de trabajo

1. Resolver identidad y ficha completa vigente de cada medicamento pendiente, empezando por Meloxidyl y los productos más usados en consulta; no extrapolar entre marcas o concentraciones.
2. Cotejar cada regla con segunda revisión clínica y pruebas independientes de dosis, especie, edad, peso, duración, división y condiciones. Revisar también las reglas ya habilitadas.
3. Separar en el modelo concentración/formulación de tamaño de envase. Evitar que 10 y 32 ml aparenten pautas diferentes.
4. Probar físicamente iPhone: teclado, orientación, retorno desde otra app, almacenamiento, zoom y selección de envase. Probar escritorio con teclado.
5. Solo después valorar uso clínico habitual y ampliación de indicaciones. Mantener acceso privado.

## Cómo probar esta versión

En Calculadora, elegir Perro, 10 kg, 8 años; buscar y seleccionar Clavaseptin. Revisar casillas y aceptar las precauciones solo tras leerlas. Calcular y comparar opciones sin elegir previamente miligramos. Seleccionar envase y cotejarlo antes del resultado final. Repetir con una condición positiva para comprobar el aviso/bloqueo. Salir y volver en el mismo navegador; comprobar recuperación. Borrar calculadora debe vaciar el borrador. Estas son pruebas de software, no instrucciones para tratar a un paciente.

Pruebas automatizadas y su resultado completo: test-results.txt. El motor clínico no se modificó en esta versión.
