# BONEList

A project listing and voting platform built with Webflow, Supabase, and Zapier.

## Architecture

- **Frontend**: Webflow CMS
- **Backend**: Supabase (PostgreSQL + Real-time API)
- **Automation**: Zapier (Project submissions)

## Project Structure

```
bonelist/
├── src/
│   ├── webflow/      # Webflow custom code and configurations
│   ├── supabase/     # Supabase database schemas and functions
│   └── zapier/       # Zapier workflow configurations
├── config/           # Environment configurations
└── docs/            # Project documentation
```

## Setup Instructions

### 1. Webflow Setup
- Clean, responsive template
- Project listing layout
- Voting buttons (Bullish 🚀 / Bearish 📉)
- Leaderboard section
- CMS integration

### 2. Supabase Database
- Projects table
- Votes tracking
- Real-time updates

### 3. Zapier Integration
- Google Form for submissions
- Payment verification
- Automated project listing

## Database Schema

### Projects Table
```sql
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    website URL,
    bullish_votes INTEGER DEFAULT 0,
    bearish_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Votes Table
```sql
CREATE TABLE votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    vote_type TEXT CHECK (vote_type IN ('bullish', 'bearish')),
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Development

1. Set up local development environment
2. Configure Supabase connection
3. Test Zapier workflows
4. Deploy Webflow site

## Maintenance

- Monitor database performance
- Verify project submissions
- Update vote counts in real-time
- Regular security audits
