const axios = require('axios');

const API_URL = 'http://localhost:3001/admin-api';
const USERNAME = 'superadmin';
const PASSWORD = 'superadmin';

async function reindexSearch() {
  try {
    console.log('1. Logging in as superadmin...');

    // Login
    const loginResponse = await axios.post(API_URL, {
      query: `
        mutation {
          login(username: "${USERNAME}", password: "${PASSWORD}") {
            ... on CurrentUser {
              id
              identifier
            }
            ... on ErrorResult {
              errorCode
              message
            }
          }
        }
      `,
    }, {
      withCredentials: true,
    });

    if (loginResponse.data.errors) {
      console.error('Login error:', loginResponse.data.errors);
      return;
    }

    console.log('   ✓ Logged in successfully');

    // Get the auth token from cookies
    const cookies = loginResponse.headers['set-cookie'];
    const cookieHeader = cookies ? cookies.join('; ') : '';

    console.log('\n2. Triggering search reindex...');

    // Trigger reindex
    const reindexResponse = await axios.post(
      API_URL,
      {
        query: `
          mutation {
            reindex {
              id
            }
          }
        `,
      },
      {
        headers: {
          Cookie: cookieHeader,
        },
        withCredentials: true,
      }
    );

    if (reindexResponse.data.errors) {
      console.error('   ✗ Reindex error:', reindexResponse.data.errors);
      return;
    }

    console.log('   ✓ Search reindex job started');
    console.log('   Job ID:', reindexResponse.data.data.reindex.id);

    console.log('\n3. Waiting for reindex to complete (checking every 2 seconds)...');

    // Poll for job completion
    let isComplete = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!isComplete && attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));

      const jobResponse = await axios.post(
        API_URL,
        {
          query: `
            query {
              job(jobId: "${reindexResponse.data.data.reindex.id}") {
                id
                state
                progress
                result
                error
              }
            }
          `,
        },
        {
          headers: {
            Cookie: cookieHeader,
          },
          withCredentials: true,
        }
      );

      const job = jobResponse.data.data.job;
      console.log(`   Progress: ${job.progress}% - State: ${job.state}`);

      if (job.state === 'COMPLETED') {
        isComplete = true;
        console.log('\n✓ Search reindex completed successfully!');
        console.log('  Result:', job.result);
      } else if (job.state === 'FAILED') {
        console.error('\n✗ Reindex job failed:', job.error);
        return;
      }
    }

    if (!isComplete) {
      console.log('\n⚠ Reindex is still running after 60 seconds. Check the admin UI for status.');
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

reindexSearch();
