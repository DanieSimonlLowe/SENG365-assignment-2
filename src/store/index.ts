import create from 'zustand';
interface DataState {
    authToken: string;
    setAuthToken: (token: string) => void;

}

const getLocalStorage = (key: string): string => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: string) => window.localStorage.setItem(key,JSON.stringify(value));

const useStore = create<DataState>((set) => ({

    authToken: getLocalStorage("auth_token") || '',
    setAuthToken: (token: string) => set(() => {
        setLocalStorage("auth_token",token);
        return {
            authToken : token
        }
    }),


}))

export default useStore;