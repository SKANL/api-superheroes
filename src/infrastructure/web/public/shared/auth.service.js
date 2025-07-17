/**
 * Servicio de autenticación para el frontend
 * Maneja login, registro, logout y token JWT
 */
class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    this.authStateListeners = [];
  }

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} - Datos del usuario y token
   */
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en el inicio de sesión');
      }

      const data = await response.json();
      this.setSession(data.token, data.user);
      this.notifyAuthStateChange();
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Registra un nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} - Datos del usuario y token
   */
  async register(username, email, password) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en el registro');
      }

      const data = await response.json();
      this.setSession(data.token, data.user);
      this.notifyAuthStateChange();
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;
    this.notifyAuthStateChange();
  }

  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} - Datos del usuario
   */
  async getProfile() {
    if (!this.isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Sesión expirada');
        }
        const error = await response.json();
        throw new Error(error.error || 'Error al obtener perfil');
      }

      const data = await response.json();
      this.user = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} - True si está autenticado
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Obtiene el token JWT
   * @returns {string|null} - Token JWT o null
   */
  getToken() {
    return this.token;
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} - Usuario actual o null
   */
  getUser() {
    return this.user;
  }

  /**
   * Obtiene los headers de autorización
   * @returns {Object} - Headers con token JWT
   */
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  /**
   * Establece los datos de sesión
   * @param {string} token - Token JWT
   * @param {Object} user - Datos del usuario
   */
  setSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  /**
   * Añade un listener para cambios en el estado de autenticación
   * @param {Function} listener - Función callback
   */
  addAuthStateListener(listener) {
    this.authStateListeners.push(listener);
  }

  /**
   * Elimina un listener
   * @param {Function} listener - Función callback a eliminar
   */
  removeAuthStateListener(listener) {
    this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
  }

  /**
   * Notifica a todos los listeners sobre cambios en la autenticación
   */
  notifyAuthStateChange() {
    const authState = {
      isAuthenticated: this.isAuthenticated(),
      user: this.user
    };
    this.authStateListeners.forEach(listener => listener(authState));
  }
}

// Exportar una instancia singleton
const authService = new AuthService();
export default authService;
