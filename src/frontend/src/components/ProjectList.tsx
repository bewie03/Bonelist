import { useEffect, useState } from 'react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Project {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  bullish_votes: number;
  bearish_votes: number;
  token_info: string | null;
  transaction_hash: string | null;
  verified: boolean;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (projectId: string, voteType: 'bullish' | 'bearish') => {
    try {
      const response = await fetch(`${API_URL}/api/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          voteType,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit vote');
      
      // Optimistically update the UI
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            [voteType === 'bullish' ? 'bullish_votes' : 'bearish_votes']: project[voteType === 'bullish' ? 'bullish_votes' : 'bearish_votes'] + 1
          }
        }
        return project
      }))

      toast.success('Vote recorded!')
    } catch (error) {
      console.error('Error voting:', error)
      toast.error('Failed to record vote')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Top Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="card hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mb-4 block"
              >
                Visit Website
              </a>
            )}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleVote(project.id, 'bullish')}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700"
              >
                <ArrowTrendingUpIcon className="h-5 w-5" />
                <span>{project.bullish_votes}</span>
              </button>
              <button
                onClick={() => handleVote(project.id, 'bearish')}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <ArrowTrendingDownIcon className="h-5 w-5" />
                <span>{project.bearish_votes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectList
