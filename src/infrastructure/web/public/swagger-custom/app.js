// =============================================================
//  ATENCIÓN: Toda la gestión de visibilidad y modo de batalla
//  debe hacerse ÚNICAMENTE a través de la función global:
//      window.updateBattleMode(modo)
//  No manipules directamente los controles ni el modo en otros
//  scripts. Si necesitas cambiar el modo, usa SIEMPRE esta función.
// =============================================================
// Custom TeamBattle Manager logic externalized

const apiBase = '/api/team-battles';
const apiHeroes = '/api/heroes';
const apiVillains = '/api/villains';
let battleId;
let battleData;
let battleMode = 'manual'; // Variable global para el modo de batalla
let heroesList = [];
let villainsList = [];

window.battleMode = battleMode;

// Función global para sincronizar el modo de batalla entre archivos
// USO: window.updateBattleMode('auto'|'manual', mostrarToast?)
function updateBattleMode(mode, showToast = false) {
  battleMode = mode;
  window.battleMode = mode; // Sincronizar variable global
  // Actualizar controles según el nuevo modo
  const roundSection = document.getElementById('round-section');
  const fightControls = document.getElementById('fight-controls');
  const modeIndicator = document.getElementById('mode-indicator');
  if (modeIndicator) {
    // Icono y color según modo
    let icon = battleMode === 'auto' ? '⚡' : '🕹️';
    let color = battleMode === 'auto' ? '#1e90ff' : '#2ecc40';
    let bg = battleMode === 'auto' ? '#eaf6ff' : '#eaffea';
    modeIndicator.textContent = `${icon} Modo de batalla: ${battleMode === 'auto' ? 'Automático' : 'Manual'}`;
    modeIndicator.className = battleMode === 'auto' ? 'mode-auto' : 'mode-manual';
    modeIndicator.style.background = bg;
    modeIndicator.style.color = color;
    modeIndicator.style.borderRadius = '6px';
    modeIndicator.style.padding = '6px 12px';
    modeIndicator.style.transition = 'background 0.3s, color 0.3s';
    // Animación breve al cambiar
    modeIndicator.style.boxShadow = '0 0 0 0 #fff';
    setTimeout(() => {
      modeIndicator.style.boxShadow = `0 0 8px 2px ${color}`;
      setTimeout(() => { modeIndicator.style.boxShadow = 'none'; }, 400);
    }, 10);
    // Toast visual solo si se solicita
    if (showToast) showModeToast(battleMode);
  }
  if (battleMode === 'manual') {
    if (fightControls) fightControls.classList.remove('hidden');
    if (roundSection) roundSection.classList.add('hidden');
  } else {
    if (fightControls) fightControls.classList.add('hidden');
    // Solo mostrar sección de ronda si la batalla está en progreso
    if (roundSection && battleData && battleData.status === 'in_progress') {
      roundSection.classList.remove('hidden');
    } else if (roundSection) {
      roundSection.classList.add('hidden');
    }
  }
}

// Toast visual para feedback de cambio de modo
function showModeToast(mode) {
  let toast = document.getElementById('mode-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'mode-toast';
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = 9999;
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '1.1em';
    toast.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
    document.body.appendChild(toast);
  }
  toast.textContent = mode === 'auto' ? '⚡ Modo Automático activado' : '🕹️ Modo Manual activado';
  toast.style.background = mode === 'auto' ? '#1e90ff' : '#2ecc40';
  toast.style.color = '#fff';
  toast.style.opacity = '0.95';
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s';
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; toast.style.transition = ''; }, 600);
  }, 1200);
}

// Hacer la función disponible globalmente (reforzado)
window.updateBattleMode = updateBattleMode;

async function fetchAndPopulateCharacters() {
  // Fetch heroes
  const hRes = await fetch(apiHeroes);
  heroesList = await hRes.json();
  const heroesSelect = document.getElementById('heroes-select');
  heroesSelect.innerHTML = '';
  heroesList.forEach(h => {
    const opt = document.createElement('option');
    opt.value = h.id;
    opt.textContent = `${h.alias || h.name} (${h.id})`;
    heroesSelect.appendChild(opt);
  });
  // Fetch villains
  const vRes = await fetch(apiVillains);
  villainsList = await vRes.json();
  const villainsSelect = document.getElementById('villains-select');
  villainsSelect.innerHTML = '';
  villainsList.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.alias || v.name} (${v.id})`;
    villainsSelect.appendChild(opt);
  });
}


async function createBattle() {
  try {
    const heroesSelect = document.getElementById('heroes-select');
    const villainsSelect = document.getElementById('villains-select');
    const heroes = Array.from(heroesSelect.selectedOptions).map(opt => opt.value);
    const villains = Array.from(villainsSelect.selectedOptions).map(opt => opt.value);
    const modeSelect = document.getElementById('battle-mode-select');
    const mode = modeSelect ? modeSelect.value : 'manual';
    if (heroes.length === 0 || villains.length === 0) {
      alert('Selecciona al menos un héroe y un villano.');
      return;
    }
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ heroIds: heroes, villainIds: villains, mode })
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || res.statusText);
    }
    const data = await res.json();
    battleData = data;
    battleId = battleData.id;
    battleMode = battleData.mode || 'manual'; // Almacenar el modo de la batalla creada
    window.battleMode = battleMode; // Sincronizar variable global
    showBattleResultsInPanel(battleData);
    showStatus();
    // Mostrar la sección de pelea y pasar el ID
    if (window.initFightGame) {
      window.initFightGame(battleId);
    }
    // El formulario de ronda solo se muestra desde showStatus() si corresponde
  } catch (err) {
    alert('Error starting battle: ' + err.message);
  }
}

async function showStatus() {
  // Always fetch fresh data (disable cache)
  const res = await fetch(`${apiBase}/${battleId}`, { cache: 'no-cache' });
  battleData = await res.json();
  battleMode = battleData.mode || 'manual'; // Actualizar el modo desde los datos frescos
  window.battleMode = battleMode; // Sincronizar variable global
  document.getElementById('battle-info').innerText = JSON.stringify(battleData, null, 2);
  showBattleResultsInPanel(battleData);
  document.getElementById('status-section').classList.remove('hidden');
  // Usar la función global para actualizar controles
  updateBattleMode(battleMode);
  // Mostrar formulario de ronda solo si el modo es automático y la batalla está en progreso
  if (battleMode === 'auto' && battleData.status === 'in_progress') {
    showRoundForm();
  } else if (battleMode === 'manual' && battleData.status === 'in_progress') {
    // Si es modo manual y la batalla está en progreso, asegurarse de mostrar la sección de pelea
    if (window.initFightGame) {
      window.initFightGame(battleId);
    }
  }
}

function showRoundForm() {
  // Solo mostrar el formulario si el modo es automático
  if (battleMode !== 'auto') return;
  // Map heroIds and villainIds to character objects, distinguiendo por tipo
  const heroes = battleData.heroIds
    .map(id => battleData.characters.find(c => c.id === id && c.type === 'hero'))
    .filter(c => c);
  const villains = battleData.villainIds
    .map(id => battleData.characters.find(c => c.id === id && c.type === 'villain'))
    .filter(c => c);
  const container = document.getElementById('actions-form');
  container.innerHTML = '';
  // Para cada héroe, select de acción y select de target (villano)
  heroes.forEach(h => {
    let targetOptions = '';
    if (villains.length > 0) {
      targetOptions = villains.map(v => `<option value="${v.id}">${v.alias || v.name} (${v.id})</option>`).join('');
      container.innerHTML += `<div>Héroe <strong>${h.alias || h.name}</strong> (${h.id}): 
        <select data-id="${h.id}" data-type="hero"><option value="normal">Normal</option><option value="special">Special</option></select>
        &rarr; <label>Objetivo: <select data-target for="${h.id}">${targetOptions}</select></label>
      </div>`;
    } else {
      container.innerHTML += `<div>Héroe <strong>${h.alias || h.name}</strong> (${h.id}): 
        <select data-id="${h.id}" data-type="hero" disabled><option>No hay villanos disponibles</option></select>
      </div>`;
    }
  });
  // Para cada villano, select de acción y select de target (héroe)
  villains.forEach(v => {
    let targetOptions = '';
    if (heroes.length > 0) {
      targetOptions = heroes.map(h => `<option value="${h.id}">${h.alias || h.name} (${h.id})</option>`).join('');
      container.innerHTML += `<div>Villano <strong>${v.alias || v.name}</strong> (${v.id}): 
        <select data-id="${v.id}" data-type="villain"><option value="normal">Normal</option><option value="special">Special</option></select>
        &rarr; <label>Objetivo: <select data-target for="${v.id}">${targetOptions}</select></label>
      </div>`;
    } else {
      container.innerHTML += `<div>Villano <strong>${v.alias || v.name}</strong> (${v.id}): 
        <select data-id="${v.id}" data-type="villain" disabled><option>No hay héroes disponibles</option></select>
      </div>`;
    }
  });
  document.getElementById('round-section').classList.remove('hidden');
}

async function executeRound() {
  const selects = document.querySelectorAll('#actions-form select[data-id]');
  const heroActions = [];
  const villainActions = [];
  selects.forEach(sel => {
    const id = sel.dataset.id;
    const action = sel.value;
    const targetSel = sel.parentElement.querySelector('select[data-target]');
    const target = targetSel ? targetSel.value : null;
    if (sel.dataset.type === 'hero') {
      heroActions.push({ id, action, target });
    } else if (sel.dataset.type === 'villain') {
      villainActions.push({ id, action, target });
    }
  });
  // Send actions to server in expected format
  const roundRes = await fetch(`${apiBase}/${battleId}/rounds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ heroActions, villainActions })
  });
  if (!roundRes.ok) {
    const errorText = await roundRes.text();
    alert('Error al ejecutar ronda: ' + (errorText || roundRes.statusText));
    return;
  }
  const updatedData = await roundRes.json();
  battleData = updatedData;
  // Refrescar estado y panel de resultados
  showBattleResultsInPanel(battleData);
  await showStatus();
}

function showHistory() {
  const info = document.getElementById('results-info');
  info.innerText = JSON.stringify(battleData.rounds, null, 2);
  document.getElementById('results-section').classList.remove('hidden');
}

// Hook para mostrar resultados en el panel visual configurable
function showBattleResultsInPanel(resultJson) {
  if (typeof updateBattleResults === 'function') {
    updateBattleResults(resultJson);
    // Mostrar la sección de resultados si está oculta
    var resultsSection = document.getElementById('results-section');
    if (resultsSection) resultsSection.classList.remove('hidden');
  }
}

// Ejemplo de integración: cuando recibas el resultado de la batalla, llama a esta función
// showBattleResultsInPanel(resultadoJson);


document.getElementById('create-btn').addEventListener('click', createBattle);
document.getElementById('round-btn').addEventListener('click', executeRound);

// Al cargar la página, poblar selects de héroes y villanos y mostrar el modo actual
window.addEventListener('DOMContentLoaded', () => {
  fetchAndPopulateCharacters();
  // Crear indicador visual del modo si no existe
  if (!document.getElementById('mode-indicator')) {
    const indicator = document.createElement('div');
    indicator.id = 'mode-indicator';
    indicator.style.margin = '10px 0';
    indicator.style.fontWeight = 'bold';
    document.body.insertBefore(indicator, document.body.firstChild);
  }
  updateBattleMode(battleMode, false);
  // Listener para cambio de modo desde el selector
  const modeSelect = document.getElementById('battle-mode-select');
  if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
      const newMode = e.target.value;
      updateBattleMode(newMode, true);
    });
  }
});

// Swagger UI
SwaggerUIBundle({
  url: '/api/docs/swagger.json',
  dom_id: '#swagger-ui',
  presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
  layout: 'StandaloneLayout'
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use('/api/team-battles-manager', express.static(path.join(__dirname, 'public/swagger-custom')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api/team-battles-manager`);
});
