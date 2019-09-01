const fs = require('fs');

const alphabet = 'abcçdefgğhıijklmnoöprsştuüvyzABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';

const fix = () => {
  console.log('Started');

  const folders = fs.readdirSync('lyrics-tur');
  for (let i = 0; i < folders.length; i++) {
    const files = fs.readdirSync(`lyrics-tur/${folders[i]}`);
    for (let j = 0; j < files.length; j += 1) {
      let file = fs.readFileSync(`lyrics-tur/${folders[i]}/${files[j]}`).toString();
      if (!fs.existsSync(`lyrics-fixed/${folders[i]}`)) fs.mkdirSync(`lyrics-fixed/${folders[i]}`);

      let last = '';
      for (let k = 0; k < file.length; k += 1) {
        if (file[k] === 'I' && alphabet.includes(last)) {
          file = `${file.substr(0, k)}l${file.substr(k + 1)}`;
        }

        last = file[k];
      }

      fs.writeFileSync(`lyrics-fixed/${folders[i]}/${files[j]}`, file);

      process.stdout.write(`Song ${j} of ${files.length}.\r`);
    }

    process.stdout.write(`Singer ${i} of ${folders.length}.\n`);
  }

  console.log('Done');
};

fix();
