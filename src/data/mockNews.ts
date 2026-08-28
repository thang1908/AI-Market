import { MarketUpdateItem, NewsItem, RiskItem } from '../types';

export const mockMarketToday: MarketUpdateItem[] = [
  {
    id: 'mt-1',
    category: 'Giá BĐS',
    headline: 'Chung cư Hà Nội duy trì mặt bằng giá mới',
    summary: 'Phân khúc căn hộ sơ cấp ghi nhận mức giá bình quân 65-90 triệu/m² do nguồn cung nội đô tiếp tục giới hạn.',
    updatedTime: '30 phút trước',
    iconName: 'TrendingUp',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'mt-2',
    category: 'Quy hoạch',
    headline: 'Đẩy nhanh tiến độ lập quy hoạch phân khu 2 bên sông Hồng',
    summary: 'Trục cảnh quan trung tâm mở ra không gian phát triển đô thị sinh thái hiện đại kết nối 2 bờ.',
    updatedTime: '2 giờ trước',
    iconName: 'Map',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'mt-3',
    category: 'Hạ tầng',
    headline: 'Tuyến Metro Nhổn - Ga Hà Nội vận hành thương mại',
    summary: 'Thúc đẩy giá trị bất động sản dọc trục Cầu Giấy - Xuân Thủy - Kim Mã gia tăng thanh khoản.',
    updatedTime: '3 giờ trước',
    iconName: 'Building2',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200'
  },
  {
    id: 'mt-4',
    category: 'Pháp lý',
    headline: 'Hiệu lực 3 luật mới (Đất đai, Nhà ở, Kinh doanh BĐS)',
    summary: 'Quy định minh bạch bảo vệ người mua nhà và siết chặt năng lực tài chính của chủ đầu tư.',
    updatedTime: '5 giờ trước',
    iconName: 'Scale',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'mt-5',
    category: 'Lãi suất',
    headline: 'Lãi suất vay mua nhà thả nổi duy trì quanh mức 8.5% - 10%',
    summary: 'Nhiều gói ưu đãi cố định 2-3 năm đầu từ các ngân hàng thương mại lớn tiếp tục hỗ trợ người mua ở thực.',
    updatedTime: '6 giờ trước',
    iconName: 'Percent',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  {
    id: 'mt-6',
    category: 'Cảnh báo',
    headline: 'Cẩn trọng với chiêu trò đặt cọc thiện chí các dự án chưa đủ điều kiện',
    summary: 'Người mua cần kiểm tra kỹ giấy phép xây dựng và biên bản nghiệm thu trước khi xuống tiền.',
    updatedTime: '8 giờ trước',
    iconName: 'AlertTriangle',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  }
];

export const mockNewsList: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Thị trường bất động sản quý 3: Nhu cầu ở thực dẫn dắt thanh khoản toàn thị trường',
    summary: 'Dữ liệu giao dịch cho thấy người mua nhà tập trung cao vào các căn hộ 2-3 phòng ngủ có pháp lý hoàn chỉnh, tiến độ xây dựng đảm bảo và hạ tầng kết nối thuận tiện.',
    category: 'Thị trường',
    time: '26/08/2026',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  },
  {
    id: 'news-2',
    title: 'Khởi công xây dựng cầu Tứ Liên và cầu Trần Hưng Đạo bắc qua sông Hồng',
    summary: 'Hai dự án giao thông trọng điểm kỳ vọng sẽ tạo động lực bứt phá mạnh mẽ cho khu vực Long Biên và Đông Anh.',
    category: 'Hạ tầng',
    time: '25/08/2026',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    isFeatured: false
  },
  {
    id: 'news-3',
    title: 'Luật Đất đai mới: Bỏ khung giá đất, xác định giá theo nguyên tắc thị trường',
    summary: 'Tác động trực tiếp đến chi phí giải phóng mặt bằng, thuế phí chuyển nhượng và định giá tài sản của doanh nghiệp.',
    category: 'Chính sách',
    time: '24/08/2026',
    readTime: '5 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    isFeatured: false
  },
  {
    id: 'news-4',
    title: 'Xu hướng dòng tiền dịch chuyển sang bất động sản thương mại và căn hộ cho thuê',
    summary: 'Lợi suất cho thuê tại các quận trung tâm Cầu Giấy, Tây Hồ và Nam Từ Liêm giữ mức ổn định 4.5% - 5.5%/năm.',
    category: 'Tài chính',
    time: '23/08/2026',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    isFeatured: false
  }
];

export const mockRiskItems: RiskItem[] = [
  {
    id: 'risk-1',
    title: 'Rủi ro khi vay quá cao để mua nhà',
    summary: 'Khi tỷ lệ đòn bẩy tài chính vượt quá 60-70% giá trị căn nhà, áp lực trả nợ gốc và lãi sau thời gian ưu đãi có thể gây mất cân đối dòng tiền sinh hoạt gia đình.',
    tags: ['Tài chính', 'Quản lý rủi ro', 'Đòn bẩy'],
    recommendedAction: 'Duy trì nghĩa vụ trả nợ không vượt quá 40% thu nhập thực tế hàng tháng.'
  },
  {
    id: 'risk-2',
    title: 'Những giấy tờ cần kiểm tra trước khi đặt cọc',
    summary: 'Cần xác minh kỹ sổ đỏ/sổ hồng bản gốc, quy hoạch phân khu chi tiết 1/500, kiểm tra tình trạng thế chấp ngân hàng và tranh chấp tại cơ quan địa phương.',
    tags: ['Pháp lý', 'Đặt cọc', 'Sổ đỏ'],
    recommendedAction: 'Yêu cầu xem bản chính và kiểm tra thông tin công chứng trước khi chuyển tiền cọc.'
  },
  {
    id: 'risk-3',
    title: 'Cần kiểm tra gì khi mua căn hộ thứ cấp?',
    summary: 'Xem xét chất lượng hoàn thiện thực tế, phí dịch vụ quản lý tòa nhà, hệ thống PCCC, tình trạng chỗ đỗ ô tô và các khoản nợ phí bảo trì nếu có.',
    tags: ['Căn hộ', 'Thứ cấp', 'Chất lượng công trình'],
    recommendedAction: 'Khảo sát thực tế vào nhiều khung giờ khác nhau (giờ cao điểm và ban đêm).'
  }
];
