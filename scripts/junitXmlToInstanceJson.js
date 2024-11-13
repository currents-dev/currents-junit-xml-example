const fs = require("fs");
const xml2js = require("xml2js");
const crypto = require("node:crypto");

const xmlFilePath = "postman-tests-example/tests.xml";
const outputDir = "postman-tests-example/instances";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateTestId(testName, suiteName) {
  const combinedString = `${testName}${suiteName}`;
  const fullHash = crypto
    .createHash("sha256")
    .update(combinedString)
    .digest("hex");
  return fullHash.substring(0, 16);
}

function generateShortHash(specName) {
  const hash = crypto.createHash("sha256").update(specName).digest("base64");
  const shortHash = hash
    .slice(0, 8)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return shortHash;
}

fs.readFile(xmlFilePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading XML file:", err);
    return;
  }

  xml2js.parseString(
    data,
    { explicitArray: false, mergeAttrs: true },
    (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        return;
      }

      const testsuites = result.testsuites.testsuite;
      testsuites.forEach((suite, index) => {
        const startTime = new Date(suite.timestamp);
        const durationMillis = parseFloat(suite.time) * 1000;
        const endTime = new Date(startTime.getTime() + durationMillis);
        console.log("RES::", result.testsuites.name);

        const suiteJson = {
          groupId: result.testsuites.name,
          spec: suite.name,
          worker: {
            workerIndex: 1,
            parallelIndex: 1,
          },
          startTime: suite.timestamp,
          results: {
            stats: {
              suites: 1,
              tests: parseInt(suite.tests),
              passes: suite.testcase.filter((tc) => !tc.failure).length,
              pending: 0,
              skipped: 0,
              failures: suite.testcase.filter((tc) => tc.failure).length,
              flaky: 0,
              wallClockStartedAt: suite.timestamp,
              wallClockEndedAt: endTime.toISOString(),
              wallClockDuration: durationMillis,
            },
            tests: suite.testcase.map((test) => {
              console.log("TEST::", test);
              return {
                _t: Date.now(),
                testId: generateTestId(test.name + suite.name),
                title: [test.name],
                state: test.failure ? "failed" : "passed",
                isFlaky: false,
                expectedStatus: test.failure ? "failed" : "passed",
                timeout: 0,
                location: {
                  column: 1,
                  file: "postman-tests-example/tests.xml",
                  line: 1,
                },
                retries: 1,
                attempts: [
                  {
                    _s: test.failure ? "failed" : "passed",
                    attempt: 1,
                    workerIndex: 1,
                    parallelIndex: 1,
                    startTime: suite.timestamp,
                    steps: [],
                    duration: parseFloat(test.time) * 1000,
                    status: test.failure ? "failed" : "passed",
                    stdout: [],
                    stderr: test.failure ? [JSON.stringify(test.failure)] : [],
                    errors: test.failure ? [test.failure] : [],
                    error: test.failure ? test.failure : {},
                  },
                ],
              };
            }),
          },
        };

        const fileNameHash = generateShortHash(suite.name);

        fs.writeFileSync(
          `${outputDir}/${fileNameHash}.json`,
          JSON.stringify(suiteJson, null, 2),
          "utf8"
        );
        console.log(
          `Created JSON file for testsuite ${suite.name} at ${outputDir}/${fileNameHash}.json`
        );
      });
    }
  );
});
