import query from './server/query';
import {createSalt, createHash} from './server/config/passport';
query(`SELECT * FROM hoes`)
.then(result => {
  console.log('PASS')
  throw new Error();
  console.log(result);
  return null;
})
.then((hi) => {
  console.log(hi)
  console.log('hi')
})
.catch(err => {
  console.log('FAIL')
  console.log(err)
});
