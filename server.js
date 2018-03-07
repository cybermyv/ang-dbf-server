import express from 'express';
import bodyParser from 'body-parser';
import dbEngine from './dbengine';
// import dbfParser from './dbfparser';

const app = express();

const path = __dirname + '../first/first-app/src/';

app.use(express.static(path));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/users', (rec, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  dbEngine.getAllUsers((err, rec) => {
    if (!err) return res.json(rec);
  });
});

app.get('/api/users/:id', (req, res)=>{
  dbEngine.getUserById(req.params.id, (err, rec) =>{
    if(!err) return res.json(rec);
  })
});

app.post('/api/users', (req, res)=>{
  dbEngine.createUser(req.body.id, req.body.name, req.body.pass, req.body.comment, err=>{
    if(err) throw err;
    res.send('Insert new user');
  })
});

app.put('/api/users/:id', (req, res)=>{
  dbEngine.updateUser(req.body.id, req.body.name, req.body.pass, req.body.comment, err=>{
    if(err) throw err;
    res.send(`Update user {$req.body.id}`);
  })
});

// app.post('/api/signin', (req, res) => {
//   dbEngine.validationSigIn(req.body.username, req.body.password,
//     (err, rec) => {
//       console.log(rec);
//       if (rec !== 'failure') {
//         res.json(rec);
//       }
//       else {
//         res.status(401).json({ error: 'Ошибка авторизации' })
//       }
//       // res.json(rec);
//     })
// });

// app.get('/api/main', (rec, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   dbfParser.getAllData(rec => {
//     return res.json(rec)
//   });
// });

const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://localhost:${port}`);
});
