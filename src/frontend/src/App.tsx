import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProjectList from './components/ProjectList'
import ProjectSubmit from './components/ProjectSubmit'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/submit" element={<ProjectSubmit />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  )
}

export default App
