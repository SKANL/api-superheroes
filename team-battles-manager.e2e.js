import { chromium } from 'playwright';

const run = async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/api/team-battles-manager');

  // Paso 1: Seleccionar el bando de héroes
  await page.waitForSelector('.side-option.heroes');
  await page.click('.side-option.heroes');
  await page.click('#sideBtn');

  // Paso 2: Esperar a que cargue la selección de personajes
  await page.waitForSelector('#userList');
  await page.waitForSelector('#opponentList');

  // Seleccionar los primeros dos héroes y villanos
  const heroCheckboxes = await page.$$('#userList input[type="checkbox"]');
  const villainCheckboxes = await page.$$('#opponentList input[type="checkbox"]');

  if (heroCheckboxes.length < 2 || villainCheckboxes.length < 2) {
    console.error('No hay suficientes héroes o villanos disponibles');
    await browser.close();
    return;
  }

  // Seleccionar los primeros dos héroes
  await heroCheckboxes[0].click();
  await heroCheckboxes[1].click();

  // Seleccionar los primeros dos villanos
  await villainCheckboxes[0].click();
  await villainCheckboxes[1].click();

  // Iniciar la batalla
  await page.click('#startBtn');

  // Espera a que aparezca la sección de batalla
  const battleVisible = await page.waitForSelector('#battle:not(.hidden)', { timeout: 5000 }).catch(() => null);

  if (!battleVisible) {
    const errorText = await page.evaluate(() => document.body.innerText);
    console.error('No se pudo crear la batalla o no se mostró la vista de batalla. Estado de la página:', errorText);
    await browser.close();
    return;
  }

  // Paso 3: Simular ataques
  await page.waitForSelector('#attackerSelect', { timeout: 5000 });
  await page.waitForSelector('#targetSelect', { timeout: 5000 });
  await page.waitForSelector('#attackType', { timeout: 5000 });

  let finished = false;
  let rounds = 0;
  const maxRounds = 10; // Límite de seguridad para evitar bucles infinitos

  while (!finished && rounds < maxRounds) {
    try {
      // Asegurarse de que el botón está habilitado antes de hacer clic
      await page.waitForSelector('#attackBtn:not([disabled])', { timeout: 2000 });

      // Seleccionar atacante y objetivo si no están seleccionados
      const attackerValue = await page.$eval('#attackerSelect', select => select.value);
      const targetValue = await page.$eval('#targetSelect', select => select.value);

      if (!attackerValue) {
        await page.selectOption('#attackerSelect', { index: 0 });
      }

      if (!targetValue) {
        await page.selectOption('#targetSelect', { index: 0 });
      }

      // Realizar ataque
      await page.click('#attackBtn');
      await page.waitForTimeout(1000); // Espera un poco más entre acciones
      rounds++;
    } catch (error) {
      console.log(`Error en la ronda ${rounds}:`, error.message);
      rounds++;
    }

    // Verifica si la batalla terminó
    finished = await page.evaluate(() => {
      const battleInfo = document.getElementById('battle-info');
      if (!battleInfo) return false;
      try {
        const data = JSON.parse(battleInfo.innerText);
        return data.status === 'finished';
      } catch {
        return false;
      }
    });

    // Si la batalla ha terminado, haz clic en el botón de finalizar
    if (finished) {
      const finishBtn = await page.$('#finishBtn:not(.hidden)');
      if (finishBtn) {
        await finishBtn.click();
        await page.waitForSelector('#results:not(.hidden)', { timeout: 5000 }).catch(() => null);
      }
    }
  }

  // Paso 4: Verificar resultados
  const results = await page.textContent('#results-info') || 'No se encontraron resultados';
  console.log('Resultados de la batalla:', results);

  // Captura de pantalla final
  await page.screenshot({ path: 'team-battle-result.png' });
  console.log('Captura de pantalla guardada como team-battle-result.png');

  await browser.close();
};

run();