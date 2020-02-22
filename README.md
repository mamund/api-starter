# API Starter

A simple _starter-kit_ for developing DARRT-style APIs.

## Set up your project
1. FORK this repo (or just copy the dartt folder index.js files) into your own project folder.
2. Using npm, install/update the following packages:
 *   `npm install -s body-parser`
 *   `npm install -s cors`
 *   `npm install -s ejs`
 *   `npm install -s express`

## Update the DARRT folder
The DARRT folder holds the framework base files.

### Update the `darrt/data.js` file
This defines that state that is passed back and forth
 * properties (MUST include id, dateCreated, & dateUpdate, SHOULD include stats)
 * enums
 * requireds
 * defaults

### update the `darrt/action.js` file
This implements the internal functionality your service supports
 
### Update the `darrt/resources.js` file
This file contains the routes and calling routines for all the URLs in your API and maps to the actions

### Update the `representation.js` file
This file contains the response representations your service supports. see the `darrt/representors/` folder for details

### Update the `transitions.js` file
This file contains all the links and forms your service API will emit at runtime.  If you are only supporting `application/json` or `text/csv` or some other format that has no hypermedia support, you can skip this step.


