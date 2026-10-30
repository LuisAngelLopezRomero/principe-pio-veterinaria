# Entrega v0.4

URL privada: https://principe-pio-consulta.sharpcivet259.chatgpt.site/

Sitio exclusivo del propietario; cero visitantes externos. Acceso mediante ChatGPT. No se ha publicado públicamente, no se ha creado GitHub, y no se ha incluido la contraseña del PDF.

11 presentaciones con 15 reglas; 118 variantes o registros sin cálculo. Seis rutas clínicas. 309 pruebas aprobadas. Inventario: 86 entradas.

Prueba visual limitada: el navegador alcanza el inicio de sesión de ChatGPT; no hay sesión autenticada para inspeccionar la interfaz. La herramienta interna de preview no estaba disponible. Diseño responsive implementado pero no verificado físicamente en iPhone.

Consultar README.md para probar y preparar repositorio privado. Consultar dist/validation-report.md para medicamentos y pendientes.

## v0.6 — formulario único

Paciente, medicamento y respuesta clínica Sí/No en el mismo formulario. Sin respuesta no calcula. «No» es una declaración expresa de ausencia de las condiciones listadas; Sí abre casillas y exige al menos una condición. La selección se guarda en el borrador. Al calcular con Sí, las no marcadas se consideran negativas según el texto visible.

Las precauciones aplicables se presentan antes de calcular. El botón «He revisado los avisos · calcular» acepta únicamente los avisos mostrados para los datos actuales; un cambio de datos invalida la aceptación. No cambia las contraindicaciones ni el motor clínico. No se incorporaron nuevas pautas ni se revalidaron prospectos en esta versión.

Resultados agrupados por presentación: mg por componente, cantidad en comprimidos/ml, base por toma o diaria, vía, frecuencia, duración y fila oficial cuando existe. La referencia teórica y la fuente quedan desplegables. No se presupone disponibilidad física de stock.

317 pruebas automáticas aprobadas. Incluyen Sí/No, ausencia de respuesta, casillas, contraindicación hepática, edad mínima y persistencia. La validación visual/iPhone sigue pendiente por indisponibilidad conocida del servicio de vista previa.

## v0.7 — revisión completa de documentación disponible

Se cruzaron los37 medicamentos del inventario con documentos descargados, formulaciones y reglas.23 productos tienen documentación clínica revisada;14 no tienen documento completo validado. Se revisaron las15 reglas previas, se habilitó Propancat230/20 con tabla oficial y Cefaseptin75 en4 indicaciones, y se publicaron16 resúmenes documentales. Total20 reglas/13presentaciones/8productos calculables. No se extrapolan a otras concentraciones.

Correcciones: Doxybactin siempre con alimentos; Clavaseptin renal/hepático requiere revisión individual de posología; piperazina es condición explícita para Propancat y la lactancia permitida no se bloquea como contraindicación. Las pautas documentales sin automatización aparecen en fichas, separadas del cálculo del paciente. Revisión clínica independiente externa y prueba Safari físico continúan pendientes.

389 pruebas automatizadas aprobadas: límites, huecos de tablas, masas por principio activo, edad, lactancia, gestación, piperazina, función renal/hepática, no extrapolación a otra concentración y acceso a pauta documental.
