import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import ProjectList from './components/ProjectList'
import ProjectSubmit from './components/ProjectSubmit'

function App() {
  const [showSubmit, setShowSubmit] = useState(false)

  return (
    <div className="min-h-screen bg-navy">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-navy-800 border-b border-navy-600">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/bone-icon.png" alt="BONE" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-bone-100">BONEList</h1>
            </div>
            <button 
              onClick={() => setShowSubmit(!showSubmit)}
              className="px-6 py-2 bg-navy-500 text-white rounded-lg hover:bg-navy-400 transition-colors"
            >
              {showSubmit ? 'View Projects' : 'Submit Project'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-12">
        {showSubmit ? (
          <div>
            <h2 className="text-3xl font-semibold text-bone-100 mb-8 text-center">Submit Your Cardano Project</h2>
            <div className="max-w-4xl mx-auto bg-navy-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-navy-600">
              <ProjectSubmit onSubmit={() => setShowSubmit(false)} />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center mb-8 space-x-4">
              <img src="/bone-icon.png" alt="BONE" className="w-12 h-12" />
              <h2 className="text-3xl font-semibold text-bone-100">Top Projects</h2>
            </div>
            <ProjectList />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
