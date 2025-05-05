import { create } from 'zustand';

type SnapadillaStore = {
  uri: string;
  getUri: () => string;
  setUri: (uri: string) => void;
  uriType: 'video' | 'picture' | '';
  setUriType: (uriType: 'video' | 'picture' | '') => void;
  user: string;
  setUser: (user: string) => void;
};

const useSnapadillaStore = create<SnapadillaStore>((set, get) => ({
  uri: '',
  uriType: 'picture',
  user: '',

  setUri: (value: string) => set({ uri: value }),
  getUri: () => get().uri,
  setUriType: (uriType: 'video' | 'picture' | '') => set({ uriType }),
  setUser: (user: string) => set({ user }),
}));

export default useSnapadillaStore;
