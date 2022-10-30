require("dotenv").config();

const { readInput, inquirerMain, pause, listPlacesFound } = require("./helpers/inquirer");
const Searches = require("./models/searches");

const main = async () => {
  const searches = new Searches();
  let option = "";
  do {
    option = await inquirerMain();

    switch (option) {
      case 1:
        //Show message search city/place
        const query = await readInput("Place: ");

        //Search places (API)
        const places = await searches.searchPlace(query);

        //Select a city
        const placeSelected = await listPlacesFound(places);
        if (placeSelected === 0) continue;

        const { name, latitude, longitude } = places.find((place) => place.id === placeSelected);

        searches.saveHistory(name);

        //weather (API)
        const { temperature, min, max, description } = await searches.weatherByPlace(latitude, longitude);

        //Show results
        console.log("\nInformation of the Place:\n".green);
        console.log("Place: ", name.green);
        console.log("Latitude: ", latitude);
        console.log("Longitude: ", longitude);
        console.log("Temperature: ", temperature);
        console.log("Min: ", min);
        console.log("Max: ", max);
        console.log("Description: ", description.green);

        await pause();
        break;
      case 2:
        //Show history
        console.log();
        searches.readDB();
        searches.history.forEach((place, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${place}`);
        });

        await pause();
        break;
    }
  } while (option !== 0);
};

main();
