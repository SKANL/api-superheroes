// game-ui.js: Lógica para el juego de peleas
// Asume que ya existe una batalla creada y su ID está disponible (puedes adaptar para obtenerla dinámicamente)


let battleId = null;
let battleData = null;
let playerSide = 'hero'; // Por defecto héroe


// Inicializa la UI del juego de peleas con una batalla existente

// Permite a la UI saber el modo de batalla actual
let battleMode = 'manual';

window.initFightGame = function (id) {
  battleId = id;
  // Oculta sección de creación y muestra selector de bando
  document.getElementById('create-section').classList.add('hidden');
  document.getElementById('side-selection-section').classList.remove('hidden');
  renderSideSelector();
};
async function loadBattleState(selectedCharacters) {
  // Fetch current battle state
  const res = await fetch(`/api/team-battles/${battleId}`, { method: 'GET' });
  battleData = await res.json();

  battleMode = battleData.mode || 'manual';

  if (window.updateBattleMode) {
    window.updateBattleMode(battleMode);
  }

  renderArena();
  renderAttackButtons();
  renderAttackLog();
  updateControlsVisibility();
}
async function selectSide(side) {
  try {
    const res = await fetch('/api/team-battles/select-side', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ side })
    });
    if (!res.ok) throw new Error('Error al seleccionar bando');
    const data = await res.json();
    console.log(data.message); // Confirmación del bando seleccionado
  } catch (e) {
    alert(e.message);
  }
}
// Renderiza el selector de bando (héroe/villano) solo en modo manual
function renderSideSelector() {
  const sideSelector = document.getElementById('side-selector');
  sideSelector.innerHTML = `
    <label>
      <input type="radio" name="player-side" value="hero" ${playerSide === 'hero' ? 'checked' : ''}> Héroes
    </label>
    <label>
      <input type="radio" name="player-side" value="villain" ${playerSide === 'villain' ? 'checked' : ''}> Villanos
    </label>
  `;

  Array.from(sideSelector.querySelectorAll('input[name="player-side"]')).forEach(radio => {
    radio.addEventListener('change', async e => {
      playerSide = e.target.value;
      await selectSide(playerSide); // Comunicar selección al backend
      document.getElementById('character-selection-section').classList.remove('hidden');
      renderCharacterSelection();
    });
  });
}

function renderCharacterSelection() {
  const characterSelection = document.getElementById('character-selection');
  const characters = playerSide === 'hero' ? battleData.heroes : battleData.villains;

  characterSelection.innerHTML = characters.map(char => `
    <label>
      <input type="checkbox" name="character" value="${char.id}"> ${char.name}
    </label>
  `).join('');

  const startBattleBtn = document.createElement('button');
  startBattleBtn.textContent = 'Iniciar Batalla';
  startBattleBtn.disabled = true;

  characterSelection.addEventListener('change', () => {
    const selectedCharacters = Array.from(characterSelection.querySelectorAll('input[name="character"]:checked'));
    startBattleBtn.disabled = selectedCharacters.length === 0;
  });

  startBattleBtn.onclick = async () => {
    const selectedCharacters = Array.from(characterSelection.querySelectorAll('input[name="character"]:checked')).map(input => input.value);
    // Update battle with selected characters
    const payload = {
      heroIds: playerSide === 'hero' ? selectedCharacters : battleData.heroIds,
      villainIds: playerSide === 'villain' ? selectedCharacters : battleData.villainIds,
      mode: battleData.mode
    };
    const resp = await fetch(`/api/team-battles/${battleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    battleData = await resp.json();
    document.getElementById('character-selection-section').classList.add('hidden');
    document.getElementById('battle-section').classList.remove('hidden');
    renderArena();
    renderAttackButtons();
  };
  characterSelection.appendChild(startBattleBtn);
}

// Renderiza los botones de ataque reales según el bando elegido
function renderAttackButtons() {
  if (!battleData) return;
  if (battleMode !== 'manual') {
    heroesButtons.innerHTML = '';
    villainsButtons.innerHTML = '';
    return;
  }

  // Clear buttons
  heroesButtons.innerHTML = '';
  villainsButtons.innerHTML = '';

  // Display selected side
  const bandMsg = document.createElement('div');
  bandMsg.style.marginBottom = '0.5em';
  bandMsg.style.fontWeight = 'bold';
  bandMsg.textContent = `Tu bando: ${playerSide === 'hero' ? 'Héroes' : 'Villanos'}`;
  (playerSide === 'hero' ? heroesButtons : villainsButtons).appendChild(bandMsg);

  // Determine side and enemy
  const myIds = playerSide === 'hero' ? battleData.heroIds : battleData.villainIds;
  const myList = playerSide === 'hero' ? (battleData.heroes || []) : (battleData.villains || []);
  const enemyIds = playerSide === 'hero' ? battleData.villainIds : battleData.heroIds;
  const enemyList = playerSide === 'hero' ? (battleData.villains || []) : (battleData.heroes || []);
  const myButtons = playerSide === 'hero' ? heroesButtons : villainsButtons;

  // Filter alive characters
  const myAlive = myIds.filter(id => (battleData.charactersState?.[id]?.isAlive ?? true));
  const enemyAlive = enemyIds.filter(id => (battleData.charactersState?.[id]?.isAlive ?? true));

  // If no enemies are alive, show message
  if (enemyAlive.length === 0) {
    const msg = document.createElement('em');
    msg.textContent = 'No hay objetivos disponibles.';
    myButtons.appendChild(msg);
    return;
  }

  // Create attack button for each character
  myAlive.forEach(id => {
    const char = myList.find(c => c.id === id) || { id, name: id };
    const btn = document.createElement('button');
    btn.textContent = `Atacar con ${char.name}`;
    btn.onclick = async () => {
      btn.disabled = true;
      try {
        const targetId = enemyAlive[0]; // Attack the first alive enemy
        const res = await fetch(`/api/team-battles/${battleId}/attack`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attackerType: playerSide,
            attackerId: id,
            targetId,
            attackType: 'normal'
          })
        });
        const data = await res.json();
        battleData = data.battle;
        renderArena();
        renderAttackLog();
        renderResult();

        // Update enemyAlive list
        enemyAlive.splice(0, 1);
      } catch (e) {
        alert(e.message);
      } finally {
        btn.disabled = !((battleData.charactersState?.[id]?.isAlive ?? true));
      }
    };
    myButtons.appendChild(btn);
  });
}
function updateControlsVisibility() {
  const fightControls = document.getElementById('fight-controls');
  const roundSection = document.getElementById('round-section');

  if (battleMode === 'manual') {
    if (fightControls) fightControls.classList.remove('hidden');
    if (roundSection) {
      roundSection.classList.remove('hidden');
      renderRoundControls();
    }
  } else {
    if (fightControls) fightControls.classList.add('hidden');
    if (roundSection) roundSection.classList.add('hidden');
  }
}

function renderArena() {
  if (!battleData) return;
  // Renderiza paneles de héroes y villanos con HP
  const heroes = battleData.heroIds.map(id => getCharacterState(id, 'hero'));
  const villains = battleData.villainIds.map(id => getCharacterState(id, 'villain'));
  battleArena.innerHTML = `
    <div class="team-panel">
      <h3>Héroes</h3>
      ${heroes.map(renderCharacterCard).join('')}
    </div>
    <div class="vs-divider">VS</div>
    <div class="team-panel">
      <h3>Villanos</h3>
      ${villains.map(renderCharacterCard).join('')}
    </div>
  `;
}

function getCharacterState(id, type) {
  const state = (battleData.charactersState && battleData.charactersState[id]) || { hpCurrent: 100, isAlive: true };
  const name = (battleData[type + 'es'] || []).find(c => c.id === id)?.name || id;
  return { id, name, type, ...state };
}

function renderCharacterCard(c) {
  const hp = c.hpCurrent ?? 100;
  const max = c.hpMax ?? 100;
  const percent = Math.round((hp / max) * 100);
  let barClass = 'hp-high';
  if (percent < 35) barClass = 'hp-low';
  else if (percent < 70) barClass = 'hp-medium';
  return `<div class="character-card${c.isAlive ? '' : ' defeated'}">
    <div class="character-name">${c.name} <span style="font-size:0.8em;color:#888">(${c.id})</span></div>
    <div class="character-hp">
      <div class="hp-bar"><div class="hp-bar-fill ${barClass}" style="width:${percent}%;"></div></div>
      <span class="hp-text">${hp} / ${max} HP</span>
    </div>
    ${c.isAlive ? `<button class="attack-btn" data-id="${c.id}" data-type="${c.type}">Atacar</button>` : ''}
  </div>`;
}

attackBtn.addEventListener('click', async () => {
  const attackerType = attackerTypeSelect.value;
  const attackerId = attackerIdSelect.value;
  const targetId = targetIdSelect.value;
  const attackType = attackTypeSelect.value;
  attackBtn.disabled = true;
  try {
    const res = await fetch(`/api/team-battles/${battleId}/attack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attackerType, attackerId, targetId, attackType })
    });
    if (!res.ok) throw new Error('Error al atacar');
    const data = await res.json();
    battleData = data.battle;
    renderArena();
    renderAttackLog();
    renderResult();
  } catch (e) {
    alert(e.message);
  } finally {
    attackBtn.disabled = false;
  }
});

restartBtn.addEventListener('click', async () => {
  restartBtn.disabled = true;
  try {
    const res = await fetch(`/api/team-battles/${battleId}/restart`, { method: 'POST' });
    if (!res.ok) throw new Error('Error al reiniciar');
    battleData = await res.json();
    renderArena();
    renderAttackLog();
    renderResult();
  } catch (e) {
    alert(e.message);
  } finally {
    restartBtn.disabled = false;
  }
});

function renderAttackLog() {
  if (!battleData || !battleData.attackHistory) {
    attackLog.innerHTML = '<em>No hay ataques aún.</em>';
    return;
  }
  attackLog.innerHTML = battleData.attackHistory.map(entry => {
    const crit = entry.critical ? ' critical' : '';
    return `<div class="attack-entry${crit}">
      <strong>${entry.attackerId}</strong> → <strong>${entry.targetId}</strong>: <span>${entry.damage} daño</span> (HP objetivo: ${entry.targetHpAfter})
    </div>`;
  }).join('');
}

function renderRoundControls() {
  const roundSection = document.getElementById('round-section');
  roundSection.innerHTML = '';

  const roundMessage = document.createElement('div');
  roundMessage.textContent = `Ronda actual: ${battleData.currentRoundIndex + 1}`;
  roundSection.appendChild(roundMessage);

  const actionButtons = document.createElement('div');
  actionButtons.className = 'action-buttons';

  const attackButton = document.createElement('button');
  attackButton.textContent = 'Ataque Normal';
  attackButton.onclick = async () => {
    await performRoundAction('normal');
  };
  actionButtons.appendChild(attackButton);

  const specialButton = document.createElement('button');
  specialButton.textContent = 'Ataque Especial';
  specialButton.onclick = async () => {
    await performRoundAction('special');
  };
  actionButtons.appendChild(specialButton);

  roundSection.appendChild(actionButtons);
}

async function performRoundAction(actionType) {
  try {
    const res = await fetch(`/api/team-battles/${battleId}/rounds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        heroActions: playerSide === 'hero' ? [{ id: battleData.heroIds[0], action: actionType, target: battleData.villainIds[0] }] : [],
        villainActions: playerSide === 'villain' ? [{ id: battleData.villainIds[0], action: actionType, target: battleData.heroIds[0] }] : []
      })
    });
    if (!res.ok) throw new Error('Error al ejecutar la acción de la ronda');
    battleData = await res.json();
    renderArena();
    renderAttackLog();
    renderRoundControls();
    renderResult();
  } catch (e) {
    alert(e.message);
  }
}

function renderResult() {
  if (!battleData) return;
  if (battleData.status === 'finished') {
    let msg = '';
    let cls = '';
    let stats = '';

    if (battleData.result === 'heroes') {
      msg = '¡Victoria de los HÉROES!';
      cls = 'heroes-win';
    } else if (battleData.result === 'villains') {
      msg = '¡Victoria de los VILLANOS!';
      cls = 'villains-win';
    } else {
      msg = '¡Empate!';
      cls = 'draw';
    }

    stats = `
      <h4>Estadísticas:</h4>
      <ul>
        ${battleData.statistics.map(stat => `<li>${stat}</li>`).join('')}
      </ul>
    `;

    battleResult.innerHTML = `<div class="${cls}">${msg}</div>${stats}`;
  } else {
    battleResult.textContent = '';
    battleResult.className = 'battle-result';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const battleModeSelect = document.getElementById('battle-mode-select');
  const fightSection = document.getElementById('fight-section');

  battleModeSelect.addEventListener('change', () => {
    if (battleModeSelect.value === 'manual') {
      fightSection.classList.remove('hidden');
      renderAttackButtons();
    } else {
      fightSection.classList.add('hidden');
      heroesButtons.innerHTML = '';
      villainsButtons.innerHTML = '';
    }
  });
});
