const fs = require("fs");
const xml2js = require("xml2js");
const crypto = require("node:crypto");

// Get command line arguments
const args = process.argv.slice(2);

// Set up argument parsing
let xmlFilePath, outputDir;

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" || args[i] === "-i") {
    xmlFilePath = args[i + 1];
    i++;
  } else if (args[i] === "--output" || args[i] === "-o") {
    outputDir = args[i + 1];
    i++;
  }
}

// Validate required arguments
if (!xmlFilePath || !outputDir) {
  console.error(
    "Usage: node script.js --input <xml-file-path> --output <output-directory>"
  );
  console.error(
    "   or: node script.js -i <xml-file-path> -o <output-directory>"
  );
  process.exit(1);
}

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

      const testsuites = Array.isArray(result.testsuites.testsuite)
        ? result.testsuites.testsuite
        : [result.testsuites.testsuite];

      testsuites.forEach((suite) => {
        const startTime = new Date(suite.timestamp);
        const durationMillis = secondsToMilliseconds(parseFloat(suite.time));
        const endTime = new Date(startTime.getTime() + durationMillis);

        const testcases = Array.isArray(suite.testcase)
          ? suite.testcase
          : [suite.testcase];

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
              suites: testcases.length,
              tests: parseInt(suite.tests),
              passes: testcases.filter((tc) => !tc?.failure).length,
              pending: 0,
              skipped: 0,
              failures: testcases.filter((tc) => tc?.failure).length,
              flaky: 0,
              wallClockStartedAt: suite.timestamp,
              wallClockEndedAt: endTime.toISOString(),
              wallClockDuration: durationMillis,
            },
            tests: testcases.map((test) => {
              const hasFailure = test?.failure && test?.failure !== "false";
              return {
                _t: Date.now(),
                testId: generateTestId(test?.name, suite.name),
                title: [test?.name],
                state: hasFailure ? "failed" : "passed",
                isFlaky: false,
                expectedStatus: hasFailure ? "failed" : "passed",
                timeout: 0,
                location: {
                  column: 1,
                  file: suite.file ?? suite.name,
                  line: 1,
                },
                retries: 1,
                attempts: [
                  {
                    _s: hasFailure ? "failed" : "passed",
                    attempt: 1,
                    workerIndex: 1,
                    parallelIndex: 1,
                    startTime: suite.timestamp,
                    steps: [],
                    duration: secondsToMilliseconds(parseFloat(test?.time)),
                    status: hasFailure ? "failed" : "passed",
                    stdout: test?.["system-out"]
                      ? [test?.["system-out"]]
                      : undefined,
                    stderr: hasFailure
                      ? extractFailure(test?.failure)
                      : undefined,
                    errors: hasFailure
                      ? [
                          mergeFailuresIntoMessage(
                            extractFailure(test?.failure)
                          ) ?? {},
                        ]
                      : undefined,
                    error: hasFailure
                      ? mergeFailuresIntoMessage(
                          extractFailure(test?.failure)
                        ) ?? {}
                      : undefined,
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

function extractFailure(failure) {
  const failureArray = [];
  if (failure?.message) {
    failureArray.push(failure?.message);
  }
  if (failure?._) {
    failureArray.push(failure?._);
  }
  if (Array.isArray(failure)) {
    let failureItem;
    for (let i = 0; i < failure.length; i++) {
      if (typeof failure[i] === "object" && failure[i] !== null) {
        failureItem = failure[i];
        break;
      }
    }
    return extractFailure(failureItem);
  }
  return failureArray;
}

function mergeFailuresIntoMessage(failuresArray) {
  if (!failuresArray) {
    return;
  }
  if (failuresArray.length === 0) {
    return;
  }
  return {
    message: failuresArray.join(", "),
  };
}

function secondsToMilliseconds(seconds) {
  return seconds * 1000;
}
