const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const branchRefName = core.getInput('branch');
        const repoName = core.getInput('repo');    
        const repoOwner = core.getInput('owner');    
        const token = core.getInput('token');
 
        const octokit = new github.GitHub(token);


        const branchName = branchRefName.replace('refs/', '').replace('heads/', '');
    
        console.log(`Current repo name: ${repoName}`);
        console.log(`Current repo owner: ${repoOwner}`);
        console.log(`Current branch name: ${branchName}`);
    
        const versionRegex = new RegExp('^(?<mainBranch>.*)\\/(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)$');
        const regexMatch = versionRegex.exec(branchName);
    
        if(!regexMatch) {
            console.log('Not need cascade merge');
            return;
        }
    
        const major = regexMatch.groups.major;
        const minor = regexMatch.groups.minor;
        const patch = regexMatch.groups.patch;
    
        console.log(`Major version: ${major}`);
        console.log(`Major version: ${minor}`);
        console.log(`Patch version: ${patch}`);

        const response = await octokit.repos.listBranches({
            owner: repoOwner,
            repo: repoName,
        });

        console.log(response.data);
    } catch (error) {
        core.setFailed(error.message);
    }    
}

run();