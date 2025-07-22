document.addEventListener('DOMContentLoaded', async () => {
  // Importar servicios
  const authService = (await import('/shared/auth.service.js')).default;
  await import('/shared/role-manager.js');
  const roleManager = new RoleManager(authService);
  
  // Elementos del DOM
  const viewVillainsDiv = document.getElementById('viewVillains');
  const createVillainDiv = document.getElementById('createVillain');
  const editVillainDiv = document.getElementById('editVillain');
  const viewTab = document.getElementById('viewTab');
  const createTab = document.getElementById('createTab');
  const villainsList = document.getElementById('villainsList');
  const villainForm = document.getElementById('villainForm');
  const editVillainForm = document.getElementById('editVillainForm');
  const searchInput = document.getElementById('searchInput');
  const cityFilter = document.getElementById('cityFilter');
  const cancelEditButton = document.getElementById('cancelEdit');
  
  let villains = [];
  let cities = new Set();

  // Funciones auxiliares
  async function loadVillains() {
    try {
      const response = await fetch('/api/villains', {
        headers: authService.getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          window.location = '/auth';
          return;
        }
        throw new Error('Error al cargar villanos');
      }
      
      villains = await response.json();
      updateCities();
      displayVillains(villains);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  }

  function updateCities() {
    cities.clear();
    villains.forEach(villain => cities.add(villain.city));
    
    cityFilter.innerHTML = '<option value="">Todas las ciudades</option>';
    Array.from(cities).sort().forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });
  }

  function displayVillains(villainsToShow) {
    const user = authService.getUser();
    villainsList.innerHTML = '';
    
    villainsToShow.forEach(villain => {
      const villainCard = document.createElement('div');
      villainCard.className = 'villain-card';
      
      // Verificar si el usuario puede editar/eliminar este villano
      const isOwner = villain.owner === user?.id;
      const isAdmin = authService.isAdmin();
      const canEdit = isAdmin || isOwner;
      
      villainCard.innerHTML = `
        <h3>${villain.name} (${villain.alias})</h3>
        <p><strong>Ciudad:</strong> ${villain.city}</p>
        <p><strong>Equipo:</strong> ${villain.team || 'Sin equipo'}</p>
        <p><strong>Propietario:</strong> ${villain.owner || 'N/A'}</p>
        <div class="stats">
          <p><strong>Salud:</strong> ${villain.health} | <strong>Ataque:</strong> ${villain.attack}</p>
          <p><strong>Defensa:</strong> ${villain.defense} | <strong>Velocidad:</strong> ${villain.speed}</p>
          <p><strong>Estado:</strong> ${villain.isAlive ? 'Vivo' : 'Muerto'} | <strong>Stamina:</strong> ${villain.stamina}</p>
        </div>
        <div class="actions">
          ${canEdit ? `<button class="edit-btn" data-villain-id="${villain.id}">Editar</button>` : ''}
          ${canEdit ? `<button class="delete-btn" data-villain-id="${villain.id}" data-villain-name="${villain.name}" style="background-color: #ff4d4f;">Eliminar</button>` : ''}
        </div>
      `;
      
      // Agregar event listeners para los botones
      if (canEdit) {
        const editBtn = villainCard.querySelector('.edit-btn');
        const deleteBtn = villainCard.querySelector('.delete-btn');
        
        if (editBtn) {
          editBtn.addEventListener('click', () => editVillain(villain.id));
        }
        
        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => deleteVillain(villain.id, villain.name));
        }
      }
      
      villainsList.appendChild(villainCard);
    });
  }

  function filterVillains() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCity = cityFilter.value;
    
    const filteredVillains = villains.filter(villain => {
      const matchesSearch = villain.name.toLowerCase().includes(searchTerm) || 
                           villain.alias.toLowerCase().includes(searchTerm);
      const matchesCity = !selectedCity || villain.city === selectedCity;
      return matchesSearch && matchesCity;
    });
    
    displayVillains(filteredVillains);
  }

  // Funciones para botones (ya no globales)
  async function editVillain(villainId) {
    try {
      const response = await fetch(`/api/villains/${villainId}`, {
        headers: authService.getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Error al cargar villano');
      
      const villain = await response.json();
      
      // Llenar formulario de edición
      document.getElementById('editVillainId').value = villain.id;
      document.getElementById('editName').value = villain.name;
      document.getElementById('editAlias').value = villain.alias;
      document.getElementById('editCity').value = villain.city;
      document.getElementById('editTeam').value = villain.team || '';
      document.getElementById('editHealth').value = villain.health;
      document.getElementById('editAttack').value = villain.attack;
      document.getElementById('editDefense').value = villain.defense;
      document.getElementById('editSpecialAbility').value = villain.specialAbility;
      document.getElementById('editSpeed').value = villain.speed;
      document.getElementById('editCritChance').value = villain.critChance;
      document.getElementById('editIsAlive').value = villain.isAlive;
      document.getElementById('editRoundsWon').value = villain.roundsWon;
      document.getElementById('editDamage').value = villain.damage;
      document.getElementById('editStatus').value = villain.status;
      document.getElementById('editStamina').value = villain.stamina;
      document.getElementById('editTeamAffinity').value = villain.teamAffinity;
      document.getElementById('editEnergyCost').value = villain.energyCost;
      document.getElementById('editDamageReduction').value = villain.damageReduction;
      
      // Configurar formulario según permisos
      roleManager.setupLimitedEditForm();
      
      // Mostrar formulario de edición
      viewVillainsDiv.classList.add('hidden');
      editVillainDiv.classList.remove('hidden');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  async function deleteVillain(villainId, villainName) {
    if (confirm(`¿Estás seguro de que deseas eliminar al villano ${villainName}?`)) {
      try {
        const response = await fetch(`/api/villains/${villainId}`, {
          method: 'DELETE',
          headers: authService.getAuthHeaders()
        });
        
        if (!response.ok) {
          const payload = await response.json();
          const msg = payload.error || payload.message || 'Error al eliminar el villano';
          throw new Error(msg);
        }
        
        alert('Villano eliminado con éxito');
        loadVillains();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  }

  // Eventos para pestañas
  viewTab.addEventListener('click', () => {
    viewVillainsDiv.classList.remove('hidden');
    createVillainDiv.classList.add('hidden');
    editVillainDiv.classList.add('hidden');
    viewTab.classList.add('active');
    createTab.classList.remove('active');
    loadVillains();
  });
  
  createTab.addEventListener('click', () => {
    // Verificar permisos antes de permitir acceso a crear
    if (!authService.canCreateEntities()) {
      roleManager.showAccessDeniedMessage('crear villanos');
      return;
    }
    
    viewVillainsDiv.classList.add('hidden');
    createVillainDiv.classList.remove('hidden');
    editVillainDiv.classList.add('hidden');
    viewTab.classList.remove('active');
    createTab.classList.add('active');
  });
  
  // Cancelar edición
  cancelEditButton?.addEventListener('click', () => {
    editVillainDiv.classList.add('hidden');
    viewVillainsDiv.classList.remove('hidden');
  });
  
  // Cargar villanos al inicio
  loadVillains();
  
  // Búsqueda de villanos
  searchInput.addEventListener('input', filterVillains);
  cityFilter.addEventListener('change', filterVillains);
  
  // Formulario para crear villano
  villainForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Verificar permisos
    if (!authService.canCreateEntities()) {
      roleManager.showAccessDeniedMessage('crear villanos');
      return;
    }
    
    const newVillain = {
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
      const response = await fetch('/api/villains', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(newVillain)
      });
      
      if (!response.ok) {
        const payload = await response.json();
        const msg = payload.errors
          ? payload.errors.map(e => e.msg).join(', ')
          : payload.error || payload.message || 'Error al crear el villano';
        throw new Error(msg);
      }
      
      const createdVillain = await response.json();
      alert('Villano creado con éxito');
      villainForm.reset();
      
      // Volver a la vista de villanos y actualizar
      viewTab.click();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  
  // Formulario para editar villano
  editVillainForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const villainId = document.getElementById('editVillainId').value;
    
    // Obtener el villano original para preservar el owner
    const originalVillain = villains.find(v => v.id === villainId);
    if (!originalVillain) {
      alert('Error: No se encontró el villano original');
      return;
    }
    
    const updatedVillain = {
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
      owner: originalVillain.owner // Preservar el owner original
    };
    
    try {
      const response = await fetch(`/api/villains/${villainId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(updatedVillain)
      });
      
      if (!response.ok) {
        const payload = await response.json();
        const msg = payload.errors
          ? payload.errors.map(e => e.msg).join(', ')
          : payload.error || payload.message || 'Error al actualizar el villano';
        throw new Error(msg);
      }
      
      alert('Villano actualizado con éxito');
      editVillainDiv.classList.add('hidden');
      viewVillainsDiv.classList.remove('hidden');
      loadVillains();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
});
