import test from 'node:test';
import assert from 'node:assert/strict';
import {native} from '../src/bridge.js';

test('Forge web JSON bridge preserves int64 and Unicode through parse and dump',()=>{
 const source='{"id":9007199254740993,"title":"한글😀","negative":-9223372036854775808}';
 const value=native.fw_parse(source);
 assert.equal(native.fw_kind(value),4n);
 assert.equal(native.fw_count(value),3n);
 assert.equal(native.fw_integer(native.fw_get(value,'id')),9007199254740993n);
 assert.equal(native.fw_integer(native.fw_get(value,'negative')),-9223372036854775808n);
 assert.equal(native.fw_text(native.fw_get(value,'title')),'한글😀');
 assert.equal(native.fw_dump(value),source);
});

test('Forge web JSON mutation rejects prototype keys and preserves array values',()=>{
 const object=native.fw_object();
 const value=native.fw_number(9007199254740993n);
 for(const key of ['__proto__','constructor','prototype'])assert.equal(native.fw_set(object,key,value),0n);
 assert.equal(native.fw_count(object),0n);
 const array=native.fw_array();
 assert.equal(native.fw_push(array,value),1n);
 assert.equal(native.fw_count(array),1n);
 assert.equal(native.fw_dump(array),'[9007199254740993]');
});

test('Forge web JSON bridge separates invalid input, boolean false and missing fields',()=>{
 assert.equal(native.fw_parse('{broken'),0n);
 const object=native.fw_parse('{"enabled":false}');
 const enabled=native.fw_get(object,'enabled');
 assert.equal(native.fw_kind(enabled),1n);
 assert.equal(native.fw_boolean(enabled),0n);
 assert.equal(native.fw_get(object,'missing'),0n);
 assert.equal(native.fw_kind(0n),0n);
});
