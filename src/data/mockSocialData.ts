import { SocialAuthor, SocialPost, SocialAISearchResult, Project, PropertyListing } from '../types';
import { mockProjects } from './mockPrimaryProjects';
import { mockListings } from './mockListings';

export const mockSocialAuthors: SocialAuthor[] = [
  {
    id: 'AUTH-CAPITALAND',
    name: 'CapitaLand Development Vietnam',
    avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=200&q=80',
    role: 'DEVELOPER',
    roleTitle: 'Chủ đầu tư quốc tế',
    isVerified: true,
    badgeLabel: 'Chủ đầu tư chính thức',
    bio: 'Trang thông tin chính thức của tập đoàn CapitaLand Development tại Việt Nam. Cập nhật tiến độ, chính sách và sự kiện mở bán các dự án Lumi Hanoi, Heritage West Lake.',
    specialtyAreas: ['Nam Từ Liêm', 'Tây Hồ', 'Hà Nội'],
    specialtyProjects: ['Lumi Hanoi', 'Heritage West Lake'],
    followersCount: 34200,
    followingCount: 12,
    contactPhone: '1800 400 088',
    email: 'contact@capitaland.com.vn'
  },
  {
    id: 'AUTH-MASTERISE',
    name: 'Masterise Homes Official',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
    role: 'DEVELOPER',
    roleTitle: 'Nhà phát triển BĐS Hạng sang',
    isVerified: true,
    badgeLabel: 'Chủ đầu tư chính thức',
    bio: 'Masterise Homes tiên phong kiến tạo chuẩn sống quốc tế tại Việt Nam với các dòng sản phẩm Lumière Series, Masteri Waterfront và Masteri West Heights.',
    specialtyAreas: ['Gia Lâm', 'Nam Từ Liêm', 'Cầu Giấy'],
    specialtyProjects: ['Masteri West Heights', 'Lumière Evergreen'],
    followersCount: 28900,
    followingCount: 8,
    contactPhone: '1900 6868',
    email: 'sales@masterisehomes.com'
  },
  {
    id: 'AUTH-HOANG-NAM',
    name: 'Hoàng Nam – BĐS Cao Cấp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'SALE',
    roleTitle: 'Top Specialist BĐS Tây Hà Nội',
    isVerified: true,
    badgeLabel: 'Môi giới xác thực',
    bio: '8 năm kinh nghiệm tư vấn căn hộ cao cấp & biệt thự Tây Hà Nội (Lumi Hanoi, Starlake, Heritage West Lake). Hỗ trợ chọn quỹ căn đẹp ngoại giao, phân tích dòng tiền chuyên sâu.',
    specialtyAreas: ['Nam Từ Liêm', 'Cầu Giấy', 'Bắc Từ Liêm', 'Tây Hồ'],
    specialtyProjects: ['Lumi Hanoi', 'The Matrix One', 'Starlake'],
    followersCount: 12500,
    followingCount: 310,
    contactPhone: '0988 123 456',
    contactZalo: '0988123456',
    email: 'hoangnam.realty@gmail.com'
  },
  {
    id: 'AUTH-MAI-PHUONG',
    name: 'Mai Phương RealEstate Review',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    role: 'CREATOR',
    roleTitle: 'BĐS Creator & Nhà đầu tư',
    isVerified: true,
    badgeLabel: 'KOC Bất Động Sản',
    bio: 'Kênh review thực tế nhà mẫu, tiến độ thi công và đánh giá pháp lý các dự án chung cư mới nhất tại Hà Nội & vùng ven. Góc nhìn khách quan và chi tiết cho người mua ở thật.',
    specialtyAreas: ['Hà Nội', 'Hưng Yên', 'Bắc Ninh'],
    specialtyProjects: ['Lumi Hanoi', 'Vinhomes Smart City', 'Ecopark'],
    followersCount: 45600,
    followingCount: 180,
    contactPhone: '0912 888 999',
    contactZalo: '0912888999'
  },
  {
    id: 'AUTH-TRAN-HUNG',
    name: 'TS. Trần Hùng – Kinh tế & BĐS',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'CREATOR',
    roleTitle: 'Chuyên gia Kinh tế & Đầu tư BĐS',
    isVerified: true,
    badgeLabel: 'Chuyên gia phân tích',
    bio: 'Tiến sĩ Kinh tế - Viện Nghiên cứu Thị trường. Chia sẻ phân tích vĩ mô, chu kỳ lãi suất, quy hoạch hạ tầng và chiến lược phân bổ tài sản bất động sản an toàn.',
    specialtyAreas: ['Toàn quốc', 'Hà Nội', 'TP.HCM'],
    specialtyProjects: ['Quy hoạch Vành đai 4', 'Metro Hà Nội'],
    followersCount: 68200,
    followingCount: 45
  },
  {
    id: 'AUTH-CENLAND',
    name: 'CenLand Miền Bắc',
    avatar: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80',
    role: 'AGENCY',
    roleTitle: 'Sàn phân phối BĐS Cấp 1',
    isVerified: true,
    badgeLabel: 'Đại lý phân phối F1',
    bio: 'Hệ sinh thái dịch vụ BĐS hàng đầu Việt Nam. Đại lý F1 phân phối quỹ căn độc quyền các dự án CapitaLand, Vinhomes, Gamuda Land và Masterise Homes.',
    specialtyAreas: ['Hà Nội', 'Hưng Yên', 'Quảng Ninh'],
    specialtyProjects: ['Lumi Hanoi', 'Vinhomes Ocean Park', 'Ecopark'],
    followersCount: 19400,
    followingCount: 120,
    contactPhone: '1900 6088',
    email: 'info@cenland.vn'
  },
  {
    id: 'AUTH-AI-OFFICIAL',
    name: 'AI Bất Động Sản Insights',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    role: 'OFFICIAL_APP',
    roleTitle: 'Hệ thống Dữ liệu & AI Tổng hợp',
    isVerified: true,
    badgeLabel: 'AI Hệ thống',
    bio: 'Cung cấp báo cáo thị trường tự động, radar biến động giá và phân tích quy hoạch thời gian thực dựa trên mô hình dữ liệu lớn BĐS.',
    specialtyAreas: ['Hà Nội', 'TP.HCM'],
    specialtyProjects: ['Tổng hợp thị trường'],
    followersCount: 52000,
    followingCount: 0
  },
  {
    id: 'AUTH-MINH-TUAN',
    name: 'Minh Tuấn (Cư dân Starlake)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'USER',
    roleTitle: 'Thành viên cộng đồng',
    isVerified: false,
    bio: 'Kỹ sư công nghệ, người mua nhà lần 2 tại Tây Hồ Tây. Thích chia sẻ trải nghiệm thực tế về quản lý vận hành, chi phí dịch vụ và thiết kế nội thất.',
    specialtyAreas: ['Tây Hồ', 'Cầu Giấy'],
    specialtyProjects: ['Starlake Tây Hồ Tây'],
    followersCount: 1420,
    followingCount: 220
  }
];

export const mockSocialPosts: SocialPost[] = [
  // 1. AI NEWS SUMMARY 1
  {
    id: 'POST-01',
    authorId: 'AUTH-AI-OFFICIAL',
    author: mockSocialAuthors[6],
    postType: 'AI_NEWS_SUMMARY',
    title: 'Hà Nội đẩy nhanh tiến độ Vành đai 4: Động lực bứt phá cho BĐS khu Tây & Tây Nam',
    content: 'Theo quy hoạch điều chỉnh, tuyến đường Vành đai 4 – Vùng Thủ đô đang được giải phóng mặt bằng đạt 98% và tăng tốc thi công các gói thầu xây lắp cầu cạn. Động thái này trực tiếp tạo lực đẩy thanh khoản cho chuỗi dự án đô thị dọc Đại lộ Thăng Long, Hoài Đức và Nam Từ Liêm.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
    ],
    isAIImage: true,
    categories: ['Hạ tầng', 'Quy hoạch', 'Thị trường'],
    locationTags: ['Hà Nội', 'Nam Từ Liêm', 'Hoài Đức'],
    sources: [
      { name: 'Báo Xây Dựng' },
      { name: 'Cổng TTĐT Chính Phủ' },
      { name: 'Sở Quy hoạch - Kiến trúc Hà Nội' }
    ],
    aiGenerated: true,
    aiSummaryBadge: 'AI Tóm tắt • 3 nguồn chính thống',
    createdAt: '1 giờ trước',
    likeCount: 245,
    commentCount: 38,
    shareCount: 52,
    comments: [
      {
        id: 'C-01',
        authorId: 'AUTH-TRAN-HUNG',
        authorName: 'TS. Trần Hùng',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        authorRole: 'CREATOR',
        content: 'Vành đai 4 khi thông xe kỹ thuật năm 2026 sẽ rút ngắn thời gian di chuyển từ các cụm đô thị vệ tinh vào trung tâm chỉ còn 20-25 phút, mặt bằng giá thứ cấp sẽ có đợt tái định giá mới.',
        createdAt: '45 phút trước',
        likesCount: 24,
        isLiked: false
      },
      {
        id: 'C-02',
        authorId: 'AUTH-MINH-TUAN',
        authorName: 'Minh Tuấn',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        authorRole: 'USER',
        content: 'Đoạn qua Hoài Đức thấy máy móc san lấp rất nhộn nhịp, hi vọng đúng tiến độ.',
        createdAt: '20 phút trước',
        likesCount: 5,
        isLiked: false
      }
    ]
  },

  // 2. DEVELOPER OFFICIAL POST
  {
    id: 'POST-02',
    authorId: 'AUTH-CAPITALAND',
    author: mockSocialAuthors[0],
    postType: 'DEVELOPER_OFFICIAL',
    title: 'CapitaLand công bố chính sách thanh toán ưu đãi mới nhất cho phân khu Lumi Signature',
    content: 'CapitaLand trân trọng công bố tiến độ xây dựng vượt kế hoạch tại Lumi Hanoi: toàn bộ phân khu Signature đã hoàn thành phần móng và bắt đầu triển khai các tầng nổi. Kèm theo đó là chính sách hỗ trợ lãi suất 0% lên tới 30 tháng và tiến độ thanh toán giãn 20% đến khi nhận nhà.',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    categories: ['Dự án', 'Chủ đầu tư', 'Chính sách'],
    projectIds: ['PROJ-LUMI'],
    locationTags: ['Nam Từ Liêm', 'Tây Mỗ'],
    createdAt: '3 giờ trước',
    likeCount: 580,
    commentCount: 94,
    shareCount: 140,
    comments: [
      {
        id: 'C-03',
        authorId: 'AUTH-HOANG-NAM',
        authorName: 'Hoàng Nam – BĐS Cao Cấp',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        authorRole: 'SALE',
        content: 'Chính sách này rất phù hợp cho các nhà đầu tư trung - dài hạn vì chỉ cần bỏ vốn ban đầu 20%, phần còn lại được ân hạn nợ gốc đến khi nhận bàn giao năm 2026.',
        createdAt: '2 giờ trước',
        likesCount: 19,
        isLiked: true
      }
    ]
  },

  // 3. PROPERTY POST (With linked real market listings)
  {
    id: 'POST-03',
    authorId: 'AUTH-HOANG-NAM',
    author: mockSocialAuthors[2],
    postType: 'PROPERTY_POST',
    title: 'Tổng hợp 3 căn 2PN & 3PN tầng đẹp giá tốt nhất tại Lumi Hanoi & Heritage West Lake tuần này',
    content: 'Sau đợt booking đợt 2, bên mình vừa nhận độc quyền chuyển nhượng và quỹ căn ngoại giao tầng trung cực đẹp: ban công Đông Nam nhìn trực diện công viên 5ha, giá gốc đợt 1 chưa qua chênh. Mời anh/chị xem chi tiết thông số và pháp lý bên dưới 👇',
    categories: ['BĐS', 'Dự án', 'Đầu tư'],
    projectIds: ['PROJ-LUMI', 'PROJ-HERITAGE'],
    listingIds: ['prop-1', 'prop-2'],
    locationTags: ['Nam Từ Liêm', 'Tây Hồ'],
    createdAt: '5 giờ trước',
    likeCount: 182,
    commentCount: 42,
    shareCount: 28,
    comments: [
      {
        id: 'C-04',
        authorId: 'AUTH-MINH-TUAN',
        authorName: 'Minh Tuấn',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        authorRole: 'USER',
        content: 'Căn prop-1 tầng 18 hướng view có bị che bởi tòa Signature bên cạnh không bạn?',
        createdAt: '3 giờ trước',
        likesCount: 2,
        isLiked: false
      }
    ]
  },

  // 4. MARKET UPDATE POST
  {
    id: 'POST-04',
    authorId: 'AUTH-AI-OFFICIAL',
    author: mockSocialAuthors[6],
    postType: 'MARKET_UPDATE',
    title: 'Báo cáo giá căn hộ Hà Nội Q1: Phân khúc cao cấp tại Tây Hồ & Nam Từ Liêm tiếp tục lập mặt bằng mới',
    content: 'Khảo sát giao dịch thực tế trên hệ thống ghi nhận mức giá sơ cấp tại quận Tây Hồ đạt trung bình 135 triệu/m² (+3.8% so với quý trước). Nguồn cung sơ cấp mở bán mới chủ yếu đến từ các dự án tiêu chuẩn quốc tế như Heritage West Lake, Lumi Hanoi và Starlake.',
    categories: ['Giá BĐS', 'Thị trường', 'Phân tích'],
    marketMetrics: [
      { label: 'Tây Hồ', value: '135 tr/m²', change: '+3.8%', isPositive: true },
      { label: 'Nam Từ Liêm', value: '88 tr/m²', change: '+2.4%', isPositive: true },
      { label: 'Cầu Giấy', value: '98 tr/m²', change: '+1.9%', isPositive: true },
      { label: 'Hưng Yên (Vùng ven)', value: '52 tr/m²', change: '+4.1%', isPositive: true }
    ],
    sources: [{ name: 'Dữ liệu giao dịch AI RealEstate Index' }],
    aiGenerated: true,
    aiSummaryBadge: 'AI Radar Giá BĐS • Cập nhật hàng tuần',
    createdAt: '8 giờ trước',
    likeCount: 390,
    commentCount: 67,
    shareCount: 84
  },

  // 5. VIDEO POST
  {
    id: 'POST-05',
    authorId: 'AUTH-MAI-PHUONG',
    author: mockSocialAuthors[3],
    postType: 'VIDEO',
    title: 'Tour thực tế nhà mẫu 3PN Dual-Key Lumi Hanoi: Bàn giao vật liệu có xứng đáng tầm giá?',
    content: 'Hôm nay Phương cùng cả nhà đi soi từng ngóc ngách căn hộ mẫu 3 phòng ngủ 112m² tại Sales Gallery Lumi Hanoi. Thiết kế kính tràn Low-E 3 lớp, hệ bếp Hafele cao cấp và giải pháp lấy sáng tự nhiên cực kỳ ấn tượng! Anh chị cho điểm căn này bao nhiêu?',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    videoDuration: '03:45',
    categories: ['Video', 'Dự án', 'Đánh giá'],
    projectIds: ['PROJ-LUMI'],
    locationTags: ['Nam Từ Liêm', 'Hà Nội'],
    createdAt: '12 giờ trước',
    likeCount: 840,
    commentCount: 156,
    shareCount: 210,
    comments: [
      {
        id: 'C-05',
        authorId: 'AUTH-MINH-TUAN',
        authorName: 'Minh Tuấn',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        authorRole: 'USER',
        content: 'Phần kính góc nhìn panorama phòng khách làm rất đẹp, phòng ngủ master cũng rộng.',
        createdAt: '10 giờ trước',
        likesCount: 8,
        isLiked: false
      }
    ]
  },

  // 6. EXPERT ANALYSIS POST
  {
    id: 'POST-06',
    authorId: 'AUTH-TRAN-HUNG',
    author: mockSocialAuthors[4],
    postType: 'ANALYSIS',
    title: '3 yếu tố quyết định thanh khoản căn hộ chung cư Hà Nội trong chu kỳ 2025 – 2028',
    content: 'Khi mặt bằng giá chung cư nội đô tiệm cận mức 80-120 triệu/m², bài toán của người mua nhà không còn là "mua đâu cũng lãi" mà cần sàng lọc kỹ:\n\n1. Uy tín & Năng lực tài chính CĐT: Các tập đoàn quốc tế như CapitaLand, Gamuda hay Masterise có tiến độ xây dựng ổn định và quản lý vận hành chuyên nghiệp.\n2. Hạ tầng giao thông kết nối thực tế: Metro số 3 & số 5, Vành đai 3.5 và Vành đai 4.\n3. Chất lượng cộng đồng cư dân & Tiện ích nội khu khép kín (Compound).',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
    ],
    categories: ['Đầu tư', 'Phân tích', 'Tài chính'],
    locationTags: ['Hà Nội'],
    createdAt: '1 ngày trước',
    likeCount: 512,
    commentCount: 89,
    shareCount: 112
  },

  // 7. COMMUNITY POST
  {
    id: 'POST-07',
    authorId: 'AUTH-MINH-TUAN',
    author: mockSocialAuthors[7],
    postType: 'COMMUNITY',
    title: 'Kinh nghiệm chọn hướng căn hộ và nghiệm thu bàn giao thô tại khu Tây Hồ Tây',
    content: 'Chia sẻ với anh em nhóm đang tìm mua căn hộ Tây Hồ: Nếu chọn ban công hướng Bắc hoặc Đông Bắc view sông Hồng thì mùa đông nên chuẩn bị rèm 2 lớp cản gió, đổi lại mùa hè cực kỳ mát và không lo nắng gắt như hướng Tây. Khi nghiệm thu cần đặc biệt kiểm tra áp lực nước và độ dốc sàn ban công nhé!',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    categories: ['Cộng đồng', 'Kinh nghiệm', 'Lối sống'],
    locationTags: ['Tây Hồ'],
    createdAt: '1 ngày trước',
    likeCount: 168,
    commentCount: 45,
    shareCount: 14
  },

  // 8. AI NEWS SUMMARY 2
  {
    id: 'POST-08',
    authorId: 'AUTH-AI-OFFICIAL',
    author: mockSocialAuthors[6],
    postType: 'AI_NEWS_SUMMARY',
    title: 'Luật Đất đai & Luật Kinh doanh BĐS mới: Tác động gì tới người mua nhà hình thành trong tương lai?',
    content: 'Quy định mới siết chặt điều kiện thu tiền đặt cọc không quá 5% giá bán trước khi đủ điều kiện ký HĐMB và yêu cầu CĐT phải giải chấp ngân hàng hoặc có bảo lãnh nghĩa vụ tài chính trước khi mở bán. Điều này giúp bảo vệ tối đa quyền lợi người mua sơ cấp.',
    images: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80'
    ],
    isAIImage: true,
    categories: ['Pháp lý', 'Chính sách', 'Thị trường'],
    sources: [
      { name: 'Bộ Xây Dựng' },
      { name: 'Văn phòng Quốc Hội' },
      { name: 'Hiệp hội BĐS Việt Nam (VNREA)' }
    ],
    aiGenerated: true,
    aiSummaryBadge: 'AI Tóm tắt • Pháp lý BĐS 2025',
    createdAt: '2 ngày trước',
    likeCount: 430,
    commentCount: 54,
    shareCount: 96
  },

  // 9. DEVELOPER OFFICIAL POST 2
  {
    id: 'POST-09',
    authorId: 'AUTH-MASTERISE',
    author: mockSocialAuthors[1],
    postType: 'DEVELOPER_OFFICIAL',
    title: 'Masterise Homes chính thức cất nóc phân khu Lumière Evergreen – Smart City',
    content: 'Cột mốc cất nóc thành công khẳng định cam kết về tiến độ và chất lượng bàn giao vượt trội. Dự án sở hữu 60 tiện ích đặc quyền nội khu và hệ thống lọc không khí trung tâm tiêu chuẩn quốc tế.',
    images: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80'
    ],
    categories: ['Dự án', 'Chủ đầu tư', 'Tiến độ'],
    projectIds: ['PROJ-SMART-CITY'],
    locationTags: ['Nam Từ Liêm'],
    createdAt: '2 ngày trước',
    likeCount: 310,
    commentCount: 29,
    shareCount: 45
  },

  // 10. SALE POST / CREATOR POST
  {
    id: 'POST-10',
    authorId: 'AUTH-CENLAND',
    author: mockSocialAuthors[5],
    postType: 'SALE_POST',
    title: 'Bảng hàng độc quyền 15 căn duplex & penthouse Vinhomes Ocean Park 2 & 3',
    content: 'CenLand mở bán quỹ căn biệt thự song lập & căn hộ view biển hồ nhân tạo với chính sách chiết khấu thanh toán sớm lên tới 12%, tặng gói nội thất trị giá 200 triệu đồng.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80'
    ],
    categories: ['BĐS', 'Dự án', 'Chính sách'],
    projectIds: ['PROJ-OCEAN-PARK'],
    listingIds: ['prop-3', 'prop-4'],
    locationTags: ['Hưng Yên', 'Gia Lâm'],
    createdAt: '3 ngày trước',
    likeCount: 142,
    commentCount: 23,
    shareCount: 19
  },

  // 11. VIDEO POST 2
  {
    id: 'POST-11',
    authorId: 'AUTH-HOANG-NAM',
    author: mockSocialAuthors[2],
    postType: 'VIDEO',
    title: 'Bay flycam tiến độ thực tế Heritage West Lake & cụm Lotte Mall Tây Hồ tháng này',
    content: 'Góc nhìn toàn cảnh từ trên cao 150m: Hồ Tây lộng gió, trục đường Võ Chí Công kết nối cầu Nhật Tân thông thoáng. Cùng Nam kiểm tra chất lượng kính hoàn thiện mặt ngoài dự án!',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    videoDuration: '02:18',
    categories: ['Video', 'Dự án', 'Tiến độ'],
    projectIds: ['PROJ-HERITAGE'],
    locationTags: ['Tây Hồ'],
    createdAt: '3 ngày trước',
    likeCount: 620,
    commentCount: 88,
    shareCount: 135
  },

  // 12. PROPERTY POST 2
  {
    id: 'POST-12',
    authorId: 'AUTH-HOANG-NAM',
    author: mockSocialAuthors[2],
    postType: 'PROPERTY_POST',
    title: 'Cần nhượng gấp căn 3PN Masteri West Heights tầng 22 view trọn hồ cát trắng',
    content: 'Chủ nhà chuyển công tác Sài Gòn cần sang nhượng gấp căn hộ full nội thất cao cấp nhập khẩu, đã có sổ hồng, hỗ trợ vay ngân hàng 70% giá trị hợp đồng.',
    categories: ['BĐS', 'Chuyển nhượng', 'Nam Từ Liêm'],
    listingIds: ['prop-5'],
    locationTags: ['Nam Từ Liêm', 'Tây Mỗ'],
    createdAt: '4 ngày trước',
    likeCount: 96,
    commentCount: 18,
    shareCount: 12
  }
];

export const mockTrendingTopics = [
  { id: '1', tag: '#LumiHanoi', count: '14.2k lượt thảo luận', isHot: true },
  { id: '2', tag: '#HeritageWestLake', count: '9.8k lượt thảo luận', isHot: true },
  { id: '3', tag: '#VanhDai4', count: '8.4k lượt thảo luận', isHot: false },
  { id: '4', tag: '#GiaChungCuTayHo', count: '6.1k lượt thảo luận', isHot: false },
  { id: '5', tag: '#LaiSuatVayNha', count: '5.5k lượt thảo luận', isHot: false },
  { id: '6', tag: '#LuatDatDai2024', count: '4.9k lượt thảo luận', isHot: false }
];

export const mockSampleSearchQueries = [
  'Thông tin mới nhất về Lumi Hanoi',
  'Tìm căn 2PN dưới 6 tỷ ở Hà Nội',
  'Dự án nào đang mở bán ở Tây Hồ?',
  'Giá chung cư Cầu Giấy gần đây thế nào?',
  'Ai là môi giới chuyên dự án này?'
];

// Mock AI Search response builder referencing cross-app data
export const generateMockSocialAISearch = (query: string): SocialAISearchResult => {
  const normalizedQuery = query.toLowerCase().trim();

  let headline = '✨ AI Tổng hợp dữ liệu toàn diện về thị trường BĐS';
  let summary = 'Hệ thống đã đối soát dữ liệu từ các danh mục Dự án sơ cấp, Bảng hàng chuyển nhượng, và Bài phân tích cộng đồng liên quan đến truy vấn của bạn.';
  let bulletPoints = [
    'Dữ liệu được cập nhật từ hồ sơ dự án chính thức và nguồn sàn F1 uy tín.',
    'Mặt bằng giá giao dịch được kiểm chứng trên AI Index theo thời gian thực.',
    'Bạn có thể click vào dự án hoặc BĐS để xem chi tiết thông số hoặc kết nối môi giới chuyên trách.'
  ];
  let keyHighlights = [
    { label: 'Trạng thái', value: 'Đang mở bán sôi động' },
    { label: 'Mặt bằng giá', value: '80 - 145 triệu/m²' },
    { label: 'Pháp lý', value: 'Sổ hồng lâu dài, HĐMB CĐT' }
  ];

  // Specific query conditions
  if (normalizedQuery.includes('lumi') || normalizedQuery.includes('capitaland')) {
    headline = '✨ AI Tổng hợp về Dự án Lumi Hanoi (CapitaLand)';
    summary = 'Lumi Hanoi là dự án căn hộ cao cấp 5.6ha tại Đại lộ Thăng Long (Nam Từ Liêm) do tập đoàn CapitaLand phát triển. Hiện đang mở bán phân khu Signature & Prestige với mức giá từ 80 - 95 triệu/m². Dự kiến bàn giao năm 2026.';
    bulletPoints = [
      'Chủ đầu tư: CapitaLand Development Vietnam (Uy tín quốc tế hàng đầu).',
      'Quy mô: 9 tòa tháp khoảng 3.950 căn hộ, mật độ xây dựng thấp với công viên 5ha.',
      'Pháp lý: Đã hoàn thiện móng, đủ điều kiện HĐMB, sở hữu lâu dài.',
      'Chính sách nổi bật: Hỗ trợ lãi suất 0% lên tới 30 tháng, thanh toán 20% đến khi nhận nhà.'
    ];
    keyHighlights = [
      { label: 'Giá từ', value: '5.5 tỷ / căn 2PN' },
      { label: 'Đơn giá TB', value: '88 tr/m²' },
      { label: 'Bàn giao', value: 'Quý 4/2026' }
    ];
  } else if (normalizedQuery.includes('tây hồ') || normalizedQuery.includes('heritage') || normalizedQuery.includes('hồ tây')) {
    headline = '✨ AI Tổng hợp thị trường BĐS & Dự án tại Quận Tây Hồ';
    summary = 'Tây Hồ là tâm điểm phân khúc BĐS hạng sang và siêu sang tại Hà Nội. Đơn giá trung bình dao động từ 110 - 180 triệu/m². Dự án nổi bật gồm Heritage West Lake (CapitaLand) và chuỗi biệt thự cao cấp ven Hồ Tây.';
    bulletPoints = [
      'Mặt bằng giá tăng trưởng ổn định 8 - 12%/năm nhờ quỹ đất ven hồ khan hiếm.',
      'Tiện ích quốc tế: Lotte Mall West Lake, bệnh viện quốc tế, các đại sứ quán lân cận.',
      'Tỷ suất cho thuê căn hộ cao cấp đạt mức 4.5% - 5.5%/năm, thu hút chuyên gia nước ngoài.'
    ];
    keyHighlights = [
      { label: 'Đơn giá TB', value: '135 tr/m²' },
      { label: 'Xu hướng', value: 'Tăng trưởng +3.8%' },
      { label: 'Dự án hot', value: 'Heritage West Lake' }
    ];
  } else if (normalizedQuery.includes('2pn') || normalizedQuery.includes('5 tỷ') || normalizedQuery.includes('6 tỷ') || normalizedQuery.includes('dưới')) {
    headline = '✨ AI Gợi ý quỹ căn 2PN phù hợp tầm tài chính';
    summary = 'Với tầm tài chính từ 4.5 - 6.5 tỷ tại Hà Nội, bạn có thể lựa chọn căn hộ 2PN cao cấp tại các dự án trọng điểm phía Tây như Lumi Hanoi, Vinhomes Smart City (phân khu Masteri / Tonkin) hoặc Nam Từ Liêm / Cầu Giấy.';
    bulletPoints = [
      'Diện tích phổ biến: 62m² - 75m² thông thủy, bố trí 2 phòng ngủ + 2 vệ sinh.',
      'Hưởng đầy đủ tiện ích compound khép kín: bể bơi 4 mùa, công viên, hầm đỗ xe thông minh.',
      'Khả năng vay vốn: Hỗ trợ vay tới 70% giá trị hợp đồng, ân hạn nợ gốc.'
    ];
    keyHighlights = [
      { label: 'Khoảng giá', value: '4.8 - 5.9 tỷ' },
      { label: 'Diện tích TB', value: '64 - 72 m²' },
      { label: 'Vị trí gợi ý', value: 'Nam Từ Liêm, Hoài Đức' }
    ];
  } else if (normalizedQuery.includes('môi giới') || normalizedQuery.includes('sale') || normalizedQuery.includes('chuyên')) {
    headline = '✨ AI Danh sách Môi giới & Chuyên gia xác thực chuyên sâu';
    summary = 'Hệ thống đã lọc ra các chuyên viên tư vấn BĐS cấp 1 và Creator được xác thực danh tính, chuyên trách thị trường và các dự án lớn tại khu vực tìm kiếm của bạn.';
    bulletPoints = [
      'Được xác thực thông tin đại lý F1 và chứng chỉ hành nghề môi giới BĐS.',
      'Có sẵn quỹ căn ngoại giao và bảng hàng trực tiếp từ chủ đầu tư.',
      'Hỗ trợ tư vấn pháp lý, thủ tục ngân hàng và tham quan căn hộ mẫu miễn phí.'
    ];
  }

  // Cross-reference data from actual app
  const matchedPosts = mockSocialPosts.filter(p => 
    p.title?.toLowerCase().includes(normalizedQuery) ||
    p.content.toLowerCase().includes(normalizedQuery) ||
    p.categories.some(c => c.toLowerCase().includes(normalizedQuery)) ||
    p.locationTags?.some(l => l.toLowerCase().includes(normalizedQuery))
  );

  const matchedProjects = mockProjects.filter(p => 
    p.name.toLowerCase().includes(normalizedQuery) ||
    p.location.toLowerCase().includes(normalizedQuery) ||
    p.district.toLowerCase().includes(normalizedQuery) ||
    p.developer.toLowerCase().includes(normalizedQuery)
  );

  const matchedListings = mockListings.filter(l =>
    l.title.toLowerCase().includes(normalizedQuery) ||
    l.projectName?.toLowerCase().includes(normalizedQuery) ||
    l.district.toLowerCase().includes(normalizedQuery) ||
    (normalizedQuery.includes('2pn') && l.bedrooms === 2) ||
    (normalizedQuery.includes('3pn') && l.bedrooms === 3)
  );

  const matchedAuthors = mockSocialAuthors.filter(a =>
    a.name.toLowerCase().includes(normalizedQuery) ||
    a.roleTitle.toLowerCase().includes(normalizedQuery) ||
    a.specialtyAreas.some(area => area.toLowerCase().includes(normalizedQuery)) ||
    a.specialtyProjects.some(proj => proj.toLowerCase().includes(normalizedQuery))
  );

  const matchedVideos = mockSocialPosts.filter(p => 
    p.postType === 'VIDEO' &&
    (p.title?.toLowerCase().includes(normalizedQuery) || p.content.toLowerCase().includes(normalizedQuery))
  );

  return {
    query,
    aiAnswer: {
      headline,
      summary,
      bulletPoints,
      keyHighlights,
      sourceCitation: 'Tổng hợp từ Dữ liệu Masterise, CapitaLand & Hệ thống AI Bất Động Sản'
    },
    relatedPosts: matchedPosts.length > 0 ? matchedPosts : mockSocialPosts.slice(0, 4),
    relatedProjects: matchedProjects.length > 0 ? matchedProjects : mockProjects.slice(0, 3),
    relatedListings: matchedListings.length > 0 ? matchedListings.slice(0, 4) : mockListings.slice(0, 4),
    relatedAuthors: matchedAuthors.length > 0 ? matchedAuthors : mockSocialAuthors.slice(0, 4),
    relatedVideos: matchedVideos.length > 0 ? matchedVideos : mockSocialPosts.filter(p => p.postType === 'VIDEO').slice(0, 3)
  };
};
