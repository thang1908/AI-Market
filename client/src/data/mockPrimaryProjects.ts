import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'PROJ-LUMI',
    name: 'Lumi Hanoi',
    developer: 'CapitaLand Development',
    location: 'Đại lộ Thăng Long, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    district: 'Nam Từ Liêm',
    city: 'Hà Nội',
    coordinates: { lat: 21.0025, lng: 105.7412, xPercent: 26, yPercent: 54 },
    status: 'Đang mở bán',
    badge: 'Hot',
    priceFrom: 'Giá từ 5,5 tỷ',
    priceFromNumber: 5.5,
    pricePerM2: '85 – 115 triệu/m²',
    availableUnitsCount: 126,
    propertyType: 'Căn hộ',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Tuyệt tác căn hộ chuẩn quốc tế của CapitaLand tại phía Tây Hà Nội. Thiết kế lấy cảm hứng từ "thành phố ánh sáng" với hơn 80 tiện ích cao cấp, công viên nội khu 5ha và cầu đi bộ trên không độc bản.',
    overview: {
      scale: '9 tòa tháp căn hộ cao từ 29 - 35 tầng',
      landArea: '5,6 ha',
      buildingDensity: '28,5%',
      totalTowers: '9 tòa tháp',
      totalUnits: '3.950 căn hộ cao cấp & Duplex, Penthouse',
      launchTime: 'Quý 1/2024',
      handoverTime: 'Dự kiến Quý 4/2026'
    },
    priceDetails: {
      priceFrom: '5,5 tỷ',
      avgPricePerM2: '92 triệu/m²',
      byType: [
        { type: '1 Phòng ngủ', area: '42.2 m²', price: '4,2 – 4,8 tỷ' },
        { type: '2 Phòng ngủ', area: '53.8 – 74.5 m²', price: '5,5 – 7,8 tỷ' },
        { type: '3 Phòng ngủ', area: '86.0 – 117.8 m²', price: '8,5 – 12,5 tỷ' },
        { type: 'Duplex / Penthouse', area: '193 – 377 m²', price: '22 – 45 tỷ' }
      ],
      priceHistory: [
        { period: 'Q1/2024 (Đợt 1)', priceAvg: '78 tr/m²' },
        { period: 'Q2/2024 (Đợt 2)', priceAvg: '86 tr/m²' },
        { period: 'Q3/2024 (Hiện tại)', priceAvg: '95 tr/m²' }
      ]
    },
    legal: {
      ownership: 'Sở hữu lâu dài đối với người Việt Nam, 50 năm với người nước ngoài',
      permits: [
        'Quyết định phê duyệt Quy hoạch 1/500',
        'Giấy phép xây dựng số 24/GPXD do Sở Xây Dựng Hà Nội cấp',
        'Văn bản đủ điều kiện bán nhà ở hình thành trong tương lai',
        'Chứng thư bảo lãnh ngân hàng Vietcombank'
      ],
      statusText: 'Đã hoàn tất 100% thủ tục pháp lý và đủ điều kiện mở bán chính thức'
    },
    progress: {
      constructionStatus: 'Đang thi công phần thân tầng 12 tòa Lumi 1 & Lumi 2; hoàn thiện móng Lumi 3 & 4',
      timeline: [
        { phase: 'Khởi công & Thi công hầm móng', date: 'Q4/2023', completed: true },
        { phase: 'Xong khối đế & mở bán Giai đoạn 1', date: 'Q1/2024', completed: true },
        { phase: 'Xây thô đến tầng 15 & mở bán Giai đoạn 2', date: 'Q2/2024', completed: true },
        { phase: 'Cất nóc toàn bộ các tòa tháp', date: 'Q2/2025', completed: false },
        { phase: 'Bàn giao căn hộ chính thức', date: 'Q4/2026', completed: false }
      ],
      lastUpdated: '18/05/2024'
    },
    amenities: {
      internal: [
        'Cầu đi bộ ánh sáng Canopy Walk trên cao dài 200m',
        'Hồ bơi vô cực phong cách resort 50m & hồ bơi ánh sao',
        'Khu thể thao phức hợp đa năng & phòng Gym 360 độ',
        'Công viên chủ đề cảnh quan thiên nhiên 5ha',
        'Khu BBQ ngoài trời & sảnh tiệc riêng tư cho cư dân',
        'Khu vui chơi trẻ em Kid Paradise & rạp chiếu phim ngoài trời',
        'Hệ thống trạm sạc xe điện thông minh toàn khu'
      ],
      external: [
        'Trung tâm thương mại Vincom Mega Mall Smart City (5 phút)',
        'Bệnh viện Đa khoa Quốc tế Vinmec (7 phút)',
        'Hệ thống trường liên cấp Vinschool, Quốc tế St. Paul (5 phút)',
        'Công viên trung tâm & biển hồ cát trắng 10.2ha (3 phút)',
        'Sân vận động Quốc gia Mỹ Đình & TT Hội nghị Quốc gia (10 phút)'
      ]
    },
    infrastructure: [
      'Nút giao Đại lộ Thăng Long kết nối trực tiếp Vành đai 3 và Vành đai 3.5',
      'Đón đầu tuyến Metro số 5 (Văn Cao - Ngọc Khánh - Hòa Lạc)',
      'Tuyến Metro số 6 (Nội Bài - Ngọc Hồi) và Metro số 7 giao lộ tương lai',
      'Đường Lê Quang Đạo kéo dài nối thẳng Hà Đông và Nam Từ Liêm'
    ],
    layouts: {
      masterPlanImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      towerLayouts: [
        { towerName: 'Mặt bằng Tòa Lumi 1 (Tầng 5 - 28)', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
        { towerName: 'Mặt bằng Tòa Lumi 2 (Tầng 5 - 32)', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
        { towerName: 'Mặt bằng Tòa Lumi 3 Signature', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' }
      ],
      unitLayouts: [
        { typeName: 'Căn 2PN - Type 2A (68.5 m²)', area: '68.5 m²', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80' },
        { typeName: 'Căn 2PN - Type 2B (74.5 m² Góc)', area: '74.5 m²', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' },
        { typeName: 'Căn 3PN - Type 3A (98.2 m²)', area: '98.2 m²', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80' },
        { typeName: 'Căn 3PN - Type 3B Luxury (117.8 m²)', area: '117.8 m²', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80' }
      ]
    },
    news: [
      {
        title: 'CapitaLand chính thức ra mắt phân khu Lumi Signature nhận được hơn 2.000 lượt quan tâm',
        date: '10/05/2024',
        source: 'VnExpress',
        snippet: 'Sự kiện giới thiệu giai đoạn 2 dự án Lumi Hanoi thu hút đông đảo nhà đầu tư và khách hàng mua ở thực nhờ vị trí kết nối và bảo chứng thương hiệu quốc tế.'
      },
      {
        title: 'Thị trường căn hộ phía Tây Hà Nội bứt phá nhờ động lực hạ tầng giao thông và metro',
        date: '02/05/2024',
        source: 'Báo Đầu Tư',
        snippet: 'Với trục Đại lộ Thăng Long và tuyến Metro số 5 sắp khởi công, khu vực Tây Mỗ - Mỹ Đình tiếp tục giữ vị trí tâm điểm hấp thụ nguồn cầu căn hộ cao cấp.'
      }
    ],
    videos: [
      {
        title: 'Video 3D Phối cảnh kiến trúc tổng thể dự án Lumi Hanoi',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        duration: '03:45'
      },
      {
        title: 'Trải nghiệm nhà mẫu căn hộ 2PN & 3PN phong cách Scandinavian',
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
        duration: '05:12'
      }
    ],
    tags: ['Căn hộ cao cấp', 'CapitaLand', 'Tây Hà Nội', 'Gần Metro', 'Sở hữu lâu dài'],
    isFeatured: true,
    isNew: true,
    isTrending: true
  },
  {
    id: 'PROJ-HERITAGE',
    name: 'Heritage West Lake',
    developer: 'CapitaLand Development & Hiền Đức Group',
    location: 'Số 677 Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    city: 'Hà Nội',
    coordinates: { lat: 21.0658, lng: 105.8124, xPercent: 54, yPercent: 22 },
    status: 'Sắp bàn giao',
    badge: 'Hot',
    priceFrom: 'Giá từ 14,5 tỷ',
    priceFromNumber: 14.5,
    pricePerM2: '135 – 170 triệu/m²',
    availableUnitsCount: 28,
    propertyType: 'Căn hộ',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Dinh thự trên không bên bờ Hồ Tây huyền thoại. Heritage West Lake là dự án căn hộ siêu sang đầu tiên tại Hà Nội có sảnh thang máy riêng tới từng căn hộ và hồ bơi vô cực nước ấm 50m trên tầng mây.',
    overview: {
      scale: '1 tòa tháp căn hộ siêu sang cao 25 tầng + 1 tháp văn phòng + 1 tháp Soho',
      landArea: '8.970 m²',
      buildingDensity: '47,5%',
      totalTowers: '3 tòa',
      totalUnits: '173 căn hộ hạng sang',
      launchTime: 'Q2/2022',
      handoverTime: 'Quý 4/2024'
    },
    priceDetails: {
      priceFrom: '14,5 tỷ',
      avgPricePerM2: '150 triệu/m²',
      byType: [
        { type: '2 Phòng ngủ Luxury', area: '94 m²', price: '14,5 – 17,2 tỷ' },
        { type: '3 Phòng ngủ Panorama', area: '145 m²', price: '21,5 – 26,0 tỷ' },
        { type: '4 Phòng ngủ President', area: '181 m²', price: '29,0 – 36,0 tỷ' },
        { type: 'Penthouse', area: '328 m²', price: '55 – 75 tỷ' }
      ],
      priceHistory: [
        { period: '2022 (Mở bán)', priceAvg: '120 tr/m²' },
        { period: '2023 (Cất nóc)', priceAvg: '138 tr/m²' },
        { period: '2024 (Chuẩn bị bàn giao)', priceAvg: '155 tr/m²' }
      ]
    },
    legal: {
      ownership: 'Sổ đỏ lâu dài (Người Việt Nam)',
      permits: [
        'Giấy phép xây dựng hoàn chỉnh',
        'Chứng nhận PCCC tiêu chuẩn quốc tế',
        'Nghiệm thu cất nóc và bàn giao'
      ],
      statusText: 'Pháp lý minh bạch, sẵn sàng cấp sổ đỏ sau khi bàn giao'
    },
    progress: {
      constructionStatus: 'Đã hoàn thiện mặt ngoài kính Low-E, đang thi công nội thất cao cấp bàn giao',
      timeline: [
        { phase: 'Khởi công công trình', date: 'Q4/2020', completed: true },
        { phase: 'Cất nóc tòa tháp', date: 'Q3/2023', completed: true },
        { phase: 'Bàn giao những căn hộ đầu tiên', date: 'Q4/2024', completed: false }
      ],
      lastUpdated: '10/05/2024'
    },
    amenities: {
      internal: [
        'Sảnh thang máy riêng biệt (Private Lift Lobby) cho 100% căn hộ',
        'Bể bơi vô cực nước ấm 4 mùa trên tầng 25 view trọn vẹn Hồ Tây',
        'Phòng xông hơi đá muối Himalaya & bể sục Jacuzzi',
        'Dịch vụ Concierge và Quản lý vận hành tiêu chuẩn khách sạn The Ascott',
        'Hầm đỗ xe thông minh tỷ lệ 1:1.5 cho mỗi căn'
      ],
      external: [
        'Mặt nước Hồ Tây chỉ 200m đi bộ',
        'Trung tâm thương mại Lotte Mall Tây Hồ (3 phút)',
        'Sân bay Quốc tế Nội Bài (18 phút qua cầu Nhật Tân)',
        'Khu hành chính Ngoại giao đoàn & Đại sứ quán Hàn Quốc (5 phút)'
      ]
    },
    infrastructure: [
      'Tuyến đường Lạc Long Quân mở rộng và phố đi bộ Trịnh Công Sơn',
      'Đại lộ Võ Chí Công kết nối thẳng sân bay Nội Bài',
      'Quy hoạch trục cảnh quan sông Hồng và bán đảo Quảng An'
    ],
    layouts: {
      masterPlanImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      towerLayouts: [
        { towerName: 'Mặt bằng Tầng Điển hình (Tầng 5 - 24)', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' }
      ],
      unitLayouts: [
        { typeName: 'Căn 2PN Grand (94 m²)', area: '94 m²', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' },
        { typeName: 'Căn 3PN Panorama View Hồ Tây (145 m²)', area: '145 m²', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80' },
        { typeName: 'Căn 4PN Sky Villa (181 m²)', area: '181 m²', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80' }
      ]
    },
    news: [
      {
        title: 'Heritage West Lake bước vào giai đoạn kiểm định hoàn thiện trước bàn giao',
        date: '28/04/2024',
        source: 'CafeF',
        snippet: 'Dự án căn hộ hàng hiệu Tây Hồ gây ấn tượng với chất lượng thi công hoàn thiện tỉ mỉ và hệ thống trang thiết bị nhập khẩu từ châu Âu.'
      }
    ],
    videos: [
      {
        title: 'Khám phá tầm nhìn Panorama 360 độ từ tầng thượng Heritage West Lake',
        thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        duration: '04:10'
      }
    ],
    tags: ['Hạng sang', 'View Hồ Tây', 'Sảnh thang riêng', 'CapitaLand', 'Sắp bàn giao'],
    isFeatured: true,
    isNew: false,
    isTrending: true
  },
  {
    id: 'PROJ-MASTERI-WEST',
    name: 'Masteri West Heights',
    developer: 'Masterise Homes',
    location: 'Khu đô thị Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    district: 'Nam Từ Liêm',
    city: 'Hà Nội',
    coordinates: { lat: 21.0062, lng: 105.7485, xPercent: 24, yPercent: 58 },
    status: 'Đã mở bán',
    badge: 'Hot',
    priceFrom: 'Giá từ 3,2 tỷ',
    priceFromNumber: 3.2,
    pricePerM2: '68 – 90 triệu/m²',
    availableUnitsCount: 64,
    propertyType: 'Căn hộ',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Biểu tượng phong cách sống chuẩn quốc tế tại tâm điểm phía Tây. Masteri West Heights sở hữu vị trí kim cương đối diện công viên trung tâm và hồ điều hòa cát trắng 4.8ha.',
    overview: {
      scale: '4 tòa tháp căn hộ cao cấp 38 tầng (West A, West B, West C, West D)',
      landArea: '3,1 ha',
      buildingDensity: '33%',
      totalTowers: '4 tòa',
      totalUnits: '3.599 căn hộ cao cấp',
      launchTime: 'Q2/2021',
      handoverTime: 'Đang bàn giao nhận nhà'
    },
    priceDetails: {
      priceFrom: '3,2 tỷ',
      avgPricePerM2: '75 triệu/m²',
      byType: [
        { type: 'Studio', area: '28.5 – 34.0 m²', price: '2,3 – 2,8 tỷ' },
        { type: '1PN+1', area: '43.0 – 47.5 m²', price: '3,2 – 3,9 tỷ' },
        { type: '2PN (1WC & 2WC)', area: '54.5 – 63.0 m²', price: '4,2 – 5,8 tỷ' },
        { type: '3PN View Hồ', area: '74.0 – 80.0 m²', price: '6,2 – 8,5 tỷ' }
      ],
      priceHistory: [
        { period: '2021', priceAvg: '52 tr/m²' },
        { period: '2022', priceAvg: '63 tr/m²' },
        { period: '2023 - 2024', priceAvg: '76 tr/m²' }
      ]
    },
    legal: {
      ownership: 'Sổ đỏ lâu dài',
      permits: ['Đầy đủ pháp lý và đã bắt đầu cấp sổ cho cư dân'],
      statusText: 'Đã bàn giao nhà, nhận nhà ở ngay hoặc khai thác cho thuê lập tức'
    },
    progress: {
      constructionStatus: 'Đã hoàn thiện 100% và đang bàn giao các tòa West A, B, C, D',
      timeline: [
        { phase: 'Cất nóc', date: 'Q2/2022', completed: true },
        { phase: 'Bàn giao các tòa', date: 'Q4/2023 - Q2/2024', completed: true }
      ],
      lastUpdated: '12/05/2024'
    },
    amenities: {
      internal: [
        'Bể bơi tầng thượng rooftop view panorama cho từng tòa',
        'Sảnh đón khách sang trọng với nhân viên lễ tân 24/7',
        '2 tầng hầm để xe riêng biệt',
        'Phòng gym cao cấp, phòng chiếu phim, phòng làm việc Business Lounge'
      ],
      external: [
        'Trực diện Hồ trung tâm 4.8ha và bãi cát trắng mịn',
        'Vườn Nhật Zen Park 6.1ha lớn nhất Đông Nam Á',
        'Vincom Mega Mall Smart City lớn nhất miền Bắc'
      ]
    },
    infrastructure: [
      'Gần nút giao cầu vượt nối thẳng Lê Trọng Tấn Hà Đông',
      'Đại lộ Thăng Long và trục Tố Hữu - Lê Văn Lương'
    ],
    layouts: {
      masterPlanImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      towerLayouts: [
        { towerName: 'Mặt bằng Tòa West B', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' }
      ],
      unitLayouts: [
        { typeName: 'Căn 2PN2WC (62m²)', area: '62 m²', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' }
      ]
    },
    news: [
      {
        title: 'Masterise Homes bàn giao vượt tiến độ các tòa tháp tại Smart City',
        date: '15/04/2024',
        source: 'Dân Trí',
        snippet: 'Cư dân Masteri West Heights hài lòng với hệ thống tiện ích đẳng cấp và nội thất bàn giao từ các thương hiệu Kohler, Hafele.'
      }
    ],
    videos: [
      {
        title: 'Cận cảnh thực tế bàn giao căn hộ Masteri West Heights',
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
        duration: '06:20'
      }
    ],
    tags: ['Masterise Homes', 'Nhận nhà ngay', 'Smart City', 'View Hồ', 'Sổ đỏ lâu dài'],
    isFeatured: false,
    isNew: false,
    isTrending: true
  },
  {
    id: 'PROJ-MATRIX-ONE',
    name: 'The Matrix One Phase 2',
    developer: 'MIK Group',
    location: 'Ngã tư Lê Quang Đạo & Mễ Trì, Quận Nam Từ Liêm, Hà Nội',
    district: 'Nam Từ Liêm',
    city: 'Hà Nội',
    coordinates: { lat: 21.0182, lng: 105.7725, xPercent: 37, yPercent: 48 },
    status: 'Đang nhận booking',
    badge: 'Mới',
    priceFrom: 'Giá từ 6,8 tỷ',
    priceFromNumber: 6.8,
    pricePerM2: '85 – 110 triệu/m²',
    availableUnitsCount: 95,
    propertyType: 'Căn hộ',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Tòa tháp biểu tượng mới tại trung tâm tài chính - hành chính Mỹ Đình. Phase 2 The Matrix One mang đến dòng sản phẩm căn hộ hạng A với kính tràn Low-E triple, tầm nhìn không giới hạn sang công viên 14ha.',
    overview: {
      scale: '2 tòa tháp căn hộ cao 44 tầng + 1 tháp biểu tượng 73 tầng',
      landArea: '3,9 ha',
      buildingDensity: '30%',
      totalTowers: '3 tòa',
      totalUnits: '990 căn hộ',
      launchTime: 'Q2/2024',
      handoverTime: 'Dự kiến Q4/2026'
    },
    priceDetails: {
      priceFrom: '6,8 tỷ',
      avgPricePerM2: '95 triệu/m²',
      byType: [
        { type: '2 Phòng ngủ', area: '87 m²', price: '6,8 – 8,2 tỷ' },
        { type: '3 Phòng ngủ Dual Key', area: '112 m²', price: '9,8 – 12,5 tỷ' },
        { type: 'Penthouse', area: '240 m²', price: '28 – 35 tỷ' }
      ]
    },
    legal: {
      ownership: 'Sở hữu lâu dài',
      permits: ['Đầy đủ phê duyệt quy hoạch và giấy phép xây dựng phần thân'],
      statusText: 'Đang nhận giữ chỗ thiện chí (Booking có hoàn lại)'
    },
    progress: {
      constructionStatus: 'Đang thi công móng cọc và tầng hầm',
      timeline: [
        { phase: 'Khởi công móng hầm', date: 'Q1/2024', completed: true },
        { phase: 'Mở bán chính thức Đợt 1', date: 'Q3/2024', completed: false }
      ],
      lastUpdated: '05/05/2024'
    },
    amenities: {
      internal: [
        'Cầu kính nối 2 tòa tháp trên tầng 23 ngắm pháo hoa',
        'Vườn nhật & bể bơi bốn mùa panorama',
        'Hệ thống lọc khí tươi và lọc nước uống tại vòi tiêu chuẩn quốc tế'
      ],
      external: [
        'Công viên hồ điều hòa Mễ Trì 14ha',
        'Đường đua F1 và Sân vận động Mỹ Đình',
        'Bệnh viện Đa khoa Hồng Ngọc - Phúc Trường Minh'
      ]
    },
    infrastructure: [
      'Trục đường huyết mạch Lê Quang Đạo - Mễ Trì - Phạm Hùng',
      'Đường Lê Quang Đạo kéo dài nối thông vành đai 3.5'
    ],
    layouts: {
      masterPlanImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      towerLayouts: [],
      unitLayouts: [
        { typeName: 'Căn 2PN Premium (87m²)', area: '87 m²', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' }
      ]
    },
    news: [],
    videos: [],
    tags: ['Mỹ Đình', 'MIK Group', 'Hạng A', 'Kính Low-E', 'Booking'],
    isFeatured: true,
    isNew: true,
    isTrending: false
  },
  {
    id: 'PROJ-VINOCC3',
    name: 'Vinhomes Ocean Park 3 – The Crown',
    developer: 'Tập đoàn Vingroup',
    location: 'Nghĩa Trụ, Văn Giang, Tiếp giáp Gia Lâm, Hà Nội',
    district: 'Gia Lâm',
    city: 'Hà Nội',
    coordinates: { lat: 20.9712, lng: 105.9624, xPercent: 82, yPercent: 65 },
    status: 'Đang mở bán',
    badge: 'Hot',
    priceFrom: 'Giá từ 7,5 tỷ',
    priceFromNumber: 7.5,
    pricePerM2: '110 – 165 triệu/m²',
    availableUnitsCount: 180,
    propertyType: 'Liền kề',
    coverImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Thành phố biển nghỉ dưỡng thượng lưu Ocean City. Quy tụ công viên nước Paradise Bay 12ha, hồ bơi bốn mùa nước mặn trong nhà kính và chuỗi biệt thự, liền kề ven vịnh biển độc đáo.',
    overview: {
      scale: 'Quần thể đô thị biển 294 ha, gồm 8 phân khu thấp tầng và 10 tòa tháp căn hộ',
      landArea: '294 ha',
      buildingDensity: '25%',
      totalTowers: '10 tòa tháp + 8.458 căn thấp tầng',
      totalUnits: '8.458 căn thấp tầng (Biệt thự, Liền kề, Shophouse)',
      launchTime: 'Q4/2022',
      handoverTime: 'Bắt đầu bàn giao từ Q4/2023'
    },
    priceDetails: {
      priceFrom: '7,5 tỷ',
      avgPricePerM2: '125 triệu/m²',
      byType: [
        { type: 'Liền kề Phố Biển (60 - 75 m²)', area: '65 m²', price: '7,5 – 9,8 tỷ' },
        { type: 'Shophouse Vịnh Thiên Đường', area: '96 m²', price: '12,5 – 16,0 tỷ' },
        { type: 'Biệt thự Song lập ven hồ', area: '150 m²', price: '20,0 – 28,0 tỷ' },
        { type: 'Biệt thự Đơn lập VIP', area: '280 m²', price: '45 – 70 tỷ' }
      ]
    },
    legal: {
      ownership: 'Sổ đỏ lâu dài',
      permits: ['100% đầy đủ hồ sơ pháp lý, đủ điều kiện mua bán chuyển nhượng'],
      statusText: 'Đã có sổ đỏ phân khu Vịnh Tây và Thời Đại'
    },
    progress: {
      constructionStatus: 'Đã hoàn thiện cảnh quan Vịnh Paradise Bay, nhiều phân khu đã có cư dân về ở',
      timeline: [
        { phase: 'Khai trương Paradise Bay', date: 'Q4/2022', completed: true },
        { phase: 'Bàn giao Phân khu Thời Đại', date: 'Q3/2023', completed: true }
      ],
      lastUpdated: '16/05/2024'
    },
    amenities: {
      internal: [
        'Vịnh biển thiên đường Paradise Bay 12ha',
        'Hồ bơi nước mặn 4 mùa Tropical Lagoon 2.8ha',
        'Công viên nước mini Aqua Bay do VinWonders thiết kế',
        'Tổ hợp ẩm thực giải trí Mega Grand World Hà Nội'
      ],
      external: [
        'Cao tốc Hà Nội - Hải Phòng kết nối nhanh sang TT Hà Nội 20 phút',
        'Cụm trường Vinschool, Đại học VinUni và Bệnh viện Vinmec San Dưỡng'
      ]
    },
    infrastructure: [
      'Cầu Vĩnh Tuy giai đoạn 2 đã thông xe',
      'Đường vành đai 3.5 và cầu Mễ Sở sắp triển khai'
    ],
    layouts: {
      masterPlanImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      towerLayouts: [],
      unitLayouts: [
        { typeName: 'Mặt bằng Liền kề 5 tầng Phố Biển', area: '65 m²', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80' }
      ]
    },
    news: [],
    videos: [],
    tags: ['Vinhomes', 'Ocean City', 'Liền kề', 'Biệt thự', 'Nghỉ dưỡng'],
    isFeatured: true,
    isNew: false,
    isTrending: true
  },
  {
    id: 'PROJ-NOBLE-CRYSTAL',
    name: 'Noble Crystal Tay Ho (Sunshine Sky City)',
    developer: 'Noble Real Estate & Sunshine Group',
    location: 'Khu đô thị Quốc tế Nam Thăng Long (Ciputra), Bắc Từ Liêm, Hà Nội',
    district: 'Bắc Từ Liêm',
    city: 'Hà Nội',
    coordinates: { lat: 21.0825, lng: 105.7952, xPercent: 44, yPercent: 16 },
    status: 'Sắp mở bán',
    badge: 'Mới',
    priceFrom: 'Giá từ 18,0 tỷ',
    priceFromNumber: 18.0,
    pricePerM2: '140 – 200 triệu/m²',
    availableUnitsCount: 52,
    propertyType: 'Căn hộ',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Dòng sản phẩm Duplex Sky Villa siêu sang tại khu đô thị quốc tế Ciputra. Thiết kế full kính chạm sàn với bể bơi chân mây riêng tại từng ban công căn hộ.',
    overview: {
      scale: '5 tòa tháp cao 40 tầng',
      landArea: '5,0 ha',
      buildingDensity: '29%',
      totalTowers: '5 tòa',
      totalUnits: '955 căn Sky Villa & Penthouse',
      launchTime: 'Q3/2024',
      handoverTime: 'Dự kiến Q4/2027'
    },
    priceDetails: {
      priceFrom: '18,0 tỷ',
      avgPricePerM2: '160 triệu/m²',
      byType: [
        { type: 'Sky Villa 3PN (130m²)', area: '130 m²', price: '18 – 22 tỷ' },
        { type: 'Sky Villa 4PN Duplex (220m²)', area: '220 m²', price: '32 – 45 tỷ' },
        { type: 'Penthouse Hoàng Gia (450m²)', area: '450 m²', price: '70 – 110 tỷ' }
      ]
    },
    legal: {
      ownership: 'Sở hữu lâu dài',
      permits: ['Quy hoạch 1/500 Ciputra và hồ sơ thiết kế cơ sở'],
      statusText: 'Đang hoàn tất móng cọc chuẩn bị mở bán'
    },
    progress: {
      constructionStatus: 'Đang thi công phần ngầm móng cọc',
      timeline: [
        { phase: 'Khởi công', date: 'Q1/2024', completed: true },
        { phase: 'Mở bán đợt 1', date: 'Q3/2024', completed: false }
      ],
      lastUpdated: '14/05/2024'
    },
    amenities: {
      internal: [
        'Hồ bơi vô cực riêng trên ban công từng căn Sky Villa',
        'Khu vườn nhiệt đới trên không 5 tầng',
        'Bãi đỗ trực thăng trên nóc tòa tháp'
      ],
      external: [
        'Sân golf Ciputra Quốc tế 18 hố',
        'Trường quốc tế UNIS, SIS, Hanoi Academy'
      ]
    },
    infrastructure: [
      'Cầu Thăng Long và đường Phạm Văn Đồng mở rộng 12 làn xe',
      'Đại lộ Võ Chí Công nối dài'
    ],
    layouts: {
      masterPlanImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      towerLayouts: [],
      unitLayouts: []
    },
    news: [],
    videos: [],
    tags: ['Ciputra', 'Sky Villa', 'Siêu sang', 'Bắc Từ Liêm'],
    isFeatured: false,
    isNew: true,
    isTrending: false
  },
  {
    id: 'PROJ-GRAND-SUNLAKE',
    name: 'Grand SunLake Văn Quán',
    developer: 'Liên danh Hesco - Thăng Long & EximRS',
    location: 'Số 135 Trần Phú, Phường Văn Quán, Quận Hà Đông, Hà Nội',
    district: 'Hà Đông',
    city: 'Hà Nội',
    coordinates: { lat: 20.9782, lng: 105.7854, xPercent: 32, yPercent: 78 },
    status: 'Sắp bàn giao',
    badge: 'Đang mở bán',
    priceFrom: 'Giá từ 3,8 tỷ',
    priceFromNumber: 3.8,
    pricePerM2: '45 – 58 triệu/m²',
    availableUnitsCount: 42,
    propertyType: 'Căn hộ',
    coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Tổ hợp căn hộ cao cấp ngay cạnh hồ Văn Quán trung tâm Hà Đông. Kết nối trực tiếp tuyến đường sắt đô thị Cát Linh - Hà Đông với đơn giá vô cùng hấp dẫn.',
    overview: {
      scale: '2 tòa tháp căn hộ cao 45 tầng và 50 tầng',
      landArea: '2,1 ha',
      buildingDensity: '38%',
      totalTowers: '2 tòa',
      totalUnits: '1.024 căn hộ',
      launchTime: 'Q3/2022',
      handoverTime: 'Quý 4/2024'
    },
    priceDetails: {
      priceFrom: '3,8 tỷ',
      avgPricePerM2: '50 triệu/m²',
      byType: [
        { type: '2 Phòng ngủ (70m²)', area: '70 m²', price: '3,8 – 4,4 tỷ' },
        { type: '3 Phòng ngủ (92m²)', area: '92 m²', price: '4,8 – 5,6 tỷ' },
        { type: 'Dual Key (105m²)', area: '105 m²', price: '5,5 – 6,5 tỷ' }
      ]
    },
    legal: {
      ownership: 'Sổ hồng lâu dài & 50 năm tùy loại căn',
      permits: ['Giấy phép xây dựng và nghiệm thu phần thô'],
      statusText: 'Đang hoàn thiện nội thất để bàn giao'
    },
    progress: {
      constructionStatus: 'Đã cất nóc cả 2 tòa tháp, đang sơn mặt ngoài và lắp kính',
      timeline: [
        { phase: 'Cất nóc 2 tháp', date: 'Q4/2023', completed: true },
        { phase: 'Bàn giao căn hộ', date: 'Q4/2024', completed: false }
      ],
      lastUpdated: '08/05/2024'
    },
    amenities: {
      internal: [
        'Trung tâm thương mại 6 tầng khối đế',
        'Bể bơi 4 mùa, phòng gym yoga tiêu chuẩn 5 sao',
        'Vườn thượng uyển sky garden ngắm hồ Văn Quán'
      ],
      external: [
        'Hồ Văn Quán thoáng mát cách 50m',
        'Ga tàu điện Metro Cát Linh - Hà Đông cách 100m'
      ]
    },
    infrastructure: [
      'Trục đường Quang Trung - Trần Phú - Nguyễn Trãi',
      'Đường sắt trên cao Cát Linh'
    ],
    layouts: {
      masterPlanImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      towerLayouts: [],
      unitLayouts: []
    },
    news: [],
    videos: [],
    tags: ['Hà Đông', 'Hồ Văn Quán', 'Metro Cát Linh', 'Giá tốt', 'Sắp bàn giao'],
    isFeatured: false,
    isNew: false,
    isTrending: true
  }
];
