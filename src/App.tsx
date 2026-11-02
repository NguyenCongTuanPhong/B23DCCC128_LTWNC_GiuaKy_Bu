import { lazy, Suspense, useEffect } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useAppDispatch } from './app/hooks'
import { loadWorkshops } from './features/workshops/workshopsSlice'
import { WorkshopPage } from './pages/WorkshopPage'
import { useTheme } from './features/theme/useTheme'

const StatsPage = lazy(() => import('./pages/StatsPage'))

function App() {
  const { theme, toggleTheme } = useTheme()
  const dispatch = useAppDispatch()

  useEffect(() => {
    void dispatch(loadWorkshops())
  }, [dispatch])

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="Mini Workshop, trang chủ">
          <span className="brand-mark">mw</span>
          <span>mini<span className="brand-accent">workshop</span></span>
        </NavLink>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <NavLink to="/" end>Khám phá</NavLink>
          <NavLink to="/stats">Thống kê</NavLink>
        </nav>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
          title={theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>
      <main className="page-content">
        <Suspense fallback={<div className="page-loading">Đang mở thống kê...</div>}>
          <Routes>
            <Route path="/" element={<WorkshopPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<WorkshopPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer">
        <span>MINI WORKSHOP</span>
        <span>Học thêm một điều mới, mỗi lần gặp nhau.</span>
      </footer>
    </div>
  )
}

export default App
