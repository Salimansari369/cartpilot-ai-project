import React, { useState, useEffect } from 'react';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { AgenticWorkflowPanel } from './components/AgenticWorkflowPanel';
import { TabsBar } from './components/TabsBar';
import { ProductCard } from './components/ProductCard';
import { PriceTrendCard } from './components/PriceTrendCard';
import { CompareAndSaveCard } from './components/CompareAndSaveCard';
import { FooterShortcuts } from './components/FooterShortcuts';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import { PreferenceSlidersModal } from './components/PreferenceSlidersModal';
import { CompareModal } from './components/CompareModal';
import { PriceAlertModal } from './components/PriceAlertModal';
import { SmartCartDrawer } from './components/SmartCartDrawer';
import { EvaluationView } from './components/EvaluationView';
import { SourceStatusModal } from './components/SourceStatusModal';
import { OutfitBuilderModal } from './components/OutfitBuilderModal';
import { SizeFitModal } from './components/SizeFitModal';
import { TrendExplorerModal } from './components/TrendExplorerModal';

import {
  Recommendation,
  PriceTrendData,
  Product,
  UserPreferences,
  AgentEvent
} from './types';
import {
  INITIAL_RECOMMENDATIONS,
  INITIAL_PRICE_TREND,
  INITIAL_AGENT_EVENTS,
  FASHION_RECOMMENDATIONS,
  FASHION_AGENT_EVENTS,
  HOME_RECOMMENDATIONS,
  HOME_AGENT_EVENTS,
  BEAUTY_RECOMMENDATIONS,
  BEAUTY_AGENT_EVENTS,
  BOOKS_RECOMMENDATIONS,
  BOOKS_AGENT_EVENTS
} from './mock/initialData';
import { apiService } from './services/api';

const CATEGORY_PROMPTS: Record<string, string> = {
  electronics: 'I want a wireless headphone under ₹5,000 for work and occasional gaming.',
  fashion: 'Best sneakers under ₹3,000 or casual jackets for winter',
  home: 'Best home and living essentials, ergonomic chairs, and appliances.',
  beauty: 'Top beauty and personal care essentials with best ratings.',
  books: 'Bestselling books and self-improvement paperbacks on Amazon and Flipkart.'
};

export const App: React.FC = () => {
  // State
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('electronics');
  const [currentSearchQuery, setCurrentSearchQuery] = useState(CATEGORY_PROMPTS['electronics']);
  const [activeTab, setActiveTab] = useState('top');

  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [priceTrend, setPriceTrend] = useState<PriceTrendData>(INITIAL_PRICE_TREND);
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>(INITIAL_AGENT_EVENTS);
  const [isLoading, setIsLoading] = useState(false);

  // Lists
  const [cartIds, setCartIds] = useState<number[]>([1, 2, 3]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([1]);
  const [compareIds, setCompareIds] = useState<number[]>([1, 2, 3, 4]);

  // Modals
  const [selectedAuditRec, setSelectedAuditRec] = useState<Recommendation | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [alertTargetProduct, setAlertTargetProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isStyleAssistantOpen, setIsStyleAssistantOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isTrendExplorerOpen, setIsTrendExplorerOpen] = useState(false);

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    price_weight: 0.25,
    performance_weight: 0.25,
    battery_weight: 0.20,
    comfort_weight: 0.15,
    reliability_weight: 0.15
  });
  const [simulationExplanation, setSimulationExplanation] = useState<string>('');

  // Initial load from backend API if running
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [prefs, savedCart, savedWishlist] = await Promise.all([
          apiService.getPreferences(),
          apiService.getSavedItems('smart_cart'),
          apiService.getSavedItems('wishlist')
        ]);
        if (prefs) setUserPreferences(prefs);
        if (savedCart && savedCart.length > 0) {
          setCartIds(savedCart.map((s) => s.product_id));
        }
        if (savedWishlist && savedWishlist.length > 0) {
          setWishlistIds(savedWishlist.map((s) => s.product_id));
        }
      } catch (e) {
        console.log('Using local cached baseline data.');
      }
    }
    loadInitialData();
  }, []);

  // Handle Search / Natural Language Query
  const handleSearchMission = async (query: string) => {
    setCurrentSearchQuery(query);
    setIsLoading(true);
    try {
      const mission = await apiService.createMission(query, userPreferences);
      if (mission.latest_run && mission.latest_run.recommendations.length > 0) {
        setRecommendations(mission.latest_run.recommendations);
        if (mission.latest_run.events) {
          setAgentEvents(mission.latest_run.events);
        }
        const topProd = mission.latest_run.recommendations[0].product;
        const trend = await apiService.getProductPriceTrend(topProd.id);
        setPriceTrend(trend);
      }
    } catch (e) {
      console.warn('Backend mission runner fallback:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle wishlist
  const handleToggleWishlist = async (prodId: number) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(prodId);
      if (exists) {
        return prev.filter((id) => id !== prodId);
      } else {
        apiService.addSavedItem(prodId, 'wishlist').catch(() => {});
        return [...prev, prodId];
      }
    });
  };

  // Add to Smart Cart
  const handleAddToCart = async (prodId: number) => {
    setCartIds((prev) => {
      if (!prev.includes(prodId)) {
        apiService.addSavedItem(prodId, 'smart_cart').catch(() => {});
        return [...prev, prodId];
      }
      return prev;
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (prodId: number) => {
    setCartIds((prev) => prev.filter((id) => id !== prodId));
  };

  // Simulate Preference Weight Sliders
  const handleSimulateWeights = async (newWeights: UserPreferences) => {
    setUserPreferences(newWeights);
    const prodIds = recommendations.map((r) => r.product.id);
    try {
      const sim = await apiService.simulateWeightShift(prodIds, newWeights as any);
      setSimulationExplanation(sim.shift_explanation);

      if (sim.ranked_products && sim.ranked_products.length > 0) {
        const titleOrder = sim.ranked_products.map((p) => p.canonical_title);
        const reordered = [...recommendations].sort((a, b) => {
          const idxA = titleOrder.indexOf(a.product.canonical_title);
          const idxB = titleOrder.indexOf(b.product.canonical_title);
          return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });
        setRecommendations(reordered);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cartProducts = recommendations
    .filter((r) => cartIds.includes(r.product.id))
    .map((r) => r.product);

  return (
    <div className="min-h-screen bg-[#f8f9fe] flex flex-col text-slate-800 antialiased font-sans">
      {/* 1. Dark Navy Top Header (Exact screenshot match) */}
      <TopHeader
        onSearch={handleSearchMission}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenAlerts={() => {
          setAlertTargetProduct(recommendations[0]?.product || null);
          setIsAlertsOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        cartCount={cartIds.length}
        category={selectedCategory}
      />

      {/* 2. Main Layout: Sidebar + Dashboard Grid */}
      <div className="flex-1 flex w-full">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            if (v === 'dashboard' || v === 'home') {
              setSelectedCategory('electronics');
              setRecommendations(INITIAL_RECOMMENDATIONS);
              setAgentEvents(INITIAL_AGENT_EVENTS);
              setCurrentSearchQuery(CATEGORY_PROMPTS['electronics']);
              setActiveTab('top');
            }
            if (v === 'compare') setIsCompareOpen(true);
            if (v === 'cart') setIsCartOpen(true);
            if (v === 'agent') setIsPreferencesOpen(true);
            if (v === 'tracker') setActiveTab('trend');
            if (v === 'recommendations') setActiveTab('top');
            if (v === 'orders') setActiveTab('why');
          }}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const catKey = cat.toLowerCase();
            if (catKey === 'fashion') {
              setRecommendations(FASHION_RECOMMENDATIONS);
              setAgentEvents(FASHION_AGENT_EVENTS);
            } else if (catKey === 'home') {
              setRecommendations(HOME_RECOMMENDATIONS);
              setAgentEvents(HOME_AGENT_EVENTS);
            } else if (catKey === 'beauty') {
              setRecommendations(BEAUTY_RECOMMENDATIONS);
              setAgentEvents(BEAUTY_AGENT_EVENTS);
            } else if (catKey === 'books') {
              setRecommendations(BOOKS_RECOMMENDATIONS);
              setAgentEvents(BOOKS_AGENT_EVENTS);
            } else {
              setRecommendations(INITIAL_RECOMMENDATIONS);
              setAgentEvents(INITIAL_AGENT_EVENTS);
            }
            const prompt = CATEGORY_PROMPTS[catKey] || `Best ${cat} under budget`;
            setCurrentSearchQuery(prompt);
            handleSearchMission(prompt);
          }}
          onOpenManagePlatforms={() => setIsSourcesOpen(true)}
        />

        {/* Dashboard Main Content Area */}
        <main className="flex-1 px-5 lg:px-7 py-5 space-y-5 overflow-x-hidden">
          {/* Top Row: Hero Banner (Left) + Agentic Workflow Panel (Right) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
            <div className="xl:col-span-8">
              <HeroBanner
                onSearchQuery={handleSearchMission}
                isLoading={isLoading}
                searchQuery={currentSearchQuery}
                category={selectedCategory}
              />
            </div>
            <div className="xl:col-span-4">
              <AgenticWorkflowPanel
                events={agentEvents}
                isRunning={isLoading}
                category={selectedCategory}
              />
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <TabsBar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === 'compare') setIsCompareOpen(true);
              if (tab === 'why') setSelectedAuditRec(recommendations[0]);
            }}
            compareCount={compareIds.length}
          />

          {/* 4 Cards Grid (3 Products + Price Trend / Compare & Save Card) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
            {recommendations.slice(0, 3).map((rec) => (
              <ProductCard
                key={rec.id}
                recommendation={rec}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onViewTradeoffs={(r) => setSelectedAuditRec(r)}
                isWishlisted={wishlistIds.includes(rec.product.id)}
              />
            ))}

            {/* 4th Card: Price Trend & Deal Insight OR Compare & Save */}
            {selectedCategory === 'fashion' || selectedCategory === 'home' || selectedCategory === 'beauty' || selectedCategory === 'books' ? (
              <CompareAndSaveCard product={recommendations[0]?.product} />
            ) : (
              <PriceTrendCard
                trendData={priceTrend}
                onSetAlert={() => {
                  setAlertTargetProduct(recommendations[0]?.product || null);
                  setIsAlertsOpen(true);
                }}
              />
            )}
          </div>

          {/* Footer Shortcuts: 5 Items in a row */}
          <FooterShortcuts
            onOpenCart={() => setIsCartOpen(true)}
            onOpenAlerts={() => {
              setAlertTargetProduct(recommendations[0]?.product || null);
              setIsAlertsOpen(true);
            }}
            onOpenWishlist={() => {
              const wishlistedRecs = recommendations.filter((r) => wishlistIds.includes(r.product.id));
              if (wishlistedRecs.length > 0) setRecommendations(wishlistedRecs);
            }}
            onOpenReviews={() => setSelectedAuditRec(recommendations[0])}
            onOpenPersonalized={() => setIsPreferencesOpen(true)}
            onOpenStyleAssistant={() => setIsStyleAssistantOpen(true)}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            onOpenTrends={() => setIsTrendExplorerOpen(true)}
            category={selectedCategory}
          />
        </main>
      </div>

      {/* --- Modals & Drawers --- */}

      {/* 1. Explainability Audit Modal */}
      {selectedAuditRec && (
        <ExplainabilityModal
          recommendation={selectedAuditRec}
          onClose={() => setSelectedAuditRec(null)}
        />
      )}

      {/* 2. Personalize Weights Sliders Modal */}
      {isPreferencesOpen && (
        <PreferenceSlidersModal
          preferences={userPreferences}
          onSavePreferences={async (prefs) => {
            setUserPreferences(prefs);
            await apiService.updatePreferences(prefs);
          }}
          onSimulate={handleSimulateWeights}
          simulationExplanation={simulationExplanation}
          onClose={() => setIsPreferencesOpen(false)}
        />
      )}

      {/* 3. Full Comparison Matrix Modal */}
      {isCompareOpen && (
        <CompareModal
          recommendations={recommendations.slice(0, 4)}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* 4. Price Alert Modal */}
      {isAlertsOpen && (
        <PriceAlertModal
          product={alertTargetProduct}
          onClose={() => setIsAlertsOpen(false)}
          onSetAlert={async (prodId, targetP, email) => {
            await apiService.createPriceAlert(prodId, targetP, email);
          }}
        />
      )}

      {/* 5. Smart Cart Shortlist Drawer */}
      <SmartCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartProducts={cartProducts}
        onRemoveItem={handleRemoveFromCart}
      />

      {/* 6. Evaluation Benchmark Modal */}
      {isEvaluationOpen && (
        <EvaluationView
          onClose={() => setIsEvaluationOpen(false)}
        />
      )}

      {/* 7. Source Status & Market Intelligence Dashboard */}
      {isSourcesOpen && (
        <SourceStatusModal
          onClose={() => setIsSourcesOpen(false)}
        />
      )}

      {/* 8. AI Style Assistant / Outfit Builder */}
      <OutfitBuilderModal
        isOpen={isStyleAssistantOpen}
        onClose={() => setIsStyleAssistantOpen(false)}
        baseProduct={recommendations[0]?.product}
        onAddToCart={handleAddToCart}
        onAddMultipleToCart={(ids) => {
          setCartIds((prev) => {
            const next = [...prev];
            ids.forEach((id) => {
              if (!next.includes(id)) next.push(id);
            });
            return next;
          });
        }}
      />

      {/* 9. AI Size & Fit Guide Modal */}
      <SizeFitModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productName={recommendations[0]?.product?.canonical_title || 'Nike Court Vision Low'}
      />

      {/* 10. Trend Explorer Modal */}
      <TrendExplorerModal
        isOpen={isTrendExplorerOpen}
        onClose={() => setIsTrendExplorerOpen(false)}
        onSelectTrend={(query, cat) => {
          setSelectedCategory(cat);
          const catKey = cat.toLowerCase();
          if (catKey === 'fashion') {
            setRecommendations(FASHION_RECOMMENDATIONS);
            setAgentEvents(FASHION_AGENT_EVENTS);
          } else if (catKey === 'home') {
            setRecommendations(HOME_RECOMMENDATIONS);
            setAgentEvents(HOME_AGENT_EVENTS);
          } else if (catKey === 'beauty') {
            setRecommendations(BEAUTY_RECOMMENDATIONS);
            setAgentEvents(BEAUTY_AGENT_EVENTS);
          } else if (catKey === 'books') {
            setRecommendations(BOOKS_RECOMMENDATIONS);
            setAgentEvents(BOOKS_AGENT_EVENTS);
          } else {
            setRecommendations(INITIAL_RECOMMENDATIONS);
            setAgentEvents(INITIAL_AGENT_EVENTS);
          }
          setCurrentSearchQuery(query);
          handleSearchMission(query);
        }}
      />
    </div>
  );
};

export default App;
