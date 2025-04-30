import React, {useState} from "react";
import Toggle from "react-Toggle";
import {useMediaQuery} from "react-responsive";
import Moon from "../imgs/Moon.png";
import Sun from "../imgs/Sun.png";


export const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(true);
  
    const systemPrefersDark = useMediaQuery(
      {
        query: "(prefers-color-scheme: dark)",
      },
      undefined,
      (isSystemDark) => setIsDark(isSystemDark)
    );

    return (
        <Toggle>
            checked={isDark}
            onChange{({target}) => setIsDark(target.checked)}
            icons={{checked: {Moon}, unchecked: {Sun}}} 
            aria-label: "Dark-Mode"
        </Toggle>
    );
}