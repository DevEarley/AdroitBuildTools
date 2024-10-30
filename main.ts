const name = Deno.args[0];
const food = Deno.args[1];
console.log(`Hello ${name}, I like ${food}!`);

// import { parseArgs } from "jsr:@std/cli/parse-args";

// const flags = parseArgs(Deno.args, {
//   boolean: ["help", "color"],
//   string: ["version"],
//   default: { color: true },
//   negatable: ["color"],
// });

 await Deno.writeTextFile("hello.txt", name + "|" + food);

// const file = await Deno.create("hello.txt");

// const writer = file.writable.getWriter();
// await writer.write(new TextEncoder().encode("World!"));

// await writer.close();

console.log("done");
setTimeout(() => {
  console.log(".");
}, 1000);
setTimeout(() => {
  console.log("..");
}, 1500);
setTimeout(() => {
  console.log("...");
}, 2000);
