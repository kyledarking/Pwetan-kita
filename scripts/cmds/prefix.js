const moment = require("moment-timezone");
const manilaTime = moment.tz('Asia/Manila');
const formattedDateTime = manilaTime.format('MMMM D, YYYY h:mm A');

module.exports = {
 config: {
	 name: "prefix",
	 version: "1.0",
	 author: "Tokodori_Frtiz",//remodified by cliff
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "auto 🪐",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "prefix") {
 return message.reply({
 body: `𝗛𝗘𝗟𝗟𝗢 𝗕𝗥𝗢!!\n𝗠𝗬 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗦: ×
𝗚𝗨𝗜𝗗𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧\n
╔═══════ ೋღ 𓃵 ღೋ ═══════╗
➥ ×help [number of page] -> see commands
➥ ×sim [message] -> talk to bot
➥ ×callad [message] -> report any problem encountered
➥ ×help [command] -> information and usage of command\n\nHave fun using it enjoy!❤\nBot Developer: https://www.facebook.com/itssmekylebaitit\n\n🗓️ | ⏰ Date And Time:\n${formattedDateTime}\n╚═══════ ೋღ 𓃵 ღೋ ═══════╝`,
 attachment: await global.utils.getStreamFromURL("https://i.imgur.com/o33JNCp.mp4")
 });
 }
 }
}
