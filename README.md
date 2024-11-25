# Currents.dev - JUnit XML report example

This is an example repository that showcases using [Currents.dev](https://currents.dev) for sending test results via Currents Generic API.


- Note: get your record key from [Currents.dev](https://app.currents.dev)

- Note: obtain the project id from [Currents.dev](https://app.currents.dev)

## Definitions:
- Report directory: Is the folder path where currents/cmd will get/generate files and information for uploading your test results to Currents platform.


## Key points:
- You have all scripts required to test the Generic API example in the `package.json` file
- All the examples must have the `instances` folder within their respective example folders. Eg: `postman-tests-example/instances`
- All the examples must have their respective `config.json` file with the following structure:
```
{
  "framework": "junit", // This is mandatory
  "frameworkVersion": "11.10.0", // Your framework's version
  "cliArgs": {
    "options": { 
        "jUnitFile": "postman-tests-example/tests.xml" // This is mandatory and must point to the JUnit XML file with the tests results
    },
    "args": []
  },
  "frameworkConfig": {
    "originFramework": "postman", // This is your framework's name
    "originFrameworkVersion": "11.10.0" // This is your framework's version
  }
}
```
- Recognized `originFramework` values in the dashboard are: `postman` for Postman, `vitest` for Vitest and `wdio` for WebDriver.io
- You can run the `<framework>:full` command for each example to execute all the related commands to the specific example or execute each one of the commands in order to understand what is the purpose of each one.


## How to try it?
1. Execute `npm run initial-setup` for setting up the needed folders for all the examples.
2. Get your Record key and Project ID from Currents dashboard.
3. Put the Record key, Project ID and a unique CI build ID in a `.env` file like this:
```
CURRENTS_KEY=your-record-key
CURRENTS_PROJECT_ID=your-project-id
CURRENTS_CI_BUILD_ID=unique-id
```

### Postman
Postman example is in `postman-tests-example` folder.
The Postman example has the following commands:
- `parse-postman-test`: Parses the JSON file exported from the Postman collection and turns it into a JUnit XML file. It uses `newman` to transform the file.
- `gen-instance-postman`: Generates the instance files into `postman-tests-example/instances` folder from the JUnit XML file.
- `report-results-postman`: Uploads the results to Currents platform.
- `postman:full`: Executes all the postman example related commands consecutively in the right order.

Note: `gen-instance-postman` command uses `currents convert` command to make the file parsing easier for postman specifically and will increase the support for other frameworks overtime.

### Vitest
Vitest example is in `vitest-example` folder.
The Vitest example has the following commands:
- `test-vitest`: Executes the vitest tests and outputs the result into a JUnit XML file.
- `gen-instance-vitest`: Generates the instance files into `vistes-example/instances` folder from the JUnit XML file.
- `report-results-vitest`: Uploads the results to Currents platform.
- `vitest:full`: Executes all the vitest example related commands consecutively in the right order.

### WebDriver.io
WebDriver.io example is in `wdio-example` folder.
The WebDriver.io example has the following commands:
- `test-wdio`: Executes the WebDriver.io tests and outputs the result into a JUnit XML file.
- `gen-instance-wdio`: Generates the instance files into `wdio-example/instances` folder from the JUnit XML file.
- `report-results-wdio`: Uploads the results to Currents platform.
- `wdio:full`: Executes all the WebDriver.io example related commands consecutively in the right order.