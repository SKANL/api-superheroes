document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const viewHeroesDiv = document.getElementById('viewHeroes');
  const createHeroDiv = document.getElementById('createHero');
  const editHeroDiv = document.getElementById('editHero');
  const viewTab = document.getElementById('viewTab');
  const createTab = document.getElementById('createTab');
  const heroesList = document.getElementById('heroesList');
  const heroForm = document.getElementById('heroForm');
  const editHeroForm = document.getElementById('editHeroForm');
  const searchInput = document.getElementById('searchInput');
  const cityFilter = document.getElementById('cityFilter');
  const cancelEditButton = document.getElementById('cancelEdit');
  
  let heroes = [];
  let cities = new Set();
  
  // Eventos para pestañas
  viewTab.addEventListener('click', () => {
    viewHeroesDiv.classList.remove('hidden');
    createHeroDiv.classList.add('hidden');
    editHeroDiv.classList.add('hidden');
    viewTab.classList.add('active');
    createTab.classList.remove('active');
    loadHeroes();
  });
  
  createTab.addEventListener('click', () => {
    viewHeroesDiv.classList.add('hidden');
    createHeroDiv.classList.remove('hidden');
    editHeroDiv.classList.add('hidden');
    viewTab.classList.remove('active');
    createTab.classList.add('active');
  });
  
  // Cancelar edición
  cancelEditButton.addEventListener('click', () => {
    editHeroDiv.classList.add('hidden');
    viewHeroesDiv.classList.remove('hidden');
  });
  
  // Cargar héroes al inicio
  loadHeroes();
  
  // Búsqueda de héroes
  searchInput.addEventListener('input', filterHeroes);
  cityFilter.addEventListener('change', filterHeroes);
  
  // Formulario para crear héroe
  heroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newHero = {
      name: document.getElementById('name').value,
      alias: document.getElementById('alias').value,
      city: document.getElementById('city').value,
      team: document.getElementById('team').value,
      health: parseInt(document.getElementById('health').value),
      attack: parseInt(document.getElementById('attack').value),
      defense: parseInt(document.getElementById('defense').value),
      specialAbility: document.getElementById('specialAbility').value,
      speed: parseInt(document.getElementById('speed').value),
      critChance: parseInt(document.getElementById('critChance').value),
      isAlive: document.getElementById('isAlive').value === 'true',
      roundsWon: parseInt(document.getElementById('roundsWon').value),
      damage: parseInt(document.getElementById('damage').value),
      status: document.getElementById('status').value,
      stamina: parseInt(document.getElementById('stamina').value),
      teamAffinity: parseInt(document.getElementById('teamAffinity').value),
      energyCost: parseInt(document.getElementById('energyCost').value),
      damageReduction: parseInt(document.getElementById('damageReduction').value)
    };
    
    try {
      const response = await fetch('/api/heroes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHero)
      });
      
      if (!response.ok) {
        const payload = await response.json();
        const msg = payload.errors
          ? payload.errors.map(e => e.msg).join(', ')
          : payload.error || payload.message || 'Error al crear el héroe';
        throw new Error(msg);
      }
      
      const createdHero = await response.json();
      alert('Héroe creado con éxito');
      heroForm.reset();
      
      // Volver a la vista de héroes y actualizar
      viewTab.click();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  
  // Formulario para editar héroe
  editHeroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const heroId = document.getElementById('editHeroId').value;
    
    const updatedHero = {
      name: document.getElementById('editName').value,
      alias: document.getElementById('editAlias').value,
      city: document.getElementById('editCity').value,
      team: document.getElementById('editTeam').value,
      health: parseInt(document.getElementById('editHealth').value),
      attack: parseInt(document.getElementById('editAttack').value),
      defense: parseInt(document.getElementById('editDefense').value),
      specialAbility: document.getElementById('editSpecialAbility').value,
      speed: parseInt(document.getElementById('editSpeed').value),
      critChance: parseInt(document.getElementById('editCritChance').value),
      isAlive: document.getElementById('editIsAlive').value === 'true',
      roundsWon: parseInt(document.getElementById('editRoundsWon').value),
      damage: parseInt(document.getElementById('editDamage').value),
      status: document.getElementById('editStatus').value,
      stamina: parseInt(document.getElementById('editStamina').value),
      teamAffinity: parseInt(document.getElementById('editTeamAffinity').value),
      energyCost: parseInt(document.getElementById('editEnergyCost').value),
      damageReduction: parseInt(document.getElementById('editDamageReduction').value)
    };
    
    try {
      const response = await fetch(`/api/heroes/${heroId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedHero)
      });
      
      if (!response.ok) {
        const payload = await response.json();
        const msg = payload.errors
          ? payload.errors.map(e => e.msg).join(', ')
          : payload.error || payload.message || 'Error al actualizar el héroe';
        throw new Error(msg);
      }
      
      alert('Héroe actualizado con éxito');
      
      // Volver a la vista de héroes y actualizar
      editHeroDiv.classList.add('hidden');
      viewHeroesDiv.classList.remove('hidden');
      loadHeroes();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  
  // Funciones
  async function loadHeroes() {
    try {
      const response = await fetch('/api/heroes');
      heroes = await response.json();
      
      // Recopilar ciudades para el filtro
      cities = new Set();
      heroes.forEach(hero => {
        if (hero.city) {
          cities.add(hero.city);
        }
      });
      
      // Actualizar el selector de ciudades
      cityFilter.innerHTML = '<option value="">Todas las ciudades</option>';
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
      });
      
      renderHeroes(heroes);
    } catch (error) {
      console.error('Error cargando héroes:', error);
      heroesList.innerHTML = '<p>Error al cargar los héroes. Intenta de nuevo más tarde.</p>';
    }
  }
  
  function renderHeroes(heroesToRender) {
    heroesList.innerHTML = '';
    
    if (heroesToRender.length === 0) {
      heroesList.innerHTML = '<p>No se encontraron héroes que coincidan con tu búsqueda.</p>';
      return;
    }
    
    heroesToRender.forEach(hero => {
      const heroCard = document.createElement('div');
      heroCard.className = 'hero-card';
      
      heroCard.innerHTML = `
        <h3>${hero.name} (${hero.alias})</h3>
        <p><strong>Ciudad:</strong> ${hero.city || 'No especificada'}</p>
        <p><strong>Equipo:</strong> ${hero.team || 'No especificado'}</p>
        <div class="stats">
          <p><strong>Salud:</strong> ${hero.health}</p>
          <p><strong>Ataque:</strong> ${hero.attack}</p>
          <p><strong>Defensa:</strong> ${hero.defense}</p>
          <p><strong>Velocidad:</strong> ${hero.speed}</p>
          <p><strong>Prob. Crítico:</strong> ${hero.critChance}%</p>
          <p><strong>Habilidad Especial:</strong> ${hero.specialAbility}</p>
        </div>
        <div class="actions">
          <button class="edit-btn" data-id="${hero.id}">Editar</button>
          <button class="delete-btn" data-id="${hero.id}">Eliminar</button>
        </div>
      `;
      
      heroesList.appendChild(heroCard);
      
      // Eventos para los botones de editar y eliminar
      heroCard.querySelector('.edit-btn').addEventListener('click', () => editHero(hero.id));
      heroCard.querySelector('.delete-btn').addEventListener('click', () => deleteHero(hero.id, hero.name));
    });
  }
  
  function filterHeroes() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCity = cityFilter.value;
    
    const filteredHeroes = heroes.filter(hero => {
      const nameMatch = hero.name?.toLowerCase().includes(searchTerm) || 
                        hero.alias?.toLowerCase().includes(searchTerm);
      const cityMatch = !selectedCity || hero.city === selectedCity;
      
      return nameMatch && cityMatch;
    });
    
    renderHeroes(filteredHeroes);
  }
  
  async function editHero(id) {
    try {
      const response = await fetch(`/api/heroes/${id}`);
      const hero = await response.json();
      
      // Rellenar el formulario de edición
      document.getElementById('editHeroId').value = hero.id;
      document.getElementById('editName').value = hero.name;
      document.getElementById('editAlias').value = hero.alias;
      document.getElementById('editCity').value = hero.city;
      document.getElementById('editTeam').value = hero.team || '';
      document.getElementById('editHealth').value = hero.health;
      document.getElementById('editAttack').value = hero.attack;
      document.getElementById('editDefense').value = hero.defense;
      document.getElementById('editSpecialAbility').value = hero.specialAbility;
      document.getElementById('editSpeed').value = hero.speed;
      document.getElementById('editCritChance').value = hero.critChance;
      
      // Mostrar formulario de edición
      viewHeroesDiv.classList.add('hidden');
      createHeroDiv.classList.add('hidden');
      editHeroDiv.classList.remove('hidden');
    } catch (error) {
      alert(`Error al cargar los datos del héroe: ${error.message}`);
    }
  }
  
  async function deleteHero(id, name) {
    if (confirm(`¿Estás seguro de que deseas eliminar al héroe ${name}?`)) {
      try {
        const response = await fetch(`/api/heroes/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const payload = await response.json();
          const msg = payload.errors
            ? payload.errors.map(e => e.msg).join(', ')
            : payload.error || payload.message || 'Error al eliminar el héroe';
          throw new Error(msg);
        }
        
        alert('Héroe eliminado con éxito');
        loadHeroes();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  }
});
