document.addEventListener('DOMContentLoaded', async () => {
  // Importar servicios
  const authService = (await import('/shared/auth.service.js')).default;
  await import('/shared/role-manager.js');
  const roleManager = new RoleManager(authService);
  
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

  // Funciones auxiliares
  async function loadHeroes() {
    try {
      const response = await fetch('/api/heroes', {
        headers: authService.getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          window.location = '/auth';
          return;
        }
        throw new Error('Error al cargar héroes');
      }
      
      heroes = await response.json();
      updateCities();
      displayHeroes(heroes);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  }

  function updateCities() {
    cities.clear();
    heroes.forEach(hero => cities.add(hero.city));
    
    cityFilter.innerHTML = '<option value="">Todas las ciudades</option>';
    Array.from(cities).sort().forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });
  }

  function displayHeroes(heroesToShow) {
    const user = authService.getUser();
    heroesList.innerHTML = '';
    
    heroesToShow.forEach(hero => {
      const heroCard = document.createElement('div');
      heroCard.className = 'hero-card';
      
      // Verificar si el usuario puede editar/eliminar este héroe
      const isOwner = hero.owner === user?.id;
      const isAdmin = authService.isAdmin();
      const canEdit = isAdmin || isOwner;
      
      heroCard.innerHTML = `
        <h3>${hero.name} (${hero.alias})</h3>
        <p><strong>Ciudad:</strong> ${hero.city}</p>
        <p><strong>Equipo:</strong> ${hero.team || 'Sin equipo'}</p>
        <p><strong>Propietario:</strong> ${hero.owner || 'N/A'}</p>
        <div class="stats">
          <p><strong>Salud:</strong> ${hero.health} | <strong>Ataque:</strong> ${hero.attack}</p>
          <p><strong>Defensa:</strong> ${hero.defense} | <strong>Velocidad:</strong> ${hero.speed}</p>
          <p><strong>Estado:</strong> ${hero.isAlive ? 'Vivo' : 'Muerto'} | <strong>Stamina:</strong> ${hero.stamina}</p>
        </div>
        <div class="actions">
          ${canEdit ? `<button class="edit-btn" data-hero-id="${hero.id}">Editar</button>` : ''}
          ${canEdit ? `<button class="delete-btn" data-hero-id="${hero.id}" data-hero-name="${hero.name}" style="background-color: #ff4d4f;">Eliminar</button>` : ''}
        </div>
      `;
      
      // Agregar event listeners para los botones
      if (canEdit) {
        const editBtn = heroCard.querySelector('.edit-btn');
        const deleteBtn = heroCard.querySelector('.delete-btn');
        
        if (editBtn) {
          editBtn.addEventListener('click', () => editHero(hero.id));
        }
        
        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => deleteHero(hero.id, hero.name));
        }
      }
      
      heroesList.appendChild(heroCard);
    });
  }

  function filterHeroes() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCity = cityFilter.value;
    
    const filteredHeroes = heroes.filter(hero => {
      const matchesSearch = hero.name.toLowerCase().includes(searchTerm) || 
                           hero.alias.toLowerCase().includes(searchTerm);
      const matchesCity = !selectedCity || hero.city === selectedCity;
      return matchesSearch && matchesCity;
    });
    
    displayHeroes(filteredHeroes);
  }

  // Funciones para botones (ya no globales)
  async function editHero(heroId) {
    try {
      const response = await fetch(`/api/heroes/${heroId}`, {
        headers: authService.getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Error al cargar héroe');
      
      const hero = await response.json();
      
      // Llenar formulario de edición
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
      document.getElementById('editIsAlive').value = hero.isAlive;
      document.getElementById('editRoundsWon').value = hero.roundsWon;
      document.getElementById('editDamage').value = hero.damage;
      document.getElementById('editStatus').value = hero.status;
      document.getElementById('editStamina').value = hero.stamina;
      document.getElementById('editTeamAffinity').value = hero.teamAffinity;
      document.getElementById('editEnergyCost').value = hero.energyCost;
      document.getElementById('editDamageReduction').value = hero.damageReduction;
      
      // Configurar formulario según permisos
      roleManager.setupLimitedEditForm();
      
      // Mostrar formulario de edición
      viewHeroesDiv.classList.add('hidden');
      editHeroDiv.classList.remove('hidden');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  async function deleteHero(heroId, heroName) {
    if (confirm(`¿Estás seguro de que deseas eliminar al héroe ${heroName}?`)) {
      try {
        const response = await fetch(`/api/heroes/${heroId}`, {
          method: 'DELETE',
          headers: authService.getAuthHeaders()
        });
        
        if (!response.ok) {
          const payload = await response.json();
          const msg = payload.error || payload.message || 'Error al eliminar el héroe';
          throw new Error(msg);
        }
        
        alert('Héroe eliminado con éxito');
        loadHeroes();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  }

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
    // Verificar permisos antes de permitir acceso a crear
    if (!authService.canCreateEntities()) {
      roleManager.showAccessDeniedMessage('crear héroes');
      return;
    }
    
    viewHeroesDiv.classList.add('hidden');
    createHeroDiv.classList.remove('hidden');
    editHeroDiv.classList.add('hidden');
    viewTab.classList.remove('active');
    createTab.classList.add('active');
  });
  
  // Cancelar edición
  cancelEditButton?.addEventListener('click', () => {
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
    
    // Verificar permisos
    if (!authService.canCreateEntities()) {
      roleManager.showAccessDeniedMessage('crear héroes');
      return;
    }
    
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
        headers: authService.getAuthHeaders(),
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
  editHeroForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const heroId = document.getElementById('editHeroId').value;
    
    // Obtener el héroe original para preservar el owner
    const originalHero = heroes.find(h => h.id === heroId);
    if (!originalHero) {
      alert('Error: No se encontró el héroe original');
      return;
    }
    
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
      damageReduction: parseInt(document.getElementById('editDamageReduction').value),
      owner: originalHero.owner // Preservar el owner original
    };
    
    try {
      const response = await fetch(`/api/heroes/${heroId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
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
      editHeroDiv.classList.add('hidden');
      viewHeroesDiv.classList.remove('hidden');
      loadHeroes();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
});
