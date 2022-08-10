const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  const MODALBUTTONSELECTOR = '.modal-footer > button';
  const SEARCH_SELECTOR = 'input[placeholder=Search]';
  const LOCATION_SELECTOR = 'li.active > a';
  const RESULTS_SELECTOR = '.results-tab';

  await page.goto('https://native-land.ca/');
  //clic pour fermer la modal
  await page.click(MODALBUTTONSELECTOR);
  //clic sur le input qui contient le placeholder Search
  await page.click(SEARCH_SELECTOR);
  //tappe Philadelphia dans le input
  await page.keyboard.type('Philadelphia');
  //attente de l'affichage de la liste déroulante après input
  await page.waitForSelector(LOCATION_SELECTOR);
  //clic sur le premier de la liste
  await page.click(LOCATION_SELECTOR);
  //attend que les résultats réels apparaissent après le chargement de la page
  await page.waitForSelector(`${RESULTS_SELECTOR} > p`);
  //créer un objet pour le résultat du clic
  const results = await page.$(RESULTS_SELECTOR);
  //accès au résultat du clic directement
  const text = await results.evaluate(element => element.innerText);
  console.log(text);
  //screenshot
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();