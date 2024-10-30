const name = Deno.args[0];
const food = Deno.args[1];
await Deno.writeTextFile("C:\\Users\\TheDean\\Desktop\\build-logs.txt", name + "|" + food);
