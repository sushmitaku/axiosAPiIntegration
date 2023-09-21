import "./styles.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [hasData, setHasData] = useState({});
  const [hasError, setHasError] = useState("");

  async function fetchData() {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );

      if (response.status === 200) {
        // Group data by userId
        const groupedData = response.data.reduce((acc, item) => {
          const { userId } = item;
          if (!acc[userId]) {
            acc[userId] = [];
          }
          acc[userId].push(item);
          return acc;
        }, {});
        console.log(groupedData)
        setHasData(groupedData);
      } else {
        setHasError(`Request failed with status ${response.status}`);
      }
    } catch (err) {
      setHasError(err.message);
    }
  }

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status !== 200) {
          setHasError(`Request failed with status ${error.response.status}`);
        } else {
          setHasError(error.message);
        }
        return Promise.reject(error);
      }
    );

    fetchData();

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <div className="App">
      {hasError ? (
        <div>{hasError}</div>
      ) : (
        <div>
          {Object.keys(hasData).map((userId) => (
            <div key={userId}>
              <h2>User ID: {userId}</h2>
              <ul>
                {hasData[userId].map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
