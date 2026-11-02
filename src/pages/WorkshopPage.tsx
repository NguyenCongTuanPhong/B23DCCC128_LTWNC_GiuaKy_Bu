import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useDebounce } from '../hooks/useDebounce'
import { WORKSHOP_TOPICS } from '../types/workshop'
import { loadWorkshops, registerWorkshop, unregisterWorkshop } from '../features/workshops/workshopsSlice'
import { useWorkshopFilters } from '../features/filters/workshopFilters'
import { WorkshopCard } from '../components/WorkshopCard'

export function WorkshopPage() {
  const dispatch = useAppDispatch()
  const workshops = useAppSelector((state) => state.workshops.items)
  const registeredIds = useAppSelector((state) => state.workshops.registeredIds)
  const status = useAppSelector((state) => state.workshops.status)
  const error = useAppSelector((state) => state.workshops.error)
  const registrationWarning = useAppSelector((state) => state.workshops.registrationWarning)
  const search = useWorkshopFilters((state) => state.search)
  const topic = useWorkshopFilters((state) => state.topic)
  const setSearch = useWorkshopFilters((state) => state.setSearch)
  const setTopic = useWorkshopFilters((state) => state.setTopic)
  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    setSearch(debouncedSearch)
  }, [debouncedSearch, setSearch])

  const filteredWorkshops = useMemo(() => {
    const normalizedQuery = search.trim().toLocaleLowerCase('vi')
    return workshops.filter((workshop) => {
      const matchesQuery = !normalizedQuery ||
        workshop.title.toLocaleLowerCase('vi').includes(normalizedQuery) ||
        workshop.speaker.toLocaleLowerCase('vi').includes(normalizedQuery)
      return matchesQuery && (topic === 'Tất cả' || workshop.topic === topic)
    })
  }, [search, topic, workshops])

  const handleRegister = useCallback((id: string) => dispatch(registerWorkshop(id)), [dispatch])
  const handleCancel = useCallback((id: string) => dispatch(unregisterWorkshop(id)), [dispatch])

  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Không gian học tập mở</span>
          <h1>Tìm điều bạn muốn học.</h1>
          <p>Workshop thực hành, ý tưởng mới và những người cùng mối quan tâm đang chờ bạn.</p>
        </div>
        {status === 'succeeded' && <div className="workshop-count"><strong>{workshops.length.toString().padStart(2, '0')}</strong> workshop học kỳ này</div>}
      </section>

      <section className="filter-bar" aria-label="Tìm kiếm và lọc workshop">
        <label className="search-box">
          <Search size={16} aria-hidden="true" />
          <input aria-label="Tìm theo tên workshop hoặc diễn giả" placeholder="Tìm workshop, diễn giả..." value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
        </label>
        <span className="filter-label"><SlidersHorizontal size={14} aria-hidden="true" /> Chủ đề</span>
        <select className="topic-select" aria-label="Lọc theo chủ đề" value={topic} onChange={(event) => setTopic(event.target.value as typeof topic)}>
          <option value="Tất cả">Tất cả chủ đề</option>
          {WORKSHOP_TOPICS.map((workshopTopic) => <option key={workshopTopic} value={workshopTopic}>{workshopTopic}</option>)}
        </select>
        {status === 'succeeded' && <span className="filter-result">{filteredWorkshops.length} kết quả</span>}
      </section>

      {registrationWarning && <p className="registration-warning" role="alert"><Sparkles size={15} />{registrationWarning}</p>}

      <section className="workshop-grid" aria-label="Danh sách workshop">
        {status === 'loading' && <div className="status-panel" role="status">Đang tải...</div>}
        {status === 'failed' && (
          <div className="status-panel error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => void dispatch(loadWorkshops())}>Thử lại</button>
          </div>
        )}
        {status === 'succeeded' && filteredWorkshops.length === 0 && <div className="empty-state"><strong>Chưa tìm thấy workshop phù hợp</strong><span>Thử từ khoá hoặc chủ đề khác nhé.</span></div>}
        {status === 'succeeded' && filteredWorkshops.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} isRegistered={registeredIds.includes(workshop.id)} onRegister={handleRegister} onCancel={handleCancel} />
        ))}
      </section>
    </>
  )
}