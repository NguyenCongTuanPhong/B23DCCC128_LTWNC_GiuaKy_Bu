import type { ApiResult, Workshop, WorkshopDraft } from '../types/workshop'

const workshopDrafts: WorkshopDraft[] = [
  { title: 'Xây dựng ứng dụng với React Server Components', speaker: 'Nguyễn Minh Anh', topic: 'Lập trình', date: '2026-11-12T08:30:00+07:00', availableSeats: 8, capacity: 30, description: 'Đi từ component đến kiến trúc ứng dụng hiện đại.' },
  { title: 'Từ dữ liệu đến sản phẩm AI thực tế', speaker: 'Trần Quốc Bảo', topic: 'AI', date: '2026-11-15T14:00:00+07:00', availableSeats: 0, capacity: 24, description: 'Khám phá quy trình biến mô hình thành sản phẩm.' },
  { title: 'Kể chuyện bằng dữ liệu', speaker: 'Lê Hoàng Yến', topic: 'Kỹ năng mềm', date: '2026-11-18T09:00:00+07:00', availableSeats: 12, capacity: 25, description: 'Trình bày insight rõ ràng và thuyết phục hơn.' },
  { title: 'TypeScript nâng cao: kiểu an toàn trong thực tế', speaker: 'Phạm Gia Huy', topic: 'Lập trình', date: '2026-11-20T13:30:00+07:00', availableSeats: 5, capacity: 20, description: 'Generic, utility types và những pattern hữu ích.' },
  { title: 'Prompt engineering cho nhóm sáng tạo', speaker: 'Vũ Khánh Linh', topic: 'AI', date: '2026-11-24T10:00:00+07:00', availableSeats: 16, capacity: 28, description: 'Thiết kế quy trình làm việc cùng AI có chủ đích.' },
  { title: 'Giao tiếp hiệu quả trong nhóm đa chức năng', speaker: 'Đỗ Thanh Hà', topic: 'Kỹ năng mềm', date: '2026-11-27T15:00:00+07:00', availableSeats: 3, capacity: 18, description: 'Phối hợp tốt hơn qua lắng nghe và phản hồi.' },
  { title: 'Thiết kế API dễ mở rộng', speaker: 'Bùi Đức Long', topic: 'Lập trình', date: '2026-12-02T09:30:00+07:00', availableSeats: 10, capacity: 22, description: 'Các nguyên tắc thiết kế API từ dự án thực tế.' },
  { title: 'AI có trách nhiệm: từ nguyên tắc đến thực hành', speaker: 'Nguyễn Thu Trang', topic: 'AI', date: '2026-12-05T13:00:00+07:00', availableSeats: 7, capacity: 20, description: 'Nhận diện rủi ro và xây dựng hệ thống đáng tin cậy.' },
]

export function fetchWorkshops(simulateFailure = false): Promise<ApiResult<Workshop[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (simulateFailure) {
        resolve({ ok: false, error: 'Không thể tải danh sách workshop. Vui lòng thử lại.' })
        return
      }

      resolve({
        ok: true,
        data: workshopDrafts.map((workshop, index) => ({ ...workshop, id: `workshop-${index + 1}` })),
      })
    }, 500)
  })
}