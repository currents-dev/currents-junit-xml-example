const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

const args = process.argv.slice(2);
const reportsDirIndex = args.indexOf('--reports-dir');
const outputFileIndex = args.indexOf('--output-file');

// Set directories with defaults
const reportsDir = reportsDirIndex !== -1 ? args[reportsDirIndex + 1] : "wdio-example";
const outputFile = outputFileIndex !== -1 ? args[outputFileIndex + 1] : "wdio-example/combined-results.xml";

if (reportsDirIndex === -1 || outputFileIndex === -1) {
  console.log('Usage: node script.js --reports-dir <directory> --output-file <file>');
  console.log(`Using defaults: --reports-dir="${reportsDir}" --output-file="${outputFile}"`);
}

async function combineResults() {
  const files = fs
    .readdirSync(reportsDir)
    .filter((f) => f.startsWith("results-") && f.endsWith(".xml"));

  let combinedTestsuites = {
    testsuites: {
      testsuite: [],
    },
  };

  for (const file of files) {
    const content = fs.readFileSync(path.join(reportsDir, file), "utf-8");
    const result = await xml2js.parseStringPromise(content);

    if (result.testsuites && result.testsuites.testsuite) {
      if (Array.isArray(result.testsuites.testsuite)) {
        combinedTestsuites.testsuites.testsuite.push(
          ...result.testsuites.testsuite
        );
      } else {
        combinedTestsuites.testsuites.testsuite.push(
          result.testsuites.testsuite
        );
      }
    }
  }

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(combinedTestsuites);

  fs.writeFileSync(outputFile, xml);

  // Optionally clean up individual result files
  files.forEach((file) => fs.unlinkSync(path.join(reportsDir, file)));

  console.log("Results combined into:", outputFile);
}

combineResults().catch(console.error);
