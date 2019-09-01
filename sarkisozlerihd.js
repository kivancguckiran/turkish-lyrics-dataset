const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const totalPages = 121;
const baseURL = 'http://www.sarkisozlerihd.com/';
const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const getSingers = async () => {
  process.stdout.write(`Getting singers. ${totalPages} page.\n`);

  const singers = [];

  for (let i = 1; i <= totalPages; i += 1) {
    const { data } = await axios.get(`${baseURL}sayfa/${i}`);

    const $ = cheerio.load(data);

    $('.full-screen-list-inside')
      .children()
      .children()
      .each((index, elem) => {
        if (elem.name === 'a') singers.push(elem.attribs.href)
      });

    await sleep(10);

    process.stdout.write(`Page ${i} of ${totalPages}.\r`);
  }

  await new Promise((resolve, reject) => {
    fs.writeFile('singers.json', JSON.stringify(singers), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const createFolders = async () => {
  const singers = await new Promise((resolve, reject) => {
    fs.readFile('singers.json', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });

  for (let i = 0; i < singers.length; i += 1) {
    const singer = singers[i].split('/')[4];
    await new Promise((resolve, reject) => {
      fs.mkdir(`lyrics/${singer}`, (err) => {
        if (err) reject(err);
        else resolve();
      })
    });
  }
};

const getSongs = async () => {
  const singers = await new Promise((resolve, reject) => {
    fs.readFile('singers.json', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });

  const allSongs = [];

  for (let i = 0; i < singers.length; i += 1) {
    const singer = singers[i].split('/')[4];

    const { data } = await axios.get(`${baseURL}sarkici/${singer}`);

    const songs = [];

    const $ = cheerio.load(data);

    $('.list-line')
      .children()
      .each((index, elem) => {
        if (elem.name === 'a') songs.push(elem.attribs.href)
      });

    allSongs.push({
      singer,
      songs,
    });

    await new Promise((resolve, reject) => {
      fs.writeFile('songs.json', JSON.stringify(allSongs), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    process.stdout.write(`Singer ${i} of ${singers.length}.\r`);
  }
};

const getLyrics = async (start = 0) => {
  const allSongs = await new Promise((resolve, reject) => {
    fs.readFile('songs.json', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });

  for (let i = start; i < allSongs.length; i += 1) {
    const { singer, songs } = allSongs[i];

    for (let j = 0; j < songs.length; j += 1) {
      const song = songs[j].split('/')[4];

      let data = null;

      while (true) {
        try {
          const response = await axios.get(`${baseURL}sarki-sozu/${song}`);
          data = response.data;
          break;
        } catch (err) {
          console.log('Error! Retrying...');
        }
      }

      const $ = cheerio.load(data);

      let rows = '';

      $('.lyric-text')
        .children()
        .each((index, elem) => {
          if (elem.name === 'p') {
            elem.children.forEach(item => {
              if (item.type === 'text') rows = `${rows}${item.data.trim()}\n`;
            });

            rows = `${rows}\n`;
          }
        });

      await new Promise((resolve, reject) => {
        fs.writeFile(`lyrics/${singer}/${song}.txt`, rows, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      process.stdout.write(`Song ${j} of ${songs.length}.\r`);
    }

    process.stdout.write(`Singer ${i} of ${allSongs.length}.\n`);
  }
};

(async () => {
  try {
    // await getSingers();
    // await createFolders();
    // await getSongs();
    await getLyrics(228);
  } catch (err) {
    console.log(err);
  }
})();
