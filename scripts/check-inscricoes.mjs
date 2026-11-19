import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../inscricoes-v4.js', import.meta.url), 'utf8');
function setup(mode) {
  const elements = new Map();
  const get = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      value: '', hidden: selector === '#form-result', disabled: false,
      listeners: {}, classList: { add() {}, remove() {} },
      attributes: {}, setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, callback) { this.listeners[name] = callback; },
      setCustomValidity(message) { this.error = message; },
      scrollIntoView() {}, focus() {},
      reportValidity() { return !get('#nome').error && !get('#whatsapp').error; }
    });
    return elements.get(selector);
  };
  get('#nome').value = ' Teste de interface ';
  get('#whatsapp').value = '(84) 99999-0000';
  const data = { 'Nome para contato': ' Teste de interface ', 'Idade do aluno': '18', WhatsApp: '(84) 99999-0000', Modalidade: 'Online', Interesse: '', _honey: '' };
  const requests = [];
  const context = vm.createContext({
    document: { querySelector: get }, Date, AbortSignal,
    FormData: class { *[Symbol.iterator]() { yield* Object.entries(data); } },
    fetch: async (url, request) => {
      requests.push({ url, ...request });
      if (mode === 'failure') throw new Error('Offline');
      return { ok: true, json: async () => ({ success: 'true' }) };
    }
  });
  vm.runInContext(source, context);
  const submit = () => get('#enrollment-form').listeners.submit({ preventDefault() {} });
  return { get, requests, data, submit };
}
const tick = () => new Promise(resolve => setImmediate(resolve));
for (const mode of ['success', 'failure']) {
  const test = setup(mode);
  test.submit(); test.submit();
  await tick();
  assert.equal(test.requests.length, 1, 'Envio duplicado deve ser bloqueado');
  const body = JSON.parse(test.requests[0].body);
  assert.equal(body['Nome para contato'], 'Teste de interface');
  assert.equal(body.Modalidade, 'Online');
  assert.match(test.get('#whatsapp-link').href, /^https:\/\/wa\.me\/5584994212725\?text=/);
  assert.equal(test.get('#form-result').hidden, false);
  assert.equal(test.get('#retry-email').hidden, mode === 'success');
  test.get('#edit-answers').listeners.click();
  assert.equal(test.get('#enrollment-form').hidden, false);
}
for (const invalid of ['name', 'phone', 'honeypot']) {
  const test = setup('success');
  if (invalid === 'name') test.get('#nome').value = '   ';
  if (invalid === 'phone') test.get('#whatsapp').value = '-----';
  if (invalid === 'honeypot') test.data._honey = 'bot';
  test.submit(); await tick();
  assert.equal(test.requests.length, 0, `Não enviar dados inválidos: ${invalid}`);
}
console.log('OK: sucesso, falha de e-mail, WhatsApp, retorno à edição, bloqueio de duplicatas e dados inválidos. Nenhuma requisição externa.');
const guideTest = setup('success');
guideTest.get('#dismiss-guide').listeners.click();
assert.equal(guideTest.get('#guide-message').hidden, true);
assert.equal(guideTest.get('#guide-toggle').attributes['aria-expanded'], 'false');
guideTest.get('#guide-toggle').listeners.click();
assert.equal(guideTest.get('#guide-message').hidden, false);
assert.equal(guideTest.get('#guide-toggle').attributes['aria-expanded'], 'true');
console.log('OK: guia Uppi recolhe e reabre com estado acessível.');
