const form=document.querySelector('#enrollment-form');
const one=document.querySelector('#step-one');
const two=document.querySelector('#step-two');
function showStep(step){const isFirst=step===1;one.hidden=!isFirst;one.disabled=!isFirst;two.hidden=isFirst;two.disabled=isFirst;document.querySelector('#step-count').textContent=isFirst?'01 / 02':'02 / 02';document.querySelector('#progress-fill').style.width=isFirst?'50%':'100%';(isFirst?document.querySelector('#responsavel'):document.querySelector('#roblox')).focus({preventScroll:true});}
document.querySelector('#next-step').addEventListener('click',()=>{if(form.reportValidity())showStep(2)});
document.querySelector('#back-step').addEventListener('click',()=>showStep(1));
let sending=false;
async function sendAnswers(){
 if(sending)return;
 sending=true; const button=document.querySelector('#submit-button');button.disabled=true;button.textContent='Enviando…';
 one.disabled=false;two.disabled=false;const data=Object.fromEntries(new FormData(form));one.disabled=true;
 if(data._honey){sending=false;button.disabled=false;button.textContent='Enviar e ir ao WhatsApp ↗';return;}
 const lines=Object.entries(data).filter(([k,v])=>!k.startsWith('_')&&v).map(([k,v])=>`${k}: ${v}`);
 const message='Olá, Project Level Up! Quero conhecer o curso de Roblox Studio.\n\n'+lines.join('\n');
 const link=document.querySelector('#whatsapp-link');link.href='https://wa.me/5584994212725?text='+encodeURIComponent(message);
 const status=document.querySelector('#result-message');const retry=document.querySelector('#retry-email');retry.disabled=true;
 try{
  const response=await fetch('https://formsubmit.co/ajax/goodvswins@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...data,_subject:'Novo interesse no curso — Project Level Up',_template:'table',Consentimento:'Adulto ou responsável autorizou contato sobre o curso'}),signal:AbortSignal.timeout(15000)});
  const result=await response.json();if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Envio não confirmado');
  status.textContent='Respostas encaminhadas ao serviço de e-mail. Agora, continue pelo WhatsApp para conversar com a Level Up.';status.classList.remove('form-error');retry.hidden=true;
 }catch(error){status.textContent='Não foi possível confirmar o envio por e-mail. Suas respostas estão prontas para enviar pelo WhatsApp. Você também pode tentar o e-mail novamente.';status.classList.add('form-error');retry.hidden=false;}
 form.hidden=true;document.querySelector('#form-result').hidden=false;document.querySelector('#step-count').textContent='PRÓXIMO PASSO';document.querySelector('#progress-fill').style.width='100%';sending=false;retry.disabled=false;button.disabled=false;link.focus({preventScroll:true});
}
form.addEventListener('submit',e=>{e.preventDefault();if(form.reportValidity())sendAnswers()});document.querySelector('#retry-email').addEventListener('click',sendAnswers);
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('waiting');observer.unobserve(e.target)}})},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('waiting');observer.observe(el)})}
document.querySelector('#year').textContent=new Date().getFullYear();
