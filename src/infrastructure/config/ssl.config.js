import fs from 'fs';
import path from 'path';
export class SSLConfig {
  constructor() {
    this.enabled = process.env.SSL_ENABLED === 'true';
    this.keyPath = process.env.SSL_KEY_PATH || './ssl/key.pem';
    this.certPath = process.env.SSL_CERT_PATH || './ssl/cert.pem';
  }

  getCredentials() {
    if (!this.enabled) return null;
    const key = fs.readFileSync(path.resolve(this.keyPath), 'utf8');
    const cert = fs.readFileSync(path.resolve(this.certPath), 'utf8');
    return { key, cert };
  }

  isEnabled() {
    return this.enabled;
  }
}
export const sslConfig = new SSLConfig();
