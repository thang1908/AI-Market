import { PrimaryInventoryUnit } from '../types';

export const mockPrimaryUnits: PrimaryInventoryUnit[] = [
  // ------------------ LUMI HANOI UNITS ------------------
  {
    id: 'UNIT-LUMI-L1-1205',
    projectId: 'PROJ-LUMI',
    projectName: 'Lumi Hanoi',
    phaseId: 'PHASE-LUMI-1',
    phaseName: 'Phase 1 - Lumi Signature',
    buildingId: 'BLD-LUMI-1',
    buildingName: 'Lumi 1',
    unitCode: 'L1.1205',
    floor: 12,
    unitType: '2PN',
    area: 74.5,
    bedrooms: 2,
    bathrooms: 2,
    doorDirection: 'Tây Bắc',
    balconyDirection: 'Đông Nam',
    view: 'Công viên nội khu & Hồ bơi ánh sao',
    totalPrice: '6,85 tỷ',
    priceValueNumber: 6.85,
    pricePerM2: '91,9 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Chiết khấu 8% khi thanh toán sớm 95%',
      'Hỗ trợ lãi suất 0% và ân hạn nợ gốc trong 24 tháng',
      'Miễn phí 2 năm phí dịch vụ quản lý quốc tế CapitaLand'
    ],
    paymentSchedule: [
      { milestone: 'Đặt cọc / Booking', percentage: '100.000.000 VNĐ', note: 'Ký thỏa thuận giữ căn' },
      { milestone: 'Đợt 1 (14 ngày sau cọc)', percentage: '10%', note: 'Ký Hợp đồng mua bán' },
      { milestone: 'Đợt 2 (Xong tầng 5)', percentage: '10%', note: 'Dự kiến Q3/2024' },
      { milestone: 'Đợt 3 (Xong tầng 15)', percentage: '10%', note: 'Dự kiến Q1/2025' },
      { milestone: 'Đợt 4 (Cất nóc)', percentage: '10%', note: 'Dự kiến Q3/2025' },
      { milestone: 'Đợt 5 (Bàn giao nhà)', percentage: '55%', note: 'Q4/2026' },
      { milestone: 'Đợt 6 (Nhận sổ đỏ)', percentage: '5%', note: 'Bàn giao giấy chứng nhận' }
    ],
    distributionSources: [
      { distributorId: 'DIST-ERA', distributorName: 'ERA Vietnam', price: '6,85 tỷ', status: 'Còn hàng', updatedAt: '15 phút trước' },
      { distributorId: 'DIST-CBRE', distributorName: 'CBRE Residential', price: '6,85 tỷ', status: 'Còn hàng', updatedAt: '35 phút trước' }
    ],
    source: 'Sàn phân phối chính thức CapitaLand',
    distributor: 'ERA Vietnam',
    updatedAt: '15 phút trước'
  },
  {
    id: 'UNIT-LUMI-L1-1808',
    projectId: 'PROJ-LUMI',
    projectName: 'Lumi Hanoi',
    phaseId: 'PHASE-LUMI-1',
    phaseName: 'Phase 1 - Lumi Signature',
    buildingId: 'BLD-LUMI-1',
    buildingName: 'Lumi 1',
    unitCode: 'L1.1808',
    floor: 18,
    unitType: '3PN',
    area: 98.2,
    bedrooms: 3,
    bathrooms: 2,
    doorDirection: 'Đông Nam',
    balconyDirection: 'Tây Bắc',
    view: 'Tầm nhìn Panorama Công viên hồ Tây Mỗ 5ha',
    totalPrice: '9,45 tỷ',
    priceValueNumber: 9.45,
    pricePerM2: '96,2 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Chiết khấu 7.5% cho gói thanh toán chuẩn',
      'Vay 70% ân hạn nợ gốc 24 tháng',
      'Tặng gói nội thất Smart Home trị giá 150 triệu'
    ],
    paymentSchedule: [
      { milestone: 'Đặt cọc', percentage: '100 triệu', note: 'Ký thỏa thuận đặt cọc' },
      { milestone: 'Đợt 1', percentage: '10%', note: 'Ký HĐMB' },
      { milestone: 'Đợt 2 - 5', percentage: '5% mỗi 3 tháng', note: 'Tiến độ xây dựng' },
      { milestone: 'Bàn giao', percentage: '55%', note: 'Q4/2026' }
    ],
    distributionSources: [
      { distributorId: 'DIST-CEN', distributorName: 'CenLand', price: '9,45 tỷ', status: 'Còn hàng', updatedAt: '20 phút trước' },
      { distributorId: 'DIST-DATXANH', distributorName: 'Đất Xanh Miền Bắc', price: '9,45 tỷ', status: 'Còn hàng', updatedAt: '1 giờ trước' }
    ],
    source: 'CapitaLand Primary Master Pool',
    distributor: 'CenLand',
    updatedAt: '20 phút trước'
  },
  {
    id: 'UNIT-LUMI-L2-0602',
    projectId: 'PROJ-LUMI',
    projectName: 'Lumi Hanoi',
    phaseId: 'PHASE-LUMI-1',
    phaseName: 'Phase 1 - Lumi Signature',
    buildingId: 'BLD-LUMI-2',
    buildingName: 'Lumi 2',
    unitCode: 'L2.0602',
    floor: 6,
    unitType: '1PN',
    area: 42.2,
    bedrooms: 1,
    bathrooms: 1,
    doorDirection: 'Tây Nam',
    balconyDirection: 'Đông Bắc',
    view: 'Vườn thiền nhiệt đới & Cầu Ánh Sáng Canopy',
    totalPrice: '4,15 tỷ',
    priceValueNumber: 4.15,
    pricePerM2: '98,3 tr/m²',
    status: 'Đang giữ chỗ',
    layoutImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    paymentPolicies: [
      'Gói vay ưu đãi chỉ cần 20% vốn tự có',
      'Hỗ trợ lãi suất 0% 18 tháng'
    ],
    paymentSchedule: [
      { milestone: 'Đặt chỗ', percentage: '50 triệu', note: 'Đang lock căn 24h' }
    ],
    distributionSources: [
      { distributorId: 'DIST-SAVILLS', distributorName: 'Savills Vietnam', price: '4,15 tỷ', status: 'Đang giữ chỗ', updatedAt: '10 phút trước' }
    ],
    source: 'Savills Vietnam Direct',
    distributor: 'Savills Vietnam',
    updatedAt: '10 phút trước'
  },
  {
    id: 'UNIT-LUMI-L2-2104',
    projectId: 'PROJ-LUMI',
    projectName: 'Lumi Hanoi',
    phaseId: 'PHASE-LUMI-2',
    phaseName: 'Phase 2 - Lumi Prestige',
    buildingId: 'BLD-LUMI-2',
    buildingName: 'Lumi 2',
    unitCode: 'L2.2104',
    floor: 21,
    unitType: '2PN',
    area: 68.5,
    bedrooms: 2,
    bathrooms: 2,
    doorDirection: 'Bắc',
    balconyDirection: 'Nam',
    view: 'View trọn vẹn Đại lộ Thăng Long & Trung tâm Hội nghị QG',
    totalPrice: '6,45 tỷ',
    priceValueNumber: 6.45,
    pricePerM2: '94,1 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Thanh toán tiến độ thảnh thơi 1%/tháng',
      'Chiết khấu 5% khi booking sớm'
    ],
    paymentSchedule: [
      { milestone: 'Cọc', percentage: '100 triệu', note: 'Đặt mua' },
      { milestone: 'Ký HĐMB', percentage: '15%', note: 'Sau 15 ngày' }
    ],
    distributionSources: [
      { distributorId: 'DIST-ERA', distributorName: 'ERA Vietnam', price: '6,45 tỷ', status: 'Còn hàng', updatedAt: '8 phút trước' }
    ],
    source: 'CapitaLand F1 Agency',
    distributor: 'ERA Vietnam',
    updatedAt: '8 phút trước'
  },
  {
    id: 'UNIT-LUMI-L3-2801',
    projectId: 'PROJ-LUMI',
    projectName: 'Lumi Hanoi',
    phaseId: 'PHASE-LUMI-2',
    phaseName: 'Phase 2 - Lumi Prestige',
    buildingId: 'BLD-LUMI-3',
    buildingName: 'Lumi 3',
    unitCode: 'L3.2801',
    floor: 28,
    unitType: 'Penthouse',
    area: 215.0,
    bedrooms: 4,
    bathrooms: 4,
    doorDirection: 'Tây',
    balconyDirection: 'Đông Nam & Đông Bắc (2 mặt thoáng)',
    view: 'Sky View Panorama 360 độ toàn cảnh phía Tây và Trung tâm Hà Nội',
    totalPrice: '26,5 tỷ',
    priceValueNumber: 26.5,
    pricePerM2: '123,2 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Gói nội thất đặc quyền Bespoke Luxury 500 triệu',
      '1 chỗ đỗ ô tô định danh trọn đời',
      'Hỗ trợ lãi suất 0% trong 30 tháng'
    ],
    paymentSchedule: [
      { milestone: 'Thỏa thuận đặt cọc', percentage: '500 triệu', note: 'Lock căn Penthouse' },
      { milestone: 'Đợt 1', percentage: '20%', note: 'Ký hợp đồng trực tiếp CĐT' }
    ],
    distributionSources: [
      { distributorId: 'DIST-CBRE', distributorName: 'CBRE Premier', price: '26,5 tỷ', status: 'Còn hàng', updatedAt: '5 phút trước' }
    ],
    source: 'CapitaLand VIP Channel',
    distributor: 'CBRE Premier',
    updatedAt: '5 phút trước'
  },

  // ------------------ HERITAGE WEST LAKE UNITS ------------------
  {
    id: 'UNIT-HERITAGE-H1-1602',
    projectId: 'PROJ-HERITAGE',
    projectName: 'Heritage West Lake',
    phaseId: 'PHASE-HERITAGE-1',
    phaseName: 'Tháp Căn Hộ Hạng Sang',
    buildingId: 'BLD-HERITAGE-1',
    buildingName: 'Tháp Heritage',
    unitCode: 'H1.1602',
    floor: 16,
    unitType: '3PN',
    area: 145.0,
    bedrooms: 3,
    bathrooms: 3,
    doorDirection: 'Tây Bắc',
    balconyDirection: 'Đông Nam',
    view: 'Trực diện mặt nước Hồ Tây 500ha & Bán đảo Quảng An',
    totalPrice: '22,8 tỷ',
    priceValueNumber: 22.8,
    pricePerM2: '157,2 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Nhận nhà ở ngay, thanh toán 50% nhận nhà',
      'Sảnh thang máy riêng độc bản (Private Lift Lobby)',
      'Miễn phí quản lý vận hành The Ascott 3 năm'
    ],
    paymentSchedule: [
      { milestone: 'Đặt cọc', percentage: '200 triệu', note: 'Ký cọc thiện chí' },
      { milestone: 'Đợt 1', percentage: '30%', note: 'Ký HĐMB' },
      { milestone: 'Đợt 2 (Nhận nhà)', percentage: '65%', note: 'Tháng 11/2024' },
      { milestone: 'Nhận sổ đỏ', percentage: '5%', note: 'Bàn giao sổ hồng lâu dài' }
    ],
    distributionSources: [
      { distributorId: 'DIST-SAVILLS', distributorName: 'Savills Vietnam', price: '22,8 tỷ', status: 'Còn hàng', updatedAt: '25 phút trước' }
    ],
    source: 'CapitaLand Ultra-Luxury Pool',
    distributor: 'Savills Vietnam',
    updatedAt: '25 phút trước'
  },
  {
    id: 'UNIT-HERITAGE-H1-0901',
    projectId: 'PROJ-HERITAGE',
    projectName: 'Heritage West Lake',
    phaseId: 'PHASE-HERITAGE-1',
    phaseName: 'Tháp Căn Hộ Hạng Sang',
    buildingId: 'BLD-HERITAGE-1',
    buildingName: 'Tháp Heritage',
    unitCode: 'H1.0901',
    floor: 9,
    unitType: '2PN',
    area: 94.0,
    bedrooms: 2,
    bathrooms: 2,
    doorDirection: 'Tây',
    balconyDirection: 'Đông',
    view: 'Hồ Tây & Lotte Mall Tây Hồ',
    totalPrice: '14,8 tỷ',
    priceValueNumber: 14.8,
    pricePerM2: '157,4 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Thanh toán sớm chiết khấu 6%',
      'Tặng gói nội thất Gessi & Poggenpohl nhập khẩu Đức trị giá 300 triệu'
    ],
    paymentSchedule: [
      { milestone: 'Đặt cọc', percentage: '200 triệu', note: 'Giữ căn' },
      { milestone: 'Nhận bàn giao', percentage: '95%', note: 'Q4/2024' }
    ],
    distributionSources: [
      { distributorId: 'DIST-CBRE', distributorName: 'CBRE Residential', price: '14,8 tỷ', status: 'Còn hàng', updatedAt: '40 phút trước' }
    ],
    source: 'CBRE Distribution Network',
    distributor: 'CBRE Residential',
    updatedAt: '40 phút trước'
  },

  // ------------------ MASTERI WEST HEIGHTS UNITS ------------------
  {
    id: 'UNIT-MASTERI-WB-1506',
    projectId: 'PROJ-MASTERI-WEST',
    projectName: 'Masteri West Heights',
    phaseId: 'PHASE-MASTERI-1',
    phaseName: 'Phân khu West A & West B',
    buildingId: 'BLD-MASTERI-WB',
    buildingName: 'Tòa West B',
    unitCode: 'WB.1506',
    floor: 15,
    unitType: '2PN',
    area: 62.0,
    bedrooms: 2,
    bathrooms: 2,
    doorDirection: 'Tây Bắc',
    balconyDirection: 'Đông Nam',
    view: 'Trực diện hồ điều hòa cát trắng 4.8ha và công viên trung tâm',
    totalPrice: '4,85 tỷ',
    priceValueNumber: 4.85,
    pricePerM2: '78,2 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Thanh toán 20% nhận nhà ngay',
      'Hỗ trợ lãi suất 0% tới 18 tháng tiếp theo',
      'Miễn phí 3 năm phí dịch vụ quản lý Masterise Property Management'
    ],
    paymentSchedule: [
      { milestone: 'Đặt cọc', percentage: '50 triệu', note: 'Ký thỏa thuận giữ căn' },
      { milestone: 'Thanh toán đợt 1', percentage: '20%', note: 'Nhận bàn giao nhà ở ngay' },
      { milestone: 'Ngân hàng giải ngân', percentage: '75%', note: 'Ân hạn gốc lãi 0%' },
      { milestone: 'Nhận sổ hồng', percentage: '5%', note: 'Khi có thông báo cấp sổ' }
    ],
    distributionSources: [
      { distributorId: 'DIST-DATXANH', distributorName: 'Đất Xanh Miền Bắc', price: '4,85 tỷ', status: 'Còn hàng', updatedAt: '12 phút trước' },
      { distributorId: 'DIST-CEN', distributorName: 'CenLand', price: '4,85 tỷ', status: 'Còn hàng', updatedAt: '45 phút trước' }
    ],
    source: 'Masterise Homes Official Primary Pool',
    distributor: 'Đất Xanh Miền Bắc',
    updatedAt: '12 phút trước'
  },
  {
    id: 'UNIT-MASTERI-WB-2208',
    projectId: 'PROJ-MASTERI-WEST',
    projectName: 'Masteri West Heights',
    phaseId: 'PHASE-MASTERI-1',
    phaseName: 'Phân khu West A & West B',
    buildingId: 'BLD-MASTERI-WB',
    buildingName: 'Tòa West B',
    unitCode: 'WB.2208',
    floor: 22,
    unitType: '1PN',
    area: 46.5,
    bedrooms: 1,
    bathrooms: 1,
    doorDirection: 'Đông Nam',
    balconyDirection: 'Tây Bắc',
    view: 'Nội khu resort & Bể bơi thác tràn phong cách Marriott',
    totalPrice: '3,55 tỷ',
    priceValueNumber: 3.55,
    pricePerM2: '76,3 tr/m²',
    status: 'Đã booking',
    layoutImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    paymentPolicies: [
      'Nhận nhà ở ngay, sẵn sàng cho chuyên gia thuê 15tr/tháng'
    ],
    paymentSchedule: [],
    distributionSources: [
      { distributorId: 'DIST-DATXANH', distributorName: 'Đất Xanh Miền Bắc', price: '3,55 tỷ', status: 'Đã booking', updatedAt: '2 giờ trước' }
    ],
    source: 'Đất Xanh Miền Bắc',
    distributor: 'Đất Xanh Miền Bắc',
    updatedAt: '2 giờ trước'
  },

  // ------------------ THE MATRIX ONE PHASE 2 UNITS ------------------
  {
    id: 'UNIT-MATRIX-T2-1402',
    projectId: 'PROJ-MATRIX-ONE',
    projectName: 'The Matrix One Phase 2',
    phaseId: 'PHASE-MATRIX-2',
    phaseName: 'Phase 2 Luxury Tower',
    buildingId: 'BLD-MATRIX-T2',
    buildingName: 'Tháp Matrix 2',
    unitCode: 'M2.1402',
    floor: 14,
    unitType: '2PN',
    area: 87.0,
    bedrooms: 2,
    bathrooms: 2,
    doorDirection: 'Tây Nam',
    balconyDirection: 'Đông Bắc',
    view: 'Trực diện Công viên hồ điều hòa Mễ Trì 14ha',
    totalPrice: '7,85 tỷ',
    priceValueNumber: 7.85,
    pricePerM2: '90,2 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Giai đoạn 1 chiết khấu booking thiện chí 2%',
      'Hỗ trợ vay 70% ân hạn nợ gốc đến khi nhận nhà',
      'Tặng gói thiết bị cao cấp Hafele & Bosch'
    ],
    paymentSchedule: [
      { milestone: 'Booking có hoàn lại', percentage: '100 triệu', note: 'Chọn vị trí ưu tiên đợt 1' },
      { milestone: 'Ký HĐMB', percentage: '15%', note: 'Dự kiến Q3/2024' }
    ],
    distributionSources: [
      { distributorId: 'DIST-CEN', distributorName: 'CenLand', price: '7,85 tỷ', status: 'Còn hàng', updatedAt: '18 phút trước' }
    ],
    source: 'MIK Group Primary Agency',
    distributor: 'CenLand',
    updatedAt: '18 phút trước'
  },

  // ------------------ VINHOMES OCEAN PARK 3 UNITS ------------------
  {
    id: 'UNIT-VINOCC3-PB-38',
    projectId: 'PROJ-VINOCC3',
    projectName: 'Vinhomes Ocean Park 3 – The Crown',
    phaseId: 'PHASE-VINOCC3-PB',
    phaseName: 'Phân khu Phố Biển',
    buildingId: 'BLD-VINOCC3-PB',
    buildingName: 'Dãy Phố Biển 08',
    unitCode: 'PB8-38',
    floor: 1, // Thấp tầng 5 tầng
    unitType: 'Duplex',
    area: 65.0, // Đất 65m2, xây dựng 240m2
    bedrooms: 4,
    bathrooms: 4,
    doorDirection: 'Đông Nam',
    balconyDirection: 'Tây Bắc',
    view: 'Công viên nội khu & Bể bơi phong cách nhiệt đới',
    totalPrice: '8,45 tỷ',
    priceValueNumber: 8.45,
    pricePerM2: '130,0 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
    viewSimulationUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    paymentPolicies: [
      'Hỗ trợ lãi suất 0% trong 24 tháng hoặc chiết khấu 10% thanh toán sớm',
      'Cam kết thuê lại 18 tháng từ VinHomes',
      'Tặng Voucher VinFast 200 triệu'
    ],
    paymentSchedule: [
      { milestone: 'Đặt cọc', percentage: '200 triệu', note: 'Ký thỏa thuận đặt cọc' },
      { milestone: 'Ký HĐMB', percentage: '15%', note: 'Nhận nhà hoàn thiện mặt ngoài' }
    ],
    distributionSources: [
      { distributorId: 'DIST-VIETSTAR', distributorName: 'Vietstarland', price: '8,45 tỷ', status: 'Còn hàng', updatedAt: '22 phút trước' }
    ],
    source: 'Vinhomes Master Agency',
    distributor: 'Vietstarland',
    updatedAt: '22 phút trước'
  },

  // ------------------ GRAND SUNLAKE UNITS ------------------
  {
    id: 'UNIT-SUNLAKE-A-1804',
    projectId: 'PROJ-GRAND-SUNLAKE',
    projectName: 'Grand SunLake Văn Quán',
    phaseId: 'PHASE-SUNLAKE-1',
    phaseName: 'Tòa Tháp A 45 Tầng',
    buildingId: 'BLD-SUNLAKE-A',
    buildingName: 'Tháp A',
    unitCode: 'A.1804',
    floor: 18,
    unitType: '2PN',
    area: 70.5,
    bedrooms: 2,
    bathrooms: 2,
    doorDirection: 'Tây Bắc',
    balconyDirection: 'Đông Nam',
    view: 'Trực diện hồ Văn Quán xanh mát',
    totalPrice: '3,85 tỷ',
    priceValueNumber: 3.85,
    pricePerM2: '54,6 tr/m²',
    status: 'Còn hàng',
    layoutImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
    // Deliberately no viewSimulationUrl to test empty fallback requirement!
    paymentPolicies: [
      'Chiết khấu thanh toán nhanh 7%',
      'Ngân hàng HD Bank hỗ trợ vay 70% lãi suất 0%'
    ],
    paymentSchedule: [
      { milestone: 'Đặt cọc', percentage: '50 triệu', note: 'Ký thỏa thuận đặt cọc' },
      { milestone: 'Nhận nhà', percentage: '95%', note: 'Bàn giao Q4/2024' }
    ],
    distributionSources: [
      { distributorId: 'DIST-EXIMRS', distributorName: 'EximRS', price: '3,85 tỷ', status: 'Còn hàng', updatedAt: '30 phút trước' }
    ],
    source: 'EximRS Distribution',
    distributor: 'EximRS',
    updatedAt: '30 phút trước'
  }
];
