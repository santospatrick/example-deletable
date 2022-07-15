import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("env variable", {
    algoliaKey: functions.config().algolia.key,
  });
  response.send("Hello from Workshop!");
});
