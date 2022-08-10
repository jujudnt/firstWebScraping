const cheerio = require('cheerio');
const got = require('got');
 
const vgmUrl= 'https://www.vgmusic.com/music/console/nintendo/nes';
 
const isMidi = (i, link) => {
  // renvoie false si l'attribut href n'est pas présent
  if(typeof link.attribs.href === 'undefined') { return false }
 
  return link.attribs.href.includes('.mid');
};
 
const noParens = (i, link) => {
  // Expression régulière qui détermine si le texte comporte des parenthèses
  const parensRegex = /^((?!\().)*$/;
  return parensRegex.test(link.children[0].data);
};
 
(async () => {
  const response = await got(vgmUrl);
  const $ = cheerio.load(response.body);
 
  $('a').filter(isMidi).filter(noParens).each((i, link) => {
    const href = link.attribs.href;
    console.log(href);
  });
})();