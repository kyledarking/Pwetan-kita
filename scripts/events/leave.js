const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "1.4",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			leaveType1: "tự rời",
			leaveType2: "bị kick",
			defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
		},
		en: {
			session1: "𝙢𝙤𝙧𝙣𝙞𝙣𝙜",
			session2: "𝙣𝙤𝙤𝙣",
			session3: "𝙖𝙛𝙩𝙚𝙧𝙣𝙤𝙤𝙣",
			session4: "𝙚𝙫𝙚𝙣𝙞𝙣𝙜",
			leaveType1: "𝙡𝙚𝙛𝙩",
			leaveType2: "𝙬𝙖𝙨 𝙠𝙞𝙘𝙠𝙚𝙙 𝙛𝙧𝙤𝙢",
			defaultLeaveMessage: "━━━━━━━━━━━━━━━━━━\n𝙂𝙤𝙤𝙙 𝘽𝙮𝙚 𝙣𝙞𝙜𝙜𝙖 {userName}\n📜𝙍𝙚𝙖𝙨𝙤𝙣: {type} 𝙩𝙝𝙚 𝙜𝙧𝙤𝙪𝙥\n𝙎𝙚𝙚 𝙮𝙤𝙪 𝙖𝙜𝙖𝙞𝙣:>\n━━━━━━━━━━━━━━━━━━"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage)
					return;
				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID())
					return;
				const hours = getTime("HH");

				const threadName = threadData.threadName;
				const userName = await usersData.getName(leftParticipantFbId);

				// {userName}   : name of the user who left the group
				// {type}       : type of the message (leave)
				// {boxName}    : name of the box
				// {threadName} : name of the box
				// {time}       : time
				// {session}    : session

				let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
				const form = {
					mentions: leaveMessage.match(/\{userNameTag\}/g) ? [{
						tag: userName,
						id: leftParticipantFbId
					}] : null
				};

				leaveMessage = leaveMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName)
					.replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
					.replace(/\{threadName\}|\{boxName\}/g, threadName)
					.replace(/\{time\}/g, hours)
					.replace(/\{session\}/g, hours <= 10 ?
						getLang("session1") :
						hours <= 12 ?
							getLang("session2") :
							hours <= 18 ?
								getLang("session3") :
								getLang("session4")
					);

				form.body = leaveMessage;

				if (leaveMessage.includes("{userNameTag}")) {
					form.mentions = [{
						id: leftParticipantFbId,
						tag: userName
					}];
				}

				if (threadData.data.leaveAttachment) {
					const files = threadData.data.leaveAttachment;
					const attachments = files.reduce((acc, file) => {
						acc.push(drive.getFile(file, "stream"));
						return acc;
					}, []);
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status == "fulfilled")
						.map(({ value }) => value);
				}
				message.send(form);
			};
	}
};
