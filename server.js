import express from 'express';
import bodyParser from 'body-parser';
import dbEngine from './dbengine';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

import sharp from 'sharp';
//import thumbnail from 'thumbnail';

// import mime from 'mime';
// import im from 'imagemagick';
// import gm from 'gm';


// import dbfParser from './dbfparser';


const app = express();
const appPath = __dirname;

const path = __dirname + '../qs/src';

app.use(express.static(path));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: 'http://localhost:4200' }));

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './uploads/')
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname)
	}
})

const upload = multer({ storage: storage });



// app.use((rec, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);

//     next();

// });

app.get('/api/users', (rec, res) => {
	dbEngine.getAllUsers((err, rec) => {
		if (!err) return res.json(rec);
	});
});

app.get('/api/users/:id', (req, res) => {
	dbEngine.getUserById(req.params.id, (err, rec) => {
		if (!err) return res.json(rec);
	});
});

app.post('/api/users', (req, res) => {
	dbEngine.createUser(req.body.login, req.body.pass, req.body.comment, (err) => {
		if (err) throw err;
		res.send('Insert new user');
	});
});

app.put('/api/users', (req, res) => {
	dbEngine.updateUser(req.body.login, req.body.pass, req.body.comment, req.body.id, (err) => {

		res.send(`Update user ${req.body.id}`);
	});
});


app.delete('/api/users/:id', (req, res) => {
	console.log(req.params.id);
	dbEngine.deleteUser(req.params.id, err => {
		if (err) throw err;
		res.send(`Delete user ${req.params.id}`);
	})
});

//-- галерея
app.get('/api/gallery', (req, res) => {
	dbEngine.getAllImages((err, rec) => {
		if (!err) return res.json(rec);
		// res.send(`<img src="${rec.image}">`);
	})
});

// app.post('/api/upload', upload.array('uploads[]', 12), (req, res) => {
// 	console.log('UPLOAD files ', req.files);
// 	res.send(req.files);

// })

//--- insert to db with tumbna
app.post('/api/insert', upload.array('image', 12), (req, res) => {
	let file = req.files[0];
	let lastId;
	//-- читаем картинку
	fs.readFile(file.path, 'base64', (err, data) => {
		if (err) throw err;
		//-- определяем ее тип
		//-- TODO - если не картинка, то в миниатюру надо грузить что-то другое и не делать миниатюрку
		let mimeType = file.mimetype;
		//-- делаем обрезку файла и складываем во временную папку. 
		sharp(file.path)
			.resize(120, 120)
			.toFile('./uploads/thumb/_' + file.filename,
				err => {
					if (!err) {

						console.log('Сохранили миниатюру');

					} else {
						console.log(err);
					}
					//-- TODO - нужно сохранить исходную картинку, получить ее ID и сохранить миниатюру в свою табличку
				})

		//-- Пока тут сохраняем исходную картинку
		data = 'data:' + mimeType + ';base64,' + data;

		// dbEngine.insertImage(file.originalname, mimeType, data, (err) => {
		// 	if (err) throw err;
		// 	res.send('Insert image - insert');
		// });

		function insertAsync(name, mime, data) {
			return new Promise((resolve, reject) => {

				dbEngine.insertImage(name, mime, data, (err) => {
				    //res.end('insert end');
					//	res.send('Insert image - insert');

					if(!err) resolve(null)
			// 		//dbEngine.insertImage(file.originalname, mimeType, data, (err) => {

					// if (err) { throw reject(err) } else {
					// 	console.log('Insert');
					// //	resolve(null);
					// }
				});
			})
		};

		function selectAsync() {
			return new Promise((resolve, reject) => {

				dbEngine.getImageByFileName((err, row) => {
					// if (err !== null) reject(err);
					// if (row) {
					 	console.log('Select');
					//	resolve(row)

					//res.send(row);
					//if(!err) resolve(row)
				});
			})
		}

		async function insertImg() {
			await insertAsync(file.originalname, mimeType, data, err=>{});
			
			lastId = await selectAsync((err,row)=>{
				
				return row;
			});

			console.log('lastId', row);
		
		};


		insertImg().then(data => {
				console.log('async', data);
			return callback(null);

		})


	})


});



//  app.post('/api/gallery',(req, res)=>{
//  	dbEngine.insertImage(req.body.image_data, err=>{
// 		if (err) throw err;
//  		res.send(`<img src="${req.body.image_data}">`);
//  	})
//  })


//----------------------------

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
