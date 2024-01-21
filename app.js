const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/weather', async (req, res) => {
  const apiKey = 'b4bf90dafb34ce2c795299cb74224f94';
  const { city } = req.body;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',  // Change to 'imperial' for Fahrenheit
      },
    });

    const { weather, main } = response.data;
    const weatherDescription = weather[0].description;
    const temperature = main.temp;

    const mood = suggestMood(weatherDescription, temperature);

    res.send({
      location: city,
      weatherDescription,
      temperature: `${temperature}°C`,
      moodSuggestion: mood,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
});

function suggestMood(weatherDescription, temperature) {
  // Define mood associations based on weather conditions and temperature
  if (weatherDescription.toLowerCase().includes('rain')) {
    return 'Cozy up with a book and enjoy the rain.';
  } else if (weatherDescription.toLowerCase().includes('clear') && temperature > 25) {
    return 'Perfect day for outdoor activities!';
  } else if (weatherDescription.toLowerCase().includes('clear')) {
    return 'Enjoy the clear skies and sunshine.';
  } else if (weatherDescription.toLowerCase().includes('cloud')) {
    return 'A bit cloudy. How about a movie indoors?';
  } else if (weatherDescription.toLowerCase().includes('snow')) {
    return 'Let it snow! Time for some winter fun.';
  } else {
    return 'Weather is unpredictable today. Stay flexible with your plans!';
  }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
