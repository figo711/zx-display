import { useEffect, useState } from "react";
import { figo } from "../flib";

export default function CurrentTime() {
    const [time, setTime] = useState<string>();
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTime(figo.getNormalDateTime());
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }, []);
  
    return (
      <>
        <h3 className={"timer"}>{time}</h3>
      </>
    );
}