export class User {
  constructor({ id, username, email, passwordHash, role = 'user', createdAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role; // 'admin' | 'user'
    this.createdAt = createdAt || new Date();
  }

  /**
   * Verifica si el usuario es administrador
   * @returns {boolean}
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Verifica si el usuario es usuario normal
   * @returns {boolean}
   */
  isUser() {
    return this.role === 'user';
  }
}
