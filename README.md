## Zarnegar

This is a Node.js Express application for managing a collection of commodities.

### Features

* Create, read, update, and delete (CRUD) operations for commodities
* Search for commodities by ID
* Display a list of all commodities
* Display a detailed view of a single commodity
* Error handling for invalid input and database errors

### Installation

1. Clone this repository.
2. Install the dependencies:

```
npm install
```

3. Start the server:

```
npm start
```

### Usage

The server will start on port 3000. You can access the application in your web browser at [http://localhost:3000/](http://localhost:3000/).

**Endpoints:**

* `/`: Displays the home page
* `/allitems`: Displays a list of all commodities
* `/about`: Displays the about page
* `/contact`: Displays the contact page
* `/new`: Displays the form for creating a new commodity
* `/find-item`: Searches for a commodity by ID
* `/delete-item`: Deletes a commodity by ID
* `/new`: Creates a new commodity

**Form fields:**

* `commodityId`: The ID of the commodity
* `commodityName01`: The name of the commodity
* `commodityWeight`: The weight of the commodity
* `commodityfineness`: The fineness of the commodity
* `commodityprice`: The price of the commodity

### License

This project is licensed under the MIT License.
