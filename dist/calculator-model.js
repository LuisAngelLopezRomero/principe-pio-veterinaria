import {normalize,weightInRow,calculate} from './engine.js?v=0.7.0';
export const searchKey = value => normalize(value).replace(/[^a-z0-9]/g,'');
export function searchProducts(products, query) {
 let key=searchKey(query);
 const aliases={clave:'clavaseptin',claveseptim:'clavaseptin',claveseptin:'clavaseptin',clavaseptim:'clavaseptin'};key=aliases[key]||key;
 return products.filter(p=>!key||searchKey(p.name).includes(key)||searchKey(p.active).includes(key));
}
// Coverage is a document/weight match, never a clinical suitability decision.
export function presentationCoverage(presentation, rules, patient) {
 const all=rules.filter(r=>r.presentationId===presentation.id&&r.enabled&&r.status==='verified');
 if(!all.length)return {status:'pending',text:'Sin cálculo validado',rank:4};
 if(!patient.species)return {status:'missing',text:'Elige perro o gato para comprobar la especie',rank:2};
 const eligible=all.filter(r=>r.species.includes(patient.species));
 if(!eligible.length)return {status:'species',text:'Sin regla para '+patient.species,rank:3};
 const weight=Number(patient.weight);
 if(!Number.isFinite(weight)||weight<=0)return {status:'missing',text:'Introduce el peso para comprobar la tabla',rank:2};
 const covered=eligible.some(r=>{
  if(r.table)return r.table.some(row=>weightInRow(weight,row));
  if(r.tableRanges){const u=weight*r.doseMlKg;return r.tableRanges.some(row=>weightInRow(weight,row)&&u>=row.minUnits-1e-10&&u<=row.maxUnits+1e-10)&&r.unitStep&&Math.abs(u/r.unitStep-Math.round(u/r.unitStep))<1e-8;}
  if(r.components?.length===1&&r.doseMgKg){const u=weight*r.doseMgKg/r.components[0].mgPerUnit;return r.unit!=='comprimidos'||(r.divisor&&Math.abs(u*r.divisor-Math.round(u*r.divisor))<1e-8);}
  return false;
 });
 return covered?{status:'covered',text:'Tabla / fracción disponible para '+weight+' kg · revisar condiciones',rank:0}:{status:'weight',text:'Peso fuera de las filas o fracciones implementadas',rank:1};
}
export function compatibleRules(rules,presentationId,species){return rules.filter(r=>r.presentationId===presentationId&&r.enabled&&r.status==='verified'&&(!species||r.species.includes(species)));}

export function productRules(rules,presentations,brand,species){
 const ids=new Set(presentations.filter(p=>p.productId===brand).map(p=>p.id));
 return rules.filter(r=>ids.has(r.presentationId)&&r.enabled&&r.status==='verified'&&(!species||r.species.includes(species)));
}
export function comparePresentations(rules,presentations,brand,patient,indication){
 return productRules(rules,presentations,brand,patient.species).filter(r=>r.indication===indication).map(rule=>({rule,presentation:presentations.find(p=>p.id===rule.presentationId),result:calculate(rule,{...patient,indication,packageConfirmed:true})}));
}
