export type AppTab = 'ai' | 'market' | 'social';

export type ListingMode = 'sale' | 'rent' | 'project';

export type PropertyType = 
  | 'Căn hộ' 
  | 'Nhà riêng' 
  | 'Nhà phố' 
  | 'Biệt thự' 
  | 'Đất' 
  | 'Shophouse' 
  | 'Khác';

export type ProjectStatus = 
  | 'Sắp mở bán'
  | 'Đang mở bán'
  | 'Đang nhận booking'
  | 'Đã mở bán'
  | 'Sắp bàn giao'
  | 'Đã bàn giao';

export type ProjectPropertyType = 
  | 'Căn hộ' 
  | 'Biệt thự' 
  | 'Liền kề' 
  | 'Shophouse' 
  | 'Nhà phố' 
  | 'Compound' 
  | 'Khác';

export interface ProjectOverview {
  scale: string;
  landArea: string;
  buildingDensity: string;
  totalTowers: string;
  totalUnits: string;
  launchTime: string;
  handoverTime: string;
  description?: string;
  handover?: string;
  density?: string;
  towers?: string;
}

export interface ProjectPriceDetail {
  priceFrom: string;
  avgPricePerM2: string;
  byType: { type: string; price: string; area: string }[];
  priceHistory?: { period: string; priceAvg: string }[];
  byUnitTypes?: { type: string; priceRange: string; area: string; pricePerM2: string }[];
}

export interface ProjectLegal {
  ownership: string;
  permits: string[];
  statusText: string;
  status?: string;
}

export interface ProjectProgress {
  constructionStatus: string;
  timeline: { phase: string; date: string; completed: boolean }[];
  lastUpdated: string;
  currentStatus?: string;
  milestones?: { title: string; date: string; status: 'completed' | 'in_progress' | 'pending' }[];
}

export interface ProjectAmenities {
  internal: string[];
  external: string[];
}

export interface ProjectLayouts {
  masterPlanImage: string;
  towerLayouts: { towerName: string; image: string }[];
  unitLayouts: { typeName: string; area: string; image: string }[];
  map?: (callback: (layout: { title: string; type: string; description: string; image: string }, idx: number) => any) => any;
}

export interface ProjectNews {
  title: string;
  date: string;
  source: string;
  snippet: string;
}

export interface ProjectVideo {
  title: string;
  thumbnail: string;
  duration: string;
}

export interface Project {
  id: string; // PROJECT_ID e.g. 'PROJ-LUMI'
  name: string;
  developer: string;
  location: string;
  district: string;
  city: string;
  coordinates: { lat: number; lng: number; xPercent: number; yPercent: number };
  status: ProjectStatus;
  badge?: 'Đang mở bán' | 'Mới' | 'Hot' | 'Sắp mở bán';
  priceFrom: string;
  priceFromNumber: number; // in billions e.g. 5.5
  pricePerM2: string;
  priceAvgPerM2?: string;
  availableUnitsCount: number;
  propertyType: ProjectPropertyType;
  coverImage: string;
  thumbnail?: string;
  gallery: string[];
  description: string;
  overview: ProjectOverview;
  priceDetails: ProjectPriceDetail;
  pricing?: { byUnitTypes: { type: string; area: string; priceRange: string; pricePerM2: string }[] };
  legal: ProjectLegal;
  progress: ProjectProgress;
  amenities: ProjectAmenities;
  infrastructure: string[];
  layouts: ProjectLayouts | any;
  priceHistory?: { trendDescription: string; historyMilestones: { period: string; price: string; note: string }[] };
  news: ProjectNews[];
  videos: ProjectVideo[];
  tags: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

export type PrimaryUnitStatus = 'Còn hàng' | 'Đang giữ chỗ' | 'Đã booking' | 'Đã bán';

export interface PrimaryInventoryUnit {
  id: string; // UNIT_ID e.g. 'UNIT-LUMI-L1-1205'
  projectId: string; // Ref to Project
  projectName: string;
  phaseId: string;
  phaseName: string;
  buildingId: string;
  buildingName: string;
  unitCode: string;
  floor: number;
  unitType: 'Studio' | '1PN' | '2PN' | '3PN' | 'Duplex' | 'Penthouse';
  area: number; // m2
  bedrooms: number;
  bathrooms: number;
  doorDirection: string;
  balconyDirection: string;
  view: string;
  totalPrice: string;
  priceValueNumber: number; // in billions e.g. 6.85
  pricePerM2: string;
  status: PrimaryUnitStatus;
  layoutImage: string;
  viewSimulationUrl?: string;
  viewSimulationImages?: string[];
  model3dUrl?: string;
  paymentPolicies: string[];
  paymentSchedule: { milestone: string; percentage: string; note: string }[];
  distributionSources: {
    distributorId: string;
    distributorName: string;
    price: string;
    status: string;
    updatedAt: string;
  }[];
  source: string;
  distributor: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface BookingPreviewRequest {
  projectId: string;
  projectName: string;
  buildingName: string;
  unitCode: string;
  unitId: string;
  price: string;
  customerName: string;
  customerPhone: string;
  distributor: string;
  saleAgentName?: string;
  note?: string;
}

export interface ProjectFilterState {
  searchQuery: string;
  districts: string[];
  developer: string;
  priceRange: string;
  propertyTypes: string[];
  status: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'units_desc' | 'latest';
}

export interface PropertyListing {
  id: string;
  title: string;
  projectName?: string;
  mode: ListingMode;
  propertyType: PropertyType;
  district: string;
  city: string;
  address: string;
  price: string;
  priceValueNumber: number; // in billions for sale, millions for rent for filtering
  pricePerM2?: string;
  area: number; // m2
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  direction?: string;
  balconyDirection?: string;
  view?: string;
  furnitureStatus?: string;
  legalStatus?: string;
  amenities?: string[];
  infrastructure?: string[];
  rentalYield?: string;
  source?: string;
  description: string;
  images: string[];
  updatedAt: string;
  isDemo?: boolean;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  propertyContext?: {
    listingId: string;
    title: string;
    price: string;
    area: string | number;
  };
}

export interface ConversationPropertyContext {
  listingId: string;
  title: string;
  price: string;
  area: string | number;
  district?: string;
  bedrooms?: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ConversationMessage[];
  propertyContext: ConversationPropertyContext | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  propertyContext?: {
    id: string;
    title: string;
    price: string;
    area: number;
    bedrooms: number;
  };
}

export interface HotProject {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  pricePerM2: string;
  description: string;
  image: string;
  status: string;
  units: string;
}

export interface AreaPriceStat {
  district: string;
  city: 'Hà Nội' | 'TP.HCM';
  avgPricePerM2: number;
  priceUnit: string;
  changePercent: number;
  isPositive: boolean;
  totalListings?: number;
  trend?: string;
}

export interface MarketUpdateItem {
  id: string;
  category: 'Giá BĐS' | 'Quy hoạch' | 'Hạ tầng' | 'Pháp lý' | 'Lãi suất' | 'Cảnh báo';
  headline: string;
  summary: string;
  updatedTime: string;
  iconName: string;
  badgeColor: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Thị trường' | 'Quy hoạch' | 'Hạ tầng' | 'Chính sách' | 'Tài chính';
  time: string;
  readTime: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface RiskItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  recommendedAction: string;
}

export interface MarketFilterState {
  searchQuery: string;
  mode: ListingMode;
  districts: string[];
  propertyTypes: string[];
  priceRange: string;
  areaRange: string;
  bedrooms: string;
  sortBy: 'latest' | 'price_asc' | 'price_desc' | 'area_desc' | 'price_per_m2_asc';
}

export interface CustomerRequirement {
  budget: number; // in billion VND e.g. 6.0
  purpose: 'SELF_USE' | 'INVESTMENT' | 'RENTAL';
  preferredDistricts: string[];
  bedrooms: number;
  householdSize?: number;
  propertyType?: PropertyType | string;
}

export interface AIEvaluationResult {
  matchScore: number;
  pros: string[];
  cons: string[];
  summary: string;
}

export interface AISearchFilterResponse {
  transaction_type?: 'SALE' | 'RENT';
  districts?: string[];
  property_type?: PropertyType | string;
  max_price?: number;
  bedrooms?: number;
  raw_query?: string;
}

// ==========================================
// SOCIAL DOMAIN TYPES
// ==========================================

export type SocialAuthorRole = 
  | 'USER' 
  | 'SALE' 
  | 'CREATOR' 
  | 'AGENCY' 
  | 'DEVELOPER' 
  | 'OFFICIAL_APP';

export interface SocialAuthor {
  id: string; // e.g. 'AUTH-01'
  name: string;
  avatar: string;
  role: SocialAuthorRole;
  roleTitle: string; // e.g. 'Chuyên viên BĐS Cao Cấp', 'Chủ đầu tư CapitaLand'
  isVerified: boolean;
  badgeLabel?: string;
  bio: string;
  specialtyAreas: string[]; // e.g. ['Tây Hồ', 'Nam Từ Liêm', 'Cầu Giấy']
  specialtyProjects: string[]; // e.g. ['Lumi Hanoi', 'Heritage West Lake']
  followersCount: number;
  followingCount: number;
  contactPhone?: string;
  contactZalo?: string;
  email?: string;
}

export type SocialPostType = 
  | 'AI_NEWS_SUMMARY'
  | 'MARKET_UPDATE'
  | 'COMMUNITY'
  | 'ANALYSIS'
  | 'DEVELOPER_OFFICIAL'
  | 'SALE_POST'
  | 'PROPERTY_POST'
  | 'VIDEO';

export type SocialFeedCategory = 
  // Actively used in SocialPage topic tabs
  | 'ALL'
  | 'PROJECTS'
  | 'MARKET'
  | 'LEGAL'
  | 'LISTINGS'
  | 'VIDEOS'
  | 'LIFESTYLE'
  // Legacy/filter aliases — not used in UI topic tabs, candidates for removal
  | 'FOR_YOU'
  | 'PROJECT'    // duplicate of PROJECTS
  | 'PRICE'      // subsumed by MARKET
  | 'PLANNING'   // subsumed by LEGAL
  | 'INFRASTRUCTURE' // subsumed by MARKET
  | 'INVESTMENT' // no dedicated tab
  | 'VIDEO';     // duplicate of VIDEOS

export interface SocialPostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: SocialAuthorRole;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface SocialPostSource {
  name: string;
  url?: string;
}

export interface SocialMarketMetric {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export interface SocialPost {
  id: string;
  authorId: string;
  author: SocialAuthor;
  postType: SocialPostType;
  title?: string;
  content: string;
  images?: string[];
  isAIImage?: boolean;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: string;
  categories: string[];
  projectIds?: string[];
  listingIds?: string[];
  unitIds?: string[];
  locationTags?: string[];
  sources?: SocialPostSource[];
  aiGenerated?: boolean;
  aiSummaryBadge?: string;
  marketMetrics?: SocialMarketMetric[];
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  comments?: SocialPostComment[];
}

export interface SocialAISearchResult {
  query: string;
  aiAnswer: {
    headline: string;
    summary: string;
    bulletPoints: string[];
    keyHighlights: { label: string; value: string }[];
    sourceCitation: string;
  };
  relatedPosts: SocialPost[];
  relatedProjects: Project[];
  relatedListings: PropertyListing[];
  relatedAuthors: SocialAuthor[];
  relatedVideos: SocialPost[];
}

