import { create } from "zustand";

interface userStoreType {
    token : string,
    setToken : (t : string) => void
}

export const userStore = create<userStoreType>((set) => ({
    token : '',
    setToken : (tok : string) => set({token : tok})
}))