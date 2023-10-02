export default {
	type: "service_account",
	projectId: "benda-dnd",
	privateKeyId: process.env.PRIVATE_KEY_ID,
	privateKey: Buffer.from(process.env.PRIVATE_KEY, "base64").toString("ascii"),
	clientEmail: "guy-pc@benda-dnd.iam.gserviceaccount.com",
	clientId: "113352585289981698236",
	authUri: "https://accounts.google.com/o/oauth2/auth",
	tokenUri: "https://oauth2.googleapis.com/token",
	authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
	clientX509CertUrl:
		"https://www.googleapis.com/robot/v1/metadata/x509/guy-pc%40benda-dnd.iam.gserviceaccount.com",
	universeDomain: "googleapis.com",
};
