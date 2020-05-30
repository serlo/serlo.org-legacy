import { serialize } from '../src/main/modules/diff/serialize.ts'
import * as diff_example from './diff_example.json'
import * as diff_spoiler from './diff_spoiler.json'

test("Does something", () => {
  console.log("Hello, World!");
  let serialized = serialize(diff_example);
  console.log(serialized);
  let bla = "a";
  expect(bla).toEqual('a');
})

test("Does something else", () => {
  console.log("Hello, Spoiler!");
  let serialized = serialize(diff_spoiler);
  console.log(serialized);
  let bla = "a";
  expect(bla).toEqual('a');
})
