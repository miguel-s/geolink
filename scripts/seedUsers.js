'use strict';

const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('../database.db');
const users = [
  {
    $id: '009ef00e-52ca-4c62-8cc6-fb48a4b4463b',
    $username: 'Foo',
    $password: '$2a$12$9ic5IkbDq9MnmD1JZs7yP.wQPqiosJkS/q1nmQzgN5IuQ3dydljli',
    $email: 'foo@hapiu.com',
    $scope: 'user, admin',
  },
];

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS users');
  db.run('CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT, password TEXT, email TEXT, scope TEXT)');

  const stmt = db.prepare('INSERT INTO users VALUES ($id, $username, $password, $email, $scope)');
  users.forEach(user => stmt.run(user));
  stmt.finalize();

  db.close();
});
