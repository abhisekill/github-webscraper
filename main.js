const request = require('request');
const path = require('path');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const createpdfDoc = require('./pdfkit');
const URL = 'https://github.com/topics';
const baseURL = 'https://github.com';


const rootPath = path.join(__dirname,'Open Source Projects');
createFolder(rootPath);

request(URL, function (error, response, html) {
    if (error) {
        console.error('error:', error);
    } else {
        // console.log(html);
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const topicsAnchorTags  = document.querySelectorAll('.container-lg.p-responsive.mt-6 a');
        for(let topicAnchor of topicsAnchorTags){
            let topicURL = topicAnchor.href;
            topicURL = baseURL + topicURL;
            let topicName = topicURL.split('/').pop();
            console.log(`Topic Name --> ${topicName} [Link --> ${topicURL}]`);
            // request(topicURL,getRepositories);
            getRepositories(topicURL,topicName)
        }
    }
});

function getRepositories(topicURL,topicName){
    const fpath = path.join(rootPath,topicName);
    createFolder(fpath);
    request(topicURL,cb);
    function cb(error,response,html){
        if (error) {
            console.error('error:', error);
        } else {
            // console.log(html);
            const dom = new JSDOM(html);
            const document = dom.window.document;
            const repoAnchorTags = document.querySelectorAll('h3 a[data-ga-click="Explore, go to repository, location:explore feed"]');
            for(let i = 0; i<8 ; i++){
                let repoURL = repoAnchorTags[i].href;
                repoURL = baseURL + repoURL;
                let repoName = repoURL.split('/').pop();
                // console.log(`Repo Name --> ${repoName} [Link --> ${repoURL}]`);
                repoURL += '/issues';
                getIssues(repoURL,repoName,fpath);
            }
        }
    }
}

function getIssues(repoURL,repoName,fpath){
    // console.log(repoURL);
    request(repoURL,cb);
   
    function cb(error,response,html){
        if (error) {
            console.error('error:', error);
        } else {
            // console.log(html);
            const dom = new JSDOM(html);
            const document = dom.window.document;
            const issueAnchorTags = document.querySelectorAll('a[data-hovercard-type="issue"]');
            console.log(issueAnchorTags.length);
            let issuesArr = [];
            for(let i = 0; i<issueAnchorTags.length; i++){
                let issueName = issueAnchorTags[i].textContent;
                let issueLink = issueAnchorTags[i].href;
                issueLink = baseURL + issueLink;
                // console.log(`Issue --> ${issueName} --> [${issueLink}]`);

                const issueObj = {
                    issueName,issueLink
                } 
                issuesArr.push(issueObj);

                // createpdfDoc(issueName,issueLink,fpath,repoName);
            }
            // console.log(issuesArr);

            // for creating json file
            let issuesData = JSON.stringify(issuesArr);
            const filePath = path.join(fpath,`${repoName}.json`)
            fs.writeFileSync(filePath,issuesData);

            // for creating pdf file
            createpdfDoc(issuesArr,fpath,repoName);

        }
    } 
}

function createFolder(fpath){
    if(!fs.existsSync(fpath))
        fs.mkdirSync(fpath);
}