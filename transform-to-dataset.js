const fs = require('fs');

const MESSAGE_COUNT = 15;

const formatMessage = m => `[${m.date.replace("T", " ")}] ${typeof m.from === 'string' ? m.from : m.from?.name}: ${m.text}`

fs.readFile('output.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error:', err);
        return;
    }

    // Parse the JSON data
    const messages = JSON.parse(data);
    const messagesMap = messages.reduce((acc, current) => {
        acc[current.id] = current;
        return acc;
    }, {});

    const noReplyInstruction = `Придумай максимально подходящее сообщение в чате, если предыдущие ${MESSAGE_COUNT} сообщений были такими:`;
    const getReplyInstruction = (replyToText) => `Придумай максимально подходящий ответ на сообщение в чате, если тебе написали: \n\n- ${replyToText}\n\nИ предыдущие ${MESSAGE_COUNT} сообщений были такими:`;
    const dataset = messages.map((message, i) => {
        if (i < MESSAGE_COUNT) return null;
        return {
            instruction: message.reply_to_id ? getReplyInstruction(messagesMap[message.reply_to_id].text) : noReplyInstruction,
            input: `${messages.slice(i - MESSAGE_COUNT, i - 1).map(formatMessage).join('\n\n')}`,
            output: formatMessage(message),
        };
    }).filter(Boolean);

    fs.writeFile('dataset.json', JSON.stringify(dataset, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error:', err);
            return;
        }

        console.log('JSON data has been saved to dataset.json');
    });
});
