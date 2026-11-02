import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Workshop } from '../types/workshop'
import { WorkshopCard } from './WorkshopCard'

const workshop: Workshop = {
  id: 'workshop-test-42', title: 'Thiết kế giao diện với React', speaker: 'Nguyễn Minh Anh',
  topic: 'Lập trình', date: '2026-11-12T08:30:00+07:00', availableSeats: 4, capacity: 20,
  description: 'Workshop kiểm thử giao diện.',
}

describe('WorkshopCard', () => {
  it('shows workshop details', () => {
    render(<WorkshopCard workshop={workshop} isRegistered={false} onRegister={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('heading', { name: workshop.title })).toBeInTheDocument()
    expect(screen.getByText('Diễn giả · Nguyễn Minh Anh')).toBeInTheDocument()
    expect(screen.getByText('Lập trình')).toBeInTheDocument()
    expect(screen.getByText(/Còn 4 chỗ/)).toBeInTheDocument()
  })
  it('calls the registration handler with the workshop id', async () => {
    const user = userEvent.setup()
    const onRegister = vi.fn()
    render(<WorkshopCard workshop={workshop} isRegistered={false} onRegister={onRegister} onCancel={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /Đăng ký/ }))
    expect(onRegister).toHaveBeenCalledExactlyOnceWith('workshop-test-42')
  })
  it('disables registration when the workshop is full', () => {
    render(<WorkshopCard workshop={{ ...workshop, availableSeats: 0 }} isRegistered={false} onRegister={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Đăng ký/ })).toBeDisabled()
    expect(screen.getByText('Đã đủ chỗ')).toBeInTheDocument()
  })
})