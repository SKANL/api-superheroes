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
  const locationInput = document.getElementById('locationInput');
  const createBattleBtn = document.getElementById('createBattleBtn');
  const backToListBtn = document.getElementById('backToListBtn');
  
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
  
  createTab.addEventListener('click', () => {
    viewBattlesDiv.classList.add('hidden');
    createBattleDiv.classList.remove('hidden');
    battleDetailDiv.classList.add('hidden');
    viewTab.classList.remove('active');
    createTab.classList.add('active');
    loadHeroesAndVillains();
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
      
      battleInfo.innerHTML = `
        <h3>Batalla #${battle.id}</h3>
        <p><strong>Fecha:</strong> ${new Date(battle.date).toLocaleDateString()}</p>
        <p><strong>Ubicación:</strong> ${battle.location || 'No especificada'}</p>
        
        <h3>Participantes</h3>
        <div class="hero-data">
          <h4>${battle.hero?.name || 'Desconocido'} (${battle.hero?.alias || 'N/A'})</h4>
          <p><strong>Ciudad:</strong> ${battle.hero?.city || 'No especificada'}</p>
          <p><strong>Estadísticas:</strong></p>
          <ul>
            <li>Salud: ${battle.hero?.health || 'N/A'}</li>
            <li>Ataque: ${battle.hero?.attack || 'N/A'}</li>
            <li>Defensa: ${battle.hero?.defense || 'N/A'}</li>
            <li>Habilidad Especial: ${battle.hero?.specialAbility || 'N/A'}</li>
          </ul>
          <p><strong>Daño causado:</strong> ${battle.heroDamage || 0}</p>
        </div>
        
        <div class="villain-data">
          <h4>${battle.villain?.name || 'Desconocido'} (${battle.villain?.alias || 'N/A'})</h4>
          <p><strong>Ciudad:</strong> ${battle.villain?.city || 'No especificada'}</p>
          <p><strong>Estadísticas:</strong></p>
          <ul>
            <li>Salud: ${battle.villain?.health || 'N/A'}</li>
            <li>Ataque: ${battle.villain?.attack || 'N/A'}</li>
            <li>Defensa: ${battle.villain?.defense || 'N/A'}</li>
            <li>Habilidad Especial: ${battle.villain?.specialAbility || 'N/A'}</li>
          </ul>
          <p><strong>Daño causado:</strong> ${battle.villainDamage || 0}</p>
        </div>
        
        <div class="result ${resultClass}">
          <strong>Resultado Final:</strong> ${resultText}
        </div>
        
        ${battle.rounds ? `
          <h3>Rondas</h3>
          <ul>
            ${battle.rounds.map(round => `
              <li>
                <p><strong>Ronda ${round.number}:</strong> ${round.description || 'Sin descripción'}</p>
                <p><strong>Ganador de la ronda:</strong> ${round.winner || 'Indeterminado'}</p>
              </li>
            `).join('')}
          </ul>
        ` : ''}
      `;
      
      viewBattlesDiv.classList.add('hidden');
      createBattleDiv.classList.add('hidden');
      battleDetailDiv.classList.remove('hidden');
    } catch (error) {
      console.error('Error cargando detalles de batalla:', error);
      alert('Error al cargar los detalles de la batalla. Intenta de nuevo más tarde.');
    }
  }
  
  async function createBattle() {
    const heroId = heroSelect.value;
    const villainId = villainSelect.value;
    const location = locationInput.value;
    
    if (!heroId || !villainId) {
      alert('Debes seleccionar un héroe y un villano para crear una batalla.');
      return;
    }
    
    const battleData = {
      heroId,
      villainId,
      location
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
      locationInput.value = '';
      
      // Ver detalles de la batalla creada
      viewBattleDetails(createdBattle.id);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }
});
