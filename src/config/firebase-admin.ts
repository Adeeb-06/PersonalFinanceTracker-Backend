import * as admin from "firebase-admin";

const fbServiceKey = process.env.FB_SERVICE_KEY;
if (!fbServiceKey) {
  throw new Error("Missing FB_SERVICE_KEY environment variable");
}

const decoded = Buffer.from(fbServiceKey, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
