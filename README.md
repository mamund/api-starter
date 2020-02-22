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
This defines what state is passed back and forth
 * properties (MUST include `id`, `dateCreated`, & `dateUpdated`; SHOULD include `status`)
 * enums
 * requireds
 * defaults

### update the `darrt/actions.js` file
This implements the internal functionality your service supports through a series of exported functions. See the included `actions.js` for examples.
 
### Update the `darrt/resources.js` file
This file contains the routes and calling routines for all the URLs in your API and maps to the actions. This is the classic *express.js*-style `router.get(...)`, `router.post(...)` set of operations that _call_ the exported `actions.js` methods via a special operation (`utils.handler(...)`). See the included `resources.js` for examples.

### Update the `representation.js` file
This file contains the response representations your service supports. This is based on the _representor_ pattern. See the `darrt/representors/` folder for built-in examples of a handful of media-type representors.

### Update the `transitions.js` file
This file contains all the links and forms your service API will emit at runtime.  If you are only supporting `application/json` or `text/csv` or some other format that has no hypermedia support, you can ignore this step.


