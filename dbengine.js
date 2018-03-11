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
	db.each(tQ, [ name ], (err, row) => {
		if (!err) {
			callback(null, row);
		}
	});
};

exports.createUser  = function (login, pass, comment, callback) {
	let tQ = 'insert into users (login, pass, comment) values (?, ?, ?)';
  
  console.log('create - ', login, pass, comment);
  
  db.run(tQ, [ login, pass, comment ], (err) => {
		if (!err) callback(null);
	});
};

exports.deleteUser = (id, callback) => {
	let tQ = 'delete from users where id =?';
	db.run(tQ, [ id ], (err) => {
		if (!err) callback(null);
	});
};

exports.updateUser = (id, login, pass, comment, callback) => {
	let tQ = 'update users set login = ?, pass = ?, comment = ? where id = ?';

	db.run(tQ, [ id, login, pass, comment ], (err) => {
		if (!err) callback(null);
	});
};

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
