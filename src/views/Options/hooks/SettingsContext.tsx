import { useContext, useState } from "react";

interface SettingsContextShape {}

// export const SettingsContext = useContext<SettingsContextShape>({});

interface Props {
  children: JSX.Element | Array<JSX.Element>;
}

export const SettingsProvider = () => {
  const [settings, setSettings] = useState();
};
