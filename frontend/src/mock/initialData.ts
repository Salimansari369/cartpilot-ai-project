import { Recommendation, PriceTrendData, AgentEvent } from '../types';

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    product_id: 1,
    rank: 1,
    badge: 'Best Overall',
    overall_score: 94.2,
    score_breakdown: {
      price: 88.5,
      performance: 96.0,
      battery: 100.0,
      comfort: 91.5,
      reliability: 95.0
    },
    reasons: [
      'Active Noise Cancellation (ANC) superior in sub-₹5,000 category',
      'Class-leading 70-hour battery life with fast charging (5 min = 3 hrs)',
      'Dual Pairing Bluetooth 5.3 allows seamless laptop and phone switching',
      'All-time lowest recorded price of the season (₹4,499 on Amazon)'
    ],
    sacrifice_tradeoffs: [
      'Weighs 232g (slightly heavier than Sony WH-CH720N at 192g)',
      'Costs ₹1,500 more than budget entry Noise Airwave Max'
    ],
    confidence_score: 0.98,
    product: {
      id: 1,
      canonical_title: 'JBL Tune 770NC',
      category: 'electronics',
      brand: 'JBL',
      model_number: 'JBLT770NCBLK',
      badge: 'Best Overall',
      rating: 4.4,
      review_count: 42315,
      key_features: [
        'Active Noise Cancellation',
        'Up to 70 Hours Battery',
        'Dual Pairing'
      ],
      thumbnail_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      verified: true,
      offers: [
        {
          id: 1,
          platform: 'amazon',
          external_product_id: 'B0C8V29XHQ',
          title: 'JBL Tune 770NC Wireless Over-Ear ANC Headphones with Mic (Black)',
          url: 'https://www.amazon.in/dp/B0C8V29XHQ',
          price: 4499,
          original_price: 6999,
          discount_pct: 36,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Appario Retail Pvt Ltd',
          seller_rating: 4.7,
          delivery_days: 1,
          return_policy: '7-day replacement',
          provenance_metadata: { source: 'Amazon Catalog Sandbox' }
        },
        {
          id: 2,
          platform: 'flipkart',
          external_product_id: 'FK-JBL-770NC',
          title: 'JBL Tune 770NC with Active Noise Cancellation Bluetooth Headset',
          url: 'https://www.flipkart.com/jbl-tune-770nc',
          price: 4699,
          original_price: 6999,
          discount_pct: 33,
          currency: 'INR',
          in_stock: true,
          seller_name: 'IndiFlashMart',
          seller_rating: 4.5,
          delivery_days: 2,
          return_policy: '7-day replacement'
        },
        {
          id: 3,
          platform: 'myntra',
          external_product_id: 'MYN-JBL-770NC',
          title: 'JBL Unisex Black Tune 770NC Wireless Headphones',
          url: 'https://www.myntra.com/jbl-tune-770nc',
          price: 4799,
          original_price: 6999,
          discount_pct: 31,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Omnitech Retail',
          seller_rating: 4.4,
          delivery_days: 3,
          return_policy: '14-day hassle free return'
        }
      ],
      insights: [
        { aspect: 'battery', sentiment_score: 0.95, mention_count: 18420, summary: 'Outstanding battery longevity; frequently achieves 65-70 hours.', suspicious_patterns_score: 0.04 },
        { aspect: 'comfort', sentiment_score: 0.82, mention_count: 11300, summary: 'Lightweight ergonomic headband with soft cushions.', suspicious_patterns_score: 0.04 },
        { aspect: 'sound', sentiment_score: 0.88, mention_count: 15200, summary: 'Signature punchy bass with companion app equalizer.', suspicious_patterns_score: 0.04 }
      ],
      specs: [
        { attribute_name: 'battery_hours', normalized_value: '70 Hours', confidence: 1.0 },
        { attribute_name: 'has_anc', normalized_value: 'Yes', confidence: 1.0 },
        { attribute_name: 'weight_g', normalized_value: '232g', confidence: 1.0 }
      ]
    },
    evidence: [
      {
        agent_name: 'verification',
        claim_text: 'Claimed 70-Hour Battery Playback',
        evidence_source: 'Verified Customer Battery Depletion Telemetry (N=1,420 tests)',
        confidence: 0.96,
        verified: true
      },
      {
        agent_name: 'verification',
        claim_text: 'Genuine 36% Price Drop (₹6,999 to ₹4,499)',
        evidence_source: '90-Day Cross-Platform Price Audit (Amazon & Flipkart)',
        confidence: 0.99,
        verified: true
      }
    ]
  },
  {
    id: 2,
    product_id: 2,
    rank: 2,
    badge: 'Best for Gaming',
    overall_score: 89.6,
    score_breakdown: {
      price: 92.0,
      performance: 92.5,
      battery: 92.0,
      comfort: 76.0,
      reliability: 88.0
    },
    reasons: [
      'Ultra-low 40ms BEAST mode latency ideal for fast-paced gaming',
      'Dolby Atmos 7.1 channel virtual surround immersion',
      '50mm dynamic drivers with pronounced bass impact'
    ],
    sacrifice_tradeoffs: [
      'Lacks Active Noise Cancellation (passive isolation only)',
      'Heavier frame (280g) can induce neck fatigue during 5h+ sessions'
    ],
    disagreements: [
      {
        contending_agents: ['Price Agent', 'Review Intelligence Agent'],
        price_agent_stance: 'Favored boAt Immortal 1000D due to lower cost (₹3,999) and 33% discount.',
        review_agent_stance: 'Flagged lack of ANC and heavier ear cup weight compared to JBL 770NC.',
        resolution: 'Decision Agent balanced weights and positioned as dedicated Best for Gaming.'
      }
    ],
    confidence_score: 0.94,
    product: {
      id: 2,
      canonical_title: 'boAt Immortal 1000D',
      category: 'electronics',
      brand: 'boAt',
      model_number: 'IM1000D-BLK',
      badge: 'Best for Gaming',
      rating: 4.3,
      review_count: 28672,
      key_features: [
        'Low Latency (~40ms)',
        'Up to 65 Hours Battery',
        'ENC Mic'
      ],
      thumbnail_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
      verified: true,
      offers: [
        {
          id: 4,
          platform: 'flipkart',
          external_product_id: 'FK-BOAT-IM1000D',
          title: 'boAt Immortal 1000D Gaming Headset with Dolby Atmos',
          url: 'https://www.flipkart.com/boat-immortal-1000d',
          price: 3999,
          original_price: 5999,
          discount_pct: 33,
          currency: 'INR',
          in_stock: true,
          seller_name: 'RetailNet',
          seller_rating: 4.6,
          delivery_days: 2,
          return_policy: '7-day replacement'
        },
        {
          id: 5,
          platform: 'amazon',
          external_product_id: 'B08T6K9Q3L',
          title: 'boAt Immortal 1000D Dual Channel Gaming Headphones',
          url: 'https://www.amazon.in/dp/B08T6K9Q3L',
          price: 4199,
          original_price: 5999,
          discount_pct: 30,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Imagine Marketing Pvt Ltd',
          seller_rating: 4.4,
          delivery_days: 1,
          return_policy: '7-day replacement'
        }
      ],
      insights: [
        { aspect: 'gaming_latency', sentiment_score: 0.94, mention_count: 9200, summary: 'Low-latency mode eliminates audio lag in competitive FPS.', suspicious_patterns_score: 0.08 }
      ],
      specs: [
        { attribute_name: 'battery_hours', normalized_value: '65 Hours', confidence: 1.0 },
        { attribute_name: 'latency_ms', normalized_value: '40ms', confidence: 1.0 }
      ]
    },
    evidence: [
      {
        agent_name: 'verification',
        claim_text: 'Low Latency ~40ms Gaming BEAST Mode',
        evidence_source: 'Audio Latency Oscilloscope Benchmark Reports',
        confidence: 0.92,
        verified: true
      }
    ]
  },
  {
    id: 3,
    product_id: 3,
    rank: 3,
    badge: 'Best Value',
    overall_score: 87.1,
    score_breakdown: {
      price: 100.0,
      performance: 78.0,
      battery: 82.0,
      comfort: 93.0,
      reliability: 84.0
    },
    reasons: [
      'Lowest price in the shortlist (₹2,999 on Myntra)',
      'Comfortable lightweight over-ear fit suitable for glasses wearers',
      'Dual device pairing and clear calling with Environmental Noise Cancellation'
    ],
    sacrifice_tradeoffs: [
      'No Active Noise Cancellation (passive isolation only)',
      '50h battery is 20 hours less than JBL Tune 770NC'
    ],
    disagreements: [],
    confidence_score: 0.91,
    product: {
      id: 3,
      canonical_title: 'Noise Airwave Max',
      category: 'electronics',
      brand: 'Noise',
      model_number: 'NW-AIR-MAX',
      badge: 'Best Value',
      rating: 4.2,
      review_count: 18907,
      key_features: [
        'Comfortable Over-ear Fit',
        'Up to 50 Hours Battery',
        'Clear Calling with ENC'
      ],
      thumbnail_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
      verified: true,
      offers: [
        {
          id: 6,
          platform: 'myntra',
          external_product_id: 'MYN-NOISE-AIRWAVE',
          title: 'Noise Unisex Charcoal Black Airwave Max Wireless Headphones',
          url: 'https://www.myntra.com/noise-airwave-max',
          price: 2999,
          original_price: 4999,
          discount_pct: 40,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Nexxus Tech',
          seller_rating: 4.3,
          delivery_days: 2,
          return_policy: '7-day return'
        },
        {
          id: 7,
          platform: 'amazon',
          external_product_id: 'B0C9D910XP',
          title: 'Noise Airwave Max Wireless Over-Ear Headphones with 50H Playtime',
          url: 'https://www.amazon.in/dp/B0C9D910XP',
          price: 3099,
          original_price: 4999,
          discount_pct: 38,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Cocoblu Retail',
          seller_rating: 4.5,
          delivery_days: 1,
          return_policy: '7-day replacement'
        }
      ],
      insights: [
        { aspect: 'value_for_money', sentiment_score: 0.96, mention_count: 8200, summary: 'Unbeatable value under ₹3,000.', suspicious_patterns_score: 0.05 }
      ],
      specs: [
        { attribute_name: 'battery_hours', normalized_value: '50 Hours', confidence: 1.0 },
        { attribute_name: 'weight_g', normalized_value: '215g', confidence: 1.0 }
      ]
    },
    evidence: [
      {
        agent_name: 'verification',
        claim_text: 'Sub-₹3,000 Lowest Cross-Platform Deal',
        evidence_source: 'Multi-Platform Scraper Audit',
        confidence: 0.98,
        verified: true
      }
    ]
  }
];

export const INITIAL_PRICE_TREND: PriceTrendData = {
  product_id: 1,
  canonical_title: 'JBL Tune 770NC',
  current_price: 4499,
  historical_average: 6999,
  price_drop: 2500,
  price_drop_pct: 36,
  recommendation: 'Buy Now: Price is 36% lower than average (₹6,999). Good time to buy!',
  confidence: 0.96,
  points: [
    { month: 'Aug', price: 6999, note: 'Launch MSRP' },
    { month: 'Sep', price: 5999, note: 'Pre-Festive' },
    { month: 'Oct', price: 4999, note: 'Great Indian Festival' },
    { month: 'Nov', price: 4499, note: 'All-Time Low' }
  ],
  is_demo_data: true
};

export const INITIAL_AGENT_EVENTS: AgentEvent[] = [
  {
    agent_name: 'intent',
    event_type: 'completed',
    message: 'Understand your need: Budget <= ₹5,000, Category: Wireless Headphones, Intended Use: Work calls + Occasional gaming.',
    timestamp: '2026-11-08T02:00:00Z'
  },
  {
    agent_name: 'scout',
    event_type: 'completed',
    message: 'Search across platforms: Queried Amazon, Flipkart, Meesho, and Myntra. Found 11 candidate listings.',
    timestamp: '2026-11-08T02:00:01Z'
  },
  {
    agent_name: 'matcher',
    event_type: 'completed',
    message: 'Analyze & compare: Resolved 11 store listings into 3 canonical products with normalized battery, latency, and weight.',
    timestamp: '2026-11-08T02:00:02Z'
  },
  {
    agent_name: 'decision',
    event_type: 'completed',
    message: 'Reason & recommend: Evaluated multi-criteria trade-offs. JBL Tune 770NC scored highest for ANC & 70h battery.',
    timestamp: '2026-11-08T02:00:03Z'
  },
  {
    agent_name: 'verification',
    event_type: 'completed',
    message: 'Done! Here are your recommendations: Verified 70h battery claim and authentic 36% price drop discount.',
    timestamp: '2026-11-08T02:00:04Z'
  }
];

export const FASHION_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 201,
    product_id: 201,
    rank: 1,
    badge: 'Best Overall',
    overall_score: 96.2,
    score_breakdown: {
      price: 88.0,
      performance: 97.0,
      battery: 90.0,
      comfort: 98.0,
      reliability: 96.5
    },
    reasons: [
      'Iconic retro basketball-inspired aesthetic with premium synthetic leather',
      'Padded low-cut collar looks sleek and feels great for all-day wear',
      'Perforations on toe and sides add breathability and authentic styling',
      'Exclusive 33% discount on Amazon at ₹2,999'
    ],
    sacrifice_tradeoffs: [
      'Slight break-in period required for optimal leather flexibility',
      'Costs more than entry casual canvas sneakers'
    ],
    confidence_score: 0.98,
    product: {
      id: 201,
      canonical_title: 'Nike Court Vision Low',
      category: 'fashion',
      brand: 'Nike',
      model_number: 'DH2987-101',
      badge: 'Best Overall',
      rating: 4.6,
      review_count: 12340,
      key_features: [
        'Classic & versatile design',
        'Comfortable all-day wear',
        'Durable leather build'
      ],
      thumbnail_url: '/fashion_nike_sneaker.png',
      verified: true,
      offers: [
        {
          id: 2011,
          platform: 'amazon',
          external_product_id: 'B08N5N4K9G',
          title: "Nike Men's Court Vision Low Sneaker (White/Black)",
          url: 'https://www.amazon.in/dp/B08N5N4K9G',
          price: 2999,
          original_price: 4495,
          discount_pct: 33,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Nike Retail India',
          seller_rating: 4.8,
          delivery_days: 2,
          return_policy: '10-day replacement',
          provenance_metadata: { source: 'Amazon Fashion Verified' }
        },
        {
          id: 2012,
          platform: 'flipkart',
          external_product_id: 'FK-NIKE-CVISION',
          title: 'Nike Court Vision Low Casual Sneakers For Men',
          url: 'https://www.flipkart.com/nike-court-vision',
          price: 3039,
          original_price: 4495,
          discount_pct: 32,
          currency: 'INR',
          in_stock: true,
          seller_name: 'RetailNet',
          seller_rating: 4.6,
          delivery_days: 2,
          return_policy: '7-day return'
        },
        {
          id: 2013,
          platform: 'myntra',
          external_product_id: 'MYN-NIKE-CVISION',
          title: "Nike Men White Court Vision Low Sneakers",
          url: 'https://www.myntra.com/nike-court-vision',
          price: 2999,
          original_price: 4495,
          discount_pct: 33,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Omnitech Retail',
          seller_rating: 4.7,
          delivery_days: 2,
          return_policy: '14-day hassle free return'
        }
      ],
      insights: [
        { aspect: 'comfort', sentiment_score: 0.94, mention_count: 5400, summary: 'Cushioned insole feels comfortable for daily walking.', suspicious_patterns_score: 0.02 },
        { aspect: 'durability', sentiment_score: 0.92, mention_count: 4200, summary: 'Thick vulcanized rubber cupsole with solid stitching.', suspicious_patterns_score: 0.03 },
        { aspect: 'fit', sentiment_score: 0.90, mention_count: 6100, summary: 'True to size; standard Nike sneaker fit.', suspicious_patterns_score: 0.02 }
      ],
      specs: [
        { attribute_name: 'material', normalized_value: 'Synthetic Leather', confidence: 1.0 },
        { attribute_name: 'sole', normalized_value: 'Rubber Cupsole', confidence: 1.0 },
        { attribute_name: 'closure', normalized_value: 'Lace-Up', confidence: 1.0 }
      ]
    },
    evidence: [
      {
        agent_name: 'verification',
        claim_text: 'Verified Official Nike Product & Sub-₹3,000 Deal',
        evidence_source: 'Cross-Store Fashion Audit',
        confidence: 0.98,
        verified: true
      }
    ]
  },
  {
    id: 202,
    product_id: 202,
    rank: 2,
    badge: 'Trendy Pick',
    overall_score: 91.5,
    score_breakdown: {
      price: 94.0,
      performance: 90.0,
      battery: 88.0,
      comfort: 93.0,
      reliability: 91.0
    },
    reasons: [
      'Sleek urban bomber profile in classic pitch black with ribbed trim',
      'Wind-resistant polyester shell keeps you warm without adding bulk',
      'Versatile casual layer for college, work, or evening outings',
      'Massive 37% off deal currently on Flipkart at ₹1,899'
    ],
    sacrifice_tradeoffs: [
      'Tailored for mild to moderate winter; not for freezing sub-zero weather'
    ],
    confidence_score: 0.95,
    product: {
      id: 202,
      canonical_title: 'Roadster Bomber Jacket',
      category: 'fashion',
      brand: 'Roadster',
      model_number: 'RDS-BMB-09',
      badge: 'Trendy Pick',
      rating: 4.4,
      review_count: 8112,
      key_features: [
        'Warm & lightweight',
        'Stylish casual look',
        'Multiple color options'
      ],
      thumbnail_url: '/fashion_roadster_jacket.png',
      verified: true,
      offers: [
        {
          id: 2021,
          platform: 'flipkart',
          external_product_id: 'FK-RDS-BMB',
          title: "Roadster Men Solid Bomber Casual Winter Jacket (Black)",
          url: 'https://www.flipkart.com/roadster-bomber-jacket',
          price: 1899,
          original_price: 2999,
          discount_pct: 37,
          currency: 'INR',
          in_stock: true,
          seller_name: 'FlashTech Commerce',
          seller_rating: 4.5,
          delivery_days: 2,
          return_policy: '7-day replacement'
        },
        {
          id: 2022,
          platform: 'myntra',
          external_product_id: 'MYN-RDS-BMB',
          title: 'Roadster Men Black Solid Bomber Jacket',
          url: 'https://www.myntra.com/roadster-bomber',
          price: 1949,
          original_price: 2999,
          discount_pct: 35,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Omnitech Retail',
          seller_rating: 4.6,
          delivery_days: 3,
          return_policy: '14-day hassle free return'
        }
      ],
      insights: [
        { aspect: 'warmth', sentiment_score: 0.91, mention_count: 3400, summary: 'Adequate warmth for 12C-22C winter breezes.', suspicious_patterns_score: 0.03 },
        { aspect: 'style', sentiment_score: 0.95, mention_count: 4100, summary: 'Modern fit matches well with denim and chinos.', suspicious_patterns_score: 0.02 }
      ],
      specs: [
        { attribute_name: 'material', normalized_value: 'Polyester / Nylon', confidence: 1.0 },
        { attribute_name: 'closure', normalized_value: 'Front Zip', confidence: 1.0 }
      ]
    },
    evidence: [
      {
        agent_name: 'verification',
        claim_text: 'Verified 37% Discount on Flipkart',
        evidence_source: 'Flipkart Direct Integration',
        confidence: 0.96,
        verified: true
      }
    ]
  },
  {
    id: 203,
    product_id: 203,
    rank: 3,
    badge: 'Value for Money',
    overall_score: 89.8,
    score_breakdown: {
      price: 98.0,
      performance: 86.0,
      battery: 85.0,
      comfort: 95.0,
      reliability: 89.0
    },
    reasons: [
      'Cozy cotton-rich fleece fabric with drawstring adjustable hood',
      'Kangaroo front pocket and ribbed cuffs for snug comfort',
      'Under ₹1,300 with top-tier international brand fabric quality',
      'Great everyday essential for casual and work-from-home styling'
    ],
    sacrifice_tradeoffs: [
      'Relaxed fit may feel slightly loose if you prefer slim-fit hoodies'
    ],
    confidence_score: 0.94,
    product: {
      id: 203,
      canonical_title: 'H&M Casual Hoodie',
      category: 'fashion',
      brand: 'H&M',
      model_number: 'HM-REG-HOODIE',
      badge: 'Value for Money',
      rating: 4.5,
      review_count: 6780,
      key_features: [
        'Soft cotton blend',
        'Perfect for everyday wear',
        'Available in multiple sizes'
      ],
      thumbnail_url: '/fashion_hm_hoodie.png',
      verified: true,
      offers: [
        {
          id: 2031,
          platform: 'myntra',
          external_product_id: 'MYN-HM-HOOD',
          title: "H&M Men Regular Fit Casual Cotton Hoodie (Beige / Camel)",
          url: 'https://www.myntra.com/hm-casual-hoodie',
          price: 1299,
          original_price: 1999,
          discount_pct: 35,
          currency: 'INR',
          in_stock: true,
          seller_name: 'H&M Hennes & Mauritz GBC',
          seller_rating: 4.8,
          delivery_days: 2,
          return_policy: '14-day hassle free return'
        },
        {
          id: 2032,
          platform: 'amazon',
          external_product_id: 'B0HMHOOD01',
          title: 'H&M Casual Pullover Hoodie for Men',
          url: 'https://www.amazon.in/dp/B0HMHOOD01',
          price: 1399,
          original_price: 1999,
          discount_pct: 30,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Appario Retail',
          seller_rating: 4.5,
          delivery_days: 3,
          return_policy: '10-day replacement'
        }
      ],
      insights: [
        { aspect: 'softness', sentiment_score: 0.96, mention_count: 3800, summary: 'Super soft interior fleece that stays comfortable all day.', suspicious_patterns_score: 0.02 },
        { aspect: 'fit', sentiment_score: 0.92, mention_count: 2900, summary: 'Relaxed standard fit with roomy kangaroo pocket.', suspicious_patterns_score: 0.03 }
      ],
      specs: [
        { attribute_name: 'material', normalized_value: 'Cotton Blend Fleece', confidence: 1.0 },
        { attribute_name: 'fit', normalized_value: 'Regular Fit', confidence: 1.0 }
      ]
    },
    evidence: [
      {
        agent_name: 'verification',
        claim_text: 'Verified H&M Genuine Merchandise',
        evidence_source: 'Myntra Brand Authorization',
        confidence: 0.97,
        verified: true
      }
    ]
  }
];

export const FASHION_AGENT_EVENTS: AgentEvent[] = [
  {
    agent_name: 'intent',
    event_type: 'completed',
    message: 'Understand your need: Category: Fashion, Budget: ₹3,000, Style: Casual.',
    timestamp: '2026-11-08T02:00:00Z'
  },
  {
    agent_name: 'scout',
    event_type: 'completed',
    message: 'Search across platforms: Amazon, Flipkart, Myntra, Ajio.',
    timestamp: '2026-11-08T02:00:01Z'
  },
  {
    agent_name: 'matcher',
    event_type: 'completed',
    message: 'Analyze & compare: Price, material, ratings, reviews.',
    timestamp: '2026-11-08T02:00:02Z'
  },
  {
    agent_name: 'decision',
    event_type: 'completed',
    message: 'Reason & recommend: Best value, style match, and offers.',
    timestamp: '2026-11-08T02:00:03Z'
  },
  {
    agent_name: 'verification',
    event_type: 'completed',
    message: 'Done! Here are your fashion recommendations ✨',
    timestamp: '2026-11-08T02:00:04Z'
  }
];

export const HOME_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 301,
    product_id: 301,
    rank: 1,
    badge: 'Best Overall',
    overall_score: 95.8,
    score_breakdown: { price: 89.0, performance: 98.0, battery: 90.0, comfort: 99.0, reliability: 97.0 },
    reasons: [
      'Heavy-duty ergonomic build with premium breathable spandex fabric',
      'Frog mechanism allows 180° recline and customizable lumbar support',
      '3D adjustable armrests designed for long work & gaming sessions',
      'All-time lowest price recorded on Amazon at ₹8,999 (40% OFF)'
    ],
    sacrifice_tradeoffs: ['Requires initial assembly (approx 20 mins with provided tools)'],
    confidence_score: 0.98,
    product: {
      id: 301,
      canonical_title: 'Green Soul Monster Ultimate Ergonomic Chair',
      category: 'home',
      brand: 'Green Soul',
      model_number: 'GS-MONSTER-ULT',
      badge: 'Best Overall',
      rating: 4.6,
      review_count: 14210,
      key_features: ['Breathable Spandex & PU', 'Frog Mechanism Recline', '3D Adjustable Armrests'],
      thumbnail_url: '/home_greensoul_chair.png',
      verified: true,
      offers: [
        {
          id: 3011,
          platform: 'amazon',
          title: 'Green Soul Monster Ultimate (T) Multi-Functional Ergonomic Chair',
          url: 'https://www.amazon.in/dp/B08GSCHAIR',
          price: 8999,
          original_price: 14990,
          discount_pct: 40,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Green Soul Official',
          seller_rating: 4.8,
          delivery_days: 2,
          return_policy: '10-day replacement',
          provenance_metadata: { source: 'Amazon Home Verified' }
        },
        {
          id: 3012,
          platform: 'flipkart',
          title: 'Green Soul Monster Ultimate Ergonomic Desk Chair',
          url: 'https://www.flipkart.com/green-soul-chair',
          price: 9499,
          original_price: 14990,
          discount_pct: 37,
          currency: 'INR',
          in_stock: true,
          seller_name: 'RetailNet',
          seller_rating: 4.6,
          delivery_days: 3,
          return_policy: '7-day replacement'
        }
      ],
      insights: [
        { aspect: 'lumbar', sentiment_score: 0.96, mention_count: 5120, summary: 'Exceptional back relief for 8+ hour sitting shifts.', suspicious_patterns_score: 0.02 }
      ],
      specs: [
        { attribute_name: 'material', normalized_value: 'Breathable Spandex', confidence: 1.0 },
        { attribute_name: 'warranty', normalized_value: '3 Years Comprehensive', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Verified 40% Off on Amazon', evidence_source: 'Amazon Catalog Audit', confidence: 0.98, verified: true }]
  },
  {
    id: 302,
    product_id: 302,
    rank: 2,
    badge: 'Smart Home Pick',
    overall_score: 93.0,
    score_breakdown: { price: 92.0, performance: 95.0, battery: 94.0, comfort: 91.0, reliability: 93.0 },
    reasons: [
      'Smart 2-in-1 sweeping and water mopping with 2700Pa suction',
      'Advanced LiDAR navigation maps multiple floors with zero blindspots',
      'Alexa & Google Assistant enabled auto-dock and recharge'
    ],
    sacrifice_tradeoffs: ['Water tank requires manual refill every 2-3 cleaning cycles'],
    confidence_score: 0.96,
    product: {
      id: 302,
      canonical_title: 'Eureka Forbes Robo Vac n Mop',
      category: 'home',
      brand: 'Eureka Forbes',
      model_number: 'EF-ROBO-VAC',
      badge: 'Smart Home Pick',
      rating: 4.4,
      review_count: 5320,
      key_features: ['LiDAR Smart Navigation', 'Simultaneous Vacuum & Mop', '2700Pa Ultra Suction'],
      thumbnail_url: '/home_eureka_vacuum.png',
      verified: true,
      offers: [
        {
          id: 3021,
          platform: 'flipkart',
          title: 'Eureka Forbes Robotic Vacuum Cleaner with Smart Mop',
          url: 'https://www.flipkart.com/eureka-forbes-robo',
          price: 11999,
          original_price: 19999,
          discount_pct: 40,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Eureka Forbes Direct',
          seller_rating: 4.7,
          delivery_days: 2,
          return_policy: '7-day replacement'
        }
      ],
      insights: [
        { aspect: 'suction', sentiment_score: 0.92, mention_count: 2400, summary: 'Picks up pet hair and fine dust effectively from tiles.', suspicious_patterns_score: 0.02 }
      ],
      specs: [
        { attribute_name: 'suction', normalized_value: '2700 Pa', confidence: 1.0 },
        { attribute_name: 'runtime', normalized_value: '130 Mins', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Verified Official Brand Warranty', evidence_source: 'Eureka Forbes Direct', confidence: 0.97, verified: true }]
  },
  {
    id: 303,
    product_id: 303,
    rank: 3,
    badge: 'Value for Money',
    overall_score: 91.2,
    score_breakdown: { price: 97.0, performance: 90.0, battery: 85.0, comfort: 92.0, reliability: 92.0 },
    reasons: [
      'Patented Rapid Air technology cooks with up to 90% less oil',
      'Digital touch screen with 7 preset cooking programs',
      'Compact 4.1L capacity ideal for small to mid-sized Indian families'
    ],
    sacrifice_tradeoffs: ['Outer basket gets hot during 200°C air frying'],
    confidence_score: 0.95,
    product: {
      id: 303,
      canonical_title: 'Philips Digital Air Fryer 4.1L',
      category: 'home',
      brand: 'Philips',
      model_number: 'HD9252/90',
      badge: 'Value for Money',
      rating: 4.5,
      review_count: 22400,
      key_features: ['Rapid Air Technology', 'Touch Screen with 7 Presets', 'Keep Warm Function'],
      thumbnail_url: '/home_philips_airfryer.png',
      verified: true,
      offers: [
        {
          id: 3031,
          platform: 'amazon',
          title: 'Philips Digital Air Fryer HD9252/90 (Black)',
          url: 'https://www.amazon.in/dp/B08VPHILIPS',
          price: 5999,
          original_price: 9995,
          discount_pct: 40,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Appario Retail',
          seller_rating: 4.8,
          delivery_days: 1,
          return_policy: '10-day replacement'
        }
      ],
      insights: [
        { aspect: 'crispiness', sentiment_score: 0.95, mention_count: 8200, summary: 'Crispy samosas and french fries with barely a teaspoon of oil.', suspicious_patterns_score: 0.01 }
      ],
      specs: [
        { attribute_name: 'capacity', normalized_value: '4.1 Litres', confidence: 1.0 },
        { attribute_name: 'power', normalized_value: '1400 W', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Verified 40% Off on Amazon', evidence_source: 'Amazon Best Deals', confidence: 0.98, verified: true }]
  }
];

export const HOME_AGENT_EVENTS: AgentEvent[] = [
  { agent_name: 'intent', event_type: 'completed', message: 'Understand your need: Category: Home & Living, Focus: Comfort, Ergonomics & Smart Living.', timestamp: '2026-11-08T02:00:00Z' },
  { agent_name: 'scout', event_type: 'completed', message: 'Search across platforms: Queried Amazon, Flipkart & Brand stores for verified home appliances.', timestamp: '2026-11-08T02:00:01Z' },
  { agent_name: 'matcher', event_type: 'completed', message: 'Analyze & compare: Resolved ergonomic specs, power ratings, and authentic customer durability feedback.', timestamp: '2026-11-08T02:00:02Z' },
  { agent_name: 'decision', event_type: 'completed', message: 'Reason & recommend: Ranked Green Soul Monster as #1 Ergonomic chair under ₹10,000.', timestamp: '2026-11-08T02:00:03Z' },
  { agent_name: 'verification', event_type: 'completed', message: 'Done! Here are your home & living recommendations ✨', timestamp: '2026-11-08T02:00:04Z' }
];

export const BEAUTY_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 401,
    product_id: 401,
    rank: 1,
    badge: 'Best Overall',
    overall_score: 96.5,
    score_breakdown: { price: 95.0, performance: 98.0, battery: 90.0, comfort: 96.0, reliability: 97.0 },
    reasons: [
      'Stable Ethyl Ascorbic Acid formula that fights dark spots and hyperpigmentation',
      'Infused with soothing Centella Asiatica for reduced skin irritation',
      'Over 18,900+ positive user reviews with visible results in 3-4 weeks'
    ],
    sacrifice_tradeoffs: ['Must be followed with daily SPF 50 sunscreen for sun protection'],
    confidence_score: 0.99,
    product: {
      id: 401,
      canonical_title: 'Minimalist 10% Vitamin C Face Serum',
      category: 'beauty',
      brand: 'Minimalist',
      model_number: 'MIN-VITC-10',
      badge: 'Best Overall',
      rating: 4.6,
      review_count: 18900,
      key_features: ['Centella Water Base', 'Fades Dark Spots & Pigmentation', 'Lightweight & Non-Sticky'],
      thumbnail_url: '/beauty_minimalist_serum.png',
      verified: true,
      offers: [
        {
          id: 4011,
          platform: 'amazon',
          title: 'Minimalist 10% Vitamin C Serum for Glowing Skin (30ml)',
          url: 'https://www.amazon.in/dp/B08FMINIMALIST',
          price: 664,
          original_price: 699,
          discount_pct: 5,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Uprising Science',
          seller_rating: 4.8,
          delivery_days: 1,
          return_policy: '10-day replacement'
        }
      ],
      insights: [
        { aspect: 'absorption', sentiment_score: 0.95, mention_count: 7300, summary: 'Absorbs instantly without greasy residue.', suspicious_patterns_score: 0.01 }
      ],
      specs: [
        { attribute_name: 'active', normalized_value: '10% Ethyl Ascorbic Acid', confidence: 1.0 },
        { attribute_name: 'skin_type', normalized_value: 'All Skin Types', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Verified Official Brand Batch', evidence_source: 'Minimalist Lab Direct', confidence: 0.99, verified: true }]
  },
  {
    id: 402,
    product_id: 402,
    rank: 2,
    badge: 'Grooming Pro',
    overall_score: 94.0,
    score_breakdown: { price: 90.0, performance: 96.0, battery: 98.0, comfort: 93.0, reliability: 95.0 },
    reasons: [
      '13-in-1 multi-grooming kit for beard, precision detailing, and body hair',
      'DualCut self-sharpening blades that stay sharp for 5 years',
      'Up to 120 minutes cordless runtime on a 1-hour fast charge'
    ],
    sacrifice_tradeoffs: ['Blades require brushing out hair after each water rinse'],
    confidence_score: 0.97,
    product: {
      id: 402,
      canonical_title: 'Philips All-in-One Multi-Trimmer MG7715',
      category: 'beauty',
      brand: 'Philips',
      model_number: 'MG7715/65',
      badge: 'Grooming Pro',
      rating: 4.5,
      review_count: 11400,
      key_features: ['13-in-1 Head to Toe', 'DualCut Self-Sharpening Blades', '120 Min Cordless Runtime'],
      thumbnail_url: '/beauty_philips_trimmer.png',
      verified: true,
      offers: [
        {
          id: 4021,
          platform: 'flipkart',
          title: 'Philips MG7715/65 All-in-One Trimmer for Men',
          url: 'https://www.flipkart.com/philips-mg7715',
          price: 2999,
          original_price: 4295,
          discount_pct: 30,
          currency: 'INR',
          in_stock: true,
          seller_name: 'RetailNet',
          seller_rating: 4.6,
          delivery_days: 2,
          return_policy: '7-day replacement'
        }
      ],
      insights: [
        { aspect: 'battery', sentiment_score: 0.97, mention_count: 3800, summary: 'Single charge easily lasts over a month of weekly trims.', suspicious_patterns_score: 0.02 }
      ],
      specs: [
        { attribute_name: 'runtime', normalized_value: '120 Minutes', confidence: 1.0 },
        { attribute_name: 'blade', normalized_value: 'Self-Sharpening Steel', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Verified 30% Off Deal', evidence_source: 'Flipkart Direct', confidence: 0.97, verified: true }]
  },
  {
    id: 403,
    product_id: 403,
    rank: 3,
    badge: 'Dermatologist Choice',
    overall_score: 92.5,
    score_breakdown: { price: 92.0, performance: 95.0, battery: 90.0, comfort: 97.0, reliability: 95.0 },
    reasons: [
      'Contains 3 essential ceramides (1, 3, 6-II) that repair compromised moisture barrier',
      'Hyaluronic acid retains natural skin moisture throughout the day',
      'Fragrance-free and non-comedogenic — ideal for sensitive skin'
    ],
    sacrifice_tradeoffs: ['Non-foaming lotion texture (does not lather like harsh soaps)'],
    confidence_score: 0.96,
    product: {
      id: 403,
      canonical_title: 'CeraVe Hydrating Facial Cleanser 236ml',
      category: 'beauty',
      brand: 'CeraVe',
      model_number: 'CRV-HYDR-236',
      badge: 'Dermatologist Choice',
      rating: 4.7,
      review_count: 31200,
      key_features: ['3 Essential Ceramides', 'Hyaluronic Acid Moisture Lock', 'Non-Comedogenic & Gentle'],
      thumbnail_url: '/beauty_cerave_cleanser.png',
      verified: true,
      offers: [
        {
          id: 4031,
          platform: 'myntra',
          title: 'CeraVe Hydrating Cleanser for Normal to Dry Skin',
          url: 'https://www.myntra.com/cerave-cleanser',
          price: 875,
          original_price: 1100,
          discount_pct: 20,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Omnitech Retail',
          seller_rating: 4.8,
          delivery_days: 2,
          return_policy: '14-day hassle free return'
        }
      ],
      insights: [
        { aspect: 'gentleness', sentiment_score: 0.98, mention_count: 12000, summary: 'Leaves face feeling clean and moisturized with zero tight dryness.', suspicious_patterns_score: 0.01 }
      ],
      specs: [
        { attribute_name: 'size', normalized_value: '236 ml', confidence: 1.0 },
        { attribute_name: 'formula', normalized_value: 'Non-foaming lotion', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Verified Authentic CeraVe Import', evidence_source: 'Myntra Verified Beauty', confidence: 0.98, verified: true }]
  }
];

export const BEAUTY_AGENT_EVENTS: AgentEvent[] = [
  { agent_name: 'intent', event_type: 'completed', message: 'Understand your need: Category: Beauty & Personal Care, Focus: Gentle Skin Barrier & Grooming.', timestamp: '2026-11-08T02:00:00Z' },
  { agent_name: 'scout', event_type: 'completed', message: 'Search across platforms: Amazon, Nykaa, Flipkart, Myntra.', timestamp: '2026-11-08T02:00:01Z' },
  { agent_name: 'matcher', event_type: 'completed', message: 'Analyze & compare: Formulations, ceramides, blade durability, and dermatologist ratings.', timestamp: '2026-11-08T02:00:02Z' },
  { agent_name: 'decision', event_type: 'completed', message: 'Reason & recommend: Minimalist 10% Vitamin C serum & Philips All-in-One Multi-Trimmer ranked tops.', timestamp: '2026-11-08T02:00:03Z' },
  { agent_name: 'verification', event_type: 'completed', message: 'Done! Here are your beauty & personal care recommendations ✨', timestamp: '2026-11-08T02:00:04Z' }
];

export const BOOKS_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 501,
    product_id: 501,
    rank: 1,
    badge: '#1 Bestseller',
    overall_score: 98.0,
    score_breakdown: { price: 96.0, performance: 99.0, battery: 99.0, comfort: 99.0, reliability: 98.0 },
    reasons: [
      'World-famous proven blueprint to build atomic daily habits that compound over time',
      'Over 15+ million copies sold globally with transformative practical frameworks',
      'Amazon all-time discounted paperback edition at ₹499 (38% OFF)'
    ],
    sacrifice_tradeoffs: ['Requires consistent daily journaling to see peak behavioral results'],
    confidence_score: 0.99,
    product: {
      id: 501,
      canonical_title: 'Atomic Habits by James Clear',
      category: 'books',
      brand: 'Penguin Random House',
      model_number: 'ISBN-978-1847941831',
      badge: '#1 Bestseller',
      rating: 4.8,
      review_count: 85400,
      key_features: ['Practical 1% Daily Rules', 'Break Bad Habits Permanently', 'Global Self-Help Phenomenon'],
      thumbnail_url: '/book_atomic_habits.png',
      verified: true,
      offers: [
        {
          id: 5011,
          platform: 'amazon',
          title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits (Paperback)',
          url: 'https://www.amazon.in/dp/1847941834',
          price: 499,
          original_price: 799,
          discount_pct: 38,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Cocoblu Retail',
          seller_rating: 4.9,
          delivery_days: 1,
          return_policy: '10-day replacement'
        }
      ],
      insights: [
        { aspect: 'readability', sentiment_score: 0.99, mention_count: 32000, summary: 'Incredibly easy to digest with clear diagrams and immediate takeaways.', suspicious_patterns_score: 0.01 }
      ],
      specs: [
        { attribute_name: 'pages', normalized_value: '320 Pages', confidence: 1.0 },
        { attribute_name: 'language', normalized_value: 'English', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Verified Official Publisher Edition', evidence_source: 'Amazon Direct Books', confidence: 0.99, verified: true }]
  },
  {
    id: 502,
    product_id: 502,
    rank: 2,
    badge: 'Essential Read',
    overall_score: 95.0,
    score_breakdown: { price: 98.0, performance: 95.0, battery: 99.0, comfort: 97.0, reliability: 95.0 },
    reasons: [
      '19 short engaging stories exploring the weird ways people think about money',
      'Teaches you how to do better with investing and wealth preservation',
      'Great value under ₹350 on Flipkart'
    ],
    sacrifice_tradeoffs: ['Focuses on investor mindset rather than complex technical stock charts'],
    confidence_score: 0.97,
    product: {
      id: 502,
      canonical_title: 'The Psychology of Money by Morgan Housel',
      category: 'books',
      brand: 'Jaico Publishing',
      model_number: 'ISBN-978-9390166268',
      badge: 'Essential Read',
      rating: 4.7,
      review_count: 42100,
      key_features: ['Timeless Lessons on Wealth', 'Behavioral Economics Made Simple', '19 Short Stories Format'],
      thumbnail_url: '/book_psychology_money.png',
      verified: true,
      offers: [
        {
          id: 5021,
          platform: 'flipkart',
          title: 'The Psychology of Money (Paperback, Morgan Housel)',
          url: 'https://www.flipkart.com/psychology-of-money',
          price: 320,
          original_price: 499,
          discount_pct: 36,
          currency: 'INR',
          in_stock: true,
          seller_name: 'TrueCom Retail',
          seller_rating: 4.7,
          delivery_days: 2,
          return_policy: '7-day replacement'
        }
      ],
      insights: [
        { aspect: 'wisdom', sentiment_score: 0.97, mention_count: 14000, summary: 'Changes how you view spending and saving forever.', suspicious_patterns_score: 0.01 }
      ],
      specs: [
        { attribute_name: 'pages', normalized_value: '252 Pages', confidence: 1.0 },
        { attribute_name: 'format', normalized_value: 'Paperback', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Verified 36% Off Discount', evidence_source: 'Flipkart Books', confidence: 0.98, verified: true }]
  },
  {
    id: 503,
    product_id: 503,
    rank: 3,
    badge: 'Top Tech Pick',
    overall_score: 93.5,
    score_breakdown: { price: 87.0, performance: 98.0, battery: 100.0, comfort: 96.0, reliability: 97.0 },
    reasons: [
      '6.8-inch glare-free 300 ppi display that reads like real paper in sunlight',
      'Warm adjustable light allows effortless night reading with zero eye fatigue',
      'Incredible 10-week battery life and waterproof (IPX8) construction'
    ],
    sacrifice_tradeoffs: ['E-ink screen designed for reading; not for fast video or web games'],
    confidence_score: 0.96,
    product: {
      id: 503,
      canonical_title: 'Kindle Paperwhite 16GB (6.8" Display)',
      category: 'books',
      brand: 'Amazon',
      model_number: 'B08N3TCP2F',
      badge: 'Top Tech Pick',
      rating: 4.6,
      review_count: 16800,
      key_features: ['300 ppi Glare-Free Screen', 'Up to 10 Weeks Battery', 'IPX8 Waterproof'],
      thumbnail_url: '/book_kindle_paperwhite.png',
      verified: true,
      offers: [
        {
          id: 5031,
          platform: 'amazon',
          title: 'All-new Kindle Paperwhite (16 GB) – 6.8" display with adjustable warm light',
          url: 'https://www.amazon.in/dp/B08N3TCP2F',
          price: 12999,
          original_price: 14999,
          discount_pct: 13,
          currency: 'INR',
          in_stock: true,
          seller_name: 'Appario Retail',
          seller_rating: 4.8,
          delivery_days: 1,
          return_policy: '10-day replacement'
        }
      ],
      insights: [
        { aspect: 'screen', sentiment_score: 0.98, mention_count: 6500, summary: 'Warm light makes reading in dark bed rooms completely effortless.', suspicious_patterns_score: 0.02 }
      ],
      specs: [
        { attribute_name: 'storage', normalized_value: '16 GB', confidence: 1.0 },
        { attribute_name: 'battery', normalized_value: 'Up to 10 Weeks', confidence: 1.0 }
      ]
    },
    evidence: [{ agent_name: 'verification', claim_text: 'Official Amazon Device Guarantee', evidence_source: 'Amazon Devices', confidence: 0.99, verified: true }]
  }
];

export const BOOKS_AGENT_EVENTS: AgentEvent[] = [
  { agent_name: 'intent', event_type: 'completed', message: 'Understand your need: Category: Books & Literature, Focus: Productivity, Wealth & Reading tech.', timestamp: '2026-11-08T02:00:00Z' },
  { agent_name: 'scout', event_type: 'completed', message: 'Search across platforms: Queried Amazon, Flipkart & leading national distributors.', timestamp: '2026-11-08T02:00:01Z' },
  { agent_name: 'matcher', event_type: 'completed', message: 'Analyze & compare: Verified genuine ISBN numbers, paper weight, and bestselling rankings.', timestamp: '2026-11-08T02:00:02Z' },
  { agent_name: 'decision', event_type: 'completed', message: 'Reason & recommend: Atomic Habits & Psychology of Money selected as top reads.', timestamp: '2026-11-08T02:00:03Z' },
  { agent_name: 'verification', event_type: 'completed', message: 'Done! Here are your books & reading recommendations ✨', timestamp: '2026-11-08T02:00:04Z' }
];
