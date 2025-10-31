#!/usr/bin/env node
// Print some Netlify context useful for builds
console.log('=== Netlify Build Context ===');
console.log('Context:', process.env.CONTEXT || process.env.NETLIFY_ENV || 'unknown');
console.log('Branch:', process.env.BRANCH || process.env.GIT_BRANCH || 'unknown');
console.log('Commit:', process.env.COMMIT_REF || 'unknown');
console.log('Head:', process.env.HEAD || 'unknown');
console.log('URL:', process.env.URL || 'unknown');
console.log('Deploy URL:', process.env.DEPLOY_URL || 'unknown');
console.log('==============================');
process.exit(0);

