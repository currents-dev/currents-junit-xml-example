# Currents.dev - Generic API example

This is an example repository that showcases using [Currents.dev](https://currents.dev) for sending test results via Currents Generic API.


- Note: get your record key from [Currents.dev](https://app.currents.dev)

- Note: obtain the project id from [Currents.dev](https://app.currents.dev)

## Definitions:
- Report directory: Is the folder path where currents/cmd will get/generate files and information for uploading your test results to Currents platform.


## Key points:
- The report directory for this project is `postman-tests-example`
- You have all scripts required to test the Generic API example in the `package.json` file

## Scripts:
- `parse-postman-test`: Transforms `postman-tests-example/tests.json` file into JUnit `postman-tests-example/tests.xml` file
- `generate-instance-files`: Reads the JUnit XML file in `postman-tests-example/tests.xml` to generate instance JSON files in `postman-tests-example/instances` path.
- `report-results`: Executes the `currents upload` command to report the test results in the report directory (`postman-tests-example`) to Currents platform.

## How to try it?
1. Get your Record key and Project ID from Currents dashboard.
2. Execute `node run parse-postman-test`
3. Execute `node run generate-instance-files`
4. Replace in the `package.json` file the script called `report-results` with your record key and project ID.
5. Set a unique CI Build ID in the script from the previous step.
6. Execute `node run report-results`