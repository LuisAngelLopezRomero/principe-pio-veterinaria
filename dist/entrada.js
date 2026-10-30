const root = document.getElementById('app');
const sessionKey = 'principe-pio-entrada-v1';
async function openApp() {
  root.innerHTML = '<p>Cargando Príncipe Pío…</p>';
  try { await import('./app.js?v=0.7.0'); }
  catch { root.innerHTML = '<p>No se pudo cargar la aplicación. Recarga la página para volver a intentarlo.</p>'; }
}
let remembered = false;
try { remembered = sessionStorage.getItem(sessionKey) === 'ok'; } catch {}
if (remembered) openApp();
else {
  root.innerHTML = `<main class="entry"><form id="entry-form" class="entry-card">
    <p class="entry-eyebrow">CONSULTA VETERINARIA</p><h1>Príncipe Pío</h1>
    <p>Tu vademécum y calculadora de dosis.</p>
    <label for="entry-key">Clave de entrada</label>
    <input id="entry-key" type="password" autocomplete="off" required autofocus>
    <p id="entry-error" role="alert"></p><button type="submit">Entrar</button>
    <small>Acceso de cortesía. Esta web es pública; la clave no protege información privada.</small>
  </form></main>`;
  document.getElementById('entry-form').addEventListener('submit', event => {
    event.preventDefault();
    const field = document.getElementById('entry-key');
    if (field.value.trim() !== 'Sobreviviendo') {
      document.getElementById('entry-error').textContent = 'La clave no es correcta.';
      field.focus(); return;
    }
    try { sessionStorage.setItem(sessionKey, 'ok'); } catch {}
    openApp();
  });
}
