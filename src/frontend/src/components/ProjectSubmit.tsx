import { useState } from 'react'
import toast from 'react-hot-toast'
import { API_URL } from './config'

interface ProjectSubmitProps {
  onSubmit?: () => void
}

interface TokenomicsData {
  totalSupply: string
  circulatingSupply: string
  burntAmount: string
  publicSale: string
  teamAllocation: string
  marketing: string
  development: string
}

interface ProjectData {
  name: string
  description: string
  shortDescription: string
  website_url: string
  image_url: string
  token_name: string
  token_ticker: string
  tokenomics: TokenomicsData
  treasury_wallet: string
  twitter_url: string
  telegram_url: string
  discord_url: string
  github_url: string
  whitepaper_url: string
  transaction_id?: string
}

export default function ProjectSubmit({ onSubmit }: ProjectSubmitProps) {
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    shortDescription: '',
    website_url: '',
    image_url: '',
    token_name: '',
    token_ticker: '',
    tokenomics: {
      totalSupply: '',
      circulatingSupply: '',
      burntAmount: '',
      publicSale: '',
      teamAllocation: '',
      marketing: '',
      development: ''
    },
    treasury_wallet: '',
    twitter_url: '',
    telegram_url: '',
    discord_url: '',
    github_url: '',
    whitepaper_url: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to submit project')

      toast.success('Project submitted successfully!')
      onSubmit?.()
    } catch (error) {
      toast.error('Failed to submit project')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProjectData],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-bone-100 border-b border-navy-600 pb-2">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="form-label">Project Name</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="form-input"
              placeholder="Your project name"
            />
          </div>

          <div>
            <label htmlFor="image_url" className="form-label">Project Logo URL</label>
            <input
              type="url"
              id="image_url"
              required
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className="form-input"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        <div>
          <label htmlFor="shortDescription" className="form-label">Short Description</label>
          <input
            type="text"
            id="shortDescription"
            required
            value={formData.shortDescription}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            className="form-input"
            placeholder="Brief one-line description of your project"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="description" className="form-label">Full Description</label>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="form-input"
            placeholder="Detailed description of your project"
          />
        </div>
      </div>

      {/* Token Information */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-bone-100 border-b border-navy-600 pb-2">Token Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="token_name" className="form-label">Token Name</label>
            <input
              type="text"
              id="token_name"
              required
              value={formData.token_name}
              onChange={(e) => handleInputChange('token_name', e.target.value)}
              className="form-input"
              placeholder="Full token name"
            />
          </div>

          <div>
            <label htmlFor="token_ticker" className="form-label">Token Ticker</label>
            <input
              type="text"
              id="token_ticker"
              required
              value={formData.token_ticker}
              onChange={(e) => handleInputChange('token_ticker', e.target.value)}
              className="form-input"
              placeholder="Token ticker symbol"
            />
          </div>
        </div>

        <div>
          <label htmlFor="treasury_wallet" className="form-label">Treasury Wallet Address</label>
          <input
            type="text"
            id="treasury_wallet"
            required
            value={formData.treasury_wallet}
            onChange={(e) => handleInputChange('treasury_wallet', e.target.value)}
            className="form-input"
            placeholder="Cardano wallet address"
          />
        </div>
      </div>

      {/* Tokenomics */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-bone-100 border-b border-navy-600 pb-2">Tokenomics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="totalSupply" className="form-label">Total Supply</label>
            <input
              type="text"
              id="totalSupply"
              required
              value={formData.tokenomics.totalSupply}
              onChange={(e) => handleInputChange('tokenomics.totalSupply', e.target.value)}
              className="form-input"
              placeholder="Total token supply"
            />
          </div>

          <div>
            <label htmlFor="circulatingSupply" className="form-label">Circulating Supply</label>
            <input
              type="text"
              id="circulatingSupply"
              required
              value={formData.tokenomics.circulatingSupply}
              onChange={(e) => handleInputChange('tokenomics.circulatingSupply', e.target.value)}
              className="form-input"
              placeholder="Current circulating supply"
            />
          </div>

          <div>
            <label htmlFor="burntAmount" className="form-label">Burnt Amount</label>
            <input
              type="text"
              id="burntAmount"
              required
              value={formData.tokenomics.burntAmount}
              onChange={(e) => handleInputChange('tokenomics.burntAmount', e.target.value)}
              className="form-input"
              placeholder="Amount of tokens burnt"
            />
          </div>

          <div>
            <label htmlFor="publicSale" className="form-label">Public Sale (%)</label>
            <input
              type="text"
              id="publicSale"
              required
              value={formData.tokenomics.publicSale}
              onChange={(e) => handleInputChange('tokenomics.publicSale', e.target.value)}
              className="form-input"
              placeholder="Percentage for public sale"
            />
          </div>

          <div>
            <label htmlFor="teamAllocation" className="form-label">Team Allocation (%)</label>
            <input
              type="text"
              id="teamAllocation"
              required
              value={formData.tokenomics.teamAllocation}
              onChange={(e) => handleInputChange('tokenomics.teamAllocation', e.target.value)}
              className="form-input"
              placeholder="Percentage for team"
            />
          </div>

          <div>
            <label htmlFor="marketing" className="form-label">Marketing (%)</label>
            <input
              type="text"
              id="marketing"
              required
              value={formData.tokenomics.marketing}
              onChange={(e) => handleInputChange('tokenomics.marketing', e.target.value)}
              className="form-input"
              placeholder="Percentage for marketing"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-bone-100 border-b border-navy-600 pb-2">Links & Resources</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="website_url" className="form-label">Website</label>
            <input
              type="url"
              id="website_url"
              required
              value={formData.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              className="form-input"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="whitepaper_url" className="form-label">Whitepaper</label>
            <input
              type="url"
              id="whitepaper_url"
              required
              value={formData.whitepaper_url}
              onChange={(e) => handleInputChange('whitepaper_url', e.target.value)}
              className="form-input"
              placeholder="https://example.com/whitepaper"
            />
          </div>

          <div>
            <label htmlFor="twitter_url" className="form-label">Twitter</label>
            <input
              type="url"
              id="twitter_url"
              required
              value={formData.twitter_url}
              onChange={(e) => handleInputChange('twitter_url', e.target.value)}
              className="form-input"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label htmlFor="telegram_url" className="form-label">Telegram</label>
            <input
              type="url"
              id="telegram_url"
              value={formData.telegram_url}
              onChange={(e) => handleInputChange('telegram_url', e.target.value)}
              className="form-input"
              placeholder="https://t.me/..."
            />
          </div>

          <div>
            <label htmlFor="discord_url" className="form-label">Discord</label>
            <input
              type="url"
              id="discord_url"
              value={formData.discord_url}
              onChange={(e) => handleInputChange('discord_url', e.target.value)}
              className="form-input"
              placeholder="https://discord.gg/..."
            />
          </div>

          <div>
            <label htmlFor="github_url" className="form-label">GitHub</label>
            <input
              type="url"
              id="github_url"
              value={formData.github_url}
              onChange={(e) => handleInputChange('github_url', e.target.value)}
              className="form-input"
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-navy-500 text-bone-100 rounded-lg hover:bg-navy-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-bone-300"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <img src="/bone-icon.png" alt="" className="w-4 h-4" />
              <span>Submit Project</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
