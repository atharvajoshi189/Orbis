import { create } from 'zustand';

type Country = {
    code: string;
    name: string;
    flag: string;
    visaRate: number;
    jobDemand: string;
    prDifficulty: string;
};

export type User = {
    id?: string;
    name: string;
    email: string;
    avatar?: string;
};

interface AppState {
    selectedCountry: Country;
    setCountry: (country: Country) => void;
    xp: number;
    addXp: (amount: number) => void;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

export const countries: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸', visaRate: 65, jobDemand: 'High', prDifficulty: 'Hard' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', visaRate: 72, jobDemand: 'Moderate', prDifficulty: 'Moderate' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', visaRate: 85, jobDemand: 'High', prDifficulty: 'Easy' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', visaRate: 78, jobDemand: 'Very High', prDifficulty: 'Moderate' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', visaRate: 80, jobDemand: 'High', prDifficulty: 'Moderate' },
];

export const useAppStore = create<AppState>((set) => ({
    selectedCountry: countries[0],
    setCountry: (country) => set({ selectedCountry: country }),
    xp: 12450,
    addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
    user: null,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
