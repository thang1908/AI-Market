# Thiết kế REST API và hợp đồng dữ liệu

## 1. Trạng thái

- Trạng thái: **Proposed — chờ review**.
- Base path: `/api/v1`.
- Protocol: HTTPS, JSON UTF-8; Server-Sent Events (SSE) cho streaming AI.
- Source of truth contract khi triển khai: `contracts/openapi.yaml`; file này chưa được tạo vì thiết kế chưa duyệt.
- Auth provider, quyền guest, role và rate limit cụ thể đang mở tại OQ-002/OQ-003/OQ-044.

### 1.1 Mapping với mock UI hiện tại

Code hiện tại dùng convention khác với API contract đề xuất. Bảng dưới đây ghi nhận sự khác biệt cần migration:

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

1. Resource-oriented REST cho read/mutation nghiệp vụ; không đưa tên component UI vào endpoint.
2. Client không gửi role, owner organization, verified status, price/freshness authority hoặc calculated count để server tin tưởng.
3. Money là số nguyên VND; không dùng số có ý nghĩa lúc là “triệu”, lúc là “tỷ”.
4. Timestamp là RFC 3339 UTC; response có `observedAt/effectiveAt` riêng cho dữ liệu thị trường.
5. List dùng cursor pagination; filter/sort được allowlist, không nhận SQL/filter expression tự do.
6. Mutation quan trọng hỗ trợ idempotency và concurrency control.
7. Error có mã máy đọc được, request ID và field violations; không lộ stack/SQL/provider secret.
8. AI trả nguồn và giới hạn; AI không gọi mutation thay người dùng.
9. Versioning breaking change qua `/v2` hoặc media type sau review; field additive là tương thích ngược.

## 3. Header và convention chung

| Header | Hướng | Mục đích |
|---|---|---|
| `Authorization: Bearer <token>` | Request | Cơ chế đề xuất ở API boundary; IdP/token type chờ OQ-003 |
| `X-Request-Id` | Hai chiều | Client có thể gửi UUID hợp lệ; server luôn trả ID cuối dùng để truy vết |
| `Idempotency-Key` | Mutation request | Bắt buộc cho lead, booking, post/comment và tác vụ có side effect |
| `If-Match: "<version>"` | Update/delete | Optimistic concurrency cho resource mutable |
| `ETag` | Response | Version/cache validation |
| `Accept: text/event-stream` | SSE | Stream AI run |
| `Last-Event-ID` | SSE reconnect | Tiếp tục stream trong cửa sổ retention được duyệt |

`Accept-Language` có thể được hỗ trợ sau khi locale scope được xác nhận; dữ liệu canonical không lưu đơn vị/format theo locale.

## 4. Envelope, pagination và lỗi

### 4.1 Resource response

Resource đơn trả trực tiếp trong `data`; metadata không nhúng vào entity:

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

- `limit` có default/max được chốt sau OQ-044; server clamp hoặc trả validation error theo contract.
- Cursor opaque, gắn với sort/filter; client không parse.
- Không trả tổng số mặc định vì count lớn tốn chi phí. Endpoint chỉ trả count khi UI thật sự cần và semantics rõ.

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

Không trả lỗi 200 với `success: false`.

## 5. Quyền truy cập

Bảng endpoint bên dưới dùng ký hiệu **Public candidate**, **Authenticated**, **Privileged/Partner**. Chỉ “Authenticated” cho mutation cá nhân là đề xuất tối thiểu, chưa thay ma trận quyền cần trả lời tại OQ-002/OQ-003/OQ-004/OQ-036.

- Public read phải áp visibility, publication status và field redaction.
- `/me/*` lấy user từ token, không nhận `userId` query/body.
- Resource thuộc organization phải kiểm tra membership và role phía server.
- Admin/moderation/data-operation API không thiết kế cho đến khi OQ-006/OQ-037 được duyệt.

## 6. Geography, listing và market

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
- `bedroomCount`, direction/furnishing/legal filter khi taxonomy được duyệt.
- `query` cho keyword full-text; NL interpretation dùng endpoint riêng.
- Sort allowlist cần product xác nhận: newest, price asc/desc, area, relevance.

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

`displayHint` không được dùng làm nguồn tính toán. `saved/interested` chỉ xuất hiện khi có identity context hoặc là `false/null` theo convention được duyệt.

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

Backend validate interpretation theo schema/allowlist rồi chạy query deterministic. Client hiển thị applied filters để người dùng sửa.

## 7. Dự án và inventory

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

- canonical identity/hierarchy;
- physical attributes;
- `availability.status`, `observedAt`, `stale` và source/authority label phù hợp;
- offer list theo distributor, giá VND, thời hạn và source freshness;
- `version` dùng khi tạo booking request.

Không gọi dữ liệu là realtime trước khi OQ-009 có SLA.

## 8. Saved và interest

| Method | Path | Hành vi |
|---|---|---|
| GET | `/me/saved-items` | Cursor page; filter `resourceKind` |
| PUT | `/me/saved-items/{resourceKind}/{resourceId}` | Idempotent save; 200/201 theo tồn tại |
| DELETE | `/me/saved-items/{resourceKind}/{resourceId}` | Idempotent unsave; 204 kể cả đã bỏ lưu theo convention |
| GET | `/me/interests` | Danh sách tín hiệu quan tâm nếu semantics được duyệt |
| PUT | `/me/interests/{resourceKind}/{resourceId}` | Idempotent mark interested |
| DELETE | `/me/interests/{resourceKind}/{resourceId}` | Bỏ quan tâm |

`resourceKind` allowlist: `listing`, `project`, `unit`, `post`; API map sang FK chặt, không dùng trực tiếp làm tên bảng/query tùy ý. `saved` và `interest` chưa hợp nhất (OQ-023).

## 9. Consultation/lead

### `POST /consultation-requests`

Yêu cầu `Idempotency-Key`.

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

Response `201 Created` trả ID, `status: submitted`, `submittedAt`; không tự trả lời “sẽ liên hệ trong 15 phút” nếu SLA chưa được duyệt. Client không chọn người phụ trách.

| Method | Path | Mục đích |
|---|---|---|
| GET | `/consultation-requests/{id}` | Người gửi xem trạng thái nếu product cho phép |
| POST | `/consultation-requests/{id}/cancel` | Chỉ thêm khi OQ về hủy được duyệt |

Assignment/CRM/internal endpoints được hoãn đến OQ-021/OQ-047.

## 10. Booking/hold

### `POST /units/{unitId}/booking-requests`

Yêu cầu `Authorization` theo policy, `Idempotency-Key`; `expectedUnitVersion` giúp phát hiện UI cũ nhưng server vẫn kiểm tra trạng thái trong transaction.

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

`email` hiện để nullable trong đề xuất vì UI/type chưa thống nhất; OQ-022 phải chốt trước OpenAPI.

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

Nếu product xác nhận tạo hold ngay, `hold` có `id`, `status`, `startsAt`, `expiresAt`; server quyết định thời hạn. Client không gửi `expiresAt`.

| Method | Path | Mục đích |
|---|---|---|
| GET | `/booking-requests/{id}` | Xem trạng thái theo quyền |
| POST | `/booking-requests/{id}/cancel` | Hủy theo state machine, `If-Match` + Idempotency-Key |

Conflict `409 RESOURCE_STATE_CONFLICT` trả `currentAvailability` đã redact và `observedAt`, không lộ thông tin người đang giữ. Payment/KYC/e-sign endpoint chưa thuộc thiết kế.

## 11. Conversation và AI streaming

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

Mỗi event có `id`, `event`, JSON `data`; heartbeat là comment. Event candidate:

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

Các event tool/system nội bộ không lộ prompt, chain-of-thought hoặc credential. Reconnect/retention cụ thể chờ SLO; khi stream không còn, client GET messages/run status.

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

Criteria/score chỉ bật sau OQ-018/OQ-029; response có `algorithmVersion`, evidence/citations, unknowns và disclaimer.

Evaluation dùng cùng `ai_runs` lifecycle. Với `stream: true`, endpoint trả `202` gồm `runId/eventsUrl`; nếu use case được cấu hình đồng bộ và hoàn tất trong request deadline, có thể trả `200` với kết quả đầy đủ. Một contract mode phải được chốt trong OpenAPI cho từng use case, không thay đổi ngẫu nhiên theo latency.

## 12. Social

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

`POST /social/posts`, bắt buộc auth + `Idempotency-Key`; quyền theo OQ-036.

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

Response có status thật (`draft`, `pending_review`, `published`), không luôn giả định publish ngay. Client không gửi `verified`, `authorRole`, counters hoặc market metrics không nguồn.

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

Report/block/appeal endpoints bị hoãn cho đến khi policy OQ-037 được duyệt; trước production không được bỏ qua quyết định này.

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

- `summary` với citation IDs;
- `highlights` gắn nguồn;
- `results.posts/projects/listings/authors` được phân trang hoặc giới hạn rõ;
- `sourceMix`/warning phân biệt canonical, verified content và UGC;
- trạng thái `insufficientEvidence` thay vì luôn trả fallback như mock hiện tại.

## 13. Media

Luồng đề xuất:

1. `POST /media/uploads` với filename, declared MIME, size, checksum, purpose.
2. Server kiểm tra quyền/quota và trả `mediaAssetId`, signed upload URL, allowed headers, expiry.
3. Client upload trực tiếp object storage.
4. `POST /media/uploads/{mediaAssetId}/complete` để xác nhận checksum.
5. Worker scan/inspect/transform; `GET /media/{id}` trả trạng thái.
6. Post/listing chỉ tham chiếu media ở trạng thái cho phép.

Limit/type/video transcode/hotlink chờ OQ-031/OQ-040; không đưa API upload production trước khi policy có.

## 14. Notification

| Method | Path | Mục đích |
|---|---|---|
| GET | `/me/notifications` | Cursor page, filter unread/type |
| POST | `/me/notifications/{id}/read` | Idempotent mark read |
| POST | `/me/notifications/read-all` | Idempotent với cutoff timestamp do server trả/nhận |
| GET/PATCH | `/me/notification-preferences` | Chỉ khi channel/preference OQ-025/OQ-054 được duyệt |

Không mở endpoint client tự gửi notification tới user khác.

## 15. Partner webhook và ingestion

Candidate endpoint: `POST /webhooks/inventory/{sourceKey}`.

- Xác minh chữ ký/timestamp và replay window.
- Dùng external event/batch ID làm idempotency.
- Validate envelope nhẹ, ghi receipt/job và trả `202`; không xử lý batch lớn đồng bộ.
- Không trả chi tiết canonical/private inventory trong webhook response.
- `GET /partner/v1/ingestion-receipts/{id}` chỉ có nếu partner cần và được auth riêng.
- Schema/version, retry và error report chờ hợp đồng nguồn OQ-008/OQ-009.

## 16. Rate limit, cache và reliability semantics

- Rate-limit key là tổ hợp user/client/source/IP risk phù hợp, không chỉ IP; số cụ thể chờ tải và abuse model.
- `Retry-After` trả với 429/503 khi biết.
- GET public hỗ trợ `ETag`/`Cache-Control`; response có user-specific field không được cache public.
- Mutation không tự retry ở client nếu không có idempotency key.
- API timeout ngắn hơn upstream; job hóa tác vụ dài.
- `202` nghĩa là đã nhận/chờ xử lý, không phải nghiệp vụ thành công cuối cùng.

## 17. Contract review checklist

- [ ] OQ P0 về auth/role/tenant và guest được chốt.
- [ ] Taxonomy/status/price/freshness và canonical ID được duyệt.
- [ ] Booking request so với hold thật, email và cancel state được duyệt.
- [ ] Post/comment/moderation permissions được duyệt.
- [ ] AI source/PII/citation/criteria được duyệt.
- [ ] Pagination/limit/sort, deep link và error copy được frontend review.
- [ ] OpenAPI examples gồm success/error/conflict/stale/empty và contract test.
- [ ] Không có payment/admin/STT/TTS endpoint được thêm khi chưa có yêu cầu.
