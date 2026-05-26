import { create } from 'zustand';
import { api } from '../api/client.js';
import type { CargoTrackItem, TrackResult } from '../types/index.js';

interface SearchState {
  boxNumber: string;
  shippingResults: CargoTrackItem[];
  receivingResults: CargoTrackItem[];
  shippingTotal: number;
  receivingTotal: number;
  loading: boolean;
  error: string | null;
  activeTab: 'shipping' | 'receiving';
  setBoxNumber: (val: string) => void;
  setActiveTab: (tab: 'shipping' | 'receiving') => void;
  search: () => Promise<TrackResult | null>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  boxNumber: '',
  shippingResults: [],
  receivingResults: [],
  shippingTotal: 0,
  receivingTotal: 0,
  loading: false,
  error: null,
  activeTab: 'shipping',
  setBoxNumber: (val) => set({ boxNumber: val }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  search: async () => {
    const { boxNumber } = get();
    if (!boxNumber.trim()) {
      set({ error: '请输入箱号' });
      return null;
    }
    set({ loading: true, error: null });
    try {
      const result = await api.cargo.track(boxNumber.trim());
      set({
        shippingResults: result.shipping,
        receivingResults: result.receiving,
        shippingTotal: result.shippingTotal,
        receivingTotal: result.receivingTotal,
        activeTab: result.shipping.length > 0 ? 'shipping' : 'receiving',
        loading: false,
      });
      return result;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return null;
    }
  },
  clearResults: () =>
    set({
      shippingResults: [],
      receivingResults: [],
      shippingTotal: 0,
      receivingTotal: 0,
      error: null,
    }),
}));
