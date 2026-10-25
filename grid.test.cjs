const test = require('node:test');
const assert = require('node:assert/strict');
const { parseGridSize, nextShade } = require('./grid.js');
test('only allows whole-number grid sizes between 1 and 100', () => {
  for(const n of [1,16,64,100]) assert.equal(parseGridSize(String(n)),n);
  for(const n of [null,'',0,101,-2,1.5,'hello','Infinity']) assert.equal(parseGridSize(n),null);
});
test('ten visits reach full black without passing opacity one', () => {
  let shade=0;
  for(let n=1;n<=10;n++){shade=nextShade(shade);assert.equal(shade,n/10);}
  assert.equal(nextShade(shade),1);
});
