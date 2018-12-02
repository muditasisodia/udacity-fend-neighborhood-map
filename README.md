# Neighborhood Map
This project is a part of Udacity’s Front End Nanodegree.
This project tests the concepts of React with APIs.

### How to Run
1. Clone or download this repository.
2. The dependencies first need to be installed. In order to do this, run `npm install`. In case you do not have npm, you may download it from [here](https://nodejs.org/en/).
3. You may now run the project with `npm start`.

### How to Use

The app displays venues for outdoor activities in Mumbai using the [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial) for display purposes and the [FourSquare API](https://developer.foursquare.com/) to fetch information about these places.

The user may filter through the locations using the input box.
Location information can be obtained by either clicking on the item in the list of clicking a marker on the map.

Caching only works in the production mode. In order to test this, you must first build the project. In the terminal, run
`npm run build`
`npm install -g serve` or `yarn global add serve`
`serve -s build`
The application can now be accessed on http://localhost:5000.
