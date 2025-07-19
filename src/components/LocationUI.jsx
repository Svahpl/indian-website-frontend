import axios from "axios";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const LocationUI = () => {
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");

  // Get Coordinates using Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation is not supported");
    }

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setUserLatitude(latitude);
      setUserLongitude(longitude);
      // DEBUG CONSOLE LOG BELOW : -
      // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    function error() {
      console.log("Unable to retrieve your location");
    }
  }, []);

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Call API once coordinates are available
  useEffect(() => {
    if (userLatitude !== null && userLongitude !== null) {
      const getlocation = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${userLatitude}&lon=${userLongitude}&appid=${
              import.meta.env.VITE_OPEN_WEATHER_API_KEY
            }&units=metric`
          );
          setCity(response.data.name);
        } catch (error) {
          console.log("Error getting user's location:", error);
        }
      };
      const getPostCode = async () => {
        try {
          const response = await axios.get(
            `https://us1.locationiq.com/v1/reverse.php?key=${"pk.045b6dad0566909d43f9fd24a5ffe132"}&lat=${userLatitude}&lon=${userLongitude}&format=json`
          );
          setPostCode(response.data.address.postcode);
        } catch (error) {
          console.log(`Error fetching pincode of the user: ${error}`);
        }
      };
      getlocation();
      getPostCode();
    }
  }, [userLatitude, userLongitude]); // <- This effect runs when lat/lon changes

  return (
    <div className="bg-mobile-green lg:pl-36 lg:bg-white dark:bg-gray-900 lg:text-black dark:text-white mui-white h-10 content-center lg:max-w-full lg:mx-auto lg:px-4 sm:px-6">
      <span className="flex text-black dark:text-white">
        <MapPin className="mx-2 text-black dark:text-white" size={20} /> Deliver
        to {`${removeDiacritics(city)}`}
        <span className="ml-2 text-black dark:text-gray-300">-</span>
        <span className="city-name ml-2 text-black dark:text-gray-300">
          {postCode ? postCode : "pincode"}
        </span>
      </span>
    </div>
  );
};

export default LocationUI;
