const fs = require("fs");

const axios = require("axios");

class Searches {
  constructor() {
    this.history = [];
    this.dbPath = "./db/data.json";
  }

  get getParamsMapBox() {
    return {
      language: "es",
      access_token: process.env.MAPBOX_KEY,
    };
  }

  get getParamsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      lang: "es",
      units: "metric",
    };
  }

  async searchPlace(place = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.getParamsMapBox,
      });

      const places = await instance.get();

      return places.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        longitude: place.center[0],
        latitude: place.center[1],
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async weatherByPlace(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: { ...this.getParamsWeather, lat, lon },
      });

      const resWeather = await instance.get();
      const { weather, main } = resWeather.data;

      return {
        description: weather[0].description,
        temperature: main.temp,
        min: main.temp_min,
        max: main.temp_max,
      };
    } catch (error) {
      console.log(error);
    }
  }

  saveHistory(place = "") {
    //skip duplicates and add history
    this.history.includes(place) || this.history.unshift(place);

    this.history = this.history.splice(0, 5);
    //save db
    this.saveDB();
  }

  saveDB() {
    const payload = {
      historial: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, "utf-8");
    const data = JSON.parse(info);

    this.history = data.historial;
  }
}

module.exports = Searches;
