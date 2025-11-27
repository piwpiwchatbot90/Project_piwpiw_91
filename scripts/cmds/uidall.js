const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "uidall",
    version: "1.0.7",
    role: 0,
    author: "SaGor",
    description: { en: "Get all UID and names in the group" },
    longDescription: { en: "Generates a list of all members' names, UIDs, and Facebook profile links in the current group" },
    commandCategory: "Group",
    usages: "{pn}",
    cooldowns: 2
  },

  onStart: async function({ api, event }) {
    const { threadID, participantIDs } = event;

    let count = 0;
    let message = "List of all UID's in this group:\n\n";

    for (const uid of participantIDs) {
      count++;
      let name = "Unknown";

      try {
        const info = await api.getUserInfo(uid);
        if (info[uid] && info[uid].name) name = info[uid].name;
      } catch (e) {}

      message += `${count}. ${name}\nUID: ${uid}\nFacebook link: https://facebook.com/${uid}\n\n`;
    }

    if (message.length >= 2000) {
      const filePath = path.join(__dirname, "cache", `uidall_${Date.now()}.txt`);
      fs.writeFileSync(filePath, message, "utf8");
      api.sendMessage(
        { body: "List of UIDs is too long. Sent as file:", attachment: fs.createReadStream(filePath) },
        threadID,
        () => fs.unlinkSync(filePath)
      );
    } else {
      api.sendMessage(message, threadID);
    }
  }
};
