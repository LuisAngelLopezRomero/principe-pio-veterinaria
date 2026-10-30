import {saveDraft,readDraft} from './draft.js?v=0.7.0';
import {searchProducts,presentationCoverage,compatibleRules,productRules,comparePresentations} from './calculator-model.js?v=0.7.0';
import {calculate,conditionLabels,normalize} from './engine.js?v=0.7.0';
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let catalog,presentations,rules,paths,audit,regimens;
try{[catalog,presentations,rules,paths,audit,regimens]=await Promise.all(['inventory','presentations','rules','paths','source-audit','reviewed-regimens'].map(async f=>{const r=await fetch(`${f}.json`);if(!r.ok)throw Error(f);return r.json();}));}catch(e){$('#app').innerHTML='<main class="main"><h1>No se pudo cargar el catálogo</h1><p>Recarga la página. No hay cálculos disponibles sin datos completos.</p></main>';throw e;}
let favorites=[];try{favorites=JSON.parse(localStorage.getItem('pp-favorites-v2')||'[]');if(!Array.isArray(favorites))favorites=[];}catch{}
const navs=['Inicio','Especialidades','Vademécum','Calculadora','Favoritos','Fuentes'];
const state={page:'Inicio',query:'',group:'',status:'',detail:null,selected:'',rule:'',brand:'',brandIndication:'',calcQuery:'',didCalculate:false,patient:{species:'',weight:'',age:'',ageUnit:'years',conditions:{},conditionsReviewed:false,packageConfirmed:false,precautionsAccepted:false,indication:''}};
const rulesSignature=JSON.stringify(rules);
let shownSafetySignature='';
const safetySignature=()=>JSON.stringify([state.brand,state.brandIndication,state.rule,{...state.patient,precautionsAccepted:false}]);
let draftRestored=false,saveFailed=false;
try{const saved=readDraft(localStorage,rulesSignature);if(saved){Object.assign(state,saved);draftRestored=true;}}catch{}
function persistDraft(){try{saveFailed=!saveDraft(localStorage,state,rulesSignature);}catch{saveFailed=true;}const node=$('#draft-status');if(node)node.textContent=saveFailed?'No se puede guardar en este navegador.':'Borrador guardado en este dispositivo durante 12 horas.';}
const valid=()=>presentations.filter(p=>rules.some(r=>r.presentationId===p.id&&r.enabled&&r.status==='verified'));
const ruleFor=id=>rules.filter(r=>r.presentationId===id);
const regimenFor=p=>regimens.find(r=>r.productId===p.productId&&(r.presentationIds.includes(p.id)||!r.presentationIds.length));
const badge=p=>ruleFor(p.id).some(r=>r.enabled&&r.status==='verified')?'<span class="tag verified">Regla documental verificada</span>':regimenFor(p)?'<span class="tag">Pauta consultable · cálculo pendiente</span>':'<span class="tag pending">Pendiente · cálculo bloqueado</span>';
const list=a=>`<ul class="list">${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const source=s=>`<p class="source"><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title||'Ficha técnica oficial')}</a><br>${esc(s.section||'')} · revisión ${esc(s.revision||s.year||'consultar documento')} · consulta ${esc(s.checkedAt||'2026-10-30')}</p>`;
function shell(){ $('#app').innerHTML=`<div class="shell"><aside class="sidebar"><div class="seal" aria-hidden="true">✚</div><div class="brand">Príncipe<br>Pío</div><div class="eyebrow">Consulta veterinaria</div><nav aria-label="Principal">${navs.map((n,i)=>`<button class="nav ${n===state.page?'active':''}" data-page="${n}"><span aria-hidden="true">${['⌂','⊞','≡','＋','☆','↗'][i]}</span> &nbsp;${n}</button>`).join('')}</nav><footer>Versión 0.7 · Evaluación clínica<br>Acceso privado · Sin historias clínicas<br><a href="/signout-with-chatgpt" target="_top">Cerrar sesión</a></footer></aside><main class="main"><header class="top"><span>CLÍNICA VETERINARIA &nbsp; / &nbsp; ${esc(state.page)}</span><span class="pill">Versión previa · 30 oct 2026</span></header><div id="content"></div></main></div>`;renderContent();}
function heading(title,sub){return `<div class="pagehead"><div class="eyebrow">Príncipe Pío / ${esc(state.page)}</div><h1>${title}</h1><p class="muted">${sub}</p></div>`;}
function card(p){return `<article class="card"><div class="row"><div><span class="eyebrow muted">${esc(p.group)}</span><h3><button data-detail="${p.id}">${esc(p.name)}</button></h3></div><button class="favorite" data-fav="${p.id}" aria-label="${favorites.includes(p.id)?'Quitar de':'Añadir a'} favoritos" aria-pressed="${favorites.includes(p.id)}">${favorites.includes(p.id)?'★':'☆'}</button></div><p>${esc(p.label)}<br><span class="small muted">${esc(p.active)}</span></p>${badge(p)}<div class="actions"><button data-detail="${p.id}">Ver ficha</button><button data-calc="${p.id}">Calculadora →</button></div></article>`;}
function home(){return heading('¡Porque sí que puedes sobrevivir!','Tu inventario, las fuentes y el paciente en un mismo lugar.')+`<section class="hero"><div><div class="eyebrow">Una decisión informada</div><h2>Del medicamento<br>al paciente concreto.</h2><p>Busca una presentación, revisa sus límites y consulta una pauta trazable. La información pendiente siempre permanece visible.</p><div class="actions"><button class="primary" data-page="Vademécum">Consultar vademécum →</button><button data-page="Calculadora">Calcular dosis</button></div></div><div class="hero-art" aria-hidden="true">Rx<small>CIENCIA · CUIDADO · CRITERIO</small></div></section><div class="stats"><div class="stat"><strong>${catalog.length}</strong>entradas del inventario</div><div class="stat"><strong>${valid().length}</strong>presentaciones con cálculo</div><div class="stat"><strong>${paths.length}</strong>rutas clínicas</div></div><div class="notice"><b>Versión en evaluación.</b> ${presentations.length} registros de variantes, incluidas identificaciones pendientes. Las reglas verificadas no confirman el stock ni sustituyen la valoración veterinaria. Sin datos clínicos suficientes, no se calcula.</div><div class="row spacer"><h2>Consulta por especialidad</h2><button data-page="Especialidades">Ver rutas →</button></div><div class="grid">${paths.slice(0,4).map(pathCard).join('')}</div>`;}
function pathCard(p){return `<article class="card"><span class="eyebrow muted">${esc(p.group)} · ${p.species.join(' / ')}</span><h3>${esc(p.name)}</h3><p class="muted">${esc(p.summary)}</p><button data-path="${p.id}">Abrir ruta →</button></article>`;}
function catalogView(){let ps=presentations.filter(p=>(state.page!=='Favoritos'||favorites.includes(p.id))&&normalize(p.name+' '+p.active+' '+p.label).includes(normalize(state.query))&&(!state.group||p.group===state.group)&&(!state.status||(state.status==='verified')===ruleFor(p.id).some(r=>r.enabled&&r.status==='verified')));return heading(state.page==='Favoritos'?'Tus referencias frecuentes.':'Vademécum de la clínica.','Cada concentración y forma se consulta por separado. Los favoritos se guardan solo en este navegador.')+`<div class="tools"><input id="search" aria-label="Buscar marca o principio activo" placeholder="Buscar marca, principio activo o concentración…" value="${esc(state.query)}"><select id="group" aria-label="Especialidad"><option value="">Todas las especialidades</option>${[...new Set(catalog.map(p=>p.group))].map(g=>`<option ${state.group===g?'selected':''}>${esc(g)}</option>`).join('')}</select><select id="status" aria-label="Estado"><option value="">Todos los estados</option><option value="verified" ${state.status==='verified'?'selected':''}>Con regla verificada</option><option value="pending" ${state.status==='pending'?'selected':''}>Pendientes</option></select></div><p class="small muted" aria-live="polite">${ps.length} registros · existencia actual sin comprobar</p><div class="grid">${ps.length?ps.map(card).join(''):'<p class="empty">No hay resultados. Prueba otra búsqueda.</p>'}</div>`;}
function regimenView(p){
 const r=regimenFor(p);if(!r)return '';
 return `<section class="regimen-reference"><h3>Pauta del documento revisado</h3><p><b>Solo para:</b> ${r.presentationLabels.map(esc).join(' · ')}</p>${!r.presentationIds.length?'<div class="notice">La variante del inventario aún no está identificada. Esta referencia no confirma que coincida con tu envase.</div>':''}<p>${esc(r.doseSummary)}</p><p><b>Frecuencia:</b> ${esc(r.frequency)}<br><b>Duración:</b> ${esc(r.duration)}</p><h3>Contraindicaciones y límites</h3>${list(r.contraindications)}<h3>Precauciones y alcance</h3>${list(r.limitations)}${source({url:r.sourceUrl,revision:r.revision,checkedAt:r.checkedAt,section:'Pauta documental de consulta; comprobar RCM completo'})}<p class="small">No es un resultado calculado para este paciente.</p></section>`;
}
function detail(id){const p=presentations.find(p=>p.id===id),rs=ruleFor(id);return heading(esc(p.name),esc(p.label))+`<button data-back>← Volver</button><div class="card spacer">${badge(p)}<h2>${esc(p.active)}</h2><p>Clasificación provisional: ${esc(p.type)} · ${esc(p.group)}</p><p><b>Identificación del envase:</b> pendiente de cotejo físico. Origen: PDF maestro, página ${p.sourcePage}. No implica disponibilidad actual.</p>${rs.length?rs.map(r=>`<hr class="divider"><h3>${esc(r.indication)}</h3>${!r.enabled?`<div class="notice">Cálculo deshabilitado: ${esc(r.pendingReason)}</div>`:''}<p>${esc(r.species.join(' / '))} · ${esc(r.route)}</p><p><b>Referencia de dosis:</b> ${r.components.filter(c=>c.doseMgKg!=null).map(c=>`${format(c.doseMgKg)} mg/kg de ${esc(c.name)}`).join(' + ')||'Consultar tabla oficial de esta pauta'} · ${esc(r.resultBasis||'por administración')}${r.table?'; prevalece la tabla oficial':''}</p><p><b>Frecuencia:</b> ${esc(r.frequency)}<br><b>Duración / revisión:</b> ${esc(r.duration)}</p>${list((r.restrictions||[]).map(x=>`${x.kind==='contraindication'?'Contraindicación':x.kind==='precaution'?'Precaución':'Revisión'}: ${x.text} [${x.section||''}]`))}${source(r.source)}${(r.table||r.tableRanges)?`<details><summary>Tabla oficial de esta presentación</summary><div class="tablewrap"><table><thead><tr><th>Peso (kg)</th><th>${esc(r.unit)} · ${esc(r.resultBasis||'por administración')}</th></tr></thead><tbody>${(r.table||r.tableRanges).map(t=>`<tr><td>${esc(t.label||`${t.minInclusive?'≥':'>'}${t.min} a ${t.maxInclusive?'≤':'<'}${t.max}`)}</td><td>${t.units??`${t.minUnits}–${t.maxUnits}`}</td></tr>`).join('')}</tbody></table></div><p class="small">Los huecos entre filas no se interpolan.</p></details>`:''}`).join(''):`${regimenFor(p)?regimenView(p):`<div class="notice">${esc(p.pendingReason)} No hay pauta validada en esta app para esta variante.</div>`}${p.sourceUrl?`<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener">Enlace de partida del inventario (no validado)</a>`:''}`}<div class="actions"><button class="primary" data-calc="${p.id}">Abrir calculadora →</button></div></div>`;}
function routeDetail(id){const p=paths.find(x=>x.id===id);return heading(esc(p.name),esc(p.group)+' · '+p.species.join(' / '))+`<button data-page="Especialidades">← Especialidades</button><div class="card spacer"><p>${esc(p.summary)}</p><h3>Antes de tratar</h3>${list(p.diagnostics)}<h3>Opciones y criterios</h3>${list(p.options)}<h3>Revisión</h3><p>${esc(p.review)}</p><div class="notice">${p.alerts.map(esc).join('<br>')}</div><h3>Referencias</h3>${p.sources.map(source).join('')}<p class="small">Guía clínica y ficha técnica son fuentes diferentes. Esta ruta no prescribe ni selecciona un fármaco automáticamente.</p><h3>Relacionado con el inventario</h3><p class="small muted">${esc(p.stockNote)}</p><div class="actions">${p.productIds.filter(id=>catalog.some(x=>x.id===id)).map(id=>`<button data-product="${id}">${esc(catalog.find(x=>x.id===id).name)}</button>`).join('')}</div></div>`;}
function patientSummary(){const p=state.patient;return `${p.species?esc(p.species==='perro'?'Perro':'Gato'):'Especie sin seleccionar'} · ${p.weight?esc(p.weight)+' kg':'Peso pendiente'} · ${p.age!==''?esc(p.age)+' '+esc({weeks:'semanas',months:'meses',years:'años'}[p.ageUnit]):'Edad pendiente'}`;}
function selectPresentation(id){
 state.selected=id;state.brand=presentations.find(p=>p.id===id)?.productId||'';
 const choices=compatibleRules(rules,id,state.patient.species);
 state.rule=choices.length===1?choices[0].id:'';
 state.patient.indication=choices.length===1?choices[0].indication:'';
 state.patient.packageConfirmed=false;invalidate();
}
function reconcileSpecies(){
 const indications=[...new Set(productRules(rules,presentations,state.brand,state.patient.species).map(r=>r.indication))];
 if(!indications.includes(state.brandIndication))state.brandIndication=indications.length===1?indications[0]:'';
 const choices=compatibleRules(rules,state.selected,state.patient.species);
 if(!choices.some(r=>r.id===state.rule)){
  state.rule=choices.length===1?choices[0].id:'';
  state.patient.indication=choices.length===1?choices[0].indication:'';
 }
 state.patient.packageConfirmed=false;
}
function productMatches(){
 const found=searchProducts(catalog,state.calcQuery).slice(0,12);
 if(state.brand)return '';
 if(!state.calcQuery.trim())return '<p class="small muted">Busca cualquier medicamento del inventario por su nombre o principio activo.</p>';
 return found.length?`<div class="search-matches">${found.map(p=>`<button type="button" data-brand="${p.id}"><strong>${esc(p.name)}</strong><span>${esc(p.active)}</span><small>${productRules(rules,presentations,p.id,'').length?'Ver pauta y calcular →':'Cálculo todavía no disponible · consultar'}</small></button>`).join('')}</div>`:'<p class="notice">No hay coincidencias. Prueba parte del nombre o el principio activo.</p>';
}
function presentationChoices(){
 if(!state.brand)return '';
 const product=catalog.find(p=>p.id===state.brand);
 const available=productRules(rules,presentations,state.brand,'');
 if(!available.length)return `<div class="notice"><b>${esc(product?.name)}: cálculo no disponible todavía.</b><p>${regimens.some(r=>r.productId===state.brand)?'Hay una pauta documental consultable; faltan controles para calcularla automáticamente.':'Aún no hay pauta revisada disponible en esta aplicación.'}</p><button data-detail="${presentations.find(p=>p.productId===state.brand)?.id}">Consultar pauta y límites</button></div>`;
 const variants=presentations.filter(p=>p.productId===state.brand&&available.some(r=>r.presentationId===p.id)).map(p=>({p,coverage:presentationCoverage(p,rules,state.patient)})).sort((a,b)=>a.coverage.rank-b.coverage.rank);
 return `<details><summary>Filtrar por envase (opcional)</summary><div class="presentation-choices">${variants.map(({p,coverage:c})=>`<button type="button" data-presentation="${p.id}" class="presentation-choice ${state.selected===p.id?'chosen':''}" aria-pressed="${state.selected===p.id}"><strong>${esc(p.label)}</strong><small>${esc(c.text)}</small>${state.selected===p.id?'<b>Seleccionada ✓</b>':''}</button>`).join('')}</div></details>`;
}
function indicationChoice(){
 const selected=presentations.find(p=>p.id===state.selected);
 if(!selected){
  if(!state.brand)return '';
  const options=[...new Set(productRules(rules,presentations,state.brand,state.patient.species).map(r=>r.indication))];
  if(!options.length)return '';
  return options.length===1?`<p class="indication-summary"><b>Para:</b> ${esc(options[0])}</p>`:`<label>Indicación<select id="brand-indication"><option value="">Elige la indicación</option>${options.map(x=>`<option value="${esc(x)}" ${state.brandIndication===x?'selected':''}>${esc(x)}</option>`).join('')}</select></label>`;
 }
 const choices=compatibleRules(rules,selected.id,state.patient.species),r=choices.find(r=>r.id===state.rule);
 const coverage=presentationCoverage(selected,rules,state.patient);
 return `<div class="selected-drug"><b>${esc(selected.name)} · ${esc(selected.label)}</b><p class="small">${esc(coverage.text)}</p></div>${choices.length?`${choices.length===1?`<h3>Indicación de la pauta</h3><p>${esc(choices[0].indication)}</p>`:`<label>Indicación<select id="rule"><option value="">Elige la indicación</option>${choices.map(x=>`<option value="${x.id}" ${state.rule===x.id?'selected':''}>${esc(x.indication)}</option>`).join('')}</select></label>`}${r?`<p class="small"><b>${esc(r.resultBasis||'Por administración')}</b> · ${esc(r.frequency)}<br>${esc(r.duration)}</p><details><summary>Fuente y pauta completa</summary>${source(r.source)}</details>`:''}<label class="check"><input type="checkbox" data-patient="packageConfirmed" ${state.patient.packageConfirmed?'checked':''}>Confirmo esta indicación y he comprobado marca, concentración, forma y vía en el envase.</label>`:`<div class="notice">${coverage.status==='species'?'Esta concentración no tiene una regla validada para la especie seleccionada. Revisa las otras presentaciones.':'Esta presentación está pendiente de validación; no se calcula.'}</div>`}`;
}
function refreshCalculatorParts(){
 if(state.page!=='Calculadora')return;
 if($('#calculate')){const blocked=!!state.brand&&!productRules(rules,presentations,state.brand,'').length;$('#calculate').disabled=blocked;$('#calculate').textContent=blocked?'Cálculo no disponible':'Revisar y calcular';}
 if($('#patient-summary'))$('#patient-summary').innerHTML=patientSummary();
 if($('#presentation-choices'))$('#presentation-choices').innerHTML=presentationChoices();
 if($('#indication-choice'))$('#indication-choice').innerHTML=indicationChoice();
 refreshSafety();
}
function healthChoice(){
 const p=state.patient,answer=p.healthAnswer||(p.conditionsReviewed?(Object.values(p.conditions).includes('yes')?'yes':'no'):'');
 return `<div class="health-question"><b>¿Tiene alguna condición o tratamiento?</b><div class="health-buttons" role="group" aria-label="Condiciones del paciente">${[['no','No'],['yes','Sí']].map(([v,t])=>`<button type="button" data-health="${v}" aria-pressed="${answer===v}" class="${answer===v?'chosen':''}">${t}</button>`).join('')}</div></div><p class="small muted">Enfermedad, alergia, gestación, lactancia, cachorro u otra medicación.</p>${answer==='yes'?`<p class="small">Marca todo lo presente. Al calcular confirmas que las no marcadas son No.</p><div class="clinical-checks">${Object.entries(conditionLabels).sort(([a],[b])=>{const order=['renal','hepatic','cardiac','pregnancy','lactation','allergy'];return (order.indexOf(a)<0?99:order.indexOf(a))-(order.indexOf(b)<0?99:order.indexOf(b));}).map(([k,label])=>`<label class="check"><input type="checkbox" data-condition="${k}" ${p.conditions[k]==='yes'?'checked':''}>${label}</label>`).join('')}</div>`:''}`;
}
function refreshSafety(){
 if(state.page!=='Calculadora'||state.detail||state.path)return;
 const candidates=state.selected?rules.filter(r=>r.id===state.rule):productRules(rules,presentations,state.brand,state.patient.species).filter(r=>r.indication===state.brandIndication);
 const messages=[...new Map(candidates.flatMap(r=>calculate(r,{...state.patient,packageConfirmed:true,indication:r.indication,precautionsAccepted:false}).messages).filter(m=>['contraindication','unauthorized','precaution','review'].includes(m.kind)).map(m=>[m.kind+'|'+m.text,m])).values()];
 const box=$('#safety-notices');if(box)box.innerHTML=messages.map(m=>`<div class="notice ${m.kind==='contraindication'?'danger':''}"><b>${esc({contraindication:'No usar',unauthorized:'Especie',precaution:'Precaución',review:'Requiere valoración'}[m.kind])}:</b> ${esc(m.text)}</div>`).join('');
 shownSafetySignature=messages.some(m=>m.kind==='precaution')?safetySignature():'';
 const button=$('#calculate');if(button&&!button.disabled)button.textContent=shownSafetySignature?'He revisado los avisos · calcular':'Calcular';
}
function calculator(){
 const p=state.patient;
 return `<div class="calc-heading"><h1>Calculadora</h1><span class="small muted">Paciente · pauta · resultado</span></div>`+`
 <p id="draft-status" class="small muted">${saveFailed?'No se puede guardar en este navegador.':draftRestored?'Borrador recuperado. Comprueba que sigues con el mismo paciente.':'Borrador guardado · 12 h en este dispositivo.'}</p><div class="calculator">
 <div class="calculator-form">
  <section class="card patient-panel" id="patient-panel">
   <div class="row"><h2>Paciente</h2><button id="reset" type="button">Borrar calculadora</button></div>
   <div class="species-picker" role="group" aria-label="Especie">
    <button type="button" data-species="perro" aria-pressed="${p.species==='perro'}" class="${p.species==='perro'?'chosen':''}">Perro</button>
    <button type="button" data-species="gato" aria-pressed="${p.species==='gato'}" class="${p.species==='gato'?'chosen':''}">Gato</button>
   </div>
   <div class="patient-inputs">
    <label>Peso actual · kg<input data-patient="weight" type="number" inputmode="decimal" min="0" step="any" value="${esc(p.weight)}" placeholder="Ej. 10"></label>
    <label>Edad<input data-patient="age" type="number" inputmode="decimal" min="0" step="any" value="${esc(p.age)}" placeholder="Ej. 8"></label>
    <label>Unidad de edad<select data-patient="ageUnit">${[['years','Años'],['months','Meses'],['weeks','Semanas']].map(([v,t])=>`<option value="${v}" ${p.ageUnit===v?'selected':''}>${t}</option>`).join('')}</select></label>
   </div>
   <p id="patient-summary" class="patient-summary" aria-live="polite">${patientSummary()}</p>
  </section>
  <section class="card drug-panel" id="drug-panel">
   <h2>Medicamento</h2>
   <label>Buscar medicamento<input id="calc-search" autocomplete="off" placeholder="Nombre del medicamento o principio activo" value="${esc(state.calcQuery)}" aria-controls="drug-matches"></label>
   <div id="drug-matches" aria-live="polite">${productMatches()}</div>
   <div id="presentation-choices" class="spacer">${presentationChoices()}</div>
   <div id="indication-choice" class="spacer">${indicationChoice()}</div>
  </section>
  <section class="card clinical-panel" id="clinical-panel">
   ${healthChoice()}<div id="safety-notices" aria-live="polite"></div>  <div class="calculate-action"><button class="primary" id="calculate" type="button" ${state.brand&&!productRules(rules,presentations,state.brand,'').length?'disabled':''}>${state.brand&&!productRules(rules,presentations,state.brand,'').length?'Cálculo no disponible':'Revisar y calcular'}</button></div>
  </section>
 </div>
 <section class="card sticky result-panel" id="result-panel">
  <h2>Dosis y posología</h2>
  <div id="result" aria-live="polite"><p class="empty">Introduce el paciente y selecciona un medicamento.</p></div>


 </section>
 </div>`;
}

function renderComparison(){
 const entries=comparePresentations(rules,presentations,state.brand,state.patient,state.brandIndication);
 if(!entries.length){$('#result').innerHTML='<div class="notice">No hay una pauta verificada para este medicamento, indicación y especie. No se calcula.</div>';return;}
 const messages=[...new Map(entries.flatMap(e=>e.result.messages).map(m=>[m.kind+'|'+m.text,m])).values()];
 const unknown=messages.filter(m=>m.kind==='missing'&&m.text.endsWith(': no valorado.'));
 const visible=messages.filter(m=>!unknown.includes(m));
 if(unknown.length)visible.unshift({kind:'missing',text:'Revisa las condiciones del paciente y confirma las casillas no marcadas.'});
 const calculated=entries.filter(e=>e.result.status==='calculated');
 const clinical=visible.filter(m=>!['contraindication','precaution','review','unauthorized'].includes(m.kind));
 $('#result').innerHTML=`<h3>${esc(catalog.find(p=>p.id===state.brand)?.name)} · presentaciones del inventario</h3><p class="small">${patientSummary()}</p>${clinical.map(m=>`<div class="notice ${m.kind==='contraindication'?'danger':''}"><b>${esc({missing:'Revisión pendiente',precaution:'Precaución',contraindication:'Contraindicado',review:'Valoración individual',unauthorized:'Sin regla para esta especie'}[m.kind]||'Aviso')}:</b> ${esc(m.text)} ${m.section?`[§ ${esc(m.section)}]`:''}</div>`).join('')}${calculated.length?`<p class="notice">Cantidades por presentación. Comprueba el envase antes de administrar; no equivalen a stock confirmado.</p>${calculated.map(({presentation:p,rule:r,result:v})=>`<article class="dose-option"><h3>${esc(p.name)} · ${esc(p.label)}</h3><div class="dose-columns"><div><span class="small muted">Miligramos · ${esc(v.resultBasis)}</span>${v.components.map(c=>`<p><b>${format(c.mg)} mg</b> ${esc(c.name)}</p>`).join('')}</div><div><span class="small muted">Cantidad · ${esc(v.resultBasis)}</span><p class="dose-amount">${format(v.units)} ${esc(v.unit)}</p></div></div><p class="small"><b>Posología:</b> ${esc(v.route)} · ${esc(v.frequency)}<br>${esc(v.duration)}</p>${v.row?`<p class="table-band"><b>Tabla del prospecto:</b> ${esc(v.row.label||`${v.row.min}–${v.row.max} kg`)} → ${format(v.units)} ${esc(v.unit)}${v.row.minUnits!=null?` (rango de fila: ${format(v.row.minUnits)}–${format(v.row.maxUnits)} ${esc(v.unit)})`:''}</p>`:'<p class="small muted">Cálculo por peso y fracción autorizada; sin tabla aplicada.</p>'}${v.measurementNote?`<p class="small">${esc(v.measurementNote)}</p>`:''}<details><summary>Fuente, referencia en mg/kg y envase</summary>${v.components.filter(c=>c.theoreticalMg!==null).map(c=>`<p class="small">Referencia teórica: ${format(c.theoreticalMg)} mg de ${esc(c.name)}. ${v.row?'Prevalece la tabla oficial.':''}</p>`).join('')}${source(v.source)}<button data-comparison-rule="${r.id}">Usar este envase</button></details></article>`).join('')}`:'<p>No hay dosis disponible hasta resolver las comprobaciones indicadas.</p>'}${entries.filter(e=>e.result.status!=='calculated').length&&calculated.length?`<p class="small muted">Otras ${entries.length-calculated.length} presentaciones no tienen una fila o fracción aplicable en este caso; no se redondean.</p>`:''}`;
}

function renderResult(){syncPatientFromForm();
 const basics=[];
 if(state.patient.healthAnswer==='yes'&&!Object.values(state.patient.conditions).includes('yes'))basics.push('Marca la condición o tratamiento presente, o elige No.');
 if(!state.patient.conditionsReviewed)basics.push('Indica Sí o No en condiciones y tratamientos.');
 if(!state.patient.species)basics.push('elige Perro o Gato.');
 if(!state.patient.weight||!Number.isFinite(Number(state.patient.weight))||Number(state.patient.weight)<=0)basics.push('introduce un peso mayor que cero.');
 if(state.patient.age===''||!Number.isFinite(Number(state.patient.age))||Number(state.patient.age)<0)basics.push('introduce la edad y su unidad.');
 if(!state.brand)basics.push('selecciona el medicamento.');
 else if(!state.selected&&!state.brandIndication)basics.push('elige una indicación con pauta verificada.');
 else if(state.selected&&!state.rule)basics.push('selecciona una indicación validada para esta presentación y especie.');
 if(basics.length){$('#result').innerHTML='<div class="notice"><b>Faltan datos para calcular</b>'+list(basics)+'</div>';return;}
 if(!state.selected){state.didCalculate=true;renderComparison();return;}
 state.didCalculate=true;const rule=rules.find(r=>r.id===state.rule),res=calculate(rule,state.patient);const unknown=res.messages.filter(m=>m.kind==='missing'&&m.text.endsWith(': no valorado.'));if(unknown.length){res.messages=res.messages.filter(m=>!unknown.includes(m));res.messages.unshift({kind:'missing',text:`quedan ${unknown.length} condiciones o tratamientos sin valorar. Revisa ese bloque antes de calcular.`});}$('#result').innerHTML=(res.messages||[]).map(m=>`<div class="notice ${m.kind==='contraindication'?'danger':''}"><b>${esc(({contraindication:'Contraindicado',precaution:'Precaución',missing:'Datos insuficientes',review:'Valoración individual',unauthorized:'Especie no autorizada',pending:'Pendiente'})[m.kind]||m.kind)}:</b> ${esc(m.text)} ${m.section?`<small>[§ ${esc(m.section)}]</small>`:''}</div>`).join('')+(res.status==='calculated'?`<div class="result"><span class="eyebrow">${esc(res.resultBasis)}</span><p><strong>${format(res.units)}</strong> ${esc(res.unit)}</p>${res.components.map(c=>`<p><b>${format(c.mg)} mg</b> de ${esc(c.name)}${c.theoreticalMg!==null?`<br><small>Referencia teórica: ${format(c.theoreticalMg)} mg${res.row?'; prevalece la tabla oficial.':'.'}</small>`:''}</p>`).join('')}<hr class="divider"><p>${esc(res.route)} · ${esc(res.frequency)}</p><p>${esc(res.duration)}</p>${res.row?`<p class="small">Fila oficial: ${esc(res.row.label||`${res.row.min}–${res.row.max} kg`)}. Sin redondear el peso.</p>`:''}${res.measurementNote?`<p class="small">${esc(res.measurementNote)}</p>`:''}<p class="small">Paciente: ${esc(state.patient.species)} · ${esc(state.patient.weight)} kg · ${esc(state.patient.age)} ${esc({weeks:'semanas',months:'meses',years:'años'}[state.patient.ageUnit])}</p>${source(res.source)}</div>`:'<p class="small"><b>No hay dosis administrable disponible.</b></p>');}
function format(n){return new Intl.NumberFormat('es-ES',{maximumFractionDigits:5}).format(n);}
function sources(){return heading('Fuentes y estado de revisión.','La trazabilidad distingue localizar un documento, revisarlo y habilitar una regla.')+`<div class="notice">${valid().length} presentaciones con alguna regla documental implementada. ${presentations.length-valid().length} registros sin cálculo. La verificación se limita a las indicaciones y reglas mostradas, no a todos los usos del producto.</div><div class="actions"><a href="reviewed-regimens.json" download>Pautas documentales revisadas</a><a href="consultoria.md" download>Informe de consultoría</a><a href="coverage.json" download>Cobertura por producto</a><a href="validation-report.md" download>Descargar estado de validación</a><a href="test-results.txt" download>Resultados de pruebas</a><a href="source-audit.json" download>Auditoría de fuentes (JSON)</a></div><h2 class="spacer">Reglas habilitadas</h2>${rules.filter(r=>r.enabled).map(r=>`<div class="card spacer"><h3>${esc(presentations.find(p=>p.id===r.presentationId)?.name)} · ${esc(presentations.find(p=>p.id===r.presentationId)?.label)}</h3><p>${esc(r.indication)}</p>${source(r.source)}</div>`).join('')}<h2 class="spacer">Revisión por medicamento</h2><p class="small">Una descarga correcta no equivale a validación clínica. Estado actualizado de documentación y cálculo. Una pauta consultable no habilita todas las presentaciones del producto.</p><div class="tablewrap"><table><thead><tr><th>Producto</th><th>Documento / acceso</th><th>Estado</th></tr></thead><tbody>${audit.map(a=>`<tr><td>${esc(a.product)}</td><td>${a.regulatoryUrl?`<a href="${esc(a.regulatoryUrl)}" target="_blank" rel="noopener">Fuente regulatoria</a>`:''}<br>${esc(a.accessResult)}</td><td>${esc(a.status)}<br>${esc(a.checkedDate)}<br><b>Reglas actuales: ${rules.filter(r=>r.enabled&&presentations.find(p=>p.id===r.presentationId)?.name===a.product).length}</b></td></tr>`).join('')}</tbody></table></div>`;}
function renderContent(){const c=$('#content');c.innerHTML=state.detail?detail(state.detail):state.path?routeDetail(state.path):state.page==='Inicio'?home():['Vademécum','Favoritos'].includes(state.page)?catalogView():state.page==='Calculadora'?calculator():state.page==='Especialidades'?heading('Una ruta para cada proceso.','Seis guías de apoyo; diagnóstico, opciones y motivos para reevaluar.')+`<div class="grid">${paths.map(pathCard).join('')}</div>`:sources();if(state.page==='Calculadora'&&!state.detail&&!state.path){refreshSafety();if(state.didCalculate)renderResult();}}
function go(page){state.page=page;state.detail=null;state.path=null;shell();window.scrollTo(0,0);}
function invalidate(){state.didCalculate=false;state.patient.precautionsAccepted=false;const box=$('#result');if(box)box.innerHTML='<p class="empty">Datos modificados. Vuelve a revisar y calcular.</p>';const checkbox=$('[data-patient="precautionsAccepted"]');if(checkbox)checkbox.checked=false;}
function syncPatientFromForm(){
 // Read actual controls at submission, including browsers that emit change without input.
 if(!document.querySelectorAll)return;
 const species=$('[data-species][aria-pressed="true"]');
 if(species)state.patient.species=species.dataset.species;
 for(const t of document.querySelectorAll('[data-patient]'))state.patient[t.dataset.patient]=t.type==='checkbox'?t.checked:t.value;
 for(const t of document.querySelectorAll('[data-condition]'))state.patient.conditions[t.dataset.condition]=t.type==='checkbox'?(t.checked?'yes':state.patient.conditionsReviewed?'no':''):t.value;
}
function chooseBrand(id){
 const product=catalog.find(p=>p.id===id);if(!product)return;
 state.brand=id;state.calcQuery=product.name;state.selected='';state.rule='';const indications=[...new Set(productRules(rules,presentations,id,state.patient.species).map(r=>r.indication))];state.brandIndication=indications.length===1?indications[0]:'';
 state.patient.indication='';state.patient.packageConfirmed=false;invalidate();renderContent();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.page)go(b.dataset.page);
 if(b.dataset.fav){const id=b.dataset.fav;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];try{localStorage.setItem('pp-favorites-v2',JSON.stringify(favorites));}catch{}renderContent();}
 if(b.dataset.detail){state.detail=b.dataset.detail;renderContent();window.scrollTo(0,0);}
 if(b.hasAttribute('data-back')){state.detail=null;renderContent();}
 if(b.dataset.calc){syncPatientFromForm();selectPresentation(b.dataset.calc);state.calcQuery=presentations.find(p=>p.id===b.dataset.calc)?.name||'';go('Calculadora');}
 if(b.dataset.path){state.path=b.dataset.path;renderContent();window.scrollTo(0,0);}
 if(b.dataset.product){state.query=catalog.find(p=>p.id===b.dataset.product).name;state.group='';state.status='';go('Vademécum');}
 if(b.dataset.species){syncPatientFromForm();state.patient.species=b.dataset.species;reconcileSpecies();invalidate();renderContent();}
 if(b.dataset.health){syncPatientFromForm();state.patient.healthAnswer=b.dataset.health;state.patient.conditionsReviewed=true;for(const k of Object.keys(conditionLabels))state.patient.conditions[k]=b.dataset.health==='no'?'no':state.patient.conditions[k]==='yes'?'yes':'no';invalidate();renderContent();}
 if(b.dataset.brand){syncPatientFromForm();chooseBrand(b.dataset.brand);}
 if(b.dataset.presentation){syncPatientFromForm();selectPresentation(b.dataset.presentation);renderContent();}
 if(b.dataset.comparisonRule){const r=rules.find(r=>r.id===b.dataset.comparisonRule);if(r){selectPresentation(r.presentationId);state.rule=r.id;state.patient.indication=r.indication;renderContent();}}
 if(b.id==='calculate'){syncPatientFromForm();if(shownSafetySignature&&shownSafetySignature===safetySignature())state.patient.precautionsAccepted=true;renderResult();$('#result-panel')?.scrollIntoView?.({behavior:'smooth',block:'start'});}
 if(b.id==='reset'){
  state.patient={species:'',weight:'',age:'',ageUnit:'years',conditions:{},conditionsReviewed:false,packageConfirmed:false,precautionsAccepted:false,indication:''};
  state.rule='';state.selected='';state.brand='';state.brandIndication='';state.calcQuery='';state.didCalculate=false;draftRestored=false;renderContent();
 }
 if(b.id==='review-healthy'){
  syncPatientFromForm();Object.keys(conditionLabels).forEach(k=>{if(!state.patient.conditions[k])state.patient.conditions[k]='no';});
  state.patient.precautionsAccepted=false;renderContent();
 }
 persistDraft();
});
function handlePatientControl(t){
 if(t.dataset?.patient){
  const key=t.dataset.patient;const value=t.type==='checkbox'?t.checked:t.value;
  const changed=state.patient[key]!==value;state.patient[key]=value;
  if(key==='conditionsReviewed'){for(const k of Object.keys(conditionLabels)){if(state.patient.conditions[k]!=='yes')state.patient.conditions[k]=value?'no':'';}}
  if(changed&&(key!=='precautionsAccepted'||!t.checked))invalidate();
  if(changed&&key==='species')reconcileSpecies();
  if(['species','weight','age','ageUnit'].includes(key))refreshCalculatorParts();
 }
 if(t.dataset?.condition){
  const val=t.type==='checkbox'?(t.checked?'yes':state.patient.conditionsReviewed?'no':''):t.value;
  if(state.patient.conditions[t.dataset.condition]!==val)invalidate();
  state.patient.conditions[t.dataset.condition]=val;
 }
}
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='search'){const pos=t.selectionStart;state.query=t.value;renderContent();$('#search').focus();$('#search').setSelectionRange(pos,pos);}
 if(t.id==='calc-search'){
  state.calcQuery=t.value;state.brand='';state.brandIndication='';state.selected='';state.rule='';state.patient.indication='';state.patient.packageConfirmed=false;
  invalidate();$('#drug-matches').innerHTML=productMatches();refreshCalculatorParts();
 }
 handlePatientControl(t);refreshSafety();persistDraft();
});
document.addEventListener('change',e=>{
 const t=e.target;handlePatientControl(t);
 if(t.id==='brand-indication'){state.brandIndication=t.value;invalidate();}
 if(t.id==='group'||t.id==='status'){state[t.id]=t.value;renderContent();}
 if(t.id==='presentation'){selectPresentation(t.value);renderContent();}
 if(t.id==='rule'){
  const candidate=compatibleRules(rules,state.selected,state.patient.species).find(r=>r.id===t.value);
  state.rule=candidate?.id||'';state.patient.indication=candidate?.indication||'';state.patient.packageConfirmed=false;invalidate();refreshCalculatorParts();
 }
 refreshSafety();persistDraft();
});
document.addEventListener('keydown',e=>{
 if(e.target.id!=='calc-search'||e.key!=='Enter')return;
 const matches=searchProducts(catalog,state.calcQuery);
 if(matches.length===1){e.preventDefault();chooseBrand(matches[0].id);persistDraft();}
});
window.addEventListener?.('pagehide',()=>{syncPatientFromForm();persistDraft();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){syncPatientFromForm();persistDraft();}});
shell();
