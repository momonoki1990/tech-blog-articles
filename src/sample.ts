import { marked } from "marked";

console.log("hello world");
const html = marked.parse("# Marked in Node.js\n\nRendered by **marked**.");
console.log(html);
