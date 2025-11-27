const axios = require("axios");

module.exports = {
  config: {
    name: "spy",
    version: "1.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    category: "INFO",
    description: "Spy on a user and get detailed info"
  },

  onStart: async function ({ event, message, usersData, api, args }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions || {})[0];
    let uid;

    if (args[0]) {
      if (/^\d+$/.test(args[0])) uid = args[0];
      else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) uid = match[1];
      }
    }

    if (!uid) {
      uid = event.type === "message_reply"
        ? event.messageReply.senderID
        : uid2 || uid1;
    }

    const userInfo = await api.getUserInfo(uid);
    const avatarUrl = await usersData.getAvatarUrl(uid);
    const userData = await usersData.get(uid);
    const allUser = await usersData.getAll();

    let genderText;
    switch (userInfo[uid].gender) {
      case 1: genderText = "𝙶𝚒𝚛𝚕🙋🏻‍♀️"; break;
      case 2: genderText = "Boy🙋🏻‍♂️"; break;
      default: genderText = "𝙶𝚊𝚢🤷🏻‍♂️";
    }

    const rank = allUser.slice().sort((a,b)=>b.exp-a.exp).findIndex(u=>u.userID===uid)+1;
    const moneyRank = allUser.slice().sort((a,b)=>b.money-a.money).findIndex(u=>u.userID===uid)+1;

    const spyInfo = `
╭────[ 𝐒𝐏𝐘 𝐔𝐒𝐄𝐑 ]
├‣ Name      : ${userInfo[uid].name}
├‣ Gender    : ${genderText}
├‣ UID       : ${uid}
├‣ Class     : ${userInfo[uid].type || "Normal User"}
├‣ Username  : ${userInfo[uid].vanity || "None"}
├‣ Profile  : ${userInfo[uid].profileUrl}
├‣ Birthday  : ${userInfo[uid].isBirthday !== false ? userInfo[uid].isBirthday : "Private"}
├‣ Nickname  : ${userInfo[uid].alternateName || "None"}
╰‣ Friend with bot: ${userInfo[uid].isFriend ? "Yes✅" : "No❎"}

╭─────[ 𝐒𝐓𝐀𝐓𝐒 ]
├‣ Money       : $${userData.money}
├‣ Rank        : #${rank}/${allUser.length}
├‣ Money Rank  : #${moneyRank}/${allUser.length}
╰───────────────`;

    message.reply({
      body: spyInfo,
      attachment: await global.utils.getStreamFromURL(avatarUrl),
    });
  }
};
