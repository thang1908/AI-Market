import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AppTab, 
  Conversation, 
  ConversationMessage, 
  MarketFilterState, 
  PropertyListing,
  CustomerRequirement,
  AIEvaluationResult,
  Project,
  PrimaryInventoryUnit,
  ProjectFilterState,
  BookingPreviewRequest,
  SocialAuthor,
  SocialPost,
  SocialAISearchResult,
  SocialFeedCategory
} from '../types';
import { mockListings } from '../data/mockListings';
import { mockProjects } from '../data/mockPrimaryProjects';
import { mockPrimaryUnits } from '../data/mockPrimaryInventory';
import { mockSocialPosts, mockSocialAuthors, generateMockSocialAISearch } from '../data/mockSocialData';

export const calculateListingEvaluation = (
  listing: PropertyListing | PrimaryInventoryUnit,
  req: CustomerRequirement
): AIEvaluationResult => {
  let score = 55;
  const pros: string[] = [];
  const cons: string[] = [];

  const isPrimary = 'unitCode' in listing;
  const priceVal = listing.priceValueNumber || 0;
  const title = isPrimary ? `${(listing as PrimaryInventoryUnit).projectName} – ${(listing as PrimaryInventoryUnit).unitCode}` : (listing as PropertyListing).title;
  const district = isPrimary ? (mockProjects.find(p => p.id === (listing as PrimaryInventoryUnit).projectId)?.district || 'Nam Từ Liêm') : (listing as PropertyListing).district;
  const bedrooms = listing.bedrooms || 2;
  const area = listing.area || 65;

  // 1. Budget check
  if (priceVal <= req.budget) {
    score += 20;
    pros.push(`Trong ngân sách dự kiến (${isPrimary ? (listing as PrimaryInventoryUnit).totalPrice : (listing as PropertyListing).price} ≤ ${req.budget} tỷ)`);
  } else if (priceVal <= req.budget * 1.15) {
    score += 10;
    cons.push(`Vượt nhẹ ngân sách (+${Math.round((priceVal - req.budget) * 10) / 10} tỷ)`);
  } else {
    score -= 10;
    cons.push(`Cao hơn ngân sách (${priceVal} tỷ vs ${req.budget} tỷ)`);
  }

  // 2. Bedrooms check
  if (bedrooms === req.bedrooms) {
    score += 15;
    pros.push(`Đúng số phòng ngủ mong muốn (${bedrooms} PN)`);
  } else if (bedrooms > req.bedrooms) {
    score += 8;
    pros.push(`Không gian rộng rãi (${bedrooms} PN)`);
  } else {
    score -= 10;
    cons.push(`Ít hơn số phòng ngủ mong muốn (${bedrooms} PN vs ${req.bedrooms} PN)`);
  }

  // 3. Location check
  if (req.preferredDistricts.length === 0 || req.preferredDistricts.some(d => district.toLowerCase().includes(d.toLowerCase()))) {
    score += 15;
    pros.push(`Nằm trong khu vực ưu tiên (${district})`);
  } else {
    cons.push(`Khu vực lân cận (${district})`);
  }

  // 4. Primary specific benefits or Legal
  if (isPrimary) {
    pros.push('Sản phẩm sơ cấp trực tiếp CĐT, hưởng chính sách ưu đãi & bảo hành');
    if ((listing as PrimaryInventoryUnit).view) {
      pros.push(`Tầm nhìn: ${(listing as PrimaryInventoryUnit).view}`);
    }
  } else {
    const legal = (listing as PropertyListing).legalStatus;
    if (legal?.toLowerCase().includes('sổ đỏ') || legal?.toLowerCase().includes('lâu dài')) {
      score += 10;
      pros.push(`Pháp lý đáp ứng yêu cầu (${legal})`);
    }
  }

  // 5. Area
  if (area >= 65) {
    pros.push(`Diện tích tối ưu ${area}m²`);
  }

  const matchScore = Math.min(97, Math.max(52, score));

  let summary = '';
  if (req.purpose === 'SELF_USE') {
    summary = matchScore >= 80
      ? `Sản phẩm rất phù hợp cho nhu cầu an cư gia đình tại ${district}, không gian tối ưu và môi trường sống chất lượng.`
      : `Sản phẩm đáp ứng cơ bản nhu cầu, bạn có thể cân nhắc thêm về mức giá hoặc chính sách hỗ trợ tài chính.`;
  } else {
    summary = `Sản phẩm có tính thanh khoản và tiềm năng tăng giá tốt theo tiến độ bàn giao hạ tầng tại ${district}.`;
  }

  return {
    matchScore,
    pros: pros.slice(0, 4),
    cons: cons.slice(0, 3),
    summary
  };
};

export interface ContactSaleContext {
  id: string;
  title: string;
  district: string;
  price: string;
  area?: number;
  bedrooms?: number;
  image?: string;
  type: 'listing' | 'project' | 'unit';
  unitCode?: string;
  projectName?: string;
  distributor?: string;
}

interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  
  // Temporary AI Chat Tab state
  isChatTabActive: boolean;
  setIsChatTabActive: (active: boolean) => void;
  openChatTab: (promptText?: string) => void;
  closeChatTab: () => void;
  
  // Conversation History Management
  conversations: Conversation[];
  activeConversationId: string;
  activeConversation: Conversation | null;
  createNewConversation: (initialPrompt?: string, propContext?: PropertyListing | null) => string;
  selectConversation: (conversationId: string) => void;
  renameConversation: (conversationId: string, newTitle: string) => void;
  deleteConversation: (conversationId: string) => void;
  
  // Chat messaging
  sendChatMessage: (text: string) => void;
  resetChat: () => void;
  
  // Most recent conversation for AI Home
  mostRecentConversation: Conversation | null;
  
  // Property context for AI
  currentPropertyContext: PropertyListing | null;
  setCurrentPropertyContext: (prop: PropertyListing | null) => void;
  clearPropertyContext: () => void;
  askAIAboutProperty: (prop: PropertyListing) => void;
  
  // Guide Panel
  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;
  
  // Saved & Interested (Secondary Listings & Primary Units & Projects)
  savedListingIds: string[];
  toggleSaveListing: (id: string) => void;
  isListingSaved: (id: string) => boolean;
  interestedListingIds: string[];
  toggleInterestListing: (id: string) => void;
  isListingInterested: (id: string) => boolean;

  savedProjectIds: string[];
  toggleSaveProject: (id: string) => void;
  isProjectSaved: (id: string) => boolean;

  savedUnitIds: string[];
  toggleSaveUnit: (id: string) => void;
  isUnitSaved: (id: string) => boolean;

  interestedUnitIds: string[];
  toggleInterestUnit: (id: string) => void;
  isUnitInterested: (id: string) => boolean;

  isSavedModalOpen: boolean;
  setIsSavedModalOpen: (open: boolean) => void;
  
  // Market filters & detail (Secondary)
  marketFilters: MarketFilterState;
  setMarketFilters: React.Dispatch<React.SetStateAction<MarketFilterState>>;
  resetMarketFilters: () => void;
  activeDetailListing: PropertyListing | null;
  setActiveDetailListing: (prop: PropertyListing | null) => void;
  
  // Project Tab Filters & Modals
  projectFilters: ProjectFilterState;
  setProjectFilters: React.Dispatch<React.SetStateAction<ProjectFilterState>>;
  resetProjectFilters: () => void;
  activeProject: Project | null;
  setActiveProject: (proj: Project | null) => void;
  
  // Primary Inventory / Giỏ hàng Modal
  isInventoryOpen: boolean;
  inventoryProject: Project | null;
  openInventory: (project: Project) => void;
  closeInventory: () => void;

  // Primary Unit Detail Modal
  activePrimaryUnit: PrimaryInventoryUnit | null;
  setActivePrimaryUnit: (unit: PrimaryInventoryUnit | null) => void;

  // Booking Preview Modal
  isBookingModalOpen: boolean;
  bookingUnit: PrimaryInventoryUnit | null;
  openBookingModal: (unit: PrimaryInventoryUnit) => void;
  closeBookingModal: () => void;

  // Global location selector
  selectedCity: 'Hà Nội' | 'TP.HCM';
  setSelectedCity: (city: 'Hà Nội' | 'TP.HCM') => void;
  
  // Helper to jump to market with filters
  openMarketWithFilter: (partialFilters?: Partial<MarketFilterState>) => void;

  // Customer Requirement (for AI Evaluation & Comparison)
  customerRequirement: CustomerRequirement;
  setCustomerRequirement: React.Dispatch<React.SetStateAction<CustomerRequirement>>;

  // Contact Sale Modal (Supports Listing, Project, Unit)
  contactSaleContext: ContactSaleContext | null;
  contactSaleListing: PropertyListing | null; // backward compatibility
  isContactSaleOpen: boolean;
  openContactSale: (target: PropertyListing | Project | PrimaryInventoryUnit) => void;
  closeContactSale: () => void;

  // Single AI Evaluation Modal (Supports Listing or Primary Unit)
  evaluatingTarget: PropertyListing | PrimaryInventoryUnit | null;
  evaluatingListing: PropertyListing | null; // backward compatibility
  isEvaluationOpen: boolean;
  openEvaluation: (target: PropertyListing | PrimaryInventoryUnit) => void;
  closeEvaluation: () => void;

  // AI Saved Comparison Modal
  isComparisonOpen: boolean;
  openComparison: () => void;
  closeComparison: () => void;

  // ==========================================
  // SOCIAL TAB STATE & ACTIONS
  // ==========================================
  socialPosts: SocialPost[];
  activeSocialTopic: SocialFeedCategory;
  setActiveSocialTopic: (topic: SocialFeedCategory) => void;
  socialFeedSort: 'for_you' | 'latest' | 'following';
  setSocialFeedSort: (sort: 'for_you' | 'latest' | 'following') => void;
  socialSearchQuery: string;
  setSocialSearchQuery: (query: string) => void;
  socialSearchResults: SocialAISearchResult | null;
  isSocialSearching: boolean;
  handleSocialSearch: (query: string) => void;
  clearSocialSearch: () => void;
  
  likedPostIds: string[];
  toggleLikePost: (postId: string) => void;
  isPostLiked: (postId: string) => boolean;

  savedPostIds: string[];
  toggleSavePost: (postId: string) => void;
  isPostSaved: (postId: string) => boolean;

  followedAuthorIds: string[];
  toggleFollowAuthor: (authorId: string) => void;
  isAuthorFollowed: (authorId: string) => boolean;

  activePostDetail: SocialPost | null;
  openPostDetail: (post: SocialPost) => void;
  closePostDetail: () => void;

  activeSocialProfile: SocialAuthor | null;
  openSocialProfile: (author: SocialAuthor) => void;
  closeSocialProfile: () => void;

  isCreatePostOpen: boolean;
  openCreatePost: () => void;
  closeCreatePost: () => void;
  createNewSocialPost: (data: {
    content: string;
    title?: string;
    postType: SocialPost['postType'];
    images?: string[];
    projectIds?: string[];
    listingIds?: string[];
    locationTags?: string[];
    categories?: string[];
  }) => void;

  isShareModalOpen: boolean;
  sharingPost: SocialPost | null;
  openShareModal: (post: SocialPost) => void;
  closeShareModal: () => void;

  isCommentsModalOpen: boolean;
  commentingPost: SocialPost | null;
  openCommentsModal: (post: SocialPost) => void;
  closeCommentsModal: () => void;
  addCommentToPost: (postId: string, text: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;

  // Cross-Navigation Helpers
  openProjectFromSocial: (projectId: string) => void;
  openListingFromSocial: (listingId: string) => void;
  openAIWithSocialContext: (prompt: string) => void;
}

const initialFilters: MarketFilterState = {
  searchQuery: '',
  mode: 'sale',
  cityId: 'HN',
  districts: [],
  propertyTypes: [],
  priceRange: 'Tất cả',
  areaRange: 'Tất cả',
  bedrooms: 'Tất cả',
  sortBy: 'latest'
};

const initialProjectFilters: ProjectFilterState = {
  searchQuery: '',
  districts: [],
  developer: 'Tất cả',
  priceRange: 'Tất cả',
  propertyTypes: [],
  status: 'Tất cả',
  sortBy: 'featured'
};

const SAVED_KEY = 'ai_bds_saved_ids';
const INTEREST_KEY = 'ai_bds_interest_ids';
const CONVERSATIONS_KEY = 'ai_bds_conversations_v3';
const ACTIVE_CONV_KEY = 'ai_bds_active_conv_id_v3';

const getInitialSeedConversations = (): Conversation[] => {
  const now = new Date();
  const today10MinsAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
  const today2HoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: 'conv-seed-1',
      title: '2PN Tây Hồ khoảng 5 tỷ',
      createdAt: today10MinsAgo,
      updatedAt: today10MinsAgo,
      propertyContext: null,
      messages: [
        {
          id: 'msg-seed-1-1',
          role: 'user',
          content: 'Tôi có 5 tỷ, muốn tìm căn 2PN ở Tây Hồ để ở thực',
          createdAt: today10MinsAgo
        },
        {
          id: 'msg-seed-1-2',
          role: 'assistant',
          content: 'Với tầm tài chính khoảng 5 tỷ tại Tây Hồ, bạn có thể lựa chọn các căn hộ 2PN chất lượng tại khu vực Võ Chí Công, Lạc Long Quân hoặc Phú Thượng. Các toà có hạ tầng đồng bộ, gần không gian thoáng mát của Hồ Tây và kết nối nhanh vào trung tâm Cầu Giấy/Ba Đình.\n\nBạn có ưu tiên dự án mới nhận nhà hay căn hộ đã có sẵn sổ đỏ lâu dài?',
          createdAt: today10MinsAgo
        }
      ]
    },
    {
      id: 'conv-seed-2',
      title: 'Lumi Hanoi – phân tích căn 2PN',
      createdAt: today2HoursAgo,
      updatedAt: today2HoursAgo,
      propertyContext: {
        listingId: 'prop-1',
        title: 'Lumi Hanoi – Căn hộ 2PN Signature',
        price: '5.8 Tỷ',
        area: 63.7,
        district: 'Nam Từ Liêm',
        bedrooms: 2
      },
      messages: [
        {
          id: 'msg-seed-2-1',
          role: 'assistant',
          content: 'Tôi đã nhận thông tin về bất động sản **Lumi Hanoi – Căn hộ 2PN Signature** (5.8 Tỷ • 63.7m² tại Nam Từ Liêm). Bạn muốn hỏi tôi điều gì về căn này (pháp lý, tiềm năng tăng giá, so sánh giá hay tiện ích)?',
          createdAt: today2HoursAgo
        },
        {
          id: 'msg-seed-2-2',
          role: 'user',
          content: 'Phân tích tiềm năng tăng giá và tiến độ thanh toán của căn này giúp tôi',
          createdAt: today2HoursAgo
        },
        {
          id: 'msg-seed-2-3',
          role: 'assistant',
          content: '• **Về tiềm năng tăng giá**: Lumi Hanoi được phát triển bởi CapitaLand với chất lượng hoàn thiện quốc tế, nằm ngay mặt tiền Đại lộ Thăng Long kết nối tuyến Metro số 5. Dự kiến biên độ tăng giá đạt 12-18% khi bàn giao vào 2026.\n\n• **Về tiến độ thanh toán**: Rất giãn, chỉ thanh toán 20% đến khi ký HĐMB, các đợt tiếp theo đóng 5%/quý. Đây là chính sách phù hợp cho cả mục đích tích sản lẫn mua ở.',
          createdAt: today2HoursAgo
        }
      ]
    },
    {
      id: 'conv-seed-3',
      title: 'So sánh Tây Hồ và Cầu Giấy',
      createdAt: yesterday,
      updatedAt: yesterday,
      propertyContext: null,
      messages: [
        {
          id: 'msg-seed-3-1',
          role: 'user',
          content: 'So sánh thị trường căn hộ Tây Hồ và Cầu Giấy cho mục đích giữ tiền',
          createdAt: yesterday
        },
        {
          id: 'msg-seed-3-2',
          role: 'assistant',
          content: '• **Quận Cầu Giấy**: Mật độ văn phòng, trường đại học và công ty công nghệ lớn nhất miền Bắc. Nhu cầu thuê cực cao, thanh khoản mua bán diễn ra chỉ trong vài tuần, tỷ suất cho thuê ổn định 4.5 - 5.2%/năm.\n\n• **Quận Tây Hồ**: Nguồn cung khan hiếm, quy hoạch sinh thái ven hồ và cộng đồng chuyên gia quốc tế. Biên độ tăng giá tài sản dài hạn vượt trội và giữ giá tốt nhất trong các chu kỳ biến động.',
          createdAt: yesterday
        }
      ]
    },
    {
      id: 'conv-seed-4',
      title: 'Đầu tư căn hộ cho thuê',
      createdAt: threeDaysAgo,
      updatedAt: threeDaysAgo,
      propertyContext: null,
      messages: [
        {
          id: 'msg-seed-4-1',
          role: 'user',
          content: 'Có 3 tỷ nhàn rỗi thì nên đầu tư căn hộ cho thuê ở đâu để dòng tiền tốt nhất?',
          createdAt: threeDaysAgo
        },
        {
          id: 'msg-seed-4-2',
          role: 'assistant',
          content: 'Với 3 tỷ, để tối ưu dòng tiền bạn nên chọn căn hộ 1PN+1 hoặc Studio tại các đại đô thị có sẵn tiện ích vận hành (như Vinhomes Smart City hoặc Ocean Park). Giá cho thuê từ 8 - 11 triệu/tháng, đạt tỷ suất khoảng 4.5 - 5%/năm kèm khả năng tự vận hành homestay.',
          createdAt: threeDaysAgo
        }
      ]
    }
  ];
};

const generateConversationTitle = (firstPrompt: string, propertyCtx?: PropertyListing | null): string => {
  if (propertyCtx) {
    return `${propertyCtx.projectName || propertyCtx.title.split('–')[0]?.trim() || propertyCtx.title} – phân tích căn ${propertyCtx.bedrooms || 2}PN`;
  }
  const clean = firstPrompt.trim();
  const lower = clean.toLowerCase();
  if (lower.includes('5 tỷ') && (lower.includes('tây hồ') || lower.includes('2pn'))) {
    return '2PN Tây Hồ khoảng 5 tỷ';
  }
  if (lower.includes('5 tỷ')) {
    return 'Tôi có 5 tỷ';
  }
  if (lower.includes('mua để ở') || lower.includes('để ở')) {
    return 'Mua để ở';
  }
  if (lower.includes('đầu tư') || lower.includes('cho thuê')) {
    return 'Mua để đầu tư';
  }
  if (lower.includes('2pn') || lower.includes('phòng ngủ')) {
    return 'Tìm căn 2PN';
  }
  if (lower.includes('lumi hanoi') || lower.includes('lumi')) {
    return 'Phân tích căn Lumi Hanoi';
  }
  if (clean.length > 36) {
    return clean.substring(0, 34) + '...';
  }
  return clean || 'Cuộc trò chuyện mới';
};

const createDefaultNewConversation = (): Conversation => {
  const now = new Date().toISOString();
  return {
    id: `conv-${Date.now()}`,
    title: 'Cuộc trò chuyện mới',
    createdAt: now,
    updatedAt: now,
    propertyContext: null,
    messages: [
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Xin chào! Tôi là trợ lý AI Bất Động Sản. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể chia sẻ về ngân sách, khu vực quan tâm hoặc mục đích mua/thuê để tôi tư vấn nhé!',
        createdAt: now
      }
    ]
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('ai');
  const [isChatTabActive, setIsChatTabActive] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [currentPropertyContext, setCurrentPropertyContext] = useState<PropertyListing | null>(null);
  const [activeDetailListing, setActiveDetailListing] = useState<PropertyListing | null>(null);
  const [selectedCity, setSelectedCity] = useState<'Hà Nội' | 'TP.HCM'>('Hà Nội');
  
  // Saved IDs local persistence
  const [savedListingIds, setSavedListingIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_KEY);
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  // Interested IDs local persistence
  const [interestedListingIds, setInterestedListingIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(INTEREST_KEY);
      return stored ? JSON.parse(stored) : ['prop-1'];
    } catch {
      return ['prop-1'];
    }
  });

  // Conversations History with persistence
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      const initial = getInitialSeedConversations();
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(initial));
      return initial;
    } catch {
      return getInitialSeedConversations();
    }
  });

  // Active Conversation ID
  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_CONV_KEY);
      if (stored) return stored;
      const initial = getInitialSeedConversations();
      return initial[0]?.id || '';
    } catch {
      return 'conv-seed-1';
    }
  });

  // Market filters (Secondary)
  const [marketFilters, setMarketFilters] = useState<MarketFilterState>(initialFilters);

  // Project filters (Primary)
  const [projectFilters, setProjectFilters] = useState<ProjectFilterState>(initialProjectFilters);
  const resetProjectFilters = () => setProjectFilters(initialProjectFilters);

  // Active Project Detail Modal
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Primary Inventory Modal
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [inventoryProject, setInventoryProject] = useState<Project | null>(null);

  const openInventory = (proj: Project) => {
    setInventoryProject(proj);
    setIsInventoryOpen(true);
  };

  const closeInventory = () => {
    setIsInventoryOpen(false);
    setInventoryProject(null);
  };

  // Primary Unit Detail Modal
  const [activePrimaryUnit, setActivePrimaryUnit] = useState<PrimaryInventoryUnit | null>(null);

  // Booking Preview Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingUnit, setBookingUnit] = useState<PrimaryInventoryUnit | null>(null);

  const openBookingModal = (unit: PrimaryInventoryUnit) => {
    setBookingUnit(unit);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingUnit(null);
  };

  // Saved Projects and Units
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ai_bds_saved_project_ids');
      return stored ? JSON.parse(stored) : ['PROJ-LUMI'];
    } catch {
      return ['PROJ-LUMI'];
    }
  });

  const toggleSaveProject = (id: string) => {
    setSavedProjectIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const isProjectSaved = (id: string) => savedProjectIds.includes(id);

  const [savedUnitIds, setSavedUnitIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ai_bds_saved_unit_ids');
      return stored ? JSON.parse(stored) : ['UNIT-LUMI-L1-1205'];
    } catch {
      return ['UNIT-LUMI-L1-1205'];
    }
  });

  const toggleSaveUnit = (id: string) => {
    setSavedUnitIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const isUnitSaved = (id: string) => savedUnitIds.includes(id);

  const [interestedUnitIds, setInterestedUnitIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ai_bds_interest_unit_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleInterestUnit = (id: string) => {
    setInterestedUnitIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const isUnitInterested = (id: string) => interestedUnitIds.includes(id);

  useEffect(() => {
    try {
      localStorage.setItem('ai_bds_saved_project_ids', JSON.stringify(savedProjectIds));
    } catch (e) { console.error(e); }
  }, [savedProjectIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_bds_saved_unit_ids', JSON.stringify(savedUnitIds));
    } catch (e) { console.error(e); }
  }, [savedUnitIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_bds_interest_unit_ids', JSON.stringify(interestedUnitIds));
    } catch (e) { console.error(e); }
  }, [interestedUnitIds]);

  // Customer Requirement state (for Match Score & AI Evaluation)
  const [customerRequirement, setCustomerRequirement] = useState<CustomerRequirement>({
    budget: 6.0,
    purpose: 'SELF_USE',
    preferredDistricts: ['Tây Hồ', 'Nam Từ Liêm', 'Cầu Giấy'],
    bedrooms: 2,
    householdSize: 4
  });

  // Contact Sale Modal state
  const [contactSaleContext, setContactSaleContext] = useState<ContactSaleContext | null>(null);
  const [contactSaleListing, setContactSaleListing] = useState<PropertyListing | null>(null);
  const [isContactSaleOpen, setIsContactSaleOpen] = useState<boolean>(false);

  const openContactSale = (target: PropertyListing | Project | PrimaryInventoryUnit) => {
    if ('unitCode' in target) {
      // Primary Unit
      const u = target as PrimaryInventoryUnit;
      const proj = mockProjects.find(p => p.id === u.projectId);
      setContactSaleContext({
        id: u.id,
        title: `${u.projectName} • Căn ${u.unitCode}`,
        district: proj?.district || 'Hà Nội',
        price: u.totalPrice,
        area: u.area,
        bedrooms: u.bedrooms,
        image: u.layoutImage,
        type: 'unit',
        unitCode: u.unitCode,
        projectName: u.projectName,
        distributor: u.distributor
      });
      setContactSaleListing(null);
    } else if ('overview' in target) {
      // Project
      const p = target as Project;
      setContactSaleContext({
        id: p.id,
        title: p.name,
        district: p.district,
        price: p.priceFrom,
        image: p.thumbnail,
        type: 'project',
        projectName: p.name,
        distributor: p.developer
      });
      setContactSaleListing(null);
    } else {
      // PropertyListing
      const l = target as PropertyListing;
      setContactSaleListing(l);
      setContactSaleContext({
        id: l.id,
        title: l.title,
        district: l.district,
        price: l.price,
        area: l.area,
        bedrooms: l.bedrooms,
        image: l.images[0],
        type: 'listing',
        projectName: l.projectName
      });
    }
    setIsContactSaleOpen(true);
  };

  const closeContactSale = () => {
    setIsContactSaleOpen(false);
    setContactSaleContext(null);
    setContactSaleListing(null);
  };

  // Single AI Evaluation Modal state
  const [evaluatingTarget, setEvaluatingTarget] = useState<PropertyListing | PrimaryInventoryUnit | null>(null);
  const [evaluatingListing, setEvaluatingListing] = useState<PropertyListing | null>(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState<boolean>(false);

  const openEvaluation = (target: PropertyListing | PrimaryInventoryUnit) => {
    setEvaluatingTarget(target);
    if ('unitCode' in target) {
      setEvaluatingListing(null);
    } else {
      setEvaluatingListing(target as PropertyListing);
    }
    setIsEvaluationOpen(true);
  };

  const closeEvaluation = () => {
    setIsEvaluationOpen(false);
    setEvaluatingTarget(null);
    setEvaluatingListing(null);
  };

  // Saved AI Comparison Modal state
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  const openComparison = () => {
    setIsComparisonOpen(true);
  };

  const closeComparison = () => {
    setIsComparisonOpen(false);
  };

  // ==========================================
  // SOCIAL TAB STATE & LOGIC
  // ==========================================
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    try {
      const stored = localStorage.getItem('ai_bds_social_posts');
      return stored ? JSON.parse(stored) : mockSocialPosts;
    } catch {
      return mockSocialPosts;
    }
  });

  const [activeSocialTopic, setActiveSocialTopic] = useState<SocialFeedCategory>('ALL');
  const [socialFeedSort, setSocialFeedSort] = useState<'for_you' | 'latest' | 'following'>('for_you');
  const [socialSearchQuery, setSocialSearchQuery] = useState<string>('');
  const [socialSearchResults, setSocialSearchResults] = useState<SocialAISearchResult | null>(null);
  const [isSocialSearching, setIsSocialSearching] = useState<boolean>(false);

  // Social likes
  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ai_bds_liked_post_ids');
      return stored ? JSON.parse(stored) : ['POST-02', 'POST-05'];
    } catch {
      return ['POST-02', 'POST-05'];
    }
  });

  const toggleLikePost = (postId: string) => {
    setLikedPostIds(prev => {
      const isLiked = prev.includes(postId);
      const updated = isLiked ? prev.filter(id => id !== postId) : [...prev, postId];
      
      // Update like count in socialPosts
      setSocialPosts(posts => posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likeCount: isLiked ? Math.max(0, p.likeCount - 1) : p.likeCount + 1
          };
        }
        return p;
      }));
      return updated;
    });
  };
  const isPostLiked = (postId: string) => likedPostIds.includes(postId);

  // Social Saved Posts (distinct from savedListingIds)
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ai_bds_saved_post_ids');
      return stored ? JSON.parse(stored) : ['POST-01', 'POST-04'];
    } catch {
      return ['POST-01', 'POST-04'];
    }
  });

  const toggleSavePost = (postId: string) => {
    setSavedPostIds(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };
  const isPostSaved = (postId: string) => savedPostIds.includes(postId);

  // Followed Authors
  const [followedAuthorIds, setFollowedAuthorIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ai_bds_followed_authors');
      return stored ? JSON.parse(stored) : ['AUTH-CAPITALAND', 'AUTH-HOANG-NAM'];
    } catch {
      return ['AUTH-CAPITALAND', 'AUTH-HOANG-NAM'];
    }
  });

  const toggleFollowAuthor = (authorId: string) => {
    setFollowedAuthorIds(prev =>
      prev.includes(authorId) ? prev.filter(id => id !== authorId) : [...prev, authorId]
    );
  };
  const isAuthorFollowed = (authorId: string) => followedAuthorIds.includes(authorId);

  // Active Post Detail Modal
  const [activePostDetail, setActivePostDetail] = useState<SocialPost | null>(null);
  const openPostDetail = (post: SocialPost) => setActivePostDetail(post);
  const closePostDetail = () => setActivePostDetail(null);

  // Active Social Profile Modal
  const [activeSocialProfile, setActiveSocialProfile] = useState<SocialAuthor | null>(null);
  const openSocialProfile = (author: SocialAuthor) => setActiveSocialProfile(author);
  const closeSocialProfile = () => setActiveSocialProfile(null);

  // Create Post Modal
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  const createNewSocialPost = (data: {
    content: string;
    title?: string;
    postType: SocialPost['postType'];
    images?: string[];
    projectIds?: string[];
    listingIds?: string[];
    locationTags?: string[];
    categories?: string[];
  }) => {
    const currentUserAuthor: SocialAuthor = {
      id: 'AUTH-CURRENT-USER',
      name: 'Bạn (Người dùng ứng dụng)',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      role: 'USER',
      roleTitle: 'Thành viên cộng đồng',
      isVerified: true,
      badgeLabel: 'Thành viên xác thực',
      bio: 'Quan tâm tìm kiếm bất động sản thực tế, chia sẻ góc nhìn và học hỏi kinh nghiệm đầu tư.',
      specialtyAreas: ['Hà Nội'],
      specialtyProjects: [],
      followersCount: 1,
      followingCount: 12
    };

    const newPost: SocialPost = {
      id: `POST-USER-${Date.now()}`,
      authorId: currentUserAuthor.id,
      author: currentUserAuthor,
      postType: data.postType || 'COMMUNITY',
      title: data.title || (data.content.length > 50 ? data.content.substring(0, 50) + '...' : undefined),
      content: data.content,
      images: data.images || [],
      categories: data.categories || ['Cộng đồng', 'Thảo luận'],
      projectIds: data.projectIds,
      listingIds: data.listingIds,
      locationTags: data.locationTags || ['Hà Nội'],
      createdAt: 'Vừa xong',
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      comments: []
    };

    setSocialPosts(prev => [newPost, ...prev]);
    setIsCreatePostOpen(false);
  };

  // Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [sharingPost, setSharingPost] = useState<SocialPost | null>(null);
  const openShareModal = (post: SocialPost) => {
    setSharingPost(post);
    setIsShareModalOpen(true);
  };
  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSharingPost(null);
  };

  // Comments Modal
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState<boolean>(false);
  const [commentingPost, setCommentingPost] = useState<SocialPost | null>(null);
  const openCommentsModal = (post: SocialPost) => {
    setCommentingPost(post);
    setIsCommentsModalOpen(true);
  };
  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
    setCommentingPost(null);
  };

  const addCommentToPost = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `C-${Date.now()}`,
      authorId: 'AUTH-CURRENT-USER',
      authorName: 'Bạn (Thành viên)',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      authorRole: 'USER' as const,
      content: text.trim(),
      createdAt: 'Vừa xong',
      likesCount: 0,
      isLiked: false
    };

    setSocialPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const comments = p.comments || [];
        return {
          ...p,
          commentCount: p.commentCount + 1,
          comments: [newComment, ...comments]
        };
      }
      return p;
    }));

    if (commentingPost && commentingPost.id === postId) {
      setCommentingPost(prev => prev ? {
        ...prev,
        commentCount: prev.commentCount + 1,
        comments: [newComment, ...(prev.comments || [])]
      } : null);
    }

    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail(prev => prev ? {
        ...prev,
        commentCount: prev.commentCount + 1,
        comments: [newComment, ...(prev.comments || [])]
      } : null);
    }
  };

  const toggleLikeComment = (postId: string, commentId: string) => {
    setSocialPosts(prev => prev.map(p => {
      if (p.id === postId && p.comments) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const liked = !c.isLiked;
              return {
                ...c,
                isLiked: liked,
                likesCount: liked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
              };
            }
            return c;
          })
        };
      }
      return p;
    }));
  };

  // Social Search
  const handleSocialSearch = (query: string) => {
    const q = query.trim();
    setSocialSearchQuery(q);
    if (!q) {
      setSocialSearchResults(null);
      return;
    }
    setIsSocialSearching(true);
    setTimeout(() => {
      const results = generateMockSocialAISearch(q);
      setSocialSearchResults(results);
      setIsSocialSearching(false);
    }, 250);
  };

  const clearSocialSearch = () => {
    setSocialSearchQuery('');
    setSocialSearchResults(null);
    setIsSocialSearching(false);
  };

  // Cross-Navigation Helpers
  const openProjectFromSocial = (projectId: string) => {
    const proj = mockProjects.find(p => p.id === projectId);
    if (proj) {
      setActiveProject(proj);
    }
  };

  const openListingFromSocial = (listingId: string) => {
    const listing = mockListings.find(l => l.id === listingId);
    if (listing) {
      setActiveDetailListing(listing);
    }
  };

  const openAIWithSocialContext = (prompt: string) => {
    setActiveTab('ai');
    setIsChatTabActive(true);
    createNewConversation(prompt);
  };

  // Sync social states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_bds_social_posts', JSON.stringify(socialPosts));
    } catch (e) { console.error(e); }
  }, [socialPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_bds_liked_post_ids', JSON.stringify(likedPostIds));
    } catch (e) { console.error(e); }
  }, [likedPostIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_bds_saved_post_ids', JSON.stringify(savedPostIds));
    } catch (e) { console.error(e); }
  }, [savedPostIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_bds_followed_authors', JSON.stringify(followedAuthorIds));
    } catch (e) { console.error(e); }
  }, [followedAuthorIds]);

  // Sync saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedListingIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedListingIds]);

  // Sync interested to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(INTEREST_KEY, JSON.stringify(interestedListingIds));
    } catch (e) {
      console.error(e);
    }
  }, [interestedListingIds]);

  // Sync conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error(e);
    }
  }, [conversations]);

  // Sync active conversation ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_CONV_KEY, activeConversationId);
    } catch (e) {
      console.error(e);
    }
  }, [activeConversationId]);

  // Derive active conversation object
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0] || null;

  // Most recent conversation
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const mostRecentConversation = sortedConversations[0] || null;

  // Sync property context when switching active conversation
  useEffect(() => {
    if (activeConversation && activeConversation.propertyContext) {
      const foundProp = mockListings.find(l => l.id === activeConversation.propertyContext?.listingId);
      if (foundProp) {
        setCurrentPropertyContext(foundProp);
      } else {
        // Construct fallback PropertyListing if not found in mockListings
        setCurrentPropertyContext({
          id: activeConversation.propertyContext.listingId,
          title: activeConversation.propertyContext.title,
          price: String(activeConversation.propertyContext.price),
          priceValueNumber: 5.8,
          area: typeof activeConversation.propertyContext.area === 'number' ? activeConversation.propertyContext.area : 63.7,
          bedrooms: activeConversation.propertyContext.bedrooms || 2,
          bathrooms: 2,
          district: activeConversation.propertyContext.district || 'Nam Từ Liêm',
          city: 'Hà Nội',
          address: activeConversation.propertyContext.district || 'Hà Nội',
          mode: 'sale',
          propertyType: 'Căn hộ',
          description: '',
          images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
          updatedAt: 'Hôm nay'
        });
      }
    } else {
      setCurrentPropertyContext(null);
    }
  }, [activeConversationId]);

  const toggleSaveListing = (id: string) => {
    setSavedListingIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isListingSaved = (id: string) => savedListingIds.includes(id);

  const toggleInterestListing = (id: string) => {
    setInterestedListingIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isListingInterested = (id: string) => interestedListingIds.includes(id);

  // Create new conversation
  const createNewConversation = (initialPrompt?: string, propContext?: PropertyListing | null): string => {
    const now = new Date().toISOString();
    const newId = `conv-${Date.now()}`;
    const newTitle = initialPrompt 
      ? generateConversationTitle(initialPrompt, propContext)
      : (propContext ? `${propContext.projectName || propContext.title.split('–')[0]?.trim() || propContext.title} – phân tích căn ${propContext.bedrooms || 2}PN` : 'Cuộc trò chuyện mới');
    
    const newMessages: ConversationMessage[] = [];

    if (propContext) {
      newMessages.push({
        id: `msg-ctx-${Date.now()}`,
        role: 'assistant',
        content: `Tôi đã nhận thông tin về bất động sản **${propContext.title}** (${propContext.price} • ${propContext.area}m² tại ${propContext.district}). Bạn muốn hỏi tôi điều gì về căn này (pháp lý, tiềm năng tăng giá, so sánh giá hay tiến độ)?`,
        createdAt: now,
        propertyContext: {
          listingId: propContext.id,
          title: propContext.title,
          price: propContext.price,
          area: propContext.area
        }
      });
      setCurrentPropertyContext(propContext);
    } else {
      newMessages.push({
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Xin chào! Tôi là trợ lý AI Bất Động Sản. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể chia sẻ về ngân sách, khu vực quan tâm hoặc mục đích mua/thuê để tôi tư vấn nhé!',
        createdAt: now
      });
      setCurrentPropertyContext(null);
    }

    if (initialPrompt && initialPrompt.trim()) {
      newMessages.push({
        id: `msg-user-${Date.now() + 1}`,
        role: 'user',
        content: initialPrompt.trim(),
        createdAt: now
      });

      // Generate AI response
      const aiResponse = generateAIResponse(initialPrompt.trim(), propContext);
      newMessages.push({
        id: `msg-ai-${Date.now() + 2}`,
        role: 'assistant',
        content: aiResponse,
        createdAt: now
      });
    }

    const newConv: Conversation = {
      id: newId,
      title: newTitle,
      createdAt: now,
      updatedAt: now,
      propertyContext: propContext ? {
        listingId: propContext.id,
        title: propContext.title,
        price: propContext.price,
        area: propContext.area,
        district: propContext.district,
        bedrooms: propContext.bedrooms
      } : null,
      messages: newMessages
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  const selectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const renameConversation = (conversationId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return { ...c, title: newTitle.trim(), updatedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== conversationId);
      if (activeConversationId === conversationId) {
        if (filtered.length > 0) {
          setActiveConversationId(filtered[0].id);
        } else {
          // If no conversations left, create a default new one
          const fresh = createDefaultNewConversation();
          setActiveConversationId(fresh.id);
          return [fresh];
        }
      }
      return filtered;
    });
  };

  const generateAIResponse = (text: string, propContext?: PropertyListing | null): string => {
    const lower = text.toLowerCase();
    if (lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
      return 'Xin chào! Tôi là trợ lý AI Bất Động Sản. Bạn đang quan tâm đến mua nhà ở thực, đầu tư hay tìm căn hộ cho thuê tại khu vực nào?';
    } else if (lower.includes('5 tỷ') || lower.includes('tài chính') || lower.includes('giá')) {
      return 'Với tầm tài chính khoảng 5 tỷ tại Hà Nội, bạn có thể lựa chọn các căn hộ cao cấp 2PN tại khu vực Nam Từ Liêm (như Lumi Hanoi, Masteri West Heights) hoặc căn hộ 2-3PN tại Cầu Giấy và Hà Đông. Bạn có muốn lọc danh sách các căn này trên Market không?';
    } else if (lower.includes('ở') || lower.includes('mua để ở')) {
      return 'Để phục vụ nhu cầu ở thực của gia đình, các tiêu chí quan trọng hàng đầu là mật độ tiện ích nội khu, khuôn viên cây xanh, trường học quốc tế và hạ tầng giao thông kết nối. Các đại đô thị như Vinhomes Smart City hay Masteri Waterfront đang là lựa chọn hàng đầu của cư dân trẻ.';
    } else if (lower.includes('tây hồ')) {
      return 'Khu vực Tây Hồ hiện có mặt bằng giá trung bình khoảng 118 triệu/m². Phân khúc cao cấp như Heritage West Lake hay D’ Le Roi Soleil phù hợp với khách hàng tìm kiếm môi trường sống sinh thái và view hồ rộng thoáng.';
    } else if (lower.includes('đầu tư') || lower.includes('cho thuê')) {
      return 'Đối với mục tiêu đầu tư cho thuê, các khu vực tập trung chuyên gia và công nghệ như Cầu Giấy (Duy Tân, Xuân Thủy), Nam Từ Liêm và Tây Hồ ghi nhận tỷ suất lợi nhuận cho thuê ổn định từ 4.2% - 5.5%/năm.';
    } else if (lower.includes('2pn') || lower.includes('phòng ngủ')) {
      return 'Căn hộ 2 phòng ngủ là phân khúc có thanh khoản cao nhất hiện nay, diện tích phổ biến từ 60 - 85m². Bạn có yêu cầu cụ thể về hướng ban công hay dự án nào không?';
    } else if (propContext || currentPropertyContext) {
      const ctx = propContext || currentPropertyContext;
      return `Về bất động sản ${ctx?.title} (${ctx?.price}, ${ctx?.area}m² tại ${ctx?.district}): Đây là sản phẩm có vị trí đắc địa, pháp lý minh bạch (${ctx?.legalStatus || 'Sổ đỏ lâu dài'}). Bạn có muốn tìm hiểu thêm về lịch thanh toán hoặc so sánh với các dự án lân cận không?`;
    }
    return 'Cảm ơn bạn đã chia sẻ nhu cầu! Dựa trên thông tin này, tôi nhận thấy khu vực bạn quan tâm có nhiều tiềm năng. Bạn có muốn xem thêm các dự án đang mở bán phù hợp với tầm tài chính này trên Market không?';
  };

  const openChatTab = (promptText?: string) => {
    setActiveTab('ai');
    setIsChatTabActive(true);
    if (promptText && promptText.trim()) {
      // Check if current conversation has active messages, if so start new or send
      if (activeConversation && activeConversation.messages.length > 1) {
        createNewConversation(promptText.trim(), null);
      } else {
        sendChatMessage(promptText.trim());
      }
    }
  };

  const closeChatTab = () => {
    setIsChatTabActive(false);
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const now = new Date().toISOString();
    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      createdAt: now,
      propertyContext: currentPropertyContext ? {
        listingId: currentPropertyContext.id,
        title: currentPropertyContext.title,
        price: currentPropertyContext.price,
        area: currentPropertyContext.area
      } : undefined
    };

    const aiResponseText = generateAIResponse(text, currentPropertyContext);

    const aiMsg: ConversationMessage = {
      id: `ai-${Date.now() + 1}`,
      role: 'assistant',
      content: aiResponseText,
      createdAt: new Date().toISOString()
    };

    setConversations(prev => {
      let targetConv = prev.find(c => c.id === activeConversationId);
      if (!targetConv) {
        const fresh = createDefaultNewConversation();
        targetConv = fresh;
        prev = [fresh, ...prev];
      }

      const isFirstUserMessage = !targetConv.messages.some(m => m.role === 'user');
      const updatedTitle = (targetConv.title === 'Cuộc trò chuyện mới' && isFirstUserMessage)
        ? generateConversationTitle(text, currentPropertyContext)
        : targetConv.title;

      return prev.map(c => {
        if (c.id === targetConv!.id) {
          return {
            ...c,
            title: updatedTitle,
            updatedAt: now,
            messages: [...c.messages, userMsg, aiMsg]
          };
        }
        return c;
      });
    });
  };

  const resetChat = () => {
    const newId = createNewConversation(undefined, null);
    setActiveConversationId(newId);
  };

  const clearPropertyContext = () => {
    setCurrentPropertyContext(null);
    if (activeConversationId) {
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return { ...c, propertyContext: null };
        }
        return c;
      }));
    }
  };

  // Flow: Market -> AI with Property Context + New Conversation
  const askAIAboutProperty = (prop: PropertyListing) => {
    setActiveTab('ai');
    setIsChatTabActive(true);
    createNewConversation(undefined, prop);
  };

  const resetMarketFilters = () => {
    setMarketFilters(initialFilters);
  };

  const openMarketWithFilter = (partialFilters?: Partial<MarketFilterState>) => {
    if (partialFilters) {
      setMarketFilters(prev => ({
        ...prev,
        ...partialFilters
      }));
    }
    setActiveTab('market');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isChatTabActive,
        setIsChatTabActive,
        openChatTab,
        closeChatTab,
        conversations,
        activeConversationId,
        activeConversation,
        createNewConversation,
        selectConversation,
        renameConversation,
        deleteConversation,
        sendChatMessage,
        resetChat,
        mostRecentConversation,
        currentPropertyContext,
        setCurrentPropertyContext,
        clearPropertyContext,
        askAIAboutProperty,
        isGuideOpen,
        setIsGuideOpen,
        savedListingIds,
        toggleSaveListing,
        isListingSaved,
        interestedListingIds,
        toggleInterestListing,
        isListingInterested,
        savedProjectIds,
        toggleSaveProject,
        isProjectSaved,
        savedUnitIds,
        toggleSaveUnit,
        isUnitSaved,
        interestedUnitIds,
        toggleInterestUnit,
        isUnitInterested,
        isSavedModalOpen,
        setIsSavedModalOpen,
        marketFilters,
        setMarketFilters,
        resetMarketFilters,
        activeDetailListing,
        setActiveDetailListing,
        projectFilters,
        setProjectFilters,
        resetProjectFilters,
        activeProject,
        setActiveProject,
        isInventoryOpen,
        inventoryProject,
        openInventory,
        closeInventory,
        activePrimaryUnit,
        setActivePrimaryUnit,
        isBookingModalOpen,
        bookingUnit,
        openBookingModal,
        closeBookingModal,
        selectedCity,
        setSelectedCity,
        openMarketWithFilter,
        customerRequirement,
        setCustomerRequirement,
        contactSaleContext,
        contactSaleListing,
        isContactSaleOpen,
        openContactSale,
        closeContactSale,
        evaluatingTarget,
        evaluatingListing,
        isEvaluationOpen,
        openEvaluation,
        closeEvaluation,
        isComparisonOpen,
        openComparison,
        closeComparison,

        // Social Tab Values & Actions
        socialPosts,
        activeSocialTopic,
        setActiveSocialTopic,
        socialFeedSort,
        setSocialFeedSort,
        socialSearchQuery,
        setSocialSearchQuery,
        socialSearchResults,
        isSocialSearching,
        handleSocialSearch,
        clearSocialSearch,
        likedPostIds,
        toggleLikePost,
        isPostLiked,
        savedPostIds,
        toggleSavePost,
        isPostSaved,
        followedAuthorIds,
        toggleFollowAuthor,
        isAuthorFollowed,
        activePostDetail,
        openPostDetail,
        closePostDetail,
        activeSocialProfile,
        openSocialProfile,
        closeSocialProfile,
        isCreatePostOpen,
        openCreatePost,
        closeCreatePost,
        createNewSocialPost,
        isShareModalOpen,
        sharingPost,
        openShareModal,
        closeShareModal,
        isCommentsModalOpen,
        commentingPost,
        openCommentsModal,
        closeCommentsModal,
        addCommentToPost,
        toggleLikeComment,
        openProjectFromSocial,
        openListingFromSocial,
        openAIWithSocialContext
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
