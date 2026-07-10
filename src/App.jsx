import { useState } from "react";
import Select from "react-select";


function App() {
  const [options, setOptions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // 🔍 Fetch cities
  const fetchCities = async (input) => {
    if (!input) {
      setOptions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=936a5f336cc4c811bfef2c97534427fa`
      );

      const data = await res.json();

      const formattedOptions = data.map((city) => ({
        label: `${city.name}, ${city.country}`,
        value: city.name,
      }));

      setOptions(formattedOptions);
    } catch (err) {
      console.log(err);
    }
  };

  // 🌦️ Fetch weather
  const getWeather = async (city) => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=936a5f336cc4c811bfef2c97534427fa&units=metric`
      );

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔥 CENTERED GLASS CARD */}
      <div
        className="p-6 rounded-2xl w-80 text-center 
        bg-white/20 backdrop-blur-lg 
        border border-white/30 
        shadow-xl text-white
        hover:scale-105 transition duration-300"
      >
        <h1 className="text-3xl font-bold mb-4">
          Weather App 🌤️
        </h1>

        {/* 🔍 Dropdown */}
        <Select
  options={options}
  inputValue={inputValue}
  menuIsOpen={inputValue.length > 0}
  onInputChange={(value, { action }) => {
    if (action === "input-change") {
      setWeather(null);
      setInputValue(value);
      fetchCities(value);
    }
  }}
  onChange={(selected) => {
    getWeather(selected.value);
    setInputValue("");
  }}
  placeholder="Search city..."
  noOptionsMessage={() => "Type to search city..."}

  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "rgba(255,255,255,0.8)",
      color: "black",
    }),
    singleValue: (base) => ({
      ...base,
      color: "black",
    }),
    input: (base) => ({
      ...base,
      color: "black",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "white",
    }),
    option: (base, state) => ({
      ...base,
      color: "black",
      backgroundColor: state.isFocused ? "#eee" : "white",
    }),
  }}
/>

        {loading && <p className="mt-2">Loading...</p>}

        {/* 🌦️ Weather */}
        {weather && weather.main && (
          <div className="mt-4">

            <h2 className="text-black text-xl font-bold">{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather"
              className="mx-auto"
            />

            <p className="text-lg font-semibold">
              {weather.main.temp} °C
            </p>

            <p className="text-white/80">
              {weather.weather[0].main}
            </p>

            <p className="mt-2">
              💧 Humidity: {weather.main.humidity}%
            </p>

            <p>
              💨 Wind: {weather.wind.speed} km/h
            </p>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;