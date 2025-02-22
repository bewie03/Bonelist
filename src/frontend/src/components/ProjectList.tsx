import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { API_URL } from './config'

interface Project {
  id: string
  name: string
  description: string
  website: string
  bullish_votes: number
  bearish_votes: number
  token_info: string
  transaction_hash: string
  verified: boolean
  created_at: string
  updated_at: string
  userVote?: 'bullish' | 'bearish' | null
}

interface UserVotes {
  [projectId: string]: 'bullish' | 'bearish'
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [userFingerprint, setUserFingerprint] = useState<string>('')
  const [userVotes, setUserVotes] = useState<UserVotes>({})

  useEffect(() => {
    initializeFingerprint()
  }, [])

  useEffect(() => {
    if (userFingerprint) {
      fetchProjects()
      fetchUserVotes()
    }
  }, [userFingerprint])

  const initializeFingerprint = async () => {
    try {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setUserFingerprint(result.visitorId)
    } catch (error) {
      console.error('Error generating fingerprint:', error)
      toast.error('Error initializing vote tracking')
    }
  }

  const fetchUserVotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects/votes/${userFingerprint}`)
      if (!response.ok) throw new Error('Failed to fetch user votes')
      const votes = await response.json()
      const votesMap = votes.reduce((acc: UserVotes, vote: any) => {
        acc[vote.project_id] = vote.vote_type
        return acc
      }, {})
      setUserVotes(votesMap)
    } catch (error) {
      console.error('Error fetching user votes:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`)
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data.map((project: Project) => ({
        ...project,
        userVote: userVotes[project.id] || null
      })))
    } catch (error) {
      toast.error('Failed to load projects')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (projectId: string, voteType: 'bullish' | 'bearish') => {
    if (!userFingerprint) {
      toast.error('Unable to track votes. Please try again later.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, voteType, userFingerprint }),
      })
      
      if (!response.ok) throw new Error('Failed to vote')
      
      const updatedProject = await response.json()
      setProjects(projects.map(project => 
        project.id === projectId ? {
          ...project,
          ...updatedProject,
          userVote: updatedProject.userVote
        } : project
      ))
      
      // Update user votes
      if (updatedProject.userVote) {
        setUserVotes(prev => ({
          ...prev,
          [projectId]: updatedProject.userVote
        }))
      } else {
        // Remove vote if it was cancelled
        setUserVotes(prev => {
          const updated = { ...prev }
          delete updated[projectId]
          return updated
        })
      }
      
      toast.success(updatedProject.userVote ? 'Vote recorded!' : 'Vote removed!')
    } catch (error) {
      toast.error('Failed to record vote')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#90caf9]"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <div key={project.id} className="bg-[#1a237e]/40 backdrop-blur-lg rounded-2xl shadow-xl border border-[#3949ab]/30 overflow-hidden group hover:border-[#3949ab]/50 transition-all duration-300">
          {/* Command Header */}
          <div className="flex items-center px-6 py-4 border-b border-[#3949ab]/30 bg-[#1a237e]/60">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3949ab]/30">
                <svg className="w-4 h-4 text-[#90caf9]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">/{project.name.toLowerCase()}</h3>
                {project.verified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#3949ab]/30 text-[#90caf9]">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#90caf9]">Description</h4>
              <p className="text-white/80">{project.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#90caf9]">Token Info</h4>
              <p className="text-white/80">{project.token_info}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a237e]/30 rounded-lg p-3">
                <p className="text-sm text-[#90caf9]">Bullish</p>
                <p className="text-lg font-semibold text-white">{project.bullish_votes}</p>
              </div>
              <div className="bg-[#1a237e]/30 rounded-lg p-3">
                <p className="text-sm text-[#90caf9]">Bearish</p>
                <p className="text-lg font-semibold text-white">{project.bearish_votes}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVote(project.id, 'bullish')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    project.userVote === 'bullish'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-green-500/10 text-green-400/70 hover:bg-green-500/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span>{project.bullish_votes}</span>
                </button>

                <button
                  onClick={() => handleVote(project.id, 'bearish')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    project.userVote === 'bearish'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-red-500/10 text-red-400/70 hover:bg-red-500/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span>{project.bearish_votes}</span>
                </button>
              </div>

              {project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1a237e]/60 text-white rounded-lg hover:bg-[#1a237e]/80 transition-colors"
                >
                  Visit
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
