const fs = require('fs');

fs.readFile('result.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Process the JSON data
    const output = JSON.stringify(
        jsonData.messages.filter(m => m.type === "message" && m.text !== "" && typeof m.text === 'string'),
        null,
        2
    );

    fs.writeFile('output.json', output, 'utf8', (err) => {
        if (err) {
            console.error('Error:', err);
            return;
        }

        console.log('JSON data has been saved to output.json');
    });
});
