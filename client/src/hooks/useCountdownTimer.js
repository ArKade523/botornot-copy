import { useEffect, useState } from "react";

const useCountdownTimer = (initialSeconds) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    useEffect(() => {
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) return prevSeconds - 1;
          clearInterval(intervalId);
          return 0;
        });
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, []);
  
    return seconds;
};

export default useCountdownTimer;
