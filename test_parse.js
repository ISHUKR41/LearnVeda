const { parseMarkdown } = require('./frontend/src/lib/utils/parseMarkdown');

const testString = "$$1 \\text{ Newton} = 1 \\text{ kg} \\times 1 \\text{ m/s}^2$$";
console.log(parseMarkdown(testString));
