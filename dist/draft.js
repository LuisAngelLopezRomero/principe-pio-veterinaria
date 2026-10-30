export const DRAFT_KEY='pp-calculator-draft-v1';
export const DRAFT_TTL=12*60*60*1000;
const pickState=s=>({page:s.page,brand:s.brand,brandIndication:s.brandIndication||'',calcQuery:s.calcQuery,selected:s.selected,rule:s.rule,didCalculate:!!s.didCalculate,patient:s.patient});
export function saveDraft(storage,state,signature,now=Date.now()){
 try{
  if(!state.brand&&!state.calcQuery&&!state.patient.species&&state.patient.weight===''&&state.patient.age===''){storage.removeItem(DRAFT_KEY);return true;}
  storage.setItem(DRAFT_KEY,JSON.stringify({schema:1,savedAt:now,signature,state:pickState(state)}));return true;
 }catch{return false;}
}
export function readDraft(storage,signature,now=Date.now()){
 try{
  const raw=storage.getItem(DRAFT_KEY);if(!raw)return null;
  const d=JSON.parse(raw);
  if(d.schema!==1||!Number.isFinite(d.savedAt)||now-d.savedAt>DRAFT_TTL||d.savedAt>now+60000||!d.state?.patient){storage.removeItem(DRAFT_KEY);return null;}
  const s=d.state,p=s.patient;
  if(!['','perro','gato'].includes(p.species)||!['weeks','months','years'].includes(p.ageUnit)||!p.conditions||typeof p.conditions!=='object')return null;
  const result={page:s.page==='Calculadora'?'Calculadora':'Inicio',brand:typeof s.brand==='string'?s.brand:'',brandIndication:typeof s.brandIndication==='string'?s.brandIndication:'',calcQuery:typeof s.calcQuery==='string'?s.calcQuery:'',selected:typeof s.selected==='string'?s.selected:'',rule:typeof s.rule==='string'?s.rule:'',didCalculate:!!s.didCalculate,patient:{healthAnswer:['yes','no'].includes(p.healthAnswer)?p.healthAnswer:'',species:p.species,weight:String(p.weight??''),age:String(p.age??''),ageUnit:p.ageUnit,conditions:Object.fromEntries(Object.entries(p.conditions).filter(([k,v])=>['yes','no',''].includes(v))),conditionsReviewed:p.conditionsReviewed===true,packageConfirmed:p.packageConfirmed===true,precautionsAccepted:p.precautionsAccepted===true,indication:typeof p.indication==='string'?p.indication:''}};
  if(d.signature!==signature){result.didCalculate=false;result.patient.packageConfirmed=false;result.patient.precautionsAccepted=false;}
  return result;
 }catch{return null;}
}
