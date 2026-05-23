const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  const body = JSON.parse(event.body);
  if (body.event !== 'order.approved') return { statusCode: 200, body: 'ignored' };
  const nome = body.Customer?.name || 'Aluno';
  const email = body.Customer?.email?.toLowerCase();
  if (!email) return { statusCode: 400, body: 'no email' };
  await admin.firestore().collection('alunos').doc(email).set({
    nome, email, senhaLocal: 'TrocarsenhaTec', ativo: true,
    dataCadastro: new Date().toISOString(),
  }, { merge: true });
  return { statusCode: 200, body: 'ok' };
};
