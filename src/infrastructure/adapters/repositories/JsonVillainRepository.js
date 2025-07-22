// Repositorio de infraestructura para Villain usando archivos JSON
import fs from 'fs-extra';
import path from 'path';
import { VillainRepository } from '../../../application/interfaces/repositories/VillainRepository.js';

const DATA_PATH = path.resolve('data/villains.json');

export class JsonVillainRepository {
  async _read() {
    try {
      return await fs.readJson(DATA_PATH);
    } catch {
      return [];
    }
  }

  async _write(data) {
    await fs.outputJson(DATA_PATH, data, { spaces: 2 });
  }

  async findById(id) {
    const data = await this._read();
    return data.find(v => v.id === id) || null;
  }

  async findByAlias(alias) {
    const data = await this._read();
    return data.find(v => v.alias === alias) || null;
  }

  async findAll() {
    return await this._read();
  }

  async findByCity(city) {
    const data = await this._read();
    return data.filter(v => v.city === city);
  }

  async findByOwner(ownerId) {
    const data = await this._read();
    return data.filter(v => v.owner === ownerId);
  }

  /**
   * Encuentra villanos por propietario o villanos de administradores
   * Los usuarios pueden ver sus propios villanos + villanos creados por administradores
   * @param {string} userId - ID del usuario
   * @param {Object} userRepository - Repositorio de usuarios para verificar roles
   * @returns {Promise<Array>} - Lista de villanos accesibles
   */
  async findAccessibleByUser(userId, userRepository) {
    const data = await this._read();
    const user = await userRepository.findById(userId);
    
    if (!user) return [];

    if (user.role === 'admin') {
      // Los administradores ven todos los villanos
      return data;
    }

    // Los usuarios ven sus propios villanos + villanos de administradores
    const accessibleVillains = [];
    
    for (const villain of data) {
      // Incluir villanos propios
      if (villain.owner === userId) {
        accessibleVillains.push(villain);
        continue;
      }
      
      // Incluir villanos de administradores
      const villainOwner = await userRepository.findById(villain.owner);
      if (villainOwner && villainOwner.role === 'admin') {
        accessibleVillains.push(villain);
      }
    }
    
    return accessibleVillains;
  }

  async findByCityAndOwner(city, ownerId) {
    const data = await this._read();
    return data.filter(v => v.city === city && v.owner === ownerId);
  }

  /**
   * Encuentra villanos por ciudad accesibles por el usuario
   * @param {string} city - Ciudad
   * @param {string} userId - ID del usuario
   * @param {Object} userRepository - Repositorio de usuarios
   * @returns {Promise<Array>} - Lista de villanos accesibles en la ciudad
   */
  async findByCityAccessibleByUser(city, userId, userRepository) {
    const accessibleVillains = await this.findAccessibleByUser(userId, userRepository);
    return accessibleVillains.filter(v => v.city === city);
  }

  async create(villain) {
    const data = await this._read();
    const id = Date.now().toString();
    const newVillain = { ...villain, id };
    data.push(newVillain);
    await this._write(data);
    return newVillain;
  }

  async update(id, villain) {
    const data = await this._read();
    const idx = data.findIndex(v => v.id === id);
    if (idx === -1) return null;
    data[idx] = { ...villain, id };
    await this._write(data);
    return data[idx];
  }

  async delete(id) {
    const data = await this._read();
    const idx = data.findIndex(v => v.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    await this._write(data);
    return true;
  }
}

export default JsonVillainRepository;
