import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, type ThemeColors } from './colors';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
    themeMode: ThemeMode;
    resolvedTheme: 'dark' | 'light';
    colors: ThemeColors;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    themeMode: 'dark',
    resolvedTheme: 'dark',
    colors: darkTheme,
    setThemeMode: () => { },
});

const STORAGE_KEY = 'sentinel-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored === 'dark' || stored === 'light' || stored === 'system') {
                    setThemeModeState(stored);
                }
            } catch {
                // AsyncStorage unavailable (Expo Go) — use default
            }
        })();
    }, []);

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
        AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => { });
    };

    const resolvedTheme = useMemo(() => {
        if (themeMode === 'system') {
            return systemColorScheme === 'light' ? 'light' : 'dark';
        }
        return themeMode;
    }, [themeMode, systemColorScheme]);

    const colors = resolvedTheme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ themeMode, resolvedTheme, colors, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
