/**
 * Utilidades para gestión de roles en la interfaz
 * Maneja la visibilidad y funcionalidad basada en roles de usuario
 */
class RoleManager {
  constructor(authService) {
    this.authService = authService;
    this.init();
  }

  /**
   * Inicializa el manejo de roles en la interfaz
   */
  init() {
    this.setupUserInfo();
    this.setupRoleBasedVisibility();
    this.addAuthStateListener();
  }

  /**
   * Configura la información del usuario en la interface
   */
  setupUserInfo() {
    const user = this.authService.getUser();
    if (!user) return;

    // Crear indicador de rol en el header
    const roleIndicator = document.createElement('div');
    roleIndicator.id = 'role-indicator';
    roleIndicator.className = 'role-indicator';
    roleIndicator.innerHTML = `
      <div class="user-info">
        <span class="username">${user.username}</span>
        <span class="role ${user.role}">${user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
      </div>
    `;

    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
      .role-indicator {
        position: absolute;
        top: 20px;
        right: 120px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
      }
      .user-info {
        display: flex;
        flex-direction: column;
        align-items: end;
        background: rgba(255, 255, 255, 0.9);
        padding: 8px 12px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .username {
        font-weight: bold;
        color: #333;
      }
      .role {
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        color: white;
      }
      .role.admin {
        background-color: #ff4d4f;
      }
      .role.user {
        background-color: #52c41a;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(roleIndicator);
  }

  /**
   * Configura la visibilidad de elementos basada en roles
   */
  setupRoleBasedVisibility() {
    // Ocultar/mostrar pestaña de crear según el rol
    const createTab = document.getElementById('createTab');
    if (createTab) {
      if (!this.authService.canCreateEntities()) {
        createTab.style.display = 'none';
        // Si está en la pestaña de crear y no puede, cambiar a ver
        if (createTab.classList.contains('active')) {
          document.getElementById('viewTab')?.click();
        }
      }
    }

    // Agregar indicadores de permisos
    this.addPermissionIndicators();
  }

  /**
   * Agrega indicadores visuales de permisos
   */
  addPermissionIndicators() {
    const user = this.authService.getUser();
    if (!user) return;

    // Agregar mensaje informativo según el rol
    const infoMessage = document.createElement('div');
    infoMessage.className = 'role-info-message';
    
    if (user.role === 'admin') {
      infoMessage.innerHTML = `
        <div class="permission-info admin-info">
          <strong>👑 Permisos de Administrador:</strong>
          <ul>
            <li>✅ Crear nuevos héroes y villanos</li>
            <li>✅ Editar todos los campos</li>
            <li>✅ Ver todas las entidades</li>
            <li>✅ Eliminar entidades propias</li>
          </ul>
        </div>
      `;
    } else {
      infoMessage.innerHTML = `
        <div class="permission-info user-info">
          <strong>👤 Permisos de Usuario:</strong>
          <ul>
            <li>❌ No puedes crear nuevos héroes o villanos</li>
            <li>⚠️ Solo puedes editar: equipo, estado, resistencia y HP actual</li>
            <li>✅ Puedes ver tus entidades y las del administrador</li>
            <li>✅ Puedes eliminar solo tus propias entidades</li>
          </ul>
        </div>
      `;
    }

    // Agregar estilos para los mensajes de permisos
    const permissionStyle = document.createElement('style');
    permissionStyle.textContent = `
      .role-info-message {
        margin: 15px 0;
        padding: 15px;
        border-radius: 8px;
        background-color: #f6ffed;
        border: 1px solid #d9f7be;
      }
      .permission-info {
        font-size: 14px;
      }
      .admin-info {
        background-color: #fff2f0;
        border-color: #ffccc7;
      }
      .permission-info ul {
        margin: 8px 0 0 0;
        padding-left: 20px;
      }
      .permission-info li {
        margin: 4px 0;
      }
    `;
    document.head.appendChild(permissionStyle);

    // Insertar después del header
    const header = document.querySelector('header');
    if (header) {
      header.insertAdjacentElement('afterend', infoMessage);
    }
  }

  /**
   * Configura formularios para usuarios con permisos limitados
   */
  setupLimitedEditForm() {
    if (this.authService.canFullEdit()) return; // Admin puede editar todo

    // Campos que los usuarios normales pueden editar
    const allowedFields = ['team', 'status', 'stamina', 'hpCurrent'];
    
    // Deshabilitar campos no permitidos en formularios de edición
    const editForm = document.getElementById('editHeroForm') || document.getElementById('editVillainForm');
    if (editForm) {
      const inputs = editForm.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        if (!allowedFields.includes(input.id) && !allowedFields.includes(input.name)) {
          input.disabled = true;
          input.style.backgroundColor = '#f5f5f5';
          input.title = 'Solo los administradores pueden editar este campo';
        }
      });
    }
  }

  /**
   * Filtra botones de acción según permisos
   */
  setupActionButtons(entityOwnerId) {
    const user = this.authService.getUser();
    if (!user) return;

    // Lógica para mostrar/ocultar botones de edición y eliminación
    const editButtons = document.querySelectorAll('.edit-btn, [data-action="edit"]');
    const deleteButtons = document.querySelectorAll('.delete-btn, [data-action="delete"]');

    editButtons.forEach(btn => {
      const canEdit = user.role === 'admin' || entityOwnerId === user.id;
      if (!canEdit) {
        btn.style.display = 'none';
      }
    });

    deleteButtons.forEach(btn => {
      const canDelete = user.role === 'admin' || entityOwnerId === user.id;
      if (!canDelete) {
        btn.style.display = 'none';
      }
    });
  }

  /**
   * Agrega listener para cambios en el estado de autenticación
   */
  addAuthStateListener() {
    this.authService.addAuthStateListener((authState) => {
      if (authState.isAuthenticated) {
        this.setupRoleBasedVisibility();
        this.setupUserInfo();
      }
    });
  }

  /**
   * Muestra mensaje de acceso denegado
   */
  showAccessDeniedMessage(action = 'realizar esta acción') {
    const message = document.createElement('div');
    message.className = 'access-denied-message';
    message.innerHTML = `
      <div class="alert alert-warning">
        <strong>⚠️ Acceso Denegado</strong><br>
        No tienes permisos suficientes para ${action}.
        <br><small>Contacta al administrador si necesitas más permisos.</small>
      </div>
    `;

    // Estilos para mensaje de acceso denegado
    const alertStyle = document.createElement('style');
    alertStyle.textContent = `
      .access-denied-message {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 300px;
      }
      .alert {
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid;
        background-color: #fff7e6;
        border-color: #ffd591;
        color: #d48806;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    `;
    document.head.appendChild(alertStyle);
    document.body.appendChild(message);

    // Remover mensaje después de 5 segundos
    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  /**
   * Verifica permisos antes de ejecutar una acción
   */
  checkPermissionAndExecute(action, callback, requiredRole = 'admin') {
    const user = this.authService.getUser();
    
    if (!user) {
      this.showAccessDeniedMessage('acceder');
      return false;
    }

    if (requiredRole === 'admin' && !this.authService.isAdmin()) {
      this.showAccessDeniedMessage(action);
      return false;
    }

    callback();
    return true;
  }
}

// Exportar para uso global
window.RoleManager = RoleManager;
