// Pure engine. Clinical data must be explicitly reviewed; no fallback doses.
export const conditionLabels={piperazine:'Piperazina',renalSevereOliguria:'Disfunción renal grave con anuria / oliguria',resistant:'Resistencia conocida o sospecha SARM / SPRM',bleeding:'Discrasia / trastorno hemorrágico / hemorragia digestiva',hypotension:'Hipotensión',previousAntiInflammatory:'Antiinflamatorio previo reciente',puppy:'Cachorro / animal en crecimiento',debilitated:'Caquexia / debilidad / infestación intensa',renal:'Enfermedad renal',hepatic:'Enfermedad hepática',cardiac:'Enfermedad cardíaca',pregnancy:'Gestación',lactation:'Lactancia',dehydration:'Deshidratación / hipovolemia',gi:'Enfermedad gastrointestinal / úlcera',diabetes:'Diabetes',epilepsy:'Epilepsia',allergy:'Hipersensibilidad al medicamento',nsaid:'Otro AINE',steroid:'Corticoide',diuretic:'Diurético',other:'Otros tratamientos concomitantes'};
export const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function ageDays(value,unit){if(value===''||value==null||!Number.isFinite(Number(value))||Number(value)<0)return null;const scale={weeks:7,months:30.4375,years:365.25}[unit];return scale?Number(value)*scale:null;}
export function weightInRow(weight,row){return (row.minInclusive?weight>=row.min:weight>row.min)&&(row.maxInclusive?weight<=row.max:weight<row.max);}
export function calculate(rule,p){
 const messages=[];const add=(kind,text,section='')=>messages.push({kind,text,section});
 if(!rule||rule.status!=='verified'||!rule.enabled||!rule.source?.url||!rule.source?.checkedAt)return {status:'pending',messages:[{kind:'pending',text:'Cálculo pendiente de validación documental y pruebas.'}]};
 const weight=Number(p.weight),age=ageDays(p.age,p.ageUnit);
 if(!p.species)add('missing','Selecciona perro o gato antes de calcular.');
 else if(!rule.species.includes(p.species))add('unauthorized','Esta presentación no tiene una regla autorizada para la especie seleccionada.','3.1');
 if(p.weight===''||!Number.isFinite(weight)||weight<=0)add('missing','Introduce un peso actual mayor que cero.');
 if(age===null)add('missing','Indica la edad y su unidad.');
 if(p.indication!==rule.indication)add('missing','Confirma la indicación de esta regla.');
 if(!p.packageConfirmed)add('missing','Confirma nombre, concentración y forma en el envase.');
 if(!p.conditionsReviewed)add('missing','Revisa todas las condiciones y tratamientos; desconocido no equivale a no.');
 const ageRange=age===null?null:p.ageUnit==='months'?[Number(p.age)*28,Number(p.age)*31]:p.ageUnit==='years'?[Number(p.age)*365,Number(p.age)*366]:[age,age];
 if(rule.minAgeDays!=null&&ageRange&&ageRange[0]<rule.minAgeDays&&ageRange[1]>=rule.minAgeDays)add('missing','La conversión aproximada de edad cruza el límite del prospecto. Introduce la edad exacta en semanas.');
 if(rule.minAgeDays!=null&&ageRange&&ageRange[1]<rule.minAgeDays)add(rule.ageKind||'contraindication',rule.ageText||'Edad fuera del límite de esta regla.',rule.ageSection||'3.5');
 if(rule.minWeight!=null&&weight<rule.minWeight)add('contraindication',`Peso inferior a ${rule.minWeight} kg.`,rule.weightSection||'3.5');
 for(const key of Object.keys(conditionLabels)){
  const val=p.conditions?.[key];
  if(!['yes','no'].includes(val)){add('missing',`${conditionLabels[key]}: no valorado.`);continue;}
  if(val==='yes'){
   const restrictions=(rule.restrictions||[]).filter(r=>r.condition===key);
   if(restrictions.length)restrictions.forEach(r=>add(r.kind,r.text,r.section));
   else add('review',`${conditionLabels[key]}: no hay una regla automatizada validada; requiere valoración individual. No equivale a contraindicación documentada.`);
  }
 }
 for(const r of rule.restrictions||[])if(r.condition==='always')add(r.kind,r.text,r.section);
 if(messages.some(m=>['missing','contraindication','unauthorized','review'].includes(m.kind)))return {status:'blocked',messages};
 if(messages.some(m=>m.kind==='precaution')&&!p.precautionsAccepted)return {status:'review',messages:[...messages,{kind:'missing',text:'La precaución requiere valoración veterinaria expresa antes de calcular.'}]};
 let units,row;
 if(rule.tableRanges&&rule.doseMlKg!=null){
 row=rule.tableRanges.find(r=>weightInRow(weight,r));units=weight*rule.doseMlKg;
 if(!row||units<row.minUnits-1e-10||units>row.maxUnits+1e-10)return {status:'blocked',messages:[...messages,{kind:'missing',text:'El peso o volumen calculado no encaja en los rangos oficiales implementados. No se redondea.'}]};
 if(!rule.unitStep||Math.abs(units/rule.unitStep-Math.round(units/rule.unitStep))>1e-8)return {status:'blocked',messages:[...messages,{kind:'missing',text:'El volumen teórico no coincide con la medida documentada del cuentagotas. No se redondea.'}]};
 }
 else if(rule.table){row=rule.table.find(r=>weightInRow(weight,r));if(!row)return {status:'blocked',messages:[...messages,{kind:'missing',text:'El peso no está cubierto por una fila oficial. No se redondea ni se interpola.'}]};units=row.units;}
 else if(rule.doseMgKg!=null&&rule.components?.length===1){units=weight*rule.doseMgKg/rule.components[0].mgPerUnit;if(rule.unit==='comprimidos'&&(!rule.divisor||Math.abs(units*rule.divisor-Math.round(units*rule.divisor))>1e-8))return {status:'blocked',messages:[...messages,{kind:'missing',text:'La cantidad teórica no corresponde a una fracción autorizada. No se redondea.'}]};}
 else return {status:'pending',messages:[{kind:'pending',text:'No hay una regla de administración completa.'}]};
 if(!Number.isFinite(units)||units<=0)return {status:'blocked',messages:[{kind:'missing',text:'Resultado no válido.'}]};
 return {status:'calculated',messages,resultBasis:rule.resultBasis||'por administración',units,unit:rule.unit,components:rule.components.map(c=>({name:c.name,mg:units*c.mgPerUnit,theoreticalMg:c.doseMgKg!=null?weight*c.doseMgKg:null})),row,frequency:rule.frequency,duration:rule.duration,route:rule.route,measurementNote:rule.unitStepNote||null,source:rule.source};
}
