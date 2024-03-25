# SDET-TechnicalTask

# Overview
Simple implementaion of testing [MyStore website](https://multiformis.com) using NightwatchJS and API testing using Supertest.

## Project Installation
- git clone [repository-url]
- cd [project-directory]
- `npm install`

## MyStore Tests
Tests designed to verify the functionality of the MyStore website.
- **Home Page Testing:** Test home page search functionality on typing "dress" search query.
- **Contact Us Page Testing:** Test contact us form submission with different scenarios.
### How to run:
- **For Home Page Testing:** `npm test -- --tag home`
- **For Contact Us Page Testing:** `npm test -- --tag contactus`

## API Tests
Tests designed to test all the API routes found on the mock-user-auth npm page.
### Setup Commands:
- `chmod +x api-tests/scripts/start.sh`
- `npm start`
### Tests Run Command (in a new terminal):
- `npm run api-test`

## HTML reports
HTML reports are automatically generated for both the mystore tests and api tests inside the **tests_output** folder that will be automatically created after the run commands  

## Notes

### mock-user-auth module
The **app.js** file, **components**, **scripts** and **config** folders are sourced from the [GitHub repository](https://github.com/thiagoluiznunes/mock-user-auth) found in the [mock-user-auth](https://www.npmjs.com/package/mock-user-auth) module 

### CircleCI Issue
There is an issue with the CircleCI pipeline where the tests fail, even though the project runs successfully on my local machine. This issue may be related to configuration differences between the local environment and the CI environment.

