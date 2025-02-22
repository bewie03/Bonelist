-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    website TEXT CHECK (website ~ '^https?://'),
    bullish_votes INTEGER DEFAULT 0,
    bearish_votes INTEGER DEFAULT 0,
    token_info TEXT,
    transaction_hash TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    vote_type TEXT CHECK (vote_type IN ('bullish', 'bearish')),
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to update project vote counts
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vote_type = 'bullish' THEN
        UPDATE projects 
        SET bullish_votes = bullish_votes + 1
        WHERE id = NEW.project_id;
    ELSE
        UPDATE projects 
        SET bearish_votes = bearish_votes + 1
        WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vote counts
CREATE TRIGGER vote_counter
    AFTER INSERT ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_vote_counts();

-- Insert some sample projects
INSERT INTO projects (name, description, website, token_info, verified)
VALUES 
    ('ShibaSwap', 'Decentralized exchange for SHIB ecosystem', 'https://shibaswap.com', 'BONE Token', true),
    ('BoneTools', 'Analytics platform for BONE token', 'https://bonetools.io', 'BONE Analytics', true),
    ('BoneVault', 'Staking platform for BONE', 'https://bonevault.finance', 'BONE Staking', true);

-- Insert some sample votes
INSERT INTO votes (project_id, vote_type)
SELECT 
    id,
    CASE WHEN random() > 0.5 THEN 'bullish' ELSE 'bearish' END
FROM projects
CROSS JOIN generate_series(1, 5); -- This will add 5 random votes to each project
