# Yet Weather App

The weather app shows local weather information (assuming the user permits the browser to send its location, and the browser is capable). Once the weather data has been received from the [OpenWeatherMap](https://openweathermap.org/api) service, this is presented to the user in one of three possible modes, increasingly in levels of detail. The background image will update with a random image from Unsplash based on the obtained weather details. Lastly, the weather information auto updates every 20 mins.

# Developer Notes

During development both [JSON Server](https://www.npmjs.com/package/json-server#getting-started), to avoid constantly hitting the rate-limited APIs, and [Storybook](https://storybook.js.org/docs/guides/guide-vue/), to design the weather components, were used.

## Installation

To install the software use, `yarn install`.

## Configuration

During development, the environment variables for OpenWeather and Unsplash API keys are read from `.env`; these are not included in the Github repository for obvious reasons. Also please note, when building in development mode the development server info is read from `.env.development`. Consequently, this environment variable will be absent when building for production.

## Running

To run up both the json server and the Vue app at the same time, there is a yarn script `serve:json`.

## Deployment

The app was deployed on Netlify and can be [found here](https://confident-hodgkin-27bc95.netlify.com/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/cc4df683-9744-4bba-b8c5-022a11e4deed/deploy-status)](https://app.netlify.com/sites/confident-hodgkin-27bc95/deploys)
