document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const viewBattlesDiv = document.getElementById('viewBattles');
  const createBattleDiv = document.getElementById('createBattle');
  const battleDetailDiv = document.getElementById('battleDetail');
  const viewTab = document.getElementById('viewTab');
  const createTab = document.getElementById('createTab');
  const battlesList = document.getElementById('battlesList');
  const battleInfo = document.getElementById('battleInfo');
  const heroFilter = document.getElementById('heroFilter');
  const villainFilter = document.getElementById('villainFilter');
  const resultFilter = document.getElementById('resultFilter');
  const heroSelect = document.getElementById('heroSelect');
  const villainSelect = document.getElementById('villainSelect');
  const locationSelect = document.getElementById('locationSelect');
  const createBattleBtn = document.getElementById('createBattleBtn');
  const backToListBtn = document.getElementById('backToListBtn');
  // Controles de ataque manual
  const attackTypeSelect = document.getElementById('attackTypeSelect');
  const attackBtn = document.getElementById('attackBtn');
  const finishBtn = document.getElementById('finishBtn');
  const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
  const messagesDiv = document.getElementById('messages');
  const battleHistory = document.getElementById('battleHistory');
  let currentBattle = null;
  let historyVisible = false;
  
  let battles = [];
  let heroes = [];
  let villains = [];
  
  // Eventos para pestañas
  viewTab.addEventListener('click', () => {
    viewBattlesDiv.classList.remove('hidden');
    createBattleDiv.classList.add('hidden');
    battleDetailDiv.classList.add('hidden');
    viewTab.classList.add('active');
    createTab.classList.remove('active');
    loadBattles();
  });
  
  createTab.addEventListener('click', async () => {
    viewBattlesDiv.classList.add('hidden');
    createBattleDiv.classList.remove('hidden');
    battleDetailDiv.classList.add('hidden');
    viewTab.classList.remove('active');
    createTab.classList.add('active');
    await loadHeroesAndVillains();
    await loadLocations();
  });
  
  // Volver a la lista desde detalles
  backToListBtn.addEventListener('click', () => {
    battleDetailDiv.classList.add('hidden');
    viewBattlesDiv.classList.remove('hidden');
  });
  
  // Cargar batallas al inicio
  loadBattles();
  
  // Filtros de batallas
  heroFilter.addEventListener('change', filterBattles);
  villainFilter.addEventListener('change', filterBattles);
  resultFilter.addEventListener('change', filterBattles);
  
  // Crear batalla
  createBattleBtn.addEventListener('click', createBattle);
  
  // Ataque
  attackBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`/api/battles/${currentBattle.id}/attack`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ attackType: attackTypeSelect.value })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 500 && errorData.error === 'Battle already finished') {
          alert('La batalla ya ha terminado. No se pueden realizar más ataques.');
          await viewBattleDetails(currentBattle.id); // Refresh to show current state
          return;
        }
        throw new Error(errorData.error || 'Error durante el ataque');
      }
      
      const result = await response.json();
      
      // Show attack result message
      if (result.attackResult?.message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'attack-message';
        messageDiv.innerHTML = `<strong>Ataque realizado:</strong> ${result.attackResult.message}`;
        
        // Add to messages area if it exists
        if (messagesDiv) {
          messagesDiv.appendChild(messageDiv);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        // If battle finished, show completion message
        if (result.attackResult.battleFinished) {
          const finishMessageDiv = document.createElement('div');
          finishMessageDiv.className = 'battle-finished-message';
          finishMessageDiv.innerHTML = `<strong>¡Batalla terminada!</strong> Ganador: ${result.attackResult.battleResult === 'hero' ? 'Héroe' : result.attackResult.battleResult === 'villain' ? 'Villano' : 'Empate'}`;
          if (messagesDiv) {
            messagesDiv.appendChild(finishMessageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }
          
          // Disable attack button
          attackBtn.disabled = true;
          attackBtn.textContent = 'Batalla Terminada';
        }
      }
      
      // Refresh battle details
      await viewBattleDetails(currentBattle.id);
    } catch (err) {
      console.error('Error durante el ataque manual:', err);
      alert('Error durante el ataque: ' + err.message);
    }
  });
  // Finalizar batalla manual
  finishBtn.addEventListener('click', async () => {
    try {
      await fetch(`/api/battles/${currentBattle.id}/finish`, { method: 'POST' });
      await viewBattleDetails(currentBattle.id);
    } catch (err) {
      console.error('Error finalizando batalla manual:', err);
      alert('Error al finalizar la batalla.');
    }
  });
  // Toggle historial
  toggleHistoryBtn.addEventListener('click', () => {
    historyVisible = !historyVisible;
    if (historyVisible) {
      battleHistory.classList.remove('hidden');
      toggleHistoryBtn.textContent = 'Ocultar Historial';
    } else {
      battleHistory.classList.add('hidden');
      toggleHistoryBtn.textContent = 'Ver Historial de Batalla';
    }
  });
  
  // Funciones
  async function loadBattles() {
    try {
      const response = await fetch('/api/battles');
      battles = await response.json();
      
      // Actualizar filtros
      updateFilters();
      
      renderBattles(battles);
    } catch (error) {
      console.error('Error cargando batallas:', error);
      battlesList.innerHTML = '<p>Error al cargar las batallas. Intenta de nuevo más tarde.</p>';
    }
  }
  
  async function loadHeroesAndVillains() {
    try {
      const [heroesResponse, villainsResponse] = await Promise.all([
        fetch('/api/heroes'),
        fetch('/api/villains')
      ]);
      
      heroes = await heroesResponse.json();
      villains = await villainsResponse.json();
      
      // Actualizar selectores
      heroSelect.innerHTML = '<option value="">Selecciona un héroe</option>';
      heroes.forEach(hero => {
        const option = document.createElement('option');
        option.value = hero.id;
        option.textContent = `${hero.name} (${hero.alias})`;
        heroSelect.appendChild(option);
      });
      
      villainSelect.innerHTML = '<option value="">Selecciona un villano</option>';
      villains.forEach(villain => {
        const option = document.createElement('option');
        option.value = villain.id;
        option.textContent = `${villain.name} (${villain.alias})`;
        villainSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error cargando personajes:', error);
      alert('Error al cargar héroes y villanos. Intenta de nuevo más tarde.');
    }
  }
  
  // Cargar ubicaciones disponibles
  async function loadLocations() {
    try {
      const response = await fetch('/api/cities');
      const cities = await response.json();
      locationSelect.innerHTML = '<option value="">Selecciona una ubicación</option>';
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        locationSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    }
  }
  
  function updateFilters() {
    // Mapear héroes y villanos únicos en las batallas
    const uniqueHeroes = new Map();
    const uniqueVillains = new Map();
    
    battles.forEach(battle => {
      if (battle.hero && !uniqueHeroes.has(battle.hero.id)) {
        uniqueHeroes.set(battle.hero.id, battle.hero);
      }
      if (battle.villain && !uniqueVillains.has(battle.villain.id)) {
        uniqueVillains.set(battle.villain.id, battle.villain);
      }
    });
    
    // Actualizar filtro de héroes
    heroFilter.innerHTML = '<option value="">Todos los héroes</option>';
    uniqueHeroes.forEach(hero => {
      const option = document.createElement('option');
      option.value = hero.id;
      option.textContent = hero.name || hero.alias;
      heroFilter.appendChild(option);
    });
    
    // Actualizar filtro de villanos
    villainFilter.innerHTML = '<option value="">Todos los villanos</option>';
    uniqueVillains.forEach(villain => {
      const option = document.createElement('option');
      option.value = villain.id;
      option.textContent = villain.name || villain.alias;
      villainFilter.appendChild(option);
    });
  }
  
  function renderBattles(battlesToRender) {
    battlesList.innerHTML = '';
    
    if (battlesToRender.length === 0) {
      battlesList.innerHTML = '<p>No se encontraron batallas que coincidan con tus filtros.</p>';
      return;
    }
    
    battlesToRender.forEach(battle => {
      const battleCard = document.createElement('div');
      battleCard.className = 'battle-card';
      
      // Añadir clase según resultado
      if (battle.result === 'hero_winner') {
        battleCard.classList.add('hero-winner');
      } else if (battle.result === 'villain_winner') {
        battleCard.classList.add('villain-winner');
      } else if (battle.result === 'draw') {
        battleCard.classList.add('draw');
      } else {
        battleCard.classList.add('ongoing');
      }
      
      let resultText = '';
      switch (battle.result) {
        case 'hero_winner':
          resultText = '¡Victoria del Héroe!';
          break;
        case 'villain_winner':
          resultText = '¡Victoria del Villano!';
          break;
        case 'draw':
          resultText = 'Empate';
          break;
        default:
          resultText = 'En progreso';
      }
      
      battleCard.innerHTML = `
        <h3>Batalla #${battle.id}</h3>
        <p><strong>Fecha:</strong> ${new Date(battle.date).toLocaleDateString()}</p>
        <p><strong>Ubicación:</strong> ${battle.location || 'No especificada'}</p>
        <div class="participants">
          <div class="hero-data">
            <strong>Héroe:</strong> ${battle.hero?.name || 'Desconocido'} (${battle.hero?.alias || 'N/A'})
          </div>
          <div class="villain-data">
            <strong>Villano:</strong> ${battle.villain?.name || 'Desconocido'} (${battle.villain?.alias || 'N/A'})
          </div>
        </div>
        <div class="result ${battle.result}">
          <strong>Resultado:</strong> ${resultText}
        </div>
        <div class="actions">
          <button class="view-btn" data-id="${battle.id}">Ver Detalles</button>
        </div>
      `;
      
      battlesList.appendChild(battleCard);
      
      // Evento para el botón de ver detalles
      battleCard.querySelector('.view-btn').addEventListener('click', () => viewBattleDetails(battle.id));
    });
  }
  
  function filterBattles() {
    const selectedHeroId = heroFilter.value;
    const selectedVillainId = villainFilter.value;
    const selectedResult = resultFilter.value;
    
    const filteredBattles = battles.filter(battle => {
      const heroMatch = !selectedHeroId || (battle.hero && battle.hero.id === selectedHeroId);
      const villainMatch = !selectedVillainId || (battle.villain && battle.villain.id === selectedVillainId);
      const resultMatch = !selectedResult || battle.result === selectedResult;
      
      return heroMatch && villainMatch && resultMatch;
    });
    
    renderBattles(filteredBattles);
  }
  
  async function viewBattleDetails(id) {
    try {
      const response = await fetch(`/api/battles/${id}`);
      const battle = await response.json();
      currentBattle = battle;
      
      battleInfo.innerHTML = '';
      
      let resultText = '';
      let resultClass = '';
      switch (battle.result) {
        case 'hero_winner':
          resultText = '¡Victoria del Héroe!';
          resultClass = 'hero-win';
          break;
        case 'villain_winner':
          resultText = '¡Victoria del Villano!';
          resultClass = 'villain-win';
          break;
        case 'draw':
          resultText = 'Empate';
          resultClass = 'draw';
          break;
        default:
          resultText = 'En progreso';
      }
      
      // Find current character states from characters array if available
      const currentHero = battle.characters?.find(c => c.type === 'hero') || battle.hero;
      const currentVillain = battle.characters?.find(c => c.type === 'villain') || battle.villain;
      
      battleInfo.innerHTML = `
        <h3>Batalla #${battle.id}</h3>
        <p><strong>Fecha:</strong> ${new Date(battle.date).toLocaleDateString()}</p>
        <p><strong>Ubicación:</strong> ${battle.location || 'No especificada'}</p>
        <p><strong>Estado:</strong> <span class="battle-status ${battle.status}">${battle.status === 'finished' ? 'Finalizada' : 'En progreso'}</span></p>
        
        <h3>Participantes</h3>
        <div class="hero-data">
          <h4>${currentHero?.name || battle.hero?.name || 'Desconocido'} (${currentHero?.alias || battle.hero?.alias || 'N/A'})</h4>
          <p><strong>Ciudad:</strong> ${currentHero?.city || battle.hero?.city || 'No especificada'}</p>
          <p><strong>Estadísticas:</strong></p>
          <ul>
            <li>Salud Máxima: ${currentHero?.hpMax || battle.hero?.hpMax || battle.hero?.health || 'N/A'}</li>
            <li>Salud Actual: <span class="hp-current ${getHpClass(currentHero?.hpCurrent, currentHero?.hpMax)}">${currentHero?.hpCurrent !== undefined ? currentHero.hpCurrent : (battle.hero?.hpCurrent !== undefined ? battle.hero.hpCurrent : (battle.hero?.health || 'N/A'))}</span></li>
            <li>Estado: <span class="alive-status ${getAliveStatus(currentHero)}">${getAliveText(currentHero)}</span></li>
            <li>Ataque: ${currentHero?.attack || battle.hero?.attack || 'N/A'}</li>
            <li>Defensa: ${currentHero?.defense || battle.hero?.defense || 'N/A'}</li>
            <li>Habilidad Especial: ${currentHero?.specialAbility || battle.hero?.specialAbility || 'N/A'}</li>
          </ul>
          <p><strong>Daño causado:</strong> ${battle.heroDamage || 0}</p>
        </div>
        
        <div class="villain-data">
          <h4>${currentVillain?.name || battle.villain?.name || 'Desconocido'} (${currentVillain?.alias || battle.villain?.alias || 'N/A'})</h4>
          <p><strong>Ciudad:</strong> ${currentVillain?.city || battle.villain?.city || 'No especificada'}</p>
          <p><strong>Estadísticas:</strong></p>
          <ul>
            <li>Salud Máxima: ${currentVillain?.hpMax || battle.villain?.hpMax || battle.villain?.health || 'N/A'}</li>
            <li>Salud Actual: <span class="hp-current ${getHpClass(currentVillain?.hpCurrent, currentVillain?.hpMax)}">${currentVillain?.hpCurrent !== undefined ? currentVillain.hpCurrent : (battle.villain?.hpCurrent !== undefined ? battle.villain.hpCurrent : (battle.villain?.health || 'N/A'))}</span></li>
            <li>Estado: <span class="alive-status ${getAliveStatus(currentVillain)}">${getAliveText(currentVillain)}</span></li>
            <li>Ataque: ${currentVillain?.attack || battle.villain?.attack || 'N/A'}</li>
            <li>Defensa: ${currentVillain?.defense || battle.villain?.defense || 'N/A'}</li>
            <li>Habilidad Especial: ${currentVillain?.specialAbility || battle.villain?.specialAbility || 'N/A'}</li>
          </ul>
          <p><strong>Daño causado:</strong> ${battle.villainDamage || 0}</p>
        </div>
        
        <div class="result ${resultClass}">
          <strong>Resultado Final:</strong> ${resultText}
        </div>
        
        ${battle.attackHistory && battle.attackHistory.length > 0 ? `
          <h3>Historial de Ataques (${battle.attackHistory.length} ataques - Ronda actual: ${battle.currentRoundIndex || 1})</h3>
          <div class="attack-history">
            ${battle.attackHistory.map((attack, index) => `
              <div class="attack-entry attack-message ${attack.damage > 75 ? 'critical' : 'normal'}">
                <strong>Ataque ${index + 1} (Ronda ${attack.round || Math.floor(index/2) + 1}):</strong> 
                ${attack.attackerName || attack.attackerId} atacó a ${attack.targetName || attack.targetId} 
                causando <span class="damage-amount">${attack.damage}</span> de daño 
                <small>(HP después: ${attack.targetHpAfter})</small>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
      
      viewBattlesDiv.classList.add('hidden');
      createBattleDiv.classList.add('hidden');
      battleDetailDiv.classList.remove('hidden');
      // Configurar controles según modo
      if (battle.mode === 'manual') {
        // Mostrar opciones de ataque
        attackBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
        toggleHistoryBtn.classList.remove('hidden');
        battleHistory.classList.add('hidden');
        messagesDiv.innerHTML = '';
        // rellenar historial inicial
        battleHistory.innerHTML = battle.attackHistory.map(h => {
          const attacker = battle.characters.find(c => c.id === h.attackerId);
          const target = battle.characters.find(c => c.id === h.targetId);
          return `<li><strong>${attacker.alias||attacker.name}</strong> causó ${h.damage} a <strong>${target.alias||target.name}</strong>. HP tras: ${h.targetHpAfter}</li>`;
        }).join('');
      } else {
        // modo automático: ocultar controles
        attackBtn.classList.add('hidden');
        finishBtn.classList.add('hidden');
        toggleHistoryBtn.classList.add('hidden');
        battleHistory.classList.add('hidden');
      }
    } catch (error) {
      console.error('Error cargando detalles de batalla:', error);
      alert('Error al cargar los detalles de la batalla. Intenta de nuevo más tarde.');
    }
  }
  
  async function createBattle() {
    const heroId = heroSelect.value;
    const villainId = villainSelect.value;
    const location = locationSelect.value;
    
    if (!heroId || !villainId) {
      alert('Debes seleccionar un héroe y un villano para crear una batalla.');
      return;
    }
    if (!location) {
      alert('Debes seleccionar una ubicación válida.');
      return;
    }
    
    // Incluir modo de batalla
    const selectedMode = document.querySelector('input[name="battleMode"]:checked').value;
    const battleData = {
      heroId,
      villainId,
      location,
      mode: selectedMode
    };
    
    try {
      const response = await fetch('/api/battles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(battleData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la batalla');
      }
      
      const createdBattle = await response.json();
      alert('Batalla creada con éxito');
      
      // Limpiar formulario
      heroSelect.value = '';
      villainSelect.value = '';
      locationSelect.value = '';
      // Flujo según modo
      if (selectedMode === 'auto') {
        // Finalizar automáticamente y mostrar detalles
        await fetch(`/api/battles/${createdBattle.id}/finish`, { method: 'POST' });
        viewBattleDetails(createdBattle.id);
      } else {
        // Modo manual: mostrar detalles para ataques paso a paso
        viewBattleDetails(createdBattle.id);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
  
  // Helper functions for character status
  function getHpClass(currentHp, maxHp) {
    if (currentHp === undefined || currentHp === null || currentHp === 'N/A') return '';
    if (maxHp === undefined || maxHp === null || maxHp === 'N/A') return '';
    
    const percentage = (currentHp / maxHp) * 100;
    if (percentage > 70) return 'hp-high';
    if (percentage > 30) return 'hp-medium';
    return 'hp-low';
  }
  
  function getAliveStatus(character) {
    if (!character) return 'dead';
    
    // Check explicit isAlive property
    if (character.isAlive !== undefined) {
      return character.isAlive ? 'alive' : 'dead';
    }
    
    // Fallback to HP check
    const hp = character.hpCurrent !== undefined ? character.hpCurrent : character.health;
    return (hp !== undefined && hp > 0) ? 'alive' : 'dead';
  }
  
  function getAliveText(character) {
    return getAliveStatus(character) === 'alive' ? 'Vivo' : 'Muerto';
  }
});
