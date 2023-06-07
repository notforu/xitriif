const fs = require('fs');

fs.readFile('dataset.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  const sizes = jsonData.reduce((acc, curr) => ({ ...acc, [curr.input.length]: (acc[curr.input.length] || 0) + 1 }), {})

  console.log(Math.max(...jsonData.map(i => i.input.length)), jsonData.length)
  //console.log(Object.entries(sizes).sort(([sizeA, countA], [sizeB, countB]) => countA - countB).map(([size, count]) => `${size} - ${count}`).join('\n'))
});
