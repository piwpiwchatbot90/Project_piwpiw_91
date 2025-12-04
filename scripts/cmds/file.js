const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		version: "1.7",
		author: "MahMUD,
		countDown: 5,
		role: 0,
		category: "admin",
		guide: "{pn} file name."
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = ["100051168244116","61580336378735","100031770681053", "100065343379315"];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("❌ | 𝐒𝐨𝐫𝐫𝐲 𝐛𝐚𝐛𝐲, 𝐨𝐧𝐥𝐲 𝐆𝐨𝐣𝐨 𝐎𝐫𝐮𝐩𝐞 𝐏𝐢𝐰 𝐏𝐢𝐰 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};
