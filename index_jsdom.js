const fs = require('fs');
const got = require('got');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const vgmUrl= 'https://www.vgmusic.com/music/console/nintendo/nes';
const isMidi = (link) => {
  // Return false if there is no href attribute.
  if(typeof link.href === 'undefined') { return false }

  return link.href.includes('.mid');
};

const noParens = (link) => {
  // Regular expression to determine if the text has parentheses.
  const parensRegex = /^((?!\().)*$/;
  return parensRegex.test(link.textContent);
};

got(vgmUrl).then(response => {
  const dom = new JSDOM(response.body);
  // Create an Array out of the HTML Elements for filtering using spread syntax.
  const nodeList = [...dom.window.document.querySelectorAll('a')];

  nodeList.filter(isMidi).filter(noParens).forEach(link => {
    const fileName = link.href;
    got.stream(`${vgmUrl}/${fileName}`)
      .on('error', err => { console.log(err); console.log(`Error on ${vgmUrl}/${fileName}`) })
      .pipe(fs.createWriteStream(`MIDIs/${fileName}`))
      .on('error', err => { console.log(err); console.log(`Error on ${vgmUrl}/${fileName}`) })
      .on('finish', () => console.log(`Downloaded: ${fileName}`));
  });
}).catch(err => {
  console.log(err);
});