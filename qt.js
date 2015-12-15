import query from './server/query';
import {createSalt, createHash} from './server/config/passport';
console.log(createSalt().length);
console.log(createHash('asdaasdasdkasljdasd', createSalt()).length)
console.log('hi')
query(`SELECT * FROM hoes`)
.then(result => {
  console.log('PASS')
  console.log(result);
  return null;
})
.then(() => {
  console.log('hi')
})
.catch(err => {
  console.log('FAIL')
  console.log(err)
});
