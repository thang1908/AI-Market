# Nhật ký quyết định kiến trúc

## 1. Quy ước

- Mọi ADR trong tài liệu này đang ở trạng thái **Proposed**.
- Chưa có quyết định nào là authorization để viết application code.
- Sau review, trạng thái hợp lệ: `Accepted`, `Rejected`, `Superseded`; ghi người duyệt/ngày/lý do.
- Khi assumption hoặc open question thay đổi, cập nhật ADR liên quan thay vì chỉ sửa implementation.

## 2. Danh mục

| ADR | Quyết định đề xuất | Trạng thái | Open question/trigger chính |
|---|---|---|---|
| ADR-001 | Modular monolith + worker | Proposed | OQ-001, OQ-004, OQ-044 |
| ADR-002 | PostgreSQL là nguồn sự thật | Proposed | OQ-009..013, OQ-045 |
| ADR-003 | Giữ SPA và chuyển đổi theo lát dọc | Proposed | OQ-001, OQ-051 |
| ADR-004 | REST JSON + SSE cho AI | Proposed | OQ-031, OQ-044 |
| ADR-005 | PostgreSQL filters/full-text trước search/vector riêng | Proposed | OQ-015, OQ-044, OQ-050 |
| ADR-006 | Managed LLM qua adapter provider-neutral | Proposed | OQ-026, OQ-028, OQ-035, OQ-046 |
| ADR-007 | Hold/booking transaction trong PostgreSQL | Proposed | OQ-009..011, OQ-019..020 |
| ADR-008 | DB-backed jobs + transactional outbox trước broker | Proposed | OQ-044, OQ-047, OQ-050 |
| ADR-009 | Không dùng Redis trong baseline | Proposed | OQ-044, OQ-050 |
| ADR-010 | Object storage + CDN cho media | Proposed | OQ-031, OQ-040, OQ-043 |
| ADR-011 | AI run/version/trust tier/citation bắt buộc | Proposed | OQ-027..030, OQ-033..035 |
| ADR-012 | Chưa triển khai STT/TTS/self-hosted model | Proposed | OQ-026, OQ-032 |
| ADR-013 | Tiền VND integer và timestamp UTC | Proposed | OQ-012, OQ-017 |
| ADR-014 | Hoãn chốt IdP/role/tenant, giữ boundary | Proposed | OQ-002..004 |

---

## ADR-001 — Modular monolith với background worker

### Bối cảnh

Sản phẩm chưa có backend, chưa có số tải/team ownership/SLO. Domain có nhiều module nhưng booking, inventory, saved và lead cần transaction/consistency. Microservice sớm sẽ tăng hợp đồng phân tán, deployment và on-call.

### Quyết định đề xuất

Xây một API Python FastAPI modular monolith và một background worker deployable riêng, dùng chung module contracts/codebase. Boundary module được enforce bằng dependency rule, public application API/event và table ownership.

### Phương án cân nhắc

- Microservices theo AI/market/social ngay từ đầu.
- Backend-as-a-Service/serverless functions rời rạc theo màn hình.
- Một monolith không có module boundary.

### Hệ quả

- Ưu: transaction đơn giản, delivery nhanh, ít hạ tầng, refactor/tách service có định hướng.
- Đổi lại: cần kỷ luật boundary; deploy API chung; lỗi monolith có blast radius lớn hơn nếu không có module isolation.
- Worker tách job nặng khỏi request nhưng DB vẫn là shared capacity cần theo dõi.

### Xem xét lại khi

Một module có nhu cầu scale/deploy/compliance/team ownership độc lập đã đo, hoặc shared DB/deploy gây bottleneck lặp lại không giải quyết được bằng tối ưu/isolation trong monolith.

---

## ADR-002 — PostgreSQL là nguồn sự thật nghiệp vụ

### Bối cảnh

Domain chủ yếu quan hệ: project hierarchy, canonical unit, offers, saved, booking state, conversation, post/comment và audit. Hold cần invariant mạnh. Chưa có dữ liệu chứng minh cần nhiều loại database.

### Quyết định đề xuất

Dùng managed PostgreSQL làm source of truth. Cache, full-text/vector index, CDN và queue projection đều có thể rebuild/đối chiếu từ database/outbox/source records.

### Phương án cân nhắc

- Document database làm datastore chính.
- Mỗi module một loại database từ đầu.
- Redis làm trạng thái inventory/hold tốc độ cao.

### Hệ quả

- Ưu: FK/constraint/transaction, query linh hoạt, vận hành/backup đơn giản.
- Đổi lại: cần quản lý connection/index/vacuum và bảo vệ OLTP khỏi analytics/job nặng.
- Schema module ownership phải được enforce dù cùng database.

### Xem xét lại khi

Workload cụ thể không phù hợp PostgreSQL và metric cho thấy datastore chuyên biệt mang lợi ích vượt chi phí consistency/operations.

---

## ADR-003 — Giữ SPA hiện tại, chuyển đổi theo lát dọc

### Bối cảnh

UI React/Vite đã thể hiện phần lớn trải nghiệm. Vấn đề chính là mock data, AppContext lớn, thiếu router/API/auth; viết lại frontend không trực tiếp giải quyết domain/backend và dễ làm lệch UX.

### Quyết định đề xuất

Giữ SPA, thêm router/typed client/server state sau khi contract được duyệt. Chuyển từng feature từ mock/localStorage sang API theo lát dọc; chỉ xóa đường mock production sau kiểm chứng.

### Phương án cân nhắc

- Rewrite frontend/framework trước backend.
- Giữ toàn bộ state trong global Context và chỉ thay mock bằng fetch.
- Chuyển sang SSR ngay để giải quyết deep link/SEO.

### Hệ quả

- Ưu: bảo toàn UI, giảm big-bang risk, contract test theo feature.
- Đổi lại: giai đoạn chuyển tiếp có mock/API path; cần flag và tránh hai nguồn sự thật.
- SSR/SEO cần quyết định riêng nếu OQ-051 xác nhận public indexing là mục tiêu.

### Xem xét lại khi

SEO/performance/public content yêu cầu SSR/SSG rõ, hoặc framework hiện tại không đáp ứng NFR đã đo.

---

## ADR-004 — REST JSON và SSE cho streaming AI

### Bối cảnh

Phần lớn domain là resource CRUD/filter/pagination. Chat cần server gửi token/status/citation theo một chiều; UI chưa có collaborative realtime/presence yêu cầu WebSocket.

### Quyết định đề xuất

REST JSON versioned tại `/api/v1`; tạo AI run bằng POST và đọc stream qua SSE có event ID/reconnect. Contract chính nằm trong OpenAPI, SSE event được version/document riêng.

### Phương án cân nhắc

- GraphQL cho mọi data.
- WebSocket cho mọi realtime.
- Long polling hoặc chỉ trả AI response hoàn chỉnh.

### Hệ quả

- Ưu: dễ cache/quan sát/test; SSE phù hợp streaming một chiều và proxy HTTP.
- Đổi lại: phải quản lý reconnect, stream retention, connection capacity; OpenAPI không mô tả SSE hoàn hảo.
- Nếu cần two-way realtime/presence sau này, có thể thêm channel chuyên biệt.

### Xem xét lại khi

Concurrent streams/proxy limitation không đạt SLO, hoặc social/collaboration yêu cầu event hai chiều latency thấp được xác nhận.

---

## ADR-005 — Structured filters và PostgreSQL full-text trước search/vector cluster

### Bối cảnh

UI search chủ yếu dựa trên geography, price, area, room, status và keyword; dataset/latency/quality chưa biết. Một cluster search/vector tăng đồng bộ, cost và vận hành.

### Quyết định đề xuất

Dùng query có cấu trúc + PostgreSQL full-text/index phù hợp. NL search chỉ trích xuất filter rồi query deterministic. Thử `pgvector` sau eval nếu semantic retrieval cần; dedicated search/vector chỉ sau metric.

### Phương án cân nhắc

- OpenSearch/Elasticsearch ngay.
- Vector database riêng cho toàn bộ search.
- LLM đọc toàn bộ mock/context không có index.

### Hệ quả

- Ưu: đơn giản, consistency và authorization dễ, chi phí thấp.
- Đổi lại: typo/synonym/ranking tiếng Việt có thể cần tuning; scale/ranking phức tạp có giới hạn.
- Cần telemetry query và benchmark để biết thời điểm chuyển.

### Xem xét lại khi

PostgreSQL không đạt latency/recall/ranking tại dataset/query thật sau tối ưu, hoặc nhu cầu fuzzy/faceted/vector/filtering vượt khả năng hợp lý.

---

## ADR-006 — Managed LLM qua adapter provider-neutral

### Bối cảnh

Mock có scaffold Gemini nhưng chưa có provider được duyệt. Tự vận hành model cần GPU/model registry/on-call/eval mà chưa có yêu cầu privacy, tải hoặc TCO.

### Quyết định đề xuất

Dùng managed LLM provider được phê duyệt qua `ModelGateway`; model routing/config/version theo use case. Domain/tool/prompt policy không phụ thuộc SDK vendor. Có timeout, quota, cost, fallback và kill switch.

### Phương án cân nhắc

- Hard-code Gemini vì dependency hiện có.
- Self-host open model từ MVP.
- Cho mỗi feature gọi trực tiếp provider SDK.

### Hệ quả

- Ưu: time-to-market/capability tốt, ít vận hành GPU, đổi/so sánh model được.
- Đổi lại: vendor data/cost/quota/egress; adapter không loại bỏ hoàn toàn khác biệt capability.
- Provider/data retention/region/DPA phải được duyệt trước production.

### Xem xét lại khi

Privacy/residency, latency, availability, capability hoặc TCO có dữ liệu chứng minh managed provider không phù hợp.

---

## ADR-007 — Inventory hold/booking dùng transaction PostgreSQL

### Bối cảnh

UI hiển thị booking/giữ chỗ và trạng thái căn có thể thay đổi đồng thời. Sai invariant có tác động kinh doanh cao. Cache/client snapshot không đủ để chống double booking.

### Quyết định đề xuất

Canonical unit + active hold kiểm tra trong transaction trên primary PostgreSQL với row lock/constraint, idempotency và status/outbox event cùng commit. Redis không quyết định winner.

### Phương án cân nhắc

- Redis distributed lock làm nguồn phán quyết.
- Optimistic client-only check.
- Queue tuần tự mọi booking trước khi phản hồi.

### Hệ quả

- Ưu: invariant mạnh, failure semantics rõ, audit và recovery đơn giản.
- Đổi lại: contention/hot unit cần index/transaction ngắn; source partner freshness vẫn là vấn đề ngoài transaction.
- Chưa triển khai cho đến khi booking vs preview, hold TTL và state authority được duyệt.

### Xem xét lại khi

Inventory source bên ngoài mới là transaction authority hoặc throughput/hotspot thực tế vượt PostgreSQL; khi đó cần protocol/reservation contract với authority, không chỉ đổi datastore.

---

## ADR-008 — DB-backed job queue và transactional outbox trước broker riêng

### Bối cảnh

Các job ingestion, notification, moderation, AI batch và expiry cần retry; volume/fan-out chưa biết. Mutation nghiệp vụ cần phát event không bị mất giữa DB commit và publish.

### Quyết định đề xuất

Dùng bảng `jobs` và `outbox_events`, worker claim bằng locking/lease, at-least-once + idempotent consumer. Outbox được tạo cùng transaction nghiệp vụ.

### Phương án cân nhắc

- Managed queue cho mọi job từ đầu.
- Kafka/event streaming từ đầu.
- Gọi provider đồng bộ ngay trong request.

### Hệ quả

- Ưu: ít thành phần, atomicity với DB, dễ debug/replay ở quy mô đầu.
- Đổi lại: polling/cleanup/DB load; fan-out/retention/throughput có giới hạn.
- Payload phải nhỏ/versioned; media/raw batch nằm object storage.

### Xem xét lại khi

Job lag/load/fan-out/isolation/retention không đạt SLO sau tuning, hoặc tích hợp yêu cầu broker managed cụ thể.

---

## ADR-009 — Không dùng Redis trong baseline

### Bối cảnh

Chưa có performance profile. CDN/HTTP cache/PostgreSQL đủ để bắt đầu; Redis tạo invalidation, HA, security và nguồn trạng thái dễ bị lạm dụng.

### Quyết định đề xuất

Không provision Redis ở baseline. Dùng edge rate controls, DB/HTTP cache phù hợp và đo bottleneck. Nếu thêm, Redis chỉ là ephemeral cache/rate state, không source of truth.

### Phương án cân nhắc

- Redis mặc định cho session/cache/queue/lock/counter.
- In-memory cache giữa nhiều API instance.

### Hệ quả

- Ưu: đơn giản, ít chi phí/on-call, correctness rõ.
- Đổi lại: một số hot read/rate-limit có thể cần giải pháp khác; phải theo dõi DB và edge capability.

### Xem xét lại khi

Metric chứng minh distributed rate-limit, hot read, shared ephemeral generation state hoặc counter latency cần Redis và có invalidation/TTL rõ.

---

## ADR-010 — Object storage và CDN cho media

### Bối cảnh

UI dùng nhiều ảnh, có video/3D/tài liệu pháp lý tiềm năng. Lưu binary trong database hoặc proxy mọi upload/download qua API gây tải/chi phí và khó phân phối.

### Quyết định đề xuất

Lưu binary ở object storage, metadata/quyền/checksum/lifecycle trong PostgreSQL; signed direct upload, quarantine/scan rồi publish; CDN cho tài nguyên được phép.

### Phương án cân nhắc

- Lưu blob trong PostgreSQL.
- Hotlink toàn bộ URL nguồn.
- Upload/serve qua API filesystem/container.

### Hệ quả

- Ưu: durability/scale/CDN tốt, API nhẹ, lifecycle rõ.
- Đổi lại: cần signed URL, CORS, malware/metadata/transcode, privacy và orphan cleanup.
- Video/3D/legal document policy còn chờ yêu cầu.

### Xem xét lại khi

Provider/content licensing yêu cầu lưu ngoài, hoặc workload media cần pipeline/streaming service chuyên biệt.

---

## ADR-011 — Versioned AI runs, trust tier và citation

### Bối cảnh

UI dùng AI cho thông tin giá, dự án, rủi ro, social và đánh giá; dữ liệu mock hiện có mâu thuẫn. Không có provenance/version sẽ khó giải thích, kiểm thử và sửa sai.

### Quyết định đề xuất

Mỗi AI response/evaluation có run lưu model/prompt/policy/tool/index version, latency/cost/safety và citation. Retrieval phân T1 canonical, T2 verified, T3 UGC, T4 unverified; output phân biệt loại nguồn và abstain khi thiếu bằng chứng.

### Phương án cân nhắc

- Chỉ lưu final text.
- Cho model tự tạo link/citation.
- Trộn UGC và canonical không nhãn.

### Hệ quả

- Ưu: audit/eval/debug/rollback, tăng độ tin cậy và hỗ trợ correction.
- Đổi lại: schema/storage/UX citation và pipeline phức tạp hơn; cần retention/permission nghiêm.
- Không lưu chain-of-thought; prompt/output raw phụ thuộc privacy policy.

### Xem xét lại khi

Legal/product thay đổi chuẩn citation/retention hoặc một use case không cần generation; vẫn giữ provenance tối thiểu cho dữ kiện.

---

## ADR-012 — Chưa triển khai STT, TTS hoặc self-hosted model

### Bối cảnh

UI không có voice/audio flow. Attachment cũng chưa nhất quán. Thêm speech/model serving sẽ kéo theo consent audio, latency, format, storage, GPU và vận hành không có yêu cầu.

### Quyết định đề xuất

Đánh dấu STT/TTS/audio/OCR và self-hosted serving là không nằm trong baseline. Chỉ thiết kế bằng ADR mới sau khi use case, UX, privacy, latency, model/provider, budget và eval được phê duyệt.

### Phương án cân nhắc

- Thêm speech endpoint “để sẵn”.
- Dùng browser speech API không có server policy.
- Dựng GPU/model server ngay cùng chat.

### Hệ quả

- Ưu: tránh scope/cost/security chưa cần, tập trung chất lượng text/RAG.
- Đổi lại: nếu voice trở thành MVP, cần cập nhật architecture/API/media/infra trước implementation.

### Xem xét lại khi

OQ-031/OQ-032 có yêu cầu UI/end-to-end và owner/budget rõ.

---

## ADR-013 — Money là integer VND, time là UTC có semantic timestamp

### Bối cảnh

Mock dùng `priceValueNumber` với thang sale/rent khác nhau và timestamp trộn ISO/chuỗi hiển thị. Điều này gây lỗi filter/sort/analytics và citation freshness.

### Quyết định đề xuất

Lưu/truyền tiền bằng integer VND (`bigint`/JSON safe integer trong giới hạn hoặc string nếu contract cần vượt giới hạn), field có tên `*AmountVnd`. Lưu time bằng `timestamptz`, API RFC3339 UTC; phân biệt created/published/effective/observed/updated.

### Phương án cân nhắc

- Lưu float theo tỷ/triệu.
- Lưu chuỗi display làm canonical.
- Lưu local time không offset.

### Hệ quả

- Ưu: tính toán/so sánh nhất quán, không mơ hồ đơn vị/timezone.
- Đổi lại: cần formatter/migration/data-quality; frontend phải chú ý JS safe integer nếu giá trị tương lai vượt giới hạn.
- Thuế/phí/giá tổng/giá m² vẫn cần contract OQ-012.

### Xem xét lại khi

Hỗ trợ đa tiền tệ/độ chính xác khác; khi đó thêm currency/minor unit model, không quay lại display number mơ hồ.

---

## ADR-014 — Hoãn chọn IdP, role và tenant model nhưng giữ boundary

### Bối cảnh

UI có avatar và nhiều loại tác giả nhưng không có auth/permission workflow. Chọn phone OTP/OAuth, multi-tenant/RBAC cụ thể lúc này sẽ invent requirement và có thể gây migration lớn.

### Quyết định đề xuất

Giữ `Identity & Access` boundary, canonical `users`, `organizations`, membership/consent concepts và server-side authorization hooks. Không chốt provider, role keys, tenant column/RLS hoặc guest capabilities trước OQ-002..004.

### Phương án cân nhắc

- Giả định mọi user giống nhau và endpoint public.
- Chọn ngay một IdP/role set từ thói quen.
- Gắn `tenant_id` vào mọi bảng dù chưa có tenancy.

### Hệ quả

- Ưu: không invent business rule/vendor, vẫn tránh rải auth logic khắp code.
- Đổi lại: auth-dependent OpenAPI/nullability/schema bị chặn; không thể triển khai mutation production trước quyết định.
- Khi được duyệt phải tạo ADR cụ thể cho IdP/session/RBAC/tenant isolation.

### Xem xét lại khi

Product trả lời OQ-002..004 và security/legal xác nhận identity/consent requirements.

## 3. Mẫu phê duyệt

Khi review, ghi thêm dưới ADR tương ứng:

```text
Decision status: Accepted | Rejected | Superseded
Approved by: <name/role>
Approved at: <YYYY-MM-DD>
Notes / conditions: <text>
Supersedes / superseded by: <ADR, nếu có>
```

Các ADR được `Accepted` nhưng còn điều kiện phải liên kết OQ/issue và không được xem là hoàn tất cho đến khi điều kiện được đóng.

