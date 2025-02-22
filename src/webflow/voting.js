// Initialize Supabase Client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Vote Handler
async function handleVote(projectId, voteType) {
    try {
        // Insert vote
        const { data, error } = await supabase
            .from('votes')
            .insert([
                { project_id: projectId, vote_type: voteType }
            ]);

        if (error) throw error;

        // Update UI
        const voteCount = document.querySelector(`#${voteType}-count-${projectId}`);
        voteCount.textContent = parseInt(voteCount.textContent) + 1;

        // Disable vote buttons temporarily
        setVoteCooldown(projectId);

    } catch (error) {
        console.error('Error casting vote:', error.message);
        alert('Failed to cast vote. Please try again.');
    }
}

// Vote Cooldown
function setVoteCooldown(projectId) {
    const buttons = document.querySelectorAll(`[data-project-id="${projectId}"]`);
    buttons.forEach(button => {
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
        }, 24 * 60 * 60 * 1000); // 24 hours
    });
}

// Real-time Updates
function subscribeToVotes() {
    const subscription = supabase
        .from('votes')
        .on('INSERT', payload => {
            updateProjectStats(payload.new.project_id);
        })
        .subscribe();
}

// Update Project Stats
async function updateProjectStats(projectId) {
    const { data, error } = await supabase
        .from('projects')
        .select('bullish_votes, bearish_votes')
        .eq('id', projectId)
        .single();

    if (error) {
        console.error('Error fetching project stats:', error.message);
        return;
    }

    // Update UI
    document.querySelector(`#bullish-count-${projectId}`).textContent = data.bullish_votes;
    document.querySelector(`#bearish-count-${projectId}`).textContent = data.bearish_votes;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up vote button listeners
    document.querySelectorAll('.vote-button').forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.dataset.projectId;
            const voteType = button.dataset.voteType;
            handleVote(projectId, voteType);
        });
    });

    // Subscribe to real-time updates
    subscribeToVotes();
});
