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
- **For Home Page Testing:** npm test -- --tag home
- **For Contact Us Page Testing:** npm test -- --tag contactus

## API Tests
Tests designed to test all the API routes found on the mock-user-auth npm page.
### Setup Commands:
- `chmod +x api-tests/scripts/start.sh`
- `npm start`
### Tests Run Command:
- `npm run api-test`



