# Turkish Mixed Song Lyrics Dataset Generator

This project can crawl sarkisozlerihd.com as of 02.09.2019. I will try to update DOM properties and website links if needed.

## How to

```bash
npm install
mkdir lyrics
node sarkisozlerihd.js
```

This will get all the lyrics from the page. Please refer to the code, it is written highly descriptive.

## Getting Turkish lyrics

```bash
mkdir lyrics-tur
node language.js
```

This will copy Turkish lyrics to the `lyrics-tur` folder.

## Trying to fix the L and I difference

Some of the lyrics contain uppercase "I" where it should be lowercase "L". Below code does not fix every occasion, but fixes most of them:

```bash
mkdir lyrics-fixed
node letter.js
```

### Issues

If you have any problem regarding any of the steps described above, please feel free to open an issue. PRs are welcome!
