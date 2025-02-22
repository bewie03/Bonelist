// Zapier Workflow Configuration

// 1. Google Form Trigger
const formSubmission = {
    formId: '{{YOUR_GOOGLE_FORM_ID}}',
    fields: {
        projectName: '{{field_1}}',
        description: '{{field_2}}',
        website: '{{field_3}}',
        tokenInfo: '{{field_4}}',
        transactionHash: '{{field_5}}'
    }
};

// 2. Transaction Verification
const verifyTransaction = async (inputData) => {
    const response = await fetch(`https://api.etherscan.io/api`, {
        params: {
            module: 'transaction',
            action: 'gettxreceiptstatus',
            txhash: inputData.transactionHash,
            apikey: '{{YOUR_ETHERSCAN_API_KEY}}'
        }
    });
    
    return {
        verified: response.data.status === '1',
        amount: response.data.value
    };
};

// 3. Supabase Integration
const supabaseConfig = {
    url: '{{YOUR_SUPABASE_URL}}',
    key: '{{YOUR_SUPABASE_API_KEY}}',
    table: 'projects'
};

// 4. Project Submission
const submitProject = async (inputData, verificationResult) => {
    if (!verificationResult.verified) {
        throw new Error('Transaction verification failed');
    }

    const projectData = {
        name: inputData.projectName,
        description: inputData.description,
        website: inputData.website,
        token_info: inputData.tokenInfo,
        transaction_hash: inputData.transactionHash,
        verified: true,
        bullish_votes: 0,
        bearish_votes: 0
    };

    return await supabase
        .from(supabaseConfig.table)
        .insert([projectData]);
};

// 5. Webflow CMS Update
const updateWebflow = {
    siteId: '{{YOUR_WEBFLOW_SITE_ID}}',
    collectionId: '{{YOUR_COLLECTION_ID}}',
    fields: {
        name: '{{step_1.projectName}}',
        description: '{{step_1.description}}',
        website: '{{step_1.website}}',
        status: 'Published'
    }
};

// Export workflow steps
module.exports = {
    formSubmission,
    verifyTransaction,
    submitProject,
    updateWebflow
};
