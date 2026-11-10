import {
  ShoppingMission,
  Product,
  PriceTrendData,
  UserPreferences,
  SavedItem,
  PriceAlert,
  EvaluationBenchmark,
  Recommendation
} from '../types';
import {
  INITIAL_RECOMMENDATIONS,
  INITIAL_PRICE_TREND,
  INITIAL_AGENT_EVENTS
} from '../mock/initialData';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

async function safeFetch<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${endpoint}:`, err);
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

export const apiService = {
  // Shopping Missions
  async listMissions(): Promise<ShoppingMission[]> {
    return safeFetch<ShoppingMission[]>('/api/missions', {}, []);
  },

  async createMission(query: string, preferences?: Partial<UserPreferences>): Promise<ShoppingMission> {
    return safeFetch<ShoppingMission>('/api/missions', {
      method: 'POST',
      body: JSON.stringify({ raw_query: query, preferences })
    });
  },

  // Products
  async getProducts(params?: { category?: string; query?: string }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.query) searchParams.append('query', params.query);
    const qs = searchParams.toString();
    return safeFetch<Product[]>(`/api/products${qs ? `?${qs}` : ''}`, {}, []);
  },

  async getProductPriceTrend(productId: number): Promise<PriceTrendData> {
    return safeFetch<PriceTrendData>(`/api/products/${productId}/trend`, {}, INITIAL_PRICE_TREND);
  },

  // Compare
  async compareProducts(productIds: number[]): Promise<{ products: Product[]; spec_keys: string[]; best_dimensions: any }> {
    return safeFetch('/api/compare', {
      method: 'POST',
      body: JSON.stringify({ product_ids: productIds })
    }, {
      products: INITIAL_RECOMMENDATIONS.map(r => r.product),
      spec_keys: ['battery_hours', 'has_anc', 'weight_g'],
      best_dimensions: { lowest_price_product: 'Noise Airwave Max', lowest_price: 2999 }
    });
  },

  // Preferences & Simulation
  async getPreferences(): Promise<UserPreferences> {
    return safeFetch<UserPreferences>('/api/preferences', {}, {
      price_weight: 0.25,
      performance_weight: 0.25,
      battery_weight: 0.20,
      comfort_weight: 0.15,
      reliability_weight: 0.15
    });
  },

  async updatePreferences(pref: UserPreferences): Promise<UserPreferences> {
    return safeFetch<UserPreferences>('/api/preferences', {
      method: 'PUT',
      body: JSON.stringify(pref)
    }, pref);
  },

  async simulateWeightShift(productIds: number[], preferences: Record<string, number>): Promise<{ ranked_products: any[]; shift_explanation: string }> {
    return safeFetch('/api/preferences/simulate', {
      method: 'POST',
      body: JSON.stringify({ product_ids: productIds, preferences })
    }, {
      ranked_products: INITIAL_RECOMMENDATIONS,
      shift_explanation: 'Simulated ranking recalculation across criteria weights.'
    });
  },

  // Saved Items (Wishlist, Smart Cart, Compare)
  async getSavedItems(listType?: string): Promise<SavedItem[]> {
    const qs = listType ? `?list_type=${listType}` : '';
    return safeFetch<SavedItem[]>(`/api/saved${qs}`, {}, []);
  },

  async addSavedItem(productId: number, listType: 'wishlist' | 'smart_cart' | 'compare', notes?: string): Promise<SavedItem> {
    return safeFetch<SavedItem>('/api/saved', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, list_type: listType, notes })
    });
  },

  async removeSavedItem(id: number): Promise<void> {
    return safeFetch<void>(`/api/saved/${id}`, { method: 'DELETE' });
  },

  // Price Alerts
  async getPriceAlerts(): Promise<PriceAlert[]> {
    return safeFetch<PriceAlert[]>('/api/alerts', {}, []);
  },

  async createPriceAlert(productId: number, targetPrice: number, notifyEmail?: string): Promise<PriceAlert> {
    return safeFetch<PriceAlert>('/api/alerts', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        target_price: targetPrice,
        notify_email: notifyEmail || 'shopper@cartpilot.ai'
      })
    });
  },

  async deletePriceAlert(alertId: number): Promise<void> {
    return safeFetch<void>(`/api/alerts/${alertId}`, { method: 'DELETE' });
  },

  // Evaluation
  async getEvaluationBenchmark(): Promise<EvaluationBenchmark> {
    return safeFetch<EvaluationBenchmark>('/api/evaluation');
  },

  // Sources & Real-Time Intelligence
  async getSourcesStatus(): Promise<any> {
    return safeFetch<any>('/api/sources/status');
  },

  async getMarketTrends(): Promise<any> {
    return safeFetch<any>('/api/trends');
  }
};
