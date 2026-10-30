# Príncipe Pío · v0.7

Aplicación privada de apoyo veterinario. Reconstrucción desde el PDF maestro del 29/10/2026; no se recibió código v0.1. Interfaz española responsive, búsqueda por marca/activo, especialidades, seis rutas, favoritos, fichas y motor de dosis con bloqueos.

## Probar sin instalar

Abrir la URL privada que acompaña a la entrega e iniciar sesión con la cuenta autorizada de ChatGPT. No se requiere instalar la aplicación. La contraseña del PDF no se distribuye ni se incrusta en JavaScript: Sites protege el acceso antes de servir los archivos.

1. Pulsar Perro o Gato e introducir peso, edad y unidad.
2. Buscar cualquier medicamento por nombre o activo y pulsarlo. La búsqueda muestra antes si aún no tiene cálculo validado.
3. Elegir indicación si hay varias. No es obligatorio elegir concentración al comenzar.
4. Responder Sí/No a condiciones y tratamientos; si Sí, marcar todo lo presente.
5. Revisar y calcular; leer las precauciones antes de confirmarlas. Se comparan las cantidades documentales y las presentaciones aplicables sin redondeos.
6. Pulsar Usar este envase y confirmar el envase para obtener el resultado final. También puede elegirse un envase conocido desde la opción anticipada.
7. El borrador se recupera al recargar o volver, durante 12 horas desde la última actividad en el mismo navegador/origen. Borrar calculadora lo elimina. Si el navegador impide almacenamiento local, la aplicación lo indica.

Para una demostración sin paciente real: Popandog, perro adulto de 5 kg, todas las condiciones realmente revisadas, indicación/envase confirmados. El cálculo debe devolver media tableta: 25 mg de prazicuantel, 72 mg de embonato de pirantel y 100 mg de fenbendazol. Esta es una comprobación de la tabla, no una recomendación de administrar.

## Desarrollo local

Requiere Node >=20 para las pruebas; la aplicación no necesita dependencias ni compilación.

```sh
npm test
npm run check
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Abrir http://127.0.0.1:8080. Este servidor es solo local y no incorpora autenticación. No exponerlo a la red. No abrir index.html directamente como archivo: los módulos y JSON requieren HTTP.

## Estructura

- `dist/app.js`, `style.css`, `index.html`: interfaz.
- `dist/engine.js`: motor puro, sin valores de dosis de reserva.
- `dist/inventory.json`: 86 entradas originales.
- `dist/presentations.json`: 129 variantes o identificaciones pendientes; conserva estado del inventario por separado de la validación de reglas.
- `dist/rules.json`: reglas por presentación. Solo `status:verified` + `enabled:true` pueden calcular.
- `dist/paths.json`: seis rutas clínicas y referencias.
- `dist/source-audit.json`: auditoría de documentación y estado de implementación.
- `dist/validation-report.md`: relación completa de habilitados y pendientes.
- `dist/test-results.txt`, `tests/engine.test.mjs`: pruebas.
- `docs/`: documentos oficiales consultados, extractos y trazabilidad.

## Seguridad y ámbito

13 presentaciones habilitadas en reglas acotadas; el resto no calcula. Campos no valorados bloquean. Contraindicaciones no pueden eludirse con una casilla. Las precauciones visibles exigen revisión y confirmación. Condiciones positivas no automatizadas quedan en revisión manual. Los resultados se invalidan al cambiar cualquier dato de paciente/pauta.

La regla Metrobactin usa 25 mg/kg por administración, dos administraciones diarias; no confundir con 50 mg/kg/día. Tablas oficiales prevalecen sobre cantidad teórica. No se suman componentes ni se intercambian sal y base. Synulox tiene una regla líquida conservadora en el tramo documentado hasta 4 kg, sin redondeo; Doxybactin muestra total diario por indicación.

## Repositorio privado

Este árbol tiene código sin secretos, package.json, pruebas con Node nativo y flujo CI. Repositorio: https://github.com/LuisAngelLopezRomero/principe-pio-veterinaria (privado). No habilitar GitHub Pages: un repositorio privado no garantiza un sitio web privado. La configuración específica del alojamiento Sites no se incluye en esta copia para GitHub. Para otro alojamiento debe diseñarse y verificarse una capa de autenticación de servidor antes de publicar.

El código se conserva también en el alojamiento privado de Sites. Las copias PDF y sus extractos quedan fuera de esta subida. Se conservan las referencias oficiales y los informes de revisión. Una revisión automática bloqueó un PDF por contener un enlace privado de SharePoint; no se incluye ese documento.

## Próximos pasos delimitados

Confirmar envases/fotografías pendientes; ampliar cobertura de Doxybactin y líquidos; validar el resto de presentaciones y fuentes europeas inaccesibles; revisar clínicamente la versión; probar Safari en iPhone físico. No habilitar por compartir marca o principio activo.

## Resultado de verificación

389 pruebas automatizadas aprobadas (motor y manejadores de interfaz en memoria). Sintaxis JS comprobada. Despliegue privado y acceso exclusivo de propietario confirmados. La comprobación visual interior y Safari iPhone están pendientes porque la sesión del navegador requiere inicio de sesión; no se ha eludido esa barrera.

## Revisión de calculadora v0.7

Búsqueda por producto con resultados pulsables, tarjetas de concentración ordenadas por cobertura documental, especie mediante botones explícitos y edad visible. Se registran input y change; al calcular se releen los controles reales para evitar valores obsoletos. Una especie vacía se clasifica como dato pendiente, no como especie no autorizada. Las pruebas incluyen perro de ocho años con Clavaseptin, cambio a gato, cambio de concentración, búsqueda por fragmento y registros change sin input. Las ampliaciones de pautas y tablas de esta versión están documentadas en dist/validation-report.md.

## Persistencia v0.7

Se guarda únicamente el borrador local del cálculo: no se recogen nombres ni identificadores del paciente. Los resultados se vuelven a calcular con las reglas cargadas, no se restaura HTML antiguo. Un cambio de reglas conserva los datos pero invalida resultados y confirmaciones. El almacenamiento puede no mantenerse entre navegadores internos y Safari: cada origen/contexto tiene su propio espacio.
