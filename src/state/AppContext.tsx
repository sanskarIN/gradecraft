import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { clearData, loadData, saveData } from "../data/storage";
import { createDefaultData } from "../domain/defaults";
import { canDeleteScale } from "../domain/gradeScaleUsage";
import type { AppData, Course, GradeScaleProfile, Settings } from "../domain/types";

type Action =
  | { type: "course/add"; course: Course }
  | { type: "course/update"; course: Course }
  | { type: "course/delete"; id: string }
  | { type: "scale/add"; scale: GradeScaleProfile }
  | { type: "scale/update"; scale: GradeScaleProfile }
  | { type: "scale/delete"; id: string }
  | { type: "settings/update"; settings: Partial<Settings> }
  | { type: "data/replace"; data: AppData }
  | { type: "data/reset" };

interface AppContextValue {
  data: AppData;
  dispatch: Dispatch<Action>;
  persistenceError: boolean;
  resetPersistedData: () => void;
}

function touch(data: AppData): AppData {
  return { ...data, lastUpdatedAt: new Date().toISOString() };
}

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case "course/add":
      return touch({ ...state, courses: [...state.courses, action.course] });
    case "course/update":
      return touch({
        ...state,
        courses: state.courses.map((course) => (course.id === action.course.id ? action.course : course)),
      });
    case "course/delete":
      return touch({ ...state, courses: state.courses.filter((course) => course.id !== action.id) });
    case "scale/add":
      return touch({ ...state, gradeScales: [...state.gradeScales, action.scale] });
    case "scale/update":
      return touch({
        ...state,
        gradeScales: state.gradeScales.map((scale) =>
          scale.id === action.scale.id ? action.scale : scale,
        ),
      });
    case "scale/delete":
      return canDeleteScale(state, action.id)
        ? touch({ ...state, gradeScales: state.gradeScales.filter((scale) => scale.id !== action.id) })
        : state;
    case "settings/update":
      return touch({ ...state, settings: { ...state.settings, ...action.settings } });
    case "data/replace":
      return touch(action.data);
    case "data/reset":
      return createDefaultData();
  }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [data, dispatch] = useReducer(reducer, undefined, () => loadData());
  const [persistenceError, setPersistenceError] = useState(false);

  useEffect(() => {
    setPersistenceError(!saveData(data));
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      root.dataset.theme =
        data.settings.theme === "system" ? (media.matches ? "dark" : "light") : data.settings.theme;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [data.settings.theme]);

  useEffect(() => {
    document.documentElement.lang = data.settings.language ?? "en";
  }, [data.settings.language]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(data.settings.reducedMotion);
    document.documentElement.dataset.compact = String(data.settings.compactMode);
  }, [data.settings.reducedMotion, data.settings.compactMode]);

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      dispatch,
      persistenceError,
      resetPersistedData: () => {
        if (!clearData()) {
          setPersistenceError(true);
          return;
        }
        setPersistenceError(false);
        dispatch({ type: "data/reset" });
      },
    }),
    [data, persistenceError],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider.");
  return value;
}
