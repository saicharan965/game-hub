const { execSync } = require("child_process");
const supportedArguments = ["/input", "/output", "/baseUrlTokenName"];

console.info(`---------------------------------------------------------`);
console.info(`| This script calls 'nswag' with the following arguments |`);
console.info(
  `| ${supportedArguments.join(", ")}                              |`
);
console.info(`---------------------------------------------------------`);

const arguments = new Map();
process.argv.forEach((arg, index) => {
  if (index < 2) {
    return;
  }
  let [argument, ...value] = arg.split(":");
  value = value.join(":");
  arguments.set(argument, value);
});

const unsupportedArguments = Array.from(arguments.keys()).filter(
  (x) => !supportedArguments.includes(x)
);
if (unsupportedArguments.length > 0) {
  throw `Found arguments that are not supported by this script: ${unsupportedArguments.join(
    ", "
  )}`;
}

const input = arguments.get("/input");
const output = arguments.get("/output");
const baseUrlTokenName = arguments.get("/baseUrlTokenName");

if (!input) {
  throw `Argument '/input' is missing.`;
}
if (!output) {
  throw `Argument '/output' is missing.`;
}
if (!baseUrlTokenName) {
  throw `Argument '/baseUrlTokenName' is missing.`;
}

execSync(
  `nswag openapi2tsclient /input:${input} /output:${output} /InjectionTokenType:InjectionToken /baseUrlTokenName:${baseUrlTokenName} /template:Angular /rxjsVersion:7 /useSingletonProvider:true`,
  { stdio: "inherit" }
);
