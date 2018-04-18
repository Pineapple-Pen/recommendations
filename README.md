# WeGot - Nearby-Recommendations
## Purpose
This service forms a part of the WeGot food review website. It renders 6 recommended restaurants based on proximity to the current restaurant selected showing basic information about a restaurant, including the name, description, type, neighborhood, price level, WeGot and Google reviews summary. Clicking on the restaurant will take you to the newly selected restaurant page.

Front End Author: stayclin  
Original Front End repo: https://github.com/bamboo-connection/recommendations

## Description
The service is composed of a server, a client, and a database.
### Server API
Serves static client files in response to a GET request to the root endpoint. Serves recommendations for given restaurant id via GET request to /restaurants/:id.
### Database
PostgreSQL with PostGIS extension for geospatial querying.

## Getting Started
### Prerequisites
-npm
-node
-webpack
-PostgreSQL + PostGIS

### Installation
1. Install dependencies: `npm install`
2. Initialize database: `npm run init-postgres`
3. Seed database: `npm run seed-postgres`
4. Run Production Webpack:`npm run build`
5. Start server: `npm start`

To start, in your browser navigate to: [http://localhost:3004](http://localhost:3004)