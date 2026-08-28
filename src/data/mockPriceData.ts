import { AreaPriceStat } from '../types';

export const mockPriceUpdates: AreaPriceStat[] = [
  // Hà Nội
  {
    district: 'Tây Hồ',
    city: 'Hà Nội',
    avgPricePerM2: 118,
    priceUnit: 'triệu/m²',
    changePercent: 2.4,
    isPositive: true,
    totalListings: 1420,
    trend: 'Tăng trưởng ổn định nhờ quỹ đất ven hồ khan hiếm'
  },
  {
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    avgPricePerM2: 96,
    priceUnit: 'triệu/m²',
    changePercent: 1.2,
    isPositive: true,
    totalListings: 2310,
    trend: 'Thanh khoản cao tại phân khúc chung cư cao cấp'
  },
  {
    district: 'Nam Từ Liêm',
    city: 'Hà Nội',
    avgPricePerM2: 82,
    priceUnit: 'triệu/m²',
    changePercent: 3.1,
    isPositive: true,
    totalListings: 3840,
    trend: 'Sôi động nhất nhờ nguồn cung dự án mới'
  },
  {
    district: 'Thanh Xuân',
    city: 'Hà Nội',
    avgPricePerM2: 89,
    priceUnit: 'triệu/m²',
    changePercent: 0.8,
    isPositive: true,
    totalListings: 1950,
    trend: 'Nhu cầu ở thực cao dọc trục Nguyễn Trãi - Lê Văn Lương'
  },
  {
    district: 'Long Biên',
    city: 'Hà Nội',
    avgPricePerM2: 72,
    priceUnit: 'triệu/m²',
    changePercent: 2.0,
    isPositive: true,
    totalListings: 1680,
    trend: 'Hưởng lợi lớn từ quy hoạch cầu Trần Hưng Đạo & Tứ Liên'
  },
  {
    district: 'Hà Đông',
    city: 'Hà Nội',
    avgPricePerM2: 65,
    priceUnit: 'triệu/m²',
    changePercent: 1.5,
    isPositive: true,
    totalListings: 2890,
    trend: 'Phân khúc giá vừa túi tiền hút mạnh gia đình trẻ'
  },

  // TP.HCM (for tab switch)
  {
    district: 'Quận 1',
    city: 'TP.HCM',
    avgPricePerM2: 245,
    priceUnit: 'triệu/m²',
    changePercent: 1.8,
    isPositive: true,
    totalListings: 980,
    trend: 'Phân khúc siêu sang giữ giá tốt'
  },
  {
    district: 'Thành phố Thủ Đức',
    city: 'TP.HCM',
    avgPricePerM2: 95,
    priceUnit: 'triệu/m²',
    changePercent: 2.9,
    isPositive: true,
    totalListings: 4200,
    trend: 'Hưởng lợi từ hạ tầng Metro số 1 & Vành đai 3'
  },
  {
    district: 'Bình Thạnh',
    city: 'TP.HCM',
    avgPricePerM2: 105,
    priceUnit: 'triệu/m²',
    changePercent: 1.1,
    isPositive: true,
    totalListings: 1850,
    trend: 'Nhu cầu thuê của chuyên gia luôn ở mức cao'
  },
  {
    district: 'Quận 7',
    city: 'TP.HCM',
    avgPricePerM2: 88,
    priceUnit: 'triệu/m²',
    changePercent: 0.9,
    isPositive: true,
    totalListings: 2400,
    trend: 'Khu Phú Mỹ Hưng tiếp tục duy trì cộng đồng chuẩn mực'
  },
  {
    district: 'Quận 2 (Cũ)',
    city: 'TP.HCM',
    avgPricePerM2: 135,
    priceUnit: 'triệu/m²',
    changePercent: 2.3,
    isPositive: true,
    totalListings: 1950,
    trend: 'Khu Thảo Điền và Thủ Thiêm thu hút dòng vốn lớn'
  },
  {
    district: 'Gò Vấp',
    city: 'TP.HCM',
    avgPricePerM2: 68,
    priceUnit: 'triệu/m²',
    changePercent: 1.4,
    isPositive: true,
    totalListings: 2100,
    trend: 'Phân khúc nhà phố dân sinh thanh khoản đều đặn'
  }
];

export interface PopularAreaItem {
  district: string;
  avgPrice: string;
  totalProducts: string;
  changeRate: string;
  description: string;
  tag: string;
}

export const mockPopularAreas: PopularAreaItem[] = [
  {
    district: 'Tây Hồ',
    avgPrice: '118 triệu/m²',
    totalProducts: '1.420 sản phẩm',
    changeRate: '+2.4%',
    description: 'Môi trường sống sinh thái cao cấp, cộng đồng quốc tế văn minh.',
    tag: 'Đẳng cấp & Sinh thái'
  },
  {
    district: 'Cầu Giấy',
    avgPrice: '96 triệu/m²',
    totalProducts: '2.310 sản phẩm',
    changeRate: '+1.2%',
    description: 'Trung tâm công nghệ, giáo dục hàng đầu với nhiều trường điểm.',
    tag: 'Sôi động & Tiện ích'
  },
  {
    district: 'Nam Từ Liêm',
    avgPrice: '82 triệu/m²',
    totalProducts: '3.840 sản phẩm',
    changeRate: '+3.1%',
    description: 'Tâm điểm phát triển đô thị phía Tây với đại đô thị thông minh.',
    tag: 'Tăng trưởng nhanh'
  },
  {
    district: 'Long Biên',
    avgPrice: '72 triệu/m²',
    totalProducts: '1.680 sản phẩm',
    changeRate: '+2.0%',
    description: 'Không gian sống thoáng mát, kết nối thuận tiện sang phố cổ.',
    tag: 'Quy hoạch đồng bộ'
  },
  {
    district: 'Gia Lâm',
    avgPrice: '58 triệu/m²',
    totalProducts: '2.450 sản phẩm',
    changeRate: '+2.7%',
    description: 'Đón đầu quy hoạch lên quận cùng chuỗi đại đô thị biển hồ.',
    tag: 'Tiềm năng cao'
  },
  {
    district: 'Hà Đông',
    avgPrice: '65 triệu/m²',
    totalProducts: '2.890 sản phẩm',
    changeRate: '+1.5%',
    description: 'Hạ tầng kết nối tàu điện Cát Linh, dịch vụ dân sinh hoàn thiện.',
    tag: 'An cư vừa túi tiền'
  }
];
