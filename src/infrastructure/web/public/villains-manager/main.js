document.addEventListener('DOMContentLoaded', () => {
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
    viewVillainsDiv.classList.add('hidden');
    createVillainDiv.classList.remove('hidden');
    editVillainDiv.classList.add('hidden');
    viewTab.classList.remove('active');
    createTab.classList.add('active');
  });
  
  // Cancelar edición
  cancelEditButton.addEventListener('click', () => {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVillain)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el villano');
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
  editVillainForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const villainId = document.getElementById('editVillainId').value;
    
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
      damageReduction: parseInt(document.getElementById('editDamageReduction').value)
    };
    
    try {
      const response = await fetch(`/api/villains/${villainId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVillain)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el villano');
      }
      
      alert('Villano actualizado con éxito');
      
      // Volver a la vista de villanos y actualizar
      editVillainDiv.classList.add('hidden');
      viewVillainsDiv.classList.remove('hidden');
      loadVillains();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  
  // Funciones
  async function loadVillains() {
    try {
      const response = await fetch('/api/villains');
      villains = await response.json();
      
      // Recopilar ciudades para el filtro
      cities = new Set();
      villains.forEach(villain => {
        if (villain.city) {
          cities.add(villain.city);
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
      
      renderVillains(villains);
    } catch (error) {
      console.error('Error cargando villanos:', error);
      villainsList.innerHTML = '<p>Error al cargar los villanos. Intenta de nuevo más tarde.</p>';
    }
  }
  
  function renderVillains(villainsToRender) {
    villainsList.innerHTML = '';
    
    if (villainsToRender.length === 0) {
      villainsList.innerHTML = '<p>No se encontraron villanos que coincidan con tu búsqueda.</p>';
      return;
    }
    
    villainsToRender.forEach(villain => {
      const villainCard = document.createElement('div');
      villainCard.className = 'villain-card';
      
      villainCard.innerHTML = `
        <h3>${villain.name} (${villain.alias})</h3>
        <p><strong>Ciudad:</strong> ${villain.city || 'No especificada'}</p>
        <p><strong>Equipo:</strong> ${villain.team || 'No especificado'}</p>
        <div class="stats">
          <p><strong>Salud:</strong> ${villain.health}</p>
          <p><strong>Ataque:</strong> ${villain.attack}</p>
          <p><strong>Defensa:</strong> ${villain.defense}</p>
          <p><strong>Velocidad:</strong> ${villain.speed}</p>
          <p><strong>Prob. Crítico:</strong> ${villain.critChance}%</p>
          <p><strong>Habilidad Especial:</strong> ${villain.specialAbility}</p>
        </div>
        <div class="actions">
          <button class="edit-btn" data-id="${villain.id}">Editar</button>
          <button class="delete-btn" data-id="${villain.id}">Eliminar</button>
        </div>
      `;
      
      villainsList.appendChild(villainCard);
      
      // Eventos para los botones de editar y eliminar
      villainCard.querySelector('.edit-btn').addEventListener('click', () => editVillain(villain.id));
      villainCard.querySelector('.delete-btn').addEventListener('click', () => deleteVillain(villain.id, villain.name));
    });
  }
  
  function filterVillains() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCity = cityFilter.value;
    
    const filteredVillains = villains.filter(villain => {
      const nameMatch = villain.name?.toLowerCase().includes(searchTerm) || 
                         villain.alias?.toLowerCase().includes(searchTerm);
      const cityMatch = !selectedCity || villain.city === selectedCity;
      
      return nameMatch && cityMatch;
    });
    
    renderVillains(filteredVillains);
  }
  
  async function editVillain(id) {
    try {
      const response = await fetch(`/api/villains/${id}`);
      const villain = await response.json();
      
      // Rellenar el formulario de edición con todos los campos
      document.getElementById('editVillainId').value = villain.id;
      document.getElementById('editName').value = villain.name;
      document.getElementById('editAlias').value = villain.alias;
      document.getElementById('editCity').value = villain.city;
      document.getElementById('editTeam').value = villain.team || '';
      document.getElementById('editHealth').value = villain.health || villain.hpMax || 100;
      document.getElementById('editAttack').value = villain.attack || 50;
      document.getElementById('editDefense').value = villain.defense || 30;
      document.getElementById('editSpecialAbility').value = villain.specialAbility || 'Dark Attack';
      document.getElementById('editSpeed').value = villain.speed || 50;
      document.getElementById('editCritChance').value = villain.critChance || 10;
      document.getElementById('editIsAlive').value = villain.isAlive !== false ? 'true' : 'false';
      document.getElementById('editRoundsWon').value = villain.roundsWon || 0;
      document.getElementById('editDamage').value = villain.damage || 0;
      document.getElementById('editStatus').value = villain.status || 'normal';
      document.getElementById('editStamina').value = villain.stamina || 100;
      document.getElementById('editTeamAffinity').value = villain.teamAffinity || 0;
      document.getElementById('editEnergyCost').value = villain.energyCost || 20;
      document.getElementById('editDamageReduction').value = villain.damageReduction || 0;
      
      // Mostrar formulario de edición
      viewVillainsDiv.classList.add('hidden');
      createVillainDiv.classList.add('hidden');
      editVillainDiv.classList.remove('hidden');
    } catch (error) {
      alert(`Error al cargar los datos del villano: ${error.message}`);
    }
  }
  
  async function deleteVillain(id, name) {
    if (confirm(`¿Estás seguro de que deseas eliminar al villano ${name}?`)) {
      try {
        const response = await fetch(`/api/villains/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al eliminar el villano');
        }
        
        alert('Villano eliminado con éxito');
        loadVillains();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  }
});
