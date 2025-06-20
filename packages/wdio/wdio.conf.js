exports.config = {
  runner: "local",
  specs: ["./tests/**/*.js"], // Adjust your test directory

  maxInstances: 1, // Set this to a higher number if you want parallel execution
  logLevel: "info",
  waitforTimeout: 10000,
  framework: "mocha",
  reporters: [
    "spec",
    [
      "junit",
      {
        outputDir: "./results",
        addFileAttribute: true,
        outputFileFormat: function (options) {
          return `${options.capabilities?.["currents:name"]}-${options.cid}.xml`;
        },
      },
    ],
  ],

  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["--headless"], // Run in headless mode (optional)
      },
      "currents:name": "groupA",
    },
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        mobileEmulation: { deviceName: "Nexus 5" }, // ✅ Use a valid device
        args: ["--headless"],
      },
      "currents:name": "groupB",
    },
  ],
};
