#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

class CompletenessValidator {
  constructor() {
    this.score = 0;
    this.maxScore = 0;
    this.results = [];
  }

  async validateComplete() {
    console.log('🎯 Validando completitud de Clean Architecture...\n');

    await this.validateStructure();
    await this.validateImplementation();
    await this.validateTesting();

    this.generateFinalReport();
  }

  checkItem(description, condition) {
    this.maxScore++;
    if (condition) {
      this.score++;
      console.log(`✅ ${description}`);
      this.results.push({ description, status: 'passed' });
    } else {
      console.log(`❌ ${description}`);
      this.results.push({ description, status: 'failed' });
    }
  }

  async validateStructure() {
    console.log('🏗️ Validando estructura...');
    this.checkItem('Estructura de directorios Clean Architecture', 
      fs.existsSync('src/domain') && 
      fs.existsSync('src/application') && 
      fs.existsSync('src/infrastructure') && 
      fs.existsSync('src/shared')
    );
    this.checkItem('package.json configurado correctamente', 
      fs.existsSync('package.json')
    );
    this.checkItem('Variables de entorno configuradas', 
      fs.existsSync('.env.example') && fs.existsSync('.env')
    );
    console.log();
  }

  async validateImplementation() {
    console.log('💻 Validando implementación...');
    this.checkItem('Domain Layer implementado', 
      fs.existsSync('src/domain/entities') && 
      fs.existsSync('src/domain/services')
    );
    this.checkItem('Application Layer implementado', 
      fs.existsSync('src/application/use-cases') && 
      fs.existsSync('src/application/interfaces')
    );
    this.checkItem('Infrastructure Layer implementado', 
      fs.existsSync('src/infrastructure/adapters/controllers') && 
      fs.existsSync('src/infrastructure/config')
    );
    this.checkItem('Shared Layer implementado', 
      fs.existsSync('src/shared/exceptions') && 
      fs.existsSync('src/shared/utils')
    );
    console.log();
  }

  async validateTesting() {
    console.log('🧪 Validando testing...');
    this.checkItem('Tests unitarios presentes', 
      fs.existsSync('tests/unit')
    );
    this.checkItem('Tests de integración presentes', 
      fs.existsSync('tests/integration') && fs.readdirSync('tests/integration').length > 0
    );
    this.checkItem('Configuración Jest presente', 
      fs.existsSync('jest.config.js') || 
      fs.readFileSync('package.json', 'utf8').includes('"jest"')
    );
    try {
      execSync('npm test', { stdio: 'pipe' });
      this.checkItem('Tests pasan correctamente', true);
    } catch (error) {
      this.checkItem('Tests pasan correctamente', false);
    }
    console.log();
  }

  generateFinalReport() {
    const percentage = (this.score / this.maxScore) * 100;
    console.log('📊 REPORTE FINAL DE COMPLETITUD');
    console.log('='.repeat(50));
    console.log(`Puntuación: ${this.score}/${this.maxScore} (${percentage.toFixed(1)}%)`);
    if (percentage >= 90) {
      console.log('🏆 ¡EXCELENTE! Tu implementación está completa.');
      console.log('🎉 Clean Architecture implementada correctamente.');
    } else if (percentage >= 70) {
      console.log('👍 BIEN. Tu implementación está casi completa.');
      console.log('🔧 Revisa los elementos faltantes para mejorar.');
    } else {
      console.log('⚠️  NECESITA TRABAJO. Implementación incompleta.');
      console.log('📚 Revisa el tutorial y completa los elementos faltantes.');
    }
    console.log('\n📋 Elementos faltantes:');
    this.results
      .filter(r => r.status === 'failed')
      .forEach(r => console.log(`   - ${r.description}`));
    console.log('\n🎯 Próximos pasos recomendados:');
    if (percentage < 100) {
      console.log('   1. Completar elementos faltantes');
      console.log('   2. Ejecutar node scripts/validate-completeness.js');
      console.log('   3. Revisar documentación');
    } else {
      console.log('   1. ¡Comenzar a desarrollar nuevas funcionalidades!');
      console.log('   2. Implementar base de datos persistente');
      console.log('   3. Agregar autenticación');
    }
  }
}

try {
  console.log('🚀 Iniciando validación de completitud...');
  new CompletenessValidator().validateComplete();
  console.log('✅ Validación completada. Revisa el reporte generado.');
} catch (error) {
  console.error('❌ Ocurrió un error durante la validación:', error);
}

export { CompletenessValidator };
