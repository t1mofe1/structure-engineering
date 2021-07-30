require('dotenv').config();
const Firebase = require('firebase-admin');

Firebase.initializeApp({
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: 'structure-engineering.firebaseapp.com',
	databaseURL: 'https://structure-engineering.firebaseio.com',
	projectId: 'structure-engineering',
	storageBucket: 'structure-engineering.appspot.com',
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	credential: Firebase.credential.cert({
		type: 'service_account',
		project_id: 'structure-engineering',
		private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
		private_key: process.env.FIREBASE_PRIVATE_KEY,
		client_email: process.env.FIREBASE_CLIENT_EMAIL,
		client_id: process.env.FIREBASE_CLIENT_ID,
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
	}),
});

const db = Firebase.firestore();
db.settings({ ignoreUndefinedProperties: true });

db.users = db.collection('users');
db.fieldValue = Firebase.firestore.FieldValue;

module.exports = { db };
