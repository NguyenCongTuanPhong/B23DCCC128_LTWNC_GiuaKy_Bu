import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loadWorkshops } from '../features/workshops/workshopsSlice'
import { WORKSHOP_TOPICS } from '../types/workshop'

export default function StatsPage() {
  const dispatch = useAppDispatch()
  const workshops = useAppSelector((state) => state.workshops.items)
  const registeredIds = useAppSelector((state) => state.workshops.registeredIds)
  const status = useAppSelector((state) => state.workshops.status)
  const error = useAppSelector((state) => state.workshops.error)
  const topicStats = useMemo(() => WORKSHOP_TOPICS.map((topic) => ({
    topic,
    count: workshops.filter((workshop) => workshop.topic === topic).length,
  })), [workshops])
  const maximumCount = Math.max(1, ...topicStats.map((item) => item.count))

  if (status === 'idle' || status === 'loading') return <div className="page-loading" role="status">Đang tải...</div>
  if (status === 'failed') {
    return (
      <div className="status-panel error" role="alert">
        <p>{error}</p>
        <button type="button" onClick={() => void dispatch(loadWorkshops())}>Thử lại</button>
      </div>
    )
  }

  return (
    <>
      <section className="page-heading stats-heading">
        <div><span className="eyebrow">Tổng quan học kỳ</span><h1>Nhịp workshop.</h1><p>Một góc nhìn nhanh về các chủ đề và lựa chọn học tập của bạn.</p></div>
      </section>
      <section className="stats-summary" aria-label="Tổng quan">
        <div className="summary-card"><span>Tổng workshop</span><strong>{workshops.length}</strong></div>
        <div className="summary-card"><span>Chủ đề đang mở</span><strong>{topicStats.filter((item) => item.count > 0).length}</strong></div>
        <div className="summary-card highlight"><span>Bạn đang đăng ký</span><strong>{registeredIds.length}<small> / 3</small></strong></div>
      </section>
      <section aria-labelledby="topic-stat-title">
        <div className="stats-section-title"><h2 id="topic-stat-title">Workshop theo chủ đề</h2><span>Phân bổ chương trình</span></div>
        <div className="topic-stats">
          {topicStats.map(({ topic, count }) => {
            const topicClass = topic === 'AI' ? 'ai' : topic === 'Kỹ năng mềm' ? 'soft' : ''
            return (
              <div className="topic-row" key={topic}>
                <div className="topic-row-name"><span className={`topic-dot ${topicClass}`} />{topic}</div>
                <div className="topic-bar" aria-label={`${count} workshop`}><span style={{ width: `${(count / maximumCount) * 100}%` }} /></div>
                <div className="topic-row-count"><strong>{count}</strong> workshop</div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}