import Promise from 'bluebird';
import pg from 'pg';

import config from './config';

export default function query(queryText, values = []) {
  return new Promise((resolve, reject) => {
    pg.connect(config.connectionString, (err, client, done) => {
      done(); // call `done()` to release the client back to the pool

      if (err) return reject(err);

      client.query(queryText, values, (err, result) => {
        if (err) return reject(err);
        resolve(result.rows);
      });
    });
  });
}
