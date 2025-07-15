document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const viewTab = document.getElementById('viewTab');
  const createTab = document.getElementById('createTab');
  const viewBattles = document.getElementById('viewBattles');
  const createBattle = document.getElementById('createBattle');
  
  const setupDiv = document.getElementById('setup');
  const selectorsDiv = document.getElementById('selectors');
  const battleDiv = document.getElementById('battle');
  const resultsDiv = document.getElementById('results');
  
  const sideOptions = document.querySelectorAll('.side-option');
  const sideBtn = document.getElementById('sideBtn');
  const startBtn = document.getElementById('startBtn');
  const finishBtn = document.getElementById('finishBtn');
  const newBattleBtn = document.getElementById('newBattleBtn');
  
  const sideLabel = document.getElementById('sideLabel');
  const userList = document.getElementById('userList');
  const opponentList = document.getElementById('opponentList');
  
  const heroesTeamStats = document.getElementById('heroesTeamStats');
  const villainsTeamStats = document.getElementById('villainsTeamStats');
  
  const attackerSelect = document.getElementById('attackerSelect');
  const targetSelect = document.getElementById('targetSelect');
  const attackTypeSelect = document.getElementById('attackType');
  const attackBtn = document.getElementById('attackBtn');
  
  const messagesDiv = document.getElementById('messages');
  const resultTitle = document.getElementById('resultTitle');
  const resultStats = document.getElementById('resultStats');

  let battle = null;
  let selectedSide = null;

  // Cambio entre pestañas
  viewTab.addEventListener('click', () => {
    viewTab.classList.add('active');
    createTab.classList.remove('active');
    viewBattles.classList.remove('hidden');
    createBattle.classList.add('hidden');
    loadTeamBattles();
  });

  createTab.addEventListener('click', () => {
    createTab.classList.add('active');
    viewTab.classList.remove('active');
    createBattle.classList.remove('hidden');
    viewBattles.classList.add('hidden');
  });

  // Selección de bando
  sideOptions.forEach(option => {
    option.addEventListener('click', () => {
      sideOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedSide = option.getAttribute('data-side');
    });
  });

  sideBtn.addEventListener('click', async () => {
    if (!selectedSide) { 
      alert('Selecciona un bando para continuar'); 
      return; 
    }
    
    sideLabel.innerText = selectedSide;
    
    // Aplicar estilos según el bando seleccionado
    if (selectedSide === 'heroes') {
      document.getElementById('userTeam').className = 'heroes-side';
      document.getElementById('opponentTeam').className = 'villains-side';
    } else {
      document.getElementById('userTeam').className = 'villains-side';
      document.getElementById('opponentTeam').className = 'heroes-side';
    }
    
    // Cargar personajes según bando
    try {
      const userResp = await fetch(`/api/${selectedSide}`);
      const userChars = await userResp.json();
      const oppSide = selectedSide === 'heroes' ? 'villains' : 'heroes';
      const oppResp = await fetch(`/api/${oppSide}`);
      const oppChars = await oppResp.json();
      
      // Render de selecciones con mejor estilo
      userList.innerHTML = '';
      userChars.forEach(ch => {
        const label = document.createElement('label');
        label.className = 'character';
        label.innerHTML = `
          <input type="checkbox" value="${ch.id}"> 
          <strong>${ch.alias || ch.name}</strong>
          ${ch.powers ? `<div><small>Poderes: ${ch.powers}</small></div>` : ''}
        `;
        userList.appendChild(label);
      });
      
      opponentList.innerHTML = '';
      oppChars.forEach(ch => {
        const label = document.createElement('label');
        label.className = 'character';
        label.innerHTML = `
          <input type="checkbox" value="${ch.id}"> 
          <strong>${ch.alias || ch.name}</strong>
          ${ch.powers ? `<div><small>Poderes: ${ch.powers}</small></div>` : ''}
        `;
        opponentList.appendChild(label);
      });
      
      setupDiv.classList.add('hidden');
      selectorsDiv.classList.remove('hidden');
    } catch (err) {
      alert('Error cargando personajes'); 
      console.error(err);
    }
  });

  startBtn.addEventListener('click', async () => {
    const side = sideLabel.innerText;
    const heroIds = [];
    const villainIds = [];
    
    if (side === 'heroes') {
      document.querySelectorAll('#userList input:checked').forEach(cb => heroIds.push(cb.value));
      document.querySelectorAll('#opponentList input:checked').forEach(cb => villainIds.push(cb.value));
    } else {
      document.querySelectorAll('#userList input:checked').forEach(cb => villainIds.push(cb.value));
      document.querySelectorAll('#opponentList input:checked').forEach(cb => heroIds.push(cb.value));
    }
    
    if (heroIds.length === 0 || villainIds.length === 0) { 
      alert('Selecciona al menos un héroe y un villano para continuar'); 
      return; 
    }
    
    try {
      const resp = await fetch('/api/team-battles', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ heroIds, villainIds, mode: 'manual' })
      });
      
      battle = await resp.json();
      
      selectorsDiv.classList.add('hidden');
      battleDiv.classList.remove('hidden');
      
      // Añadir mensaje inicial
      const initialMessage = document.createElement('div');
      initialMessage.className = 'message system';
      initialMessage.innerText = '¡La batalla ha comenzado! Selecciona un personaje y realiza tu primer ataque.';
      messagesDiv.appendChild(initialMessage);
      
      updateBattleUI();
    } catch (err) {
      alert('Error iniciando batalla'); 
      console.error(err);
    }
  });

  attackBtn.addEventListener('click', async () => {
    const attackerId = attackerSelect.value;
    const targetId = targetSelect.value;
    const attackType = attackTypeSelect.value;
    
    if (!attackerId || !targetId) { 
      alert('Selecciona atacante y objetivo'); 
      return; 
    }
    
    try {
      const resp = await fetch(`/api/team-battles/${battle.id}/attack`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          attackerType: battle.characters.find(c => c.id === attackerId).type,
          attackerId, 
          targetId, 
          attackType
        })
      });
      
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        alert(err.error || 'Error en el servidor durante el ataque');
        return;
      }
      
      const result = await resp.json();
      battle = result.battle;
      
      const attacker = battle.characters.find(c => c.id === attackerId);
      const target = battle.characters.find(c => c.id === targetId);
      
      // Mensaje con mejor formato
      const msg = result.attackResult?.message || 'Ataque realizado';
      const messageEl = document.createElement('div');
      messageEl.className = `message ${attackType}`;
      messageEl.innerHTML = `<strong>${attacker.alias || attacker.name}</strong> ${msg}`;
      messagesDiv.appendChild(messageEl);
      
      // Auto-scroll al último mensaje
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      
      if (battle && Array.isArray(battle.characters)) {
        updateBattleUI();
      }
      
      if (battle.status === 'finished') {
        const endMessage = document.createElement('div');
        endMessage.className = 'message system';
        endMessage.innerHTML = '<strong>¡La batalla ha terminado!</strong> Haz clic en Finalizar Batalla para ver los resultados.';
        messagesDiv.appendChild(endMessage);
        
        finishBtn.classList.remove('hidden'); 
        attackBtn.disabled = true;
      }
    } catch (err) {
      alert('Error durante el ataque'); 
      console.error(err);
    }
  });

  finishBtn.addEventListener('click', async () => {
    try {
      const resp = await fetch(`/api/team-battles/${battle.id}/finish`, { method: 'POST' });
      const result = await resp.json();
      
      // Mostrar resultados en la sección de resultados
      if (result.result.includes('Heroes')) {
        resultTitle.innerText = '¡Victoria de los Héroes!';
        resultTitle.style.color = '#1890ff';
      } else if (result.result.includes('Villains')) {
        resultTitle.innerText = '¡Victoria de los Villanos!';
        resultTitle.style.color = '#ff1a1a';
      } else {
        resultTitle.innerText = '¡Empate!';
        resultTitle.style.color = '#666666';
      }
      
      resultStats.innerHTML = `<p><strong>${result.result}</strong></p>`;
      
      if (Array.isArray(result.statistics)) {
        resultStats.innerHTML += '<h3>Estadísticas de la batalla:</h3>';
        result.statistics.forEach(stat => {
          resultStats.innerHTML += `<p>${stat}</p>`;
        });
      }
      
      battleDiv.classList.add('hidden');
      resultsDiv.classList.remove('hidden');
      
    } catch (err) {
      alert('Error finalizando batalla'); 
      console.error(err);
    }
  });
  
  newBattleBtn.addEventListener('click', () => {
    // Resetear todo para una nueva batalla
    resultsDiv.classList.add('hidden');
    setupDiv.classList.remove('hidden');
    selectedSide = null;
    battle = null;
    sideOptions.forEach(opt => opt.classList.remove('selected'));
    messagesDiv.innerHTML = '';
    finishBtn.classList.add('hidden');
    attackBtn.disabled = false;
  });

  function updateBattleUI() {
    // Actualizar estadísticas de equipo
    heroesTeamStats.innerHTML = '';
    villainsTeamStats.innerHTML = '';
    
    if (battle && battle.characters) {
      const heroes = battle.characters.filter(c => c.type === 'hero');
      const villains = battle.characters.filter(c => c.type === 'villain');
      
      heroes.forEach(hero => {
        const hpPercentage = Math.max(0, (hero.hpCurrent / hero.hpMax) * 100);
        const heroDiv = document.createElement('div');
        heroDiv.className = `character-stats ${!hero.isAlive ? 'defeated' : ''}`;
        heroDiv.innerHTML = `
          <div>
            <strong>${hero.alias || hero.name}</strong>
            <div>HP: ${hero.hpCurrent}/${hero.hpMax} ${!hero.isAlive ? '(Caído)' : ''}</div>
            <div class="hp-bar">
              <div class="hp-fill" style="width: ${hpPercentage}%; 
                background-color: ${hpPercentage > 50 ? '#52c41a' : hpPercentage > 20 ? '#faad14' : '#ff4d4f'}">
              </div>
            </div>
          </div>
        `;
        heroesTeamStats.appendChild(heroDiv);
      });
      
      villains.forEach(villain => {
        const hpPercentage = Math.max(0, (villain.hpCurrent / villain.hpMax) * 100);
        const villainDiv = document.createElement('div');
        villainDiv.className = `character-stats ${!villain.isAlive ? 'defeated' : ''}`;
        villainDiv.innerHTML = `
          <div>
            <strong>${villain.alias || villain.name}</strong>
            <div>HP: ${villain.hpCurrent}/${villain.hpMax} ${!villain.isAlive ? '(Caído)' : ''}</div>
            <div class="hp-bar">
              <div class="hp-fill" style="width: ${hpPercentage}%; 
                background-color: ${hpPercentage > 50 ? '#52c41a' : hpPercentage > 20 ? '#faad14' : '#ff4d4f'}">
              </div>
            </div>
          </div>
        `;
        villainsTeamStats.appendChild(villainDiv);
      });
    }
    
    // Actualizar selects de acción
    attackerSelect.innerHTML = '';
    targetSelect.innerHTML = '';
    
    if (battle && battle.characters) {
      const userType = selectedSide === 'heroes' ? 'hero' : 'villain';
      
      // Opciones de atacante (personajes del usuario que estén vivos)
      const userCharacters = battle.characters.filter(c => c.type === userType && c.isAlive);
      userCharacters.forEach(character => {
        const option = document.createElement('option');
        option.value = character.id;
        option.innerText = `${character.alias || character.name}`;
        attackerSelect.appendChild(option);
      });
      
      // Si hay atacante seleccionado, mostrar objetivos posibles
      if (attackerSelect.value) {
        const targetType = userType === 'hero' ? 'villain' : 'hero';
        const targetCharacters = battle.characters.filter(c => c.type === targetType && c.isAlive);
        
        targetCharacters.forEach(character => {
          const option = document.createElement('option');
          option.value = character.id;
          option.innerText = `${character.alias || character.name}`;
          targetSelect.appendChild(option);
        });
      }
    }
    
    // Establecer el battle-info para compatibilidad con el e2e test
    if (!document.getElementById('battle-info')) {
      const battleInfoHidden = document.createElement('div');
      battleInfoHidden.id = 'battle-info';
      battleInfoHidden.style.display = 'none';
      battleInfoHidden.innerText = JSON.stringify(battle);
      document.body.appendChild(battleInfoHidden);
    } else {
      document.getElementById('battle-info').innerText = JSON.stringify(battle);
    }
    
    // Crear div de resultados para el e2e test si no existe
    if (!document.getElementById('results-info') && battle) {
      const resultsInfo = document.createElement('div');
      resultsInfo.id = 'results-info';
      resultsInfo.style.display = 'none';
      resultsInfo.innerText = `Batalla de equipos ${battle.id} - Estado: ${battle.status}`;
      document.body.appendChild(resultsInfo);
    }
  }
  
  // Función para cargar batallas en la vista de listado
  async function loadTeamBattles() {
    try {
      const response = await fetch('/api/team-battles');
      const battles = await response.json();
      
      const battlesList = document.getElementById('teamBattlesList');
      battlesList.innerHTML = '';
      
      if (battles.length === 0) {
        battlesList.innerHTML = '<p>No hay batallas de equipo disponibles. ¡Crea una nueva!</p>';
        return;
      }
      
      battles.forEach(battle => {
        const battleCard = document.createElement('div');
        battleCard.className = `battle-card ${getBattleStatusClass(battle)}`;
        
        // Contar héroes y villanos vivos
        const heroesAlive = battle.characters.filter(c => c.type === 'hero' && c.isAlive).length;
        const heroesTotal = battle.characters.filter(c => c.type === 'hero').length;
        const villainsAlive = battle.characters.filter(c => c.type === 'villain' && c.isAlive).length;
        const villainsTotal = battle.characters.filter(c => c.type === 'villain').length;
        
        battleCard.innerHTML = `
          <h3>Batalla #${battle.id}</h3>
          <div class="battle-details">
            <div><strong>Estado:</strong> ${battle.status === 'ongoing' ? 'En progreso' : 'Finalizada'}</div>
            <div><strong>Ronda actual:</strong> ${battle.currentRound}</div>
            <div class="team-status">
              <div><strong>Héroes:</strong> ${heroesAlive}/${heroesTotal} activos</div>
              <div><strong>Villanos:</strong> ${villainsAlive}/${villainsTotal} activos</div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 15px;">
            <button class="btn btn-primary view-battle-btn" data-id="${battle.id}">Ver detalles</button>
          </div>
        `;
        
        battlesList.appendChild(battleCard);
      });
      
      // Añadir eventos a los botones
      document.querySelectorAll('.view-battle-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          try {
            const battleId = btn.getAttribute('data-id');
            const resp = await fetch(`/api/team-battles/${battleId}`);
            battle = await resp.json();
            
            // Cargar la vista de batalla
            viewBattles.classList.add('hidden');
            createBattle.classList.remove('hidden');
            setupDiv.classList.add('hidden');
            selectorsDiv.classList.add('hidden');
            
            // Determinar qué vista mostrar según el estado de la batalla
            if (battle.status === 'ongoing') {
              battleDiv.classList.remove('hidden');
              resultsDiv.classList.add('hidden');
              selectedSide = battle.characters.some(c => c.type === 'hero') ? 'heroes' : 'villains';
              updateBattleUI();
            } else {
              battleDiv.classList.add('hidden');
              resultsDiv.classList.remove('hidden');
              
              // Mostrar resultados
              const heroesLeft = battle.characters.filter(c => c.type === 'hero' && c.isAlive).length;
              const villainsLeft = battle.characters.filter(c => c.type === 'villain' && c.isAlive).length;
              
              if (heroesLeft > villainsLeft) {
                resultTitle.innerText = '¡Victoria de los Héroes!';
                resultTitle.style.color = '#1890ff';
              } else if (villainsLeft > heroesLeft) {
                resultTitle.innerText = '¡Victoria de los Villanos!';
                resultTitle.style.color = '#ff1a1a';
              } else {
                resultTitle.innerText = '¡Empate!';
                resultTitle.style.color = '#666666';
              }
              
              resultStats.innerHTML = `
                <p><strong>Rondas jugadas:</strong> ${battle.currentRound}</p>
                <p><strong>Héroes sobrevivientes:</strong> ${heroesLeft}/${battle.characters.filter(c => c.type === 'hero').length}</p>
                <p><strong>Villanos sobrevivientes:</strong> ${villainsLeft}/${battle.characters.filter(c => c.type === 'villain').length}</p>
              `;
            }
          } catch (err) {
            alert('Error cargando la batalla');
            console.error(err);
          }
        });
      });
      
    } catch (err) {
      console.error('Error cargando batallas:', err);
    }
  }
  
  function getBattleStatusClass(battle) {
    if (battle.status === 'finished') {
      const heroesLeft = battle.characters.filter(c => c.type === 'hero' && c.isAlive).length;
      const villainsLeft = battle.characters.filter(c => c.type === 'villain' && c.isAlive).length;
      
      if (heroesLeft > villainsLeft) return 'heroes-winning';
      if (villainsLeft > heroesLeft) return 'villains-winning';
      return 'draw';
    }
    return 'ongoing';
  }
});
