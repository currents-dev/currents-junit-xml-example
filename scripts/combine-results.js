const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

const reportsDir = "wdio-example";
const outputFile = "wdio-example/combined-results.xml";

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
