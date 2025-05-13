const https = require('https');

const pokemon = [
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
  { id: 25, name: 'Pikachu' },
  { id: 6, name: 'Charizard' },
  { id: 9, name: 'Blastoise' },
  { id: 3, name: 'Venusaur' },
  { id: 150, name: 'Mewtwo' },
  { id: 151, name: 'Mew' },
  { id: 149, name: 'Dragonite' },
  { id: 130, name: 'Gyarados' },
  { id: 143, name: 'Snorlax' }
];

function checkImage(url) {
  return new Promise(resolve => {
    https.get(url, res => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

(async () => {
  for (const p1 of pokemon) {
    for (const p2 of pokemon) {
      const url = `https://images.japeal.com/pkm/${p1.id}/${p1.id}.${p2.id}.png`;
      const exists = await checkImage(url);
      if (exists) {
        console.log(`${p1.name} + ${p2.name}: ${url}`);
      }
    }
  }
})(); 