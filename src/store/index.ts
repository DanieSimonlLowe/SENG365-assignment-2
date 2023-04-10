import create from 'zustand';
interface DataState {
    authToken: string;
    setAuthToken: (token: string) => void;

    userId: number;
    setUserId: (id: number) => void;
}

const BASE_KEY: string = 'M9q8Yn-*7!av6nA6f&RGzYXq';

const getLocalStorage = (key: string): string => JSON.parse(window.localStorage.getItem(BASE_KEY+key) as string);
const setLocalStorage = (key: string, value: string): void => window.localStorage.setItem(BASE_KEY+key,JSON.stringify(value));

const getLocalStorageInt = (key: string): number => {
    const value = parseInt(getLocalStorage(key));
    if (Number.isNaN(value) || value < 0) {
        return -1;
    } else {
        return value;
    }
}

const setLocalStorageInt = (key: string, value:number): void => {
    setLocalStorage(key,value.toString());
}

const useStore = create<DataState>((set) => ({

    authToken: getLocalStorage("authToken") || '',
    setAuthToken: (token: string) => set(() => {
        setLocalStorage("authToken",token);
        return {
            authToken : token
        }
    }),

    userId: getLocalStorageInt("userId") || -1,

    setUserId: (id: number) => set(() => {
        setLocalStorageInt("userId",id);
        return {
            userId : id
        }
    })
}))

export default useStore;