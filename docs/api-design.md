# Thiết kế REST API và hợp đồng dữ liệu

## 1. Trạng thái

> Tài liệu này định nghĩa các quy ước và hợp đồng dữ liệu cho REST API của hệ thống.

- Trạng thái: **Proposed — chờ review**.
- Base path: `/api/v1`.
- Protocol: HTTPS, JSON UTF-8; Server-Sent Events (SSE - server gửi dữ liệu liên tục tới client) cho streaming AI.
- Source of truth (nguồn chân lý duy nhất) contract khi triển khai: `contracts/openapi.yaml`. File này chưa được tạo vì thiết kế chưa duyệt.
- Auth provider (nhà cung cấp dịch vụ xác thực), quyền guest (khách), role (vai trò) và rate limit (giới hạn tốc độ gọi API) cụ thể đang mở tại các open questions (câu hỏi đang mở): OQ-002, OQ-003, OQ-044.

### 1.1 Mapping với mock UI hiện tại

> Phần này trình bày bảng đối chiếu giữa code UI hiện tại và API contract mới.

Code hiện tại dùng convention (quy ước) khác với API contract đề xuất. Bảng dưới đây ghi nhận sự khác biệt cần migration (chuyển đổi):

| Đặc điểm | Mock UI hiện tại | API contract đề xuất | Ghi chú migration |
|---|---|---|---|
| ID format | Readable (`PROJ-LUMI`, `UNIT-LUMI-L1-1205`, `AUTH-01`) | UUID | Cần mapping table hoặc lookup khi chuyển đổi |
| Giá tiền | `price: string` ("6.85 tỷ") + `priceValueNumber: number` (billions) | `amountVnd: bigint` (VND integer) | Chuyển đổi: `priceValueNumber * 1_000_000_000` cho sale, `* 1_000_000` cho rent |
| Property type | Tiếng Việt (`'Căn hộ'`, `'Nhà riêng'`) | English lowercase (`apartment`, `townhouse`) | Cần taxonomy mapping table |
| Transaction kind | `mode: 'sale' \| 'rent' \| 'project'` | `transactionKind: 'sale' \| 'rent'`; project là resource riêng | `'project'` không phải transaction kind; tách sang `/projects` |
| Location | Flat: `district: string`, `city: string`, `address: string` | Nested: `location: { city: {id, name}, district: {id, name}, addressText }` | Restructure khi có geography API |
| Timestamp | `updatedAt: string` (display format) | `observedAt/publishedAt: RFC3339 UTC` | Parse và chuẩn hóa timezone |
| Version field | Không có | `version: integer` trên mọi mutable resource | Thêm khi implement backend |
| Booking request | `BookingPreviewRequest { customerName, customerPhone, distributor, saleAgentName }` | `{ customer: { name, phone, email }, offerId, expectedUnitVersion, consent }` | Restructure request body |
| Social post type | `postType: SocialPostType` (UPPERCASE: `'ANALYSIS'`, `'COMMUNITY'`) | `type` (lowercase: `analysis`, `community`) | Cần case transform |
| Saved items | Chỉ `savedListingIds: string[]` | `PUT /me/saved-items/{resourceKind}/{resourceId}` hỗ trợ listing/project/unit/post | Mở rộng scope |

## 2. Nguyên tắc contract

> Danh sách các nguyên tắc thiết kế API cốt lõi cần tuân thủ.

1. Thiết kế API theo tài nguyên (resource-oriented REST) cho read/mutation (đọc/ghi) nghiệp vụ. Tên endpoint đặt theo nghiệp vụ (ví dụ: `/listings`, `/projects`). Không đặt theo tên component UI (ví dụ: không dùng `/market-page`).
2. Client không gửi các thông tin như role, owner organization, verified status, price/freshness authority, hoặc calculated count để server tin tưởng. Server tự kiểm chứng các quyền này.
3. Tiền tệ (Money) luôn là số nguyên VND. Không dùng số thập phân hoặc số có ý nghĩa thay đổi lúc là “triệu”, lúc là “tỷ”.
4. Timestamp (dấu thời gian) sử dụng chuẩn RFC 3339 UTC. Response (phản hồi) sẽ có trường `observedAt/effectiveAt` riêng dành cho dữ liệu thị trường.
5. Danh sách sử dụng cursor pagination (phân trang bằng con trỏ). Filter (bộ lọc) và sort (sắp xếp) phải nằm trong danh sách cho phép (allowlist). API không nhận các câu lệnh SQL hoặc biểu thức filter tự do.
6. Mutation quan trọng hỗ trợ idempotency (gửi lại không bị lặp - đảm bảo kết quả không đổi khi gọi nhiều lần) và concurrency control (kiểm soát tương tranh - xử lý nhiều request cùng lúc).
7. Error (lỗi) trả về mã máy đọc được, kèm theo request ID và chi tiết các trường vi phạm (field violations). API tuyệt đối không để lộ stack trace, câu lệnh SQL hoặc provider secret (khóa bí mật của bên thứ ba).
8. AI trả về nguồn trích dẫn và có giới hạn rõ ràng. AI không được quyền gọi mutation thay mặt người dùng.
9. Versioning (quản lý phiên bản) với các thay đổi phá vỡ (breaking change) sẽ thực hiện qua `/v2` hoặc media type sau khi được review. Việc thêm trường mới (field additive) được coi là tương thích ngược.

## 3. Header và convention chung

> Quy định về các HTTP header tiêu chuẩn dùng chung cho toàn bộ API.

| Header | Hướng | Mục đích |
|---|---|---|
| `Authorization: Bearer <token>` | Request | Cơ chế đề xuất ở API boundary; IdP/token type chờ OQ-003 |
| `X-Request-Id` | Hai chiều | Client có thể gửi UUID hợp lệ; server luôn trả ID cuối dùng để truy vết |
| `Idempotency-Key` | Mutation request | Bắt buộc cho lead, booking, post/comment và tác vụ có side effect |
| `If-Match: "<version>"` | Update/delete | Optimistic concurrency cho resource mutable |
| `ETag` | Response | Version/cache validation |
| `Accept: text/event-stream` | SSE | Stream AI run |
| `Last-Event-ID` | SSE reconnect | Tiếp tục stream trong cửa sổ retention được duyệt |

`Accept-Language` có thể được hỗ trợ sau khi locale scope (phạm vi ngôn ngữ) được xác nhận. Dữ liệu gốc (canonical data) không lưu đơn vị hoặc định dạng theo locale cụ thể.

## 4. Envelope, pagination và lỗi

> Cấu trúc chung của mọi JSON response, bao gồm dữ liệu đơn, phân trang và báo lỗi.

### 4.1 Resource response

Resource đơn lẻ được trả về trực tiếp trong trường `data`. Metadata không được nhúng chung vào trong entity (thực thể):

```json
{
  "data": {
    "id": "a9a4b44e-2388-45bd-81a9-705832d2bfff",
    "version": 3
  },
  "meta": {
    "requestId": "01961d95-f680-755c-b7c8-96642dd93caf"
  }
}
```

### 4.2 Cursor page

```json
{
  "data": [],
  "page": {
    "nextCursor": null,
    "hasNext": false,
    "limit": 20
  },
  "meta": {
    "requestId": "01961d95-f680-755c-b7c8-96642dd93caf"
  }
}
```

- `limit` có giá trị mặc định và giá trị tối đa (default/max) sẽ được chốt sau OQ-044. Server sẽ cắt bớt (clamp) hoặc trả về lỗi xác thực (validation error) theo đúng hợp đồng.
- Giá trị `cursor` là chuỗi mã hóa (opaque). Client không cần (và không nên) giải mã chuỗi này. Cursor được gắn với bộ lọc và sắp xếp hiện tại.
- API không trả về tổng số lượng (tổng số bản ghi) theo mặc định vì việc đếm số lượng lớn tốn nhiều chi phí. Endpoint chỉ trả về tổng số lượng khi UI thật sự cần và ngữ nghĩa rõ ràng.

### 4.3 Error

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Dữ liệu gửi lên chưa hợp lệ.",
    "requestId": "01961d95-f680-755c-b7c8-96642dd93caf",
    "details": [
      {
        "field": "phone",
        "reason": "INVALID_PHONE_FORMAT"
      }
    ]
  }
}
```

| HTTP | Mã tiêu biểu | Khi dùng |
|---:|---|---|
| 400 | `INVALID_REQUEST`, `INVALID_CURSOR` | JSON/query không đọc được |
| 401 | `AUTHENTICATION_REQUIRED`, `TOKEN_INVALID` | Chưa/không xác thực |
| 403 | `ACCESS_DENIED`, `CONSENT_REQUIRED` | Không có quyền/chưa consent |
| 404 | `RESOURCE_NOT_FOUND` | Không tồn tại hoặc cần che giấu sự tồn tại |
| 409 | `RESOURCE_STATE_CONFLICT`, `IDEMPOTENCY_CONFLICT` | Căn đã giữ, state/version/request hash xung đột |
| 412 | `VERSION_MISMATCH` | `If-Match` không khớp nếu convention chọn 412 |
| 422 | `VALIDATION_FAILED`, `MODERATION_REJECTED` | Semantics không hợp lệ |
| 429 | `RATE_LIMITED`, `AI_QUOTA_EXCEEDED` | Quota/rate limit |
| 502/503 | `UPSTREAM_UNAVAILABLE`, `AI_PROVIDER_UNAVAILABLE` | Dependency lỗi; có `retryable` khi phù hợp |

Không trả về lỗi mã 200 kèm theo `success: false`.

## 5. Quyền truy cập

> Quy định về phân quyền truy cập cho từng loại endpoint.

Bảng endpoint bên dưới dùng các ký hiệu: **Public candidate** (Có thể công khai), **Authenticated** (Đã đăng nhập), **Privileged/Partner** (Đặc quyền/Đối tác). Chỉ mức “Authenticated” cho mutation cá nhân là đề xuất tối thiểu. Thiết kế này chưa thay thế ma trận quyền chi tiết (cần trả lời tại các OQ-002, OQ-003, OQ-004, OQ-036).

- Quyền đọc công khai (Public read) phải áp dụng các quy tắc về khả năng hiển thị (visibility), trạng thái xuất bản (publication status) và ẩn các trường nhạy cảm (field redaction).
- Endpoint `/me/*` lấy thông tin user từ token. API không nhận `userId` từ query hoặc body.
- Resource thuộc một tổ chức (organization) phải được kiểm tra tư cách thành viên (membership) và vai trò (role) từ phía server.
- API cho Admin/moderation/data-operation không được thiết kế cho đến khi OQ-006, OQ-037 được duyệt.

## 6. Geography, listing và market

> Các API liên quan đến vị trí địa lý, danh sách bất động sản và thông tin thị trường.

### 6.1 Endpoint catalog/read

| Method | Path | Mục đích | Quyền ứng viên |
|---|---|---|---|
| GET | `/cities` | Thành phố được hỗ trợ | Public candidate |
| GET | `/cities/{cityId}/districts` | Quận/huyện theo thành phố | Public candidate |
| GET | `/listings` | Filter/sort/paginate tin bán/thuê | Public candidate |
| GET | `/listings/{listingId}` | Chi tiết tin, media, provenance | Public candidate |
| GET | `/market/price-observations` | Dữ liệu giá theo geography/property/metric/time | Public candidate |
| GET | `/market/updates` | “Thị trường hôm nay” đã publish | Public candidate |
| GET | `/articles` | Tin/news/risk content | Public candidate |
| GET | `/articles/{articleId}` | Nội dung/metadata/source | Public candidate |

### 6.2 Listing query

```http
GET /api/v1/listings?transactionKind=sale&cityId=<uuid>&districtId=<uuid>&propertyType=apartment&minPriceAmountVnd=5000000000&maxPriceAmountVnd=9000000000&minAreaSqm=60&bedroomCount=2&sort=publishedAt.desc&limit=20&cursor=<opaque>
```

Filter candidate quan sát từ UI:

- `transactionKind`: `sale|rent`.
- `cityId`, `districtId`, `projectId`.
- `propertyType`, `min/maxPriceAmountVnd`, `min/maxAreaSqm`.
- `bedroomCount`, filter cho hướng (direction), nội thất (furnishing), và pháp lý (legal) khi taxonomy (hệ thống phân loại) được duyệt.
- Dùng tham số `query` cho tìm kiếm từ khóa toàn văn (keyword full-text). Việc hiểu ngôn ngữ tự nhiên (NL interpretation) sẽ dùng endpoint riêng.
- Các kiểu sắp xếp cho phép (sort allowlist) cần bộ phận sản phẩm (product) xác nhận: mới nhất (newest), giá tăng/giảm (price asc/desc), diện tích (area), độ phù hợp (relevance).

### 6.3 Listing response ví dụ

```json
{
  "data": [
    {
      "id": "d2a95c6e-5752-4452-849e-420acb0c04af",
      "transactionKind": "sale",
      "propertyType": "apartment",
      "title": "Căn hộ 2 phòng ngủ",
      "price": {
        "amountVnd": 6800000000,
        "displayHint": null
      },
      "areaSqm": "72.5",
      "bedroomCount": 2,
      "bathroomCount": 2,
      "location": {
        "city": {"id": "<uuid>", "name": "Hà Nội"},
        "district": {"id": "<uuid>", "name": "Tây Hồ"},
        "addressText": "Địa chỉ đã được phép công khai"
      },
      "project": {
        "id": "<uuid>",
        "name": "Tên dự án chuẩn"
      },
      "coverMedia": {
        "url": "https://cdn.example.invalid/media/signed-or-public-key",
        "alt": "Căn hộ 2 phòng ngủ"
      },
      "verificationStatus": "unverified",
      "observedAt": "2026-08-29T03:00:00Z",
      "publishedAt": "2026-08-28T07:15:00Z",
      "saved": false,
      "interested": false,
      "version": 3
    }
  ],
  "page": {"nextCursor": null, "hasNext": false, "limit": 20},
  "meta": {"requestId": "<uuid>"}
}
```

Trường `displayHint` không được dùng làm nguồn để tính toán. Trạng thái `saved/interested` chỉ xuất hiện khi có ngữ cảnh người dùng (identity context) hoặc trả về `false/null` theo convention được duyệt.

Các field có trong UI listing type nhưng chưa liệt kê trong response:

- `furnitureStatus` / `furnishingCode`: trạng thái nội thất.
- `balconyDirection`: hướng ban công, bổ sung cho `direction`.
- `view`: tầm nhìn (hồ, sông, thành phố...).
- `rentalYield`: tỷ suất cho thuê (chỉ listing sale).
- `infrastructure`: hạ tầng xung quanh.
- `amenities`: tiện ích nội khu.

Các field này sẽ được thêm vào listing detail response khi taxonomy được duyệt.

### 6.4 Natural-language market search

`POST /search/market`

Request:

```json
{
  "query": "Căn 2 phòng ngủ ở Tây Hồ dưới 9 tỷ, ưu tiên gần hồ",
  "cityId": "<uuid>",
  "resourceKinds": ["listing"],
  "limit": 20,
  "cursor": null
}
```

Response:

```json
{
  "data": {
    "interpretation": {
      "transactionKind": "sale",
      "districtIds": ["<uuid>"],
      "bedroomCount": 2,
      "maxPriceAmountVnd": 9000000000,
      "preferences": ["near_lake"],
      "unresolvedTerms": []
    },
    "results": [],
    "grounding": {
      "usedAiInterpretation": true,
      "warnings": []
    }
  },
  "page": {"nextCursor": null, "hasNext": false, "limit": 20},
  "meta": {"requestId": "<uuid>"}
}
```

Backend sẽ xác thực diễn giải (validate interpretation) dựa theo schema/allowlist. Sau đó backend sẽ chạy query một cách tất định (deterministic). Client hiển thị các bộ lọc đã áp dụng (applied filters) để người dùng có thể chỉnh sửa lại.

## 7. Dự án và inventory

> Quản lý danh sách dự án và quỹ căn hộ (inventory).

| Method | Path | Mục đích |
|---|---|---|
| GET | `/projects` | Search/filter/paginate dự án |
| GET | `/projects/{projectId}` | Overview + summary; section lớn có thể tải riêng |
| GET | `/projects/{projectId}/legal-documents` | Pháp lý có source/verification |
| GET | `/projects/{projectId}/progress-events` | Tiến độ theo thời gian |
| GET | `/projects/{projectId}/price-observations` | Lịch sử giá |
| GET | `/projects/{projectId}/units` | Master Pool filter/sort/cursor |
| GET | `/units/{unitId}` | Chi tiết căn và offers hiện hành |
| GET | `/units/{unitId}/availability` | Snapshot trạng thái/freshness nhẹ; không tạo hold |

Query inventory candidate:

```http
GET /api/v1/projects/{projectId}/units?phaseId=<uuid>&buildingId=<uuid>&unitType=2-bedroom&direction=southeast&status=available&sort=price.asc&limit=30
```

Response unit phải có:

- Thông tin định danh và phân cấp chuẩn xác (canonical identity/hierarchy).
- Các thuộc tính vật lý (physical attributes).
- Thông tin về tình trạng phòng như `availability.status`, `observedAt`, `stale` (đã cũ). Các trường này cần gắn với nhãn nguồn/độ tin cậy (source/authority label) phù hợp.
- Danh sách chào bán (offer list) theo nhà phân phối, giá VND, thời hạn và độ mới của dữ liệu nguồn (source freshness).
- Trường `version` được dùng khi tạo yêu cầu đặt giữ chỗ (booking request).

Không gọi dữ liệu này là dữ liệu thời gian thực (realtime) trước khi OQ-009 xác định mức cam kết dịch vụ (SLA).

## 8. Saved và interest

> API lưu trữ và quản lý mức độ quan tâm của người dùng đối với các mục.

| Method | Path | Hành vi |
|---|---|---|
| GET | `/me/saved-items` | Cursor page; filter `resourceKind` |
| PUT | `/me/saved-items/{resourceKind}/{resourceId}` | Idempotent save; 200/201 theo tồn tại |
| DELETE | `/me/saved-items/{resourceKind}/{resourceId}` | Idempotent unsave; 204 kể cả đã bỏ lưu theo convention |
| GET | `/me/interests` | Danh sách tín hiệu quan tâm nếu semantics được duyệt |
| PUT | `/me/interests/{resourceKind}/{resourceId}` | Idempotent mark interested |
| DELETE | `/me/interests/{resourceKind}/{resourceId}` | Bỏ quan tâm |

Danh sách `resourceKind` được cho phép (allowlist): `listing`, `project`, `unit`, `post`. API sẽ ánh xạ khóa này sang khóa ngoại (FK) một cách chặt chẽ. Không dùng trực tiếp biến này làm tên bảng hoặc thực thi câu query tùy ý. Chức năng `saved` (đã lưu) và `interest` (quan tâm) chưa được hợp nhất (đang chờ OQ-023).

## 9. Consultation/lead

> API gửi yêu cầu tư vấn và quản lý khách hàng tiềm năng.

### `POST /consultation-requests`

Yêu cầu phải có `Idempotency-Key`.

```json
{
  "target": {
    "kind": "listing",
    "id": "d2a95c6e-5752-4452-849e-420acb0c04af"
  },
  "topics": ["price", "legal", "site_visit"],
  "contact": {
    "name": "Nguyễn A",
    "phone": "+84901234567"
  },
  "note": "Xin liên hệ trong giờ hành chính.",
  "consent": {
    "policyVersion": "lead-contact-v1",
    "granted": true
  },
  "sourceSurface": "listing-detail"
}
```

Response `201 Created` sẽ trả về ID, `status: submitted`, và `submittedAt`. Server không tự trả lời thông báo “sẽ liên hệ trong 15 phút” nếu SLA này chưa được duyệt. Client không được quyền chọn người phụ trách.

| Method | Path | Mục đích |
|---|---|---|
| GET | `/consultation-requests/{id}` | Người gửi xem trạng thái nếu product cho phép |
| POST | `/consultation-requests/{id}/cancel` | Chỉ thêm khi OQ về hủy được duyệt |

Các endpoint phục vụ phân công công việc (assignment), CRM hoặc nội bộ (internal) sẽ bị hoãn đến khi OQ-021 và OQ-047 được giải quyết.

## 10. Booking/hold

> API xử lý nghiệp vụ đặt chỗ và giữ chỗ căn hộ.

### `POST /units/{unitId}/booking-requests`

Yêu cầu gửi `Authorization` (token xác thực) theo chính sách và `Idempotency-Key`. Trường `expectedUnitVersion` giúp phát hiện nếu UI đang hiển thị dữ liệu cũ. Tuy nhiên, server vẫn sẽ kiểm tra lại trạng thái thực tế trong transaction.

```json
{
  "expectedUnitVersion": 14,
  "offerId": "a275932a-dfd4-4e36-8cca-2b7f7e9fc61a",
  "customer": {
    "name": "Nguyễn A",
    "phone": "+84901234567",
    "email": "a@example.com"
  },
  "note": "Cần xác nhận chính sách thanh toán.",
  "consent": {
    "policyVersion": "booking-contact-v1",
    "granted": true
  },
  "sourceSurface": "unit-detail"
}
```

Trường `email` hiện đang để cho phép rỗng (nullable) trong đề xuất vì UI và kiểu dữ liệu chưa thống nhất. Vấn đề này tại OQ-022 phải được chốt trước khi xuất file OpenAPI.

Response khi chỉ tạo request:

```json
{
  "data": {
    "id": "55b0274c-7123-4e0d-940e-7115ad80c11b",
    "unitId": "<uuid>",
    "status": "pending_verification",
    "hold": null,
    "submittedAt": "2026-08-29T03:15:00Z",
    "version": 1
  },
  "meta": {"requestId": "<uuid>"}
}
```

Nếu bộ phận product xác nhận việc tạo giữ chỗ (hold) ngay lập tức, object `hold` sẽ có `id`, `status`, `startsAt`, và `expiresAt`. Server quyết định thời hạn này. Client không gửi tham số `expiresAt`.

| Method | Path | Mục đích |
|---|---|---|
| GET | `/booking-requests/{id}` | Xem trạng thái theo quyền |
| POST | `/booking-requests/{id}/cancel` | Hủy theo state machine, `If-Match` + Idempotency-Key |

Lỗi xung đột `409 RESOURCE_STATE_CONFLICT` sẽ trả về thông tin `currentAvailability` (tình trạng hiện tại, đã được che bớt dữ liệu) và thời điểm ghi nhận `observedAt`. API không để lộ thông tin của người đang giữ chỗ hiện tại. Các endpoint liên quan đến thanh toán (payment), xác minh danh tính (KYC), hoặc chữ ký điện tử (e-sign) chưa thuộc phạm vi thiết kế này.

## 11. Conversation và AI streaming

> Giao tiếp với AI chatbot và stream kết quả liên tục.

| Method | Path | Mục đích |
|---|---|---|
| POST | `/conversations` | Tạo hội thoại |
| GET | `/conversations` | Search/cursor/group ở client theo timestamp |
| GET | `/conversations/{id}` | Metadata hội thoại |
| PATCH | `/conversations/{id}` | Đổi tên, `If-Match` |
| DELETE | `/conversations/{id}` | Xóa/ẩn theo retention policy |
| GET | `/conversations/{id}/messages` | Cursor theo sequence/time |
| POST | `/conversations/{id}/messages` | Ghi user message và khởi tạo AI run; yêu cầu `Idempotency-Key` để retry không nhân đôi turn |
| GET | `/ai-runs/{runId}/events` | SSE stream/reconnect |
| POST | `/ai-runs/{runId}/cancel` | Best-effort cancel |
| POST | `/ai/evaluations` | Đánh giá/so sánh resource, không mutation resource |

### Tạo message/run

```json
{
  "content": {
    "type": "text",
    "text": "So sánh hai căn đã lưu theo ngân sách và pháp lý."
  },
  "contexts": [
    {"kind": "listing", "id": "<uuid>"},
    {"kind": "listing", "id": "<uuid>"}
  ],
  "stream": true
}
```

Response `202 Accepted`:

```json
{
  "data": {
    "userMessageId": "<uuid>",
    "assistantMessageId": "<uuid>",
    "runId": "<uuid>",
    "status": "queued",
    "eventsUrl": "/api/v1/ai-runs/<uuid>/events"
  },
  "meta": {"requestId": "<uuid>"}
}
```

### SSE contract

Mỗi sự kiện (event) có `id`, tên `event`, và dữ liệu JSON `data`. Heartbeat (tín hiệu giữ kết nối) là comment trong SSE. Các event mẫu (candidate):

```text
id: 1
event: run.status
data: {"status":"running"}

id: 2
event: answer.delta
data: {"text":"Dựa trên dữ liệu cập nhật..."}

id: 3
event: citation.added
data: {"citation":{"id":"c1","sourceType":"listing","sourceId":"<uuid>","title":"Căn hộ 2 phòng ngủ","observedAt":"2026-08-29T03:00:00Z"}}

id: 4
event: answer.completed
data: {"messageId":"<uuid>","finishReason":"stop","warnings":["AI-generated; verify critical information"]}
```

Các sự kiện liên quan đến công cụ (tool) và hệ thống nội bộ tuyệt đối không để lộ câu lệnh nhắc (prompt), luồng suy luận (chain-of-thought) hoặc thông tin xác thực (credential). Chính sách kết nối lại (reconnect) và lưu trữ (retention) cụ thể chờ SLO. Khi stream không còn hoạt động, client sử dụng GET để lấy messages và trạng thái run.

### AI evaluation request

```json
{
  "useCase": "compare",
  "targets": [
    {"kind": "listing", "id": "<uuid>"},
    {"kind": "unit", "id": "<uuid>"}
  ],
  "criteria": ["budget", "location", "legal", "freshness"],
  "userPreferences": {
    "budgetMaxAmountVnd": 9000000000
  }
}
```

Tiêu chí (criteria) và điểm số (score) chỉ được bật sau khi chốt OQ-018 và OQ-029. Response có `algorithmVersion`, bằng chứng hoặc trích dẫn (evidence/citations), các thông tin chưa rõ (unknowns) và tuyên bố từ chối trách nhiệm (disclaimer).

Quy trình đánh giá (Evaluation) dùng chung vòng đời (lifecycle) với `ai_runs`. Với thiết lập `stream: true`, endpoint trả về HTTP `202` bao gồm `runId` và `eventsUrl`. Nếu use case được cấu hình xử lý đồng bộ và hoàn tất kịp trong thời gian request deadline, server có thể trả về HTTP `200` với kết quả đầy đủ. Một chế độ contract (contract mode) cố định phải được chốt trong OpenAPI cho từng use case. Server không được phép thay đổi ngẫu nhiên kiểu trả về theo độ trễ (latency).

## 12. Social

> Tính năng mạng xã hội, bảng tin và tương tác người dùng.

### 12.1 Read/feed

| Method | Path | Mục đích |
|---|---|---|
| GET | `/social/feed?mode=for-you|latest|following` | Feed cursor; mode semantics chờ OQ-038 |
| GET | `/social/posts/{postId}` | Chi tiết bài và target/source |
| GET | `/social/posts/{postId}/comments` | Comment page/thread theo policy |
| GET | `/social/authors/{authorId}` | Hồ sơ public |
| GET | `/social/authors/{authorId}/posts` | Bài public của tác giả |
| GET | `/social/trending-topics` | Trending có window/definition cần xác nhận |

### 12.2 Tạo bài

`POST /social/posts`, bắt buộc có xác thực (auth) và `Idempotency-Key`. Quyền truy cập tuân theo OQ-036.

```json
{
  "type": "analysis",
  "title": "Diễn biến giá khu vực",
  "body": "Nội dung phân tích của tác giả.",
  "target": {"kind": "project", "id": "<uuid>"},
  "mediaAssetIds": ["<uuid>"],
  "sources": [
    {
      "url": "https://publisher.example.invalid/article",
      "title": "Nguồn tham khảo",
      "publishedAt": "2026-08-28T00:00:00Z"
    }
  ]
}
```

Response trả về trạng thái thật (như `draft`, `pending_review`, `published`). API không luôn giả định là bài viết sẽ được xuất bản (publish) ngay lập tức. Client không gửi các trường như `verified`, `authorRole`, bộ đếm (counters) hoặc số liệu thị trường (market metrics) mà không có nguồn.

| Method | Path | Mục đích |
|---|---|---|
| PATCH | `/social/posts/{postId}` | Sửa theo state/owner, `If-Match` |
| DELETE | `/social/posts/{postId}` | Xóa/ẩn theo policy |
| PUT/DELETE | `/social/posts/{postId}/reaction` | Like/reaction idempotent |
| POST | `/social/posts/{postId}/comments` | Tạo comment, idempotency/moderation |
| PATCH/DELETE | `/social/comments/{commentId}` | Chỉ thêm sau OQ-039 |
| PUT/DELETE | `/social/comments/{commentId}/reaction` | Tương tác comment |
| PUT/DELETE | `/social/authors/{authorId}/follow` | Follow idempotent |
| POST | `/social/posts/{postId}/shares` | Ghi share event theo definition OQ-041 |

Các endpoint về báo cáo (report), chặn (block), và khiếu nại (appeal) sẽ bị hoãn cho đến khi chính sách tại OQ-037 được duyệt. Trước khi lên môi trường production, không được bỏ qua quyết định này.

### 12.3 Social AI search

`POST /search/social`

```json
{
  "query": "Các ý kiến gần đây về pháp lý dự án X",
  "cityId": "<uuid>",
  "publishedAfter": "2026-07-01T00:00:00Z",
  "limit": 20
}
```

Response gồm:

- Phần `summary` (tóm tắt) kèm theo các citation ID.
- Phần `highlights` (điểm nhấn) được gắn với nguồn cụ thể.
- Danh sách `results.posts/projects/listings/authors` phải được phân trang hoặc giới hạn số lượng rõ ràng.
- Biến `sourceMix`/warning giúp phân biệt nội dung chính quy (canonical), nội dung đã được xác minh (verified) và nội dung do người dùng tạo (UGC - User Generated Content).
- Cần trả về trạng thái không đủ dữ kiện (`insufficientEvidence`) thay vì luôn luôn trả kết quả dự phòng (fallback) như mock hiện tại.

## 13. Media

> Quy trình tải lên và xử lý các tập tin đa phương tiện.

Luồng đề xuất:

1. Client gọi `POST /media/uploads` với các thông tin: tên file (filename), kiểu nội dung khai báo (declared MIME), kích thước (size), mã kiểm tra (checksum) và mục đích sử dụng (purpose).
2. Server kiểm tra quyền và hạn mức (quota). Server trả về ID tài sản (`mediaAssetId`), URL upload tạm thời có chữ ký (signed upload URL), các header được phép, và thời gian hết hạn (expiry).
3. Client thực hiện upload file trực tiếp lên kho lưu trữ đối tượng (object storage).
4. Client gọi `POST /media/uploads/{mediaAssetId}/complete` để xác nhận checksum sau khi upload.
5. Hệ thống worker chạy ngầm để quét virus, kiểm tra (inspect) hoặc chuyển đổi định dạng (transform). Client gọi `GET /media/{id}` để cập nhật trạng thái.
6. Các bài viết (post) hoặc tin đăng (listing) chỉ được tham chiếu đến các media đang ở trạng thái cho phép.

Giới hạn (Limit), loại file (type), xử lý chuyển đổi video (video transcode), và chống dẫn link trực tiếp (hotlink) đang chờ OQ-031 và OQ-040. Tuyệt đối không đưa API upload lên production trước khi có chính sách rõ ràng.

## 14. Notification

> Hệ thống thông báo và tuỳ chọn nhận thông báo.

| Method | Path | Mục đích |
|---|---|---|
| GET | `/me/notifications` | Cursor page, filter unread/type |
| POST | `/me/notifications/{id}/read` | Idempotent mark read |
| POST | `/me/notifications/read-all` | Idempotent với cutoff timestamp do server trả/nhận |
| GET/PATCH | `/me/notification-preferences` | Chỉ khi channel/preference OQ-025/OQ-054 được duyệt |

Không mở endpoint cho phép client tự gửi thông báo trực tiếp tới user khác.

## 15. Partner webhook và ingestion

> Nhận dữ liệu từ đối tác qua webhook.

Candidate endpoint: `POST /webhooks/inventory/{sourceKey}`.

- Hệ thống phải xác minh chữ ký, timestamp và thời gian hợp lệ (replay window) của webhook.
- Sử dụng ID của sự kiện hoặc lô (external event/batch ID) làm khóa idempotency.
- Chỉ thực hiện kiểm tra sơ bộ gói tin (validate envelope nhẹ), ghi nhận yêu cầu (ghi receipt/job) và trả về HTTP `202`. Server không xử lý đồng bộ các lô dữ liệu lớn (batch lớn).
- Không trả về chi tiết các dữ liệu chuẩn (canonical) hoặc thông tin giỏ hàng riêng tư (private inventory) trong nội dung phản hồi của webhook.
- Endpoint `GET /partner/v1/ingestion-receipts/{id}` chỉ được cung cấp nếu partner thật sự cần và có quyền xác thực (auth) riêng biệt.
- Lược đồ dữ liệu (schema/version), cơ chế thử lại (retry) và báo cáo lỗi (error report) đang chờ thỏa thuận từ nguồn cung cấp (OQ-008 và OQ-009).

## 16. Rate limit, cache và reliability semantics

> Các quy ước về giới hạn truy cập, bộ nhớ đệm và tính ổn định.

- Khóa giới hạn (Rate-limit key) là tổ hợp phù hợp giữa người dùng (user), thiết bị (client), nguồn (source), và rủi ro IP (IP risk). Không chỉ dựa vào duy nhất IP. Con số giới hạn cụ thể chờ kết quả kiểm thử tải và mô hình phát hiện lạm dụng (abuse model).
- Header `Retry-After` (thử lại sau) sẽ được trả về kèm mã lỗi 429 hoặc 503 khi server xác định được thời điểm phù hợp.
- Yêu cầu GET công khai (GET public) có hỗ trợ `ETag` và `Cache-Control`. Các response chứa dữ liệu đặc thù của người dùng (user-specific field) không được phép lưu cache ở mức công khai (public).
- Phía client không được tự động thử lại (retry) các request dạng mutation nếu không có idempotency key.
- Timeout của API phải ngắn hơn timeout của hệ thống phía sau (upstream). Các tác vụ chạy lâu phải được chuyển thành job chạy ngầm.
- Phản hồi HTTP `202` chỉ có nghĩa là yêu cầu đã được nhận hoặc đang chờ xử lý. Nó không có nghĩa là nghiệp vụ cuối cùng đã thành công.

## 17. Contract review checklist

> Danh sách kiểm tra trước khi hoàn thiện và phê duyệt API contract.

- [ ] Các OQ độ ưu tiên cao (P0) về xác thực (auth), vai trò (role), tổ chức (tenant) và người dùng khách (guest) đã được chốt.
- [ ] Phân loại (Taxonomy), trạng thái (status), giá (price), độ tươi của dữ liệu (freshness) và định danh chuẩn (canonical ID) đã được duyệt.
- [ ] So sánh booking request với hold thật, email và trạng thái hủy (cancel state) đã được duyệt.
- [ ] Quyền đăng bài (post), bình luận (comment) và kiểm duyệt (moderation) đã được duyệt.
- [ ] Nguồn AI (AI source), thông tin nhận dạng cá nhân (PII), trích dẫn (citation) và tiêu chí (criteria) đã được duyệt.
- [ ] Phân trang (Pagination), giới hạn (limit), sắp xếp (sort), deep link và nội dung báo lỗi (error copy) đã được team frontend review.
- [ ] OpenAPI examples bao gồm đầy đủ các trường hợp: thành công (success), lỗi (error), xung đột (conflict), dữ liệu cũ (stale), dữ liệu trống (empty) và đã có contract test.
- [ ] Đảm bảo không có các endpoint về thanh toán (payment), quản trị viên (admin), chuyển giọng nói thành văn bản (STT) hoặc văn bản thành giọng nói (TTS) bị thêm vào khi chưa có yêu cầu chính thức.
