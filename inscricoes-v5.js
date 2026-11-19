const form = document.querySelector('#enrollment-form');
const button = document.querySelector('#submit-button');
const resultPanel = document.querySelector('#form-result');
const status = document.querySelector('#result-message');
const retry = document.querySelector('#retry-email');
const whatsapp = document.querySelector('#whatsapp');
const nameInput = document.querySelector('#nome');
let sending = false;
let answers = null;

nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
whatsapp.addEventListener('input', () => whatsapp.setCustomValidity(''));

async function sendAnswers() {
  if (sending || !answers) return;
  sending = true;
  button.disabled = true;
  retry.disabled = true;
  button.textContent = 'Preparando…';
  const lines = Object.entries(answers).filter(([key, value]) => !key.startsWith('_') && value).map(([key, value]) => `${key}: ${value}`);
  const message = 'Olá, Level Up! Quero me inscrever no curso de Roblox Studio.\n\n' + lines.join('\n');
  const link = document.querySelector('#whatsapp-link');
  link.href = 'https://wa.me/5584994212725?text=' + encodeURIComponent(message);
  status.textContent = 'Suas respostas estão prontas. Continue no WhatsApp para conversar com a Level Up.';
  status.classList.remove('form-error');
  form.hidden = true;
  resultPanel.hidden = false;
  retry.hidden = true;
  document.querySelector('.enrollment-form-wrap').scrollIntoView({ block: 'center' });
  link.focus({ preventScroll: true });
  try {
    const response = await fetch('https://formsubmit.co/ajax/goodvswins@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...answers, _subject: 'Pré-inscrição — Level Up', _template: 'table', Consentimento: 'Adulto ou responsável autorizou contato sobre o curso' }),
      signal: AbortSignal.timeout(15000)
    });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Envio não confirmado');
    status.textContent = 'Respostas encaminhadas ao serviço de e-mail. Continue no WhatsApp para conhecer as turmas e os próximos passos.';
  } catch {
    status.textContent = 'O envio por e-mail não foi confirmado. Você pode enviar suas respostas pelo WhatsApp ou tentar o e-mail novamente.';
    status.classList.add('form-error');
    retry.hidden = false;
  } finally {
    sending = false;
    button.disabled = false;
    retry.disabled = false;
    document.querySelector('#edit-answers').disabled = false;
    button.textContent = 'Preparar inscrição';
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (sending) return;
  nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Informe seu nome.');
  const digits = whatsapp.value.replace(/\D/g, '');
  whatsapp.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Informe um WhatsApp válido com DDD.');
  if (!form.reportValidity()) return;
  answers = Object.fromEntries(new FormData(form));
  if (answers._honey) return;
  answers['Nome para contato'] = nameInput.value.trim();
  document.querySelector('#edit-answers').disabled = true;
  sendAnswers();
});

retry.addEventListener('click', () => {
  document.querySelector('#edit-answers').disabled = true;
  sendAnswers();
});
document.querySelector('#edit-answers').addEventListener('click', () => {
  if (sending) return;
  resultPanel.hidden = true;
  form.hidden = false;
  nameInput.focus();
});
document.querySelector('#year').textContent = new Date().getFullYear();

const guide = document.querySelector('.floating-guide');
const guideMessage = document.querySelector('#guide-message');
const guideToggle = document.querySelector('#guide-toggle');
const guideText = document.querySelector('#guide-text');
let guideInteracted = false;
function setGuideOpen(open) {
  guideMessage.hidden = !open;
  guideToggle.setAttribute('aria-expanded', String(open));
}
if (typeof matchMedia !== 'undefined') {
  const mobileGuide = matchMedia('(max-width: 600px)');
  if (mobileGuide.matches) setGuideOpen(false);
  mobileGuide.addEventListener('change', event => {
    if (event.matches && !guideInteracted) setGuideOpen(false);
  });
}
document.querySelector('#dismiss-guide').addEventListener('click', () => {
  guideInteracted = true;
  setGuideOpen(false);
});
guideToggle.addEventListener('click', () => {
  guideInteracted = true;
  setGuideOpen(guideMessage.hidden);
});
form.addEventListener('focusin', () => guide.classList.add('form-focused'));
form.addEventListener('focusout', event => {
  if (!form.contains(event.relatedTarget)) guide.classList.remove('form-focused');
});
if (typeof IntersectionObserver !== 'undefined') {
  const messages = {
    inicio: 'Oi! Sou o Uppi. Vamos criar seu próximo jogo?',
    curso: 'Qual área combina com você? Tem um mascote para cada descoberta!',
    aplicativo: 'Seu laboratório vai com você no celular, tablet e computador.',
    inscricao: 'Vamos juntos! Preencha os dados ou converse com a Level Up pelo WhatsApp.'
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        guideText.textContent = messages[entry.target.id];
        if (entry.target.id !== 'inicio' && !guideInteracted) setGuideOpen(false);
      }
    }
  }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
  for (const id of Object.keys(messages)) observer.observe(document.querySelector('#' + id));
}
