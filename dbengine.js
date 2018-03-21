//import sqlite3 from 'sqlite3';
const uuid = require('uuid');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/dbase', (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to database! ');
});

exports.getAllUsers = (callback) => {
	let tQ = 'select * from users';
	db.all(tQ, callback);
};

exports.getUserById = (id, callback) => {
	let tQ = 'select * from users where id = ?';
	db.each(tQ, [id], (err, row) => {
		if (!err) {
			callback(null, row);
		}
	});
};

exports.createUser = function (login, pass, comment, callback) {
	let tQ = 'insert into users (login, pass, comment) values (?, ?, ?)';

	console.log('create - ', login, pass, comment);

	db.run(tQ, [login, pass, comment], (err) => {
		if (!err) callback(null);
	});
};

exports.deleteUser = (id, callback) => {
	let tQ = 'delete from users where id = ?';
	console.log('del', id);
	db.run(tQ, [id], (err) => {
		if (!err) callback(null);
	});
};

exports.updateUser = (login, pass, comment, id, callback) => {
	let tQ = 'update users set login = ?, pass = ?, comment = ? where id = ?';
	console.log('update', id, login, pass, comment);
	db.run(tQ, [login, pass, comment, id], (err) => {
		if (!err) callback(null);
	});
};

exports.getAllImages=(callback)=>{
	let tQ = 'select * from images';
	db.all(tQ, callback);
}

// exports.storeImageInDb = (image_name, image_data, callback)=>{
// 	let tQ = 'insert into images (name, image) values (?, ?)';
// 	db.run(tQ, [image_name, image_data], (err)=>{
// 		if (!err) callback(null);
// 	})
// };

//-- японский способ

exports.insertImage = (image_name, image_data, callback)=>{
	
	console.log(image_data);

	db.serialize(()=>{
		const stmp = db.prepare('insert into images (name, image) values (?, ?)');
		stmp.run(image_name, image_data);
		stmp.finalize();
	})
};

exports.getImageById = (id, callback)=>{
	db.serialize(()=>{
		const stmp = db.prepare('select * from images where id = ?');
		stmp.get(id);
		stmp.finalize();
	})
}

// exports.sigup = callback => {
//   let tQ = 'select * from users';
//   db.all(tQ, callback);
// };

// exports.validationSigIn = (login, password, callback) => {

//   let tQ = 'select * from users where login = ? and pass = ?';

//   db.get(tQ, [login, password], (err, row) => {
//     if (!err) {

//       //   console.log(row);

//       if (row) row.token = uuid.v4();;

//       return row
//         ? callback(null, row)
//         : callback(null, 'failure')
//     };
//   });

//   //db.close();

// };
