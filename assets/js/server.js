const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'h-trust'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL!');
});

const cors = require('cors');
app.use(cors());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/signup', async (req, res) => {
  console.clear();
    require("dotenv").config();
    const {
      Client,
      PrivateKey,
      AccountCreateTransaction,
      Hbar,
    } = require("@hashgraph/sdk");
    
    // Configure your client with operator account and key
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);
    const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);
    
    async function main() {
      // Generate a new ECDSA private key
      const newPrivateKey = await PrivateKey.generateECDSA();
      const publicKey = newPrivateKey.publicKey;
    
      console.log("Private Key (DER Encooçded):", newPrivateKey.toStringDer());
    
      // Create a new account with the public key
      const transactionResponse = await new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(Hbar.fromTinybars(1000000)) // Set initial balance
        .setTransactionValidDuration(120)
        .execute(client);
    
      // Fetch the receipt of the transaction
      const receipt = await transactionResponse.getReceipt(client);
      const newAccountId = receipt.accountId;
    
      return newAccountId ;
    }
    try {
        const newAccountId = await main();
        res.json({ accountId: newAccountId.toString() });  // Utiliser l'ID dans la réponse
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error creating account");
    }

    try {
      const newAccountId = await main();
      const { username, password } = req.body;

      // Insérez l'utilisateur dans la base de données
      const insertUser = 'INSERT INTO client (nom,mdp,hederaID,hederaPRVKEY) VALUES (?, ?, ?, ?)';
      connection.query(insertUser, [username, password, newAccountId.toString(), newPrivateKey.toString()], (err, results) => {
          if (err) {
              throw err;
          }
          res.send(`Utilisateur créé avec l'ID: ${results.insertId}`);
      });
      
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error creating account or inserting into database");
  }
});


app.listen(3000, () => console.log('Server running on port 3000'));

