import { useApp } from "../state/AppContext";
import { getMessages } from "./messages";
export function useMessages(){const{data}=useApp();return getMessages(data.settings.language);}
