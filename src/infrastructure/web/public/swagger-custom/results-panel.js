// Panel de visualización de resultados para TeamBattle Manager
// Permite elegir entre: JSON crudo, tabla, tarjetas, resumen, timeline, alertas, colapsables

const VIEW_MODES = [
  { value: 'json', label: 'JSON crudo' },
  { value: 'table', label: 'Tabla' },
  { value: 'cards', label: 'Tarjetas' },
  { value: 'summary', label: 'Resumen textual' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'alerts', label: 'Alertas/Badges' },
  { value: 'collapsible', label: 'Colapsables' }
];

let lastBattleResult = null;

function renderResultsView(data, mode) {
  const container = document.getElementById('results-container');
  // Derivar equipos y asegurar rounds como array
  if (!data.teams && Array.isArray(data.characters)) {
    data.teams = {
      Héroes: data.characters.filter(c => c.type === 'hero'),
      Villanos: data.characters.filter(c => c.type === 'villain')
    };
  }
  if (!Array.isArray(data.rounds)) data.rounds = [];
  if (!container) return;
  container.innerHTML = '';
  if (!data) {
    container.innerHTML = '<div class="form-hint">No hay resultados para mostrar.</div>';
    return;
  }
  switch (mode) {
    case 'json':
      renderRawJson(data, container);
      break;
    case 'table':
      renderTable(data, container);
      break;
    case 'cards':
      renderCards(data, container);
      break;
    case 'summary':
      renderSummary(data, container);
      break;
    case 'timeline':
      renderTimeline(data, container);
      break;
    case 'alerts':
      renderAlerts(data, container);
      break;
    case 'collapsible':
      renderCollapsible(data, container);
      break;
    default:
      renderRawJson(data, container);
  }
}

function renderRawJson(data, container) {
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(data, null, 2);
  pre.style.overflowX = 'auto';
  pre.style.background = '#222';
  pre.style.color = '#fff';
  pre.style.padding = '12px';
  pre.style.borderRadius = '6px';
  pre.style.fontSize = '1em';
  pre.setAttribute('aria-label', 'JSON crudo de la batalla');
  container.appendChild(pre);
}

function renderTable(data, container) {
  // Ejemplo: mostrar equipos y estado final
  if (!data.teams) {
    container.innerHTML = '<div class="form-hint">No hay datos de equipos para mostrar en tabla.</div>';
    return;
  }
  const table = document.createElement('table');
  table.className = 'battle-table';
  table.style.fontSize = '0.9em';
  table.style.width = '100%';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr>
    <th>Equipo</th>
    <th>Nombre/Alias</th>
    <th>Ciudad</th>
    <th>HP</th>
    <th>ATK</th>
    <th>DEF</th>
    <th>VEL</th>
    <th>Stamina</th>
    <th>Crit%</th>
    <th>Afinidad</th>
    <th>Habilidad Especial</th>
    <th>Estado</th>
  </tr>`;
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  for (const team of Object.keys(data.teams)) {
    for (const member of data.teams[team]) {
      const tr = document.createElement('tr');
      const hpDisplay = member.hpCurrent !== undefined 
        ? `${member.hpCurrent}/${member.hpMax || member.health || '?'}`
        : (member.health || '-');
      const isAlive = member.isAlive !== false && member.hpCurrent !== 0;
      const statusDisplay = !isAlive ? 'derrotado' : (member.status || 'normal');
      const nameDisplay = `${member.name || '?'}<br><small>${member.alias || '?'}</small>`;
      
      tr.innerHTML = `
        <td>${team}</td>
        <td>${nameDisplay}</td>
        <td>${member.city || '-'}</td>
        <td><strong>${hpDisplay}</strong></td>
        <td>${member.attack || '-'}</td>
        <td>${member.defense || '-'}</td>
        <td>${member.speed || '-'}</td>
        <td>${member.stamina || '-'}</td>
        <td>${member.critChance || '-'}%</td>
        <td>${member.teamAffinity > 0 ? '+' : ''}${member.teamAffinity || 0}</td>
        <td><small>${member.specialAbility || '-'}</small></td>
        <td><span style="color: ${!isAlive ? 'red' : 'green'}">${statusDisplay}</span></td>
      `;
      if (!isAlive) tr.style.opacity = '0.6';
      tbody.appendChild(tr);
    }
  }
  table.appendChild(tbody);
  container.appendChild(table);
}

function renderCards(data, container) {
  // Ejemplo: tarjetas para cada personaje
  if (!data.teams) {
    container.innerHTML = '<div class="form-hint">No hay datos de equipos para mostrar en tarjetas.</div>';
    return;
  }
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexWrap = 'wrap';
  wrapper.style.gap = '16px';
  for (const team of Object.keys(data.teams)) {
    for (const member of data.teams[team]) {
      const card = document.createElement('div');
      card.style.background = '#f8f8f8';
      card.style.border = '1px solid #bbb';
      card.style.borderRadius = '8px';
      card.style.padding = '16px';
      card.style.minWidth = '280px';
      card.style.maxWidth = '320px';
      card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      card.style.fontSize = '0.9em';
      
      const hpDisplay = member.hpCurrent !== undefined 
        ? `${member.hpCurrent}/${member.hpMax || member.health || '?'}`
        : (member.health || '-');
      const isAlive = member.isAlive !== false && member.hpCurrent !== 0;
      const statusDisplay = !isAlive ? 'derrotado' : (member.status || 'normal');
      
      if (!isAlive) {
        card.style.opacity = '0.7';
        card.style.border = '2px solid #ff6b6b';
      } else {
        card.style.border = `2px solid ${team === 'Héroes' ? '#4ecdc4' : '#ff9f43'}`;
      }
      
      // Calcular porcentaje de HP
      const hpPercent = member.hpCurrent !== undefined && member.hpMax 
        ? Math.round((member.hpCurrent / member.hpMax) * 100)
        : 100;
      
      card.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <div style="font-weight: bold; font-size: 1.1em; color: #333;">${member.name || 'Sin nombre'}</div>
          <div style="font-style: italic; color: #666;">"${member.alias || 'Sin alias'}"</div>
          <div style="font-size: 0.85em; color: #888;">📍 ${member.city || 'Ciudad desconocida'}</div>
          ${member.team ? `<div style="font-size: 0.8em; color: #555;">🏆 ${member.team}</div>` : ''}
        </div>
        
        <div style="background: #fff; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">💚 Salud: ${hpDisplay} (${hpPercent}%)</div>
          <div style="background: #eee; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: ${hpPercent > 50 ? '#4ecdc4' : hpPercent > 25 ? '#feca57' : '#ff6b6b'}; height: 100%; width: ${hpPercent}%; transition: width 0.3s;"></div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
          <div><b>⚔️ Ataque:</b> ${member.attack || '-'}</div>
          <div><b>🛡️ Defensa:</b> ${member.defense || '-'}</div>
          <div><b>💨 Velocidad:</b> ${member.speed || '-'}</div>
          <div><b>⚡ Stamina:</b> ${member.stamina || '-'}</div>
          <div><b>🎯 Crítico:</b> ${member.critChance || '-'}%</div>
          <div><b>🤝 Afinidad:</b> ${member.teamAffinity > 0 ? '+' : ''}${member.teamAffinity || 0}</div>
        </div>
        
        <div style="background: #fff; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">🌟 Habilidad Especial:</div>
          <div style="font-style: italic;">${member.specialAbility || 'Ninguna'}</div>
          <div style="font-size: 0.8em; color: #666;">Costo: ${member.energyCost || '-'} energía</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85em;">
          <div><b>🏆 Rondas ganadas:</b> ${member.roundsWon || 0}</div>
          <div><b>💥 Daño infligido:</b> ${member.damage || 0}</div>
          <div><b>🛡️ Reducción daño:</b> ${member.damageReduction || 0}%</div>
          <div><b>📊 Estado:</b> <span style="color: ${!isAlive ? 'red' : 'green'}; font-weight: bold;">${statusDisplay}</span></div>
        </div>
      `;
      wrapper.appendChild(card);
    }
  }
  container.appendChild(wrapper);
}

function renderSummary(data, container) {
  // Resumen detallado con estadísticas
  let html = '';
  
  // Información general de la batalla
  html += '<div style="background: #f0f0f0; padding: 12px; border-radius: 6px; margin-bottom: 16px;">';
  html += '<h3 style="margin: 0 0 8px 0;">📊 Resumen de Batalla</h3>';
  
  if (data.result) {
    const resultColor = data.result === 'heroes' ? '#4ecdc4' : data.result === 'villains' ? '#ff9f43' : '#95a5a6';
    html += `<div style="font-size: 1.1em; font-weight: bold; color: ${resultColor};">🏆 Ganador: ${data.result === 'heroes' ? 'Héroes' : data.result === 'villains' ? 'Villanos' : 'Empate'}</div>`;
  }
  
  if (data.rounds) {
    html += `<div>⚔️ Total de rondas ejecutadas: <b>${data.rounds.length}</b></div>`;
  }
  
  if (data.status) {
    html += `<div>📋 Estado: <b>${data.status === 'finished' ? 'Terminada' : 'En progreso'}</b></div>`;
  }
  html += '</div>';
  
  // Análisis por equipos
  if (data.teams) {
    for (const team of Object.keys(data.teams)) {
      const teamMembers = data.teams[team];
      const vivos = teamMembers.filter(m => {
        const isAlive = m.isAlive !== false && (m.hpCurrent === undefined || m.hpCurrent > 0);
        return isAlive && m.status !== 'derrotado';
      });
      const muertos = teamMembers.filter(m => !vivos.includes(m));
      
      html += `<div style="background: ${team === 'Héroes' ? '#e8f8f6' : '#fff2e8'}; padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 4px solid ${team === 'Héroes' ? '#4ecdc4' : '#ff9f43'};">`;
      html += `<h4 style="margin: 0 0 8px 0;">${team === 'Héroes' ? '🦸‍♂️' : '🦹‍♂️'} ${team}</h4>`;
      
      // Estadísticas del equipo
      const totalHp = teamMembers.reduce((sum, m) => sum + (m.hpCurrent || 0), 0);
      const maxHp = teamMembers.reduce((sum, m) => sum + (m.hpMax || m.health || 0), 0);
      const avgAttack = Math.round(teamMembers.reduce((sum, m) => sum + (m.attack || 0), 0) / teamMembers.length);
      const avgDefense = Math.round(teamMembers.reduce((sum, m) => sum + (m.defense || 0), 0) / teamMembers.length);
      
      html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-bottom: 8px; font-size: 0.9em;">`;
      html += `<div><b>💚 HP Total:</b> ${totalHp}/${maxHp}</div>`;
      html += `<div><b>⚔️ ATK Promedio:</b> ${avgAttack}</div>`;
      html += `<div><b>🛡️ DEF Promedio:</b> ${avgDefense}</div>`;
      html += `<div><b>👥 Miembros:</b> ${teamMembers.length}</div>`;
      html += `<div><b>✅ Vivos:</b> ${vivos.length}</div>`;
      html += `<div><b>💀 Caídos:</b> ${muertos.length}</div>`;
      html += '</div>';
      
      // Lista de supervivientes
      if (vivos.length > 0) {
        html += '<div style="margin: 8px 0;"><b>🌟 Supervivientes:</b></div>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        vivos.forEach(m => {
          const hpPercent = m.hpCurrent && m.hpMax ? Math.round((m.hpCurrent / m.hpMax) * 100) : 100;
          html += `<div style="background: white; padding: 6px 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 0.85em;">`;
          html += `<b>${m.name || m.alias}</b><br>`;
          html += `HP: ${m.hpCurrent || m.health}/${m.hpMax || m.health} (${hpPercent}%)<br>`;
          html += `ATK: ${m.attack || '-'} | DEF: ${m.defense || '-'}`;
          html += '</div>';
        });
        html += '</div>';
      }
      
      // Lista de caídos
      if (muertos.length > 0) {
        html += '<div style="margin: 8px 0;"><b>💀 Caídos en combate:</b></div>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        muertos.forEach(m => {
          html += `<div style="background: #ffe6e6; padding: 6px 10px; border-radius: 4px; border: 1px solid #ffb3b3; font-size: 0.85em; opacity: 0.8;">`;
          html += `<b>${m.name || m.alias}</b><br>`;
          html += `${m.specialAbility || 'Sin habilidad especial'}`;
          html += '</div>';
        });
        html += '</div>';
      }
      
      html += '</div>';
    }
  }
  
  // Resumen de rondas si existen
  if (data.rounds && data.rounds.length > 0) {
    html += '<div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 16px;">';
    html += '<h4 style="margin: 0 0 8px 0;">⚔️ Historial de Rondas</h4>';
    data.rounds.forEach((round, index) => {
      html += `<div style="margin: 4px 0; padding: 6px; background: white; border-radius: 4px;">`;
      html += `<b>Ronda ${round.roundNumber || index + 1}:</b> `;
      html += `Héroes ${round.heroTotal || 0} daño vs Villanos ${round.villainTotal || 0} daño `;
      html += `→ <span style="font-weight: bold; color: ${round.result === 'heroes' ? '#4ecdc4' : round.result === 'villains' ? '#ff9f43' : '#95a5a6'};">`;
      html += `${round.result === 'heroes' ? 'Victoria Héroes' : round.result === 'villains' ? 'Victoria Villanos' : 'Empate'}</span>`;
      html += '</div>';
    });
    html += '</div>';
  }
  
  container.innerHTML = html || '<div class="form-hint">No hay resumen disponible.</div>';
}

function renderTimeline(data, container) {
  // Ejemplo: timeline de rondas
  // Mostrar timeline de rondas, o mensaje si no hay rondas aún
  const rounds = Array.isArray(data.rounds) ? data.rounds : [];
  if (rounds.length === 0) {
    container.innerHTML = '<div class="form-hint">No se han ejecutado rondas aún.</div>';
    return;
  }
  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';
  rounds.forEach((round, i) => {
    const li = document.createElement('li');
    li.style.marginBottom = '12px';
    li.innerHTML = `<b>Ronda ${i + 1}:</b> ${round.summary || JSON.stringify(round)}`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function renderAlerts(data, container) {
  // Alertas y badges informativos sobre personajes y batalla
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.gap = '12px';
  
  // Alerta principal del estado de batalla
  const mainAlert = document.createElement('div');
  mainAlert.style.padding = '12px 16px';
  mainAlert.style.borderRadius = '6px';
  mainAlert.style.fontWeight = 'bold';
  mainAlert.style.textAlign = 'center';
  
  if (data.status === 'finished') {
    mainAlert.style.background = data.result === 'heroes' ? '#d4f7d4' : data.result === 'villains' ? '#ffe0e0' : '#f0f0f0';
    mainAlert.textContent = `🏁 Batalla terminada - Ganador: ${data.result === 'heroes' ? 'Héroes' : data.result === 'villains' ? 'Villanos' : 'Empate'}`;
  } else {
    mainAlert.style.background = '#fff3cd';
    mainAlert.textContent = '⚔️ Batalla en progreso';
  }
  wrapper.appendChild(mainAlert);
  
  // Badges por personaje
  if (data.teams) {
    for (const team of Object.keys(data.teams)) {
      const teamDiv = document.createElement('div');
      teamDiv.innerHTML = `<h4 style="margin: 8px 0;">${team === 'Héroes' ? '🦸‍♂️' : '🦹‍♂️'} ${team}</h4>`;
      
      const badgesContainer = document.createElement('div');
      badgesContainer.style.display = 'flex';
      badgesContainer.style.flexWrap = 'wrap';
      badgesContainer.style.gap = '8px';
      
      data.teams[team].forEach(member => {
        const badge = document.createElement('div');
        badge.style.display = 'inline-block';
        badge.style.padding = '8px 12px';
        badge.style.borderRadius = '20px';
        badge.style.fontSize = '0.85em';
        badge.style.fontWeight = 'bold';
        badge.style.minWidth = '120px';
        badge.style.textAlign = 'center';
        
        const isAlive = member.isAlive !== false && (member.hpCurrent === undefined || member.hpCurrent > 0);
        const hpPercent = member.hpCurrent && member.hpMax ? Math.round((member.hpCurrent / member.hpMax) * 100) : 100;
        
        // Color según estado
        if (!isAlive) {
          badge.style.background = '#dc3545';
          badge.style.color = 'white';
          badge.innerHTML = `💀 ${member.name || member.alias}<br>DERROTADO`;
        } else if (hpPercent > 75) {
          badge.style.background = '#28a745';
          badge.style.color = 'white';
          badge.innerHTML = `💚 ${member.name || member.alias}<br>HP: ${hpPercent}% (${member.hpCurrent}/${member.hpMax})`;
        } else if (hpPercent > 50) {
          badge.style.background = '#ffc107';
          badge.style.color = 'black';
          badge.innerHTML = `💛 ${member.name || member.alias}<br>HP: ${hpPercent}% (${member.hpCurrent}/${member.hpMax})`;
        } else if (hpPercent > 25) {
          badge.style.background = '#fd7e14';
          badge.style.color = 'white';
          badge.innerHTML = `🧡 ${member.name || member.alias}<br>HP: ${hpPercent}% (${member.hpCurrent}/${member.hpMax})`;
        } else {
          badge.style.background = '#dc3545';
          badge.style.color = 'white';
          badge.innerHTML = `❤️ ${member.name || member.alias}<br>HP CRÍTICO: ${hpPercent}% (${member.hpCurrent}/${member.hpMax})`;
        }
        
        badgesContainer.appendChild(badge);
      });
      
      teamDiv.appendChild(badgesContainer);
      wrapper.appendChild(teamDiv);
    }
  }
  
  // Badges de estadísticas adicionales
  if (data.teams) {
    const statsDiv = document.createElement('div');
    statsDiv.innerHTML = '<h4 style="margin: 12px 0 8px 0;">📊 Estadísticas Destacadas</h4>';
    
    const statsBadges = document.createElement('div');
    statsBadges.style.display = 'flex';
    statsBadges.style.flexWrap = 'wrap';
    statsBadges.style.gap = '8px';
    
    // Encontrar el más fuerte, más rápido, etc.
    const allMembers = Object.values(data.teams).flat();
    const strongest = allMembers.reduce((prev, curr) => (curr.attack || 0) > (prev.attack || 0) ? curr : prev);
    const fastest = allMembers.reduce((prev, curr) => (curr.speed || 0) > (prev.speed || 0) ? curr : prev);
    const toughest = allMembers.reduce((prev, curr) => (curr.defense || 0) > (prev.defense || 0) ? curr : prev);
    const mostCrit = allMembers.reduce((prev, curr) => (curr.critChance || 0) > (prev.critChance || 0) ? curr : prev);
    
    const createStatBadge = (icon, label, member, stat) => {
      const badge = document.createElement('div');
      badge.style.background = '#17a2b8';
      badge.style.color = 'white';
      badge.style.padding = '6px 10px';
      badge.style.borderRadius = '15px';
      badge.style.fontSize = '0.8em';
      badge.style.fontWeight = 'bold';
      badge.innerHTML = `${icon} ${label}: ${member.name || member.alias} (${stat})`;
      return badge;
    };
    
    statsBadges.appendChild(createStatBadge('⚔️', 'Más fuerte', strongest, strongest.attack));
    statsBadges.appendChild(createStatBadge('💨', 'Más rápido', fastest, fastest.speed));
    statsBadges.appendChild(createStatBadge('🛡️', 'Más resistente', toughest, toughest.defense));
    statsBadges.appendChild(createStatBadge('🎯', 'Más crítico', mostCrit, `${mostCrit.critChance}%`));
    
    statsDiv.appendChild(statsBadges);
    wrapper.appendChild(statsDiv);
  }
  
  container.appendChild(wrapper);
}

function renderCollapsible(data, container) {
  // Ejemplo: colapsables por ronda
  // Mostrar detalles colapsables: estado inicial y rondas
  // Estado inicial
  const initDetails = document.createElement('details');
  const initSummary = document.createElement('summary');
  initSummary.textContent = 'Estado inicial de los equipos';
  initDetails.appendChild(initSummary);
  const initPre = document.createElement('pre');
  initPre.textContent = JSON.stringify(data.teams || {}, null, 2);
  initPre.style.background = '#f4f4f4';
  initPre.style.padding = '8px';
  initPre.style.borderRadius = '4px';
  initDetails.appendChild(initPre);
  container.appendChild(initDetails);
  // Rondas posteriores
  const rounds = Array.isArray(data.rounds) ? data.rounds : [];
  if (rounds.length === 0) {
    const nodetails = document.createElement('div');
    nodetails.className = 'form-hint';
    nodetails.textContent = 'No se han ejecutado rondas aún.';
    container.appendChild(nodetails);
    return;
  }
  rounds.forEach((round, i) => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = `Ronda ${i + 1}`;
    details.appendChild(summary);
    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(round, null, 2);
    pre.style.background = '#f4f4f4';
    pre.style.padding = '8px';
    pre.style.borderRadius = '4px';
    details.appendChild(pre);
    container.appendChild(details);
  });
}


// Manejar el cambio de vista (asegurar que el DOM esté listo)
document.addEventListener('DOMContentLoaded', function () {
  const viewModeSelect = document.getElementById('view-mode-select');
  if (viewModeSelect) {
    viewModeSelect.addEventListener('change', function () {
      if (lastBattleResult) {
        renderResultsView(lastBattleResult, this.value);
      }
    });
  }
});

// Función para actualizar el resultado y refrescar la vista
function updateBattleResults(data) {
  lastBattleResult = data;
  const viewModeSelect = document.getElementById('view-mode-select');
  const mode = viewModeSelect ? viewModeSelect.value : 'json';
  renderResultsView(data, mode);
}

// Para integración: llama updateBattleResults(json) cuando recibas el resultado de la batalla
// Ejemplo: updateBattleResults({ result: 'Victoria de los héroes', teams: {...}, rounds: [...] });
