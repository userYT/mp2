import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import NotFound from './components/NotFound'
import { PokemonProvider } from './context/PokemonProvider'
import DetailView from './pages/DetailView'
import GalleryView from './pages/GalleryView'
import ListView from './pages/ListView'

export default function App() {
  return (
    <PokemonProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/list" replace />} />
          <Route path="list" element={<ListView />} />
          <Route path="gallery" element={<GalleryView />} />
          <Route path="pokemon/:id" element={<DetailView />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </PokemonProvider>
  )
}
