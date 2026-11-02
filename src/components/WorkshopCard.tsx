import { memo } from 'react'
import { CalendarDays, Check, Clock3, MapPin, Users } from 'lucide-react'
import type { Workshop } from '../types/workshop'

interface WorkshopCardProps {
  workshop: Workshop
  isRegistered: boolean
  onRegister: (id: string) => void
  onCancel: (id: string) => void
}

function formatWorkshopDate(date: string): string {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

function WorkshopCardComponent({ workshop, isRegistered, onRegister, onCancel }: WorkshopCardProps) {
  const isFull = workshop.availableSeats === 0
  const topicClass = workshop.topic === 'AI' ? 'topic-ai' : workshop.topic === 'Kỹ năng mềm' ? 'topic-soft' : ''

  return (
    <article className="workshop-card">
      <div className="card-topline">
        <span className={`topic-badge ${topicClass}`}>{workshop.topic}</span>
        <span className={`seat-status ${isFull ? 'sold-out' : ''}`}>
          <Users size={13} aria-hidden="true" />{isFull ? 'Đã đủ chỗ' : `Còn ${workshop.availableSeats} chỗ`}
        </span>
      </div>
      <h2>{workshop.title}</h2>
      <p className="speaker">Diễn giả · {workshop.speaker}</p>
      <div className="card-meta">
        <span><CalendarDays size={14} aria-hidden="true" />{formatWorkshopDate(workshop.date)}</span>
        <span><Clock3 size={14} aria-hidden="true" />Theo lịch chương trình</span>
      </div>
      <div className="card-bottom">
        <span className="capacity-copy"><strong>{workshop.availableSeats}</strong> / {workshop.capacity} chỗ còn lại</span>
        {isRegistered ? (
          <button className="workshop-action cancel" type="button" onClick={() => onCancel(workshop.id)}>
            <Check size={14} aria-hidden="true" /> Đã đăng ký · Huỷ
          </button>
        ) : (
          <button className="workshop-action" type="button" disabled={isFull} onClick={() => onRegister(workshop.id)}>
            {isFull ? <Users size={14} aria-hidden="true" /> : <MapPin size={14} aria-hidden="true" />}Đăng ký
          </button>
        )}
      </div>
    </article>
  )
}

export const WorkshopCard = memo(WorkshopCardComponent)