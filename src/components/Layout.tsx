import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

function tabClass({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.tab} ${styles.active}` : styles.tab
}

export default function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <NavLink to="/list" className={styles.brand}>
          POKEMON SEARCH APP
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/list" className={tabClass}>
            List
          </NavLink>
          <NavLink to="/gallery" className={tabClass}>
            Gallery
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
