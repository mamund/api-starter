# API Starter

A simple _starter-kit_ for developing *DARRT*-style APIs. *DARRT* is an acronym which stands for Data, Actions, Resources, Representations, & Transitions. The *DARRT* library is used in the book "Design and Build Great Web APIs" (https://pragprog.com/book/maapis/design-and-build-great-web-apis).

## Set up your project
First, FORK this repo (or just copy the `/dartt/` folder and the root `index.js` and `package.json` files into your own project folder).

This project has a `package.json` which identifies the following runtime dependencies:
 *   `body-parser`
 *   `cors`
 *   `ejs`
 *   `express`

You can use `npm install` to update all dependencies. If you just copy the files, be sure to install/update the dependencies yourself.

## Update the control files
The project SHOULD work "out-of-the-box" as a simple CRUD-style API to manage persons.  To make this work for your own API needs, you only need to update the files in the `/darrt/` folder. See the steps below for details.

## The DARRT folder
The `/darrt/` folder holds the framework base files:
 * `data.js`
 * `actions.js`
 * `resources.js`
 * `representations.js`
 * `transitions.js`

These four files are the ones you'll edit to match your API needs.

### The `lib` and `representors` folders
There are two subfolders, too: `/darrt/lib` and `/darrt/representors/`. The `lib` folder holds the operational support files for managing the information in your control files in the `/darrt/` folder. The `representors` folder holds response representation templates (using `ejs`) matched to media-type strings. The representors in the base library are:
 * application/json
 * text/csv
 * application/forms+json
 * application/links+json (alpha)
 * application/prag+sjon (beta)
 
You can edit these and add new representors for additional media types as needed.

### The `darrt/data.js` file
This defines what state is passed back and forth
 * properties (MUST include `id`, `dateCreated`, & `dateUpdated`; SHOULD include `status`)
 * enums
 * requireds
 * defaults

### The `darrt/actions.js` file
This implements the internal functionality your service supports through a series of exported functions. See the included `actions.js` for examples.
 
### The `darrt/resources.js` file
This file contains the routes and calling routines for all the URLs in your API and maps to the actions. This is the classic *express.js*-style `router.get(...)`, `router.post(...)` set of operations that _call_ the exported `actions.js` methods via a special operation (`utils.handler(...)`). See the included `resources.js` for examples.

### The `representation.js` file
This file contains the response representations your service supports. This is based on the _representor_ pattern. See the `darrt/representors/` folder for built-in examples of a handful of media-type representors.

### The `transitions.js` file
This file contains all the links and forms your service API will emit at runtime.  If you are only supporting `application/json` or `text/csv` or some other format that has no hypermedia support, you can ignore this step.


