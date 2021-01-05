/* eslint-disable no-continue */
/* eslint-disable no-console */
const fs = require('fs');
const LanguageDetect = require('languagedetect');

const lngDetector = new LanguageDetect();

(async () => {
  console.log('Started');

  const folders = fs.readdirSync('lyrics');
  for (let i = 0; i < folders.length; i += 1) {
    const files = fs.readdirSync(`lyrics/${folders[i]}`);
    for (let j = 0; j < files.length; j += 1) {
      const file = fs.readFileSync(`lyrics/${folders[i]}/${files[j]}`).toString();
      const [first] = lngDetector.detect(file);
      if (!first || first[0] !== 'turkish') continue;
      if (!fs.existsSync(`lyrics-tur/${folders[i]}`)) fs.mkdirSync(`lyrics-tur/${folders[i]}`);

      fs.copyFileSync(`lyrics/${folders[i]}/${files[j]}`, `lyrics-tur/${folders[i]}/${files[j]}`);

      process.stdout.write(`Song ${j} of ${files.length}.\r`);
    }

    process.stdout.write(`Singer ${i} of ${folders.length}.\n`);
  }

  console.log('Done');
})();
