
const request = require('request');

const core = require('@actions/core');

const GH_TOKEN= core.getInput('GH_TOKEN');

const GH_USER= core.getInput('GH_USER');

const GH_REPO=core.getInput('GH_REPO');

const GH_ORG=core.getInput('GH_ORG');


const updateRepo = (workItem) => {
    console.log("Writing Work Item to Repo: ", workItem);
  


    var request = require("request");
  
    var options = {
      method: 'POST',
      url: 'https://api.github.com/repos/'+GH_ORG+'/'+GH_REPO+'/issues',
      headers: {
        Authorization: 'Bearer ' + GH_TOKEN,
        'Content-Type': 'application/json',
        Accept: "application/vnd.github.symmetra-preview+json",
        'User-Agent': "machine_user"
      },
      body: {
        title: workItem.title,
        body: workItem.description,
        assignees: [GH_USER],
        labels: ['feature']
      },
      json: true
    };
  
    request(options, function(error, response, body) {
      if (error) throw new Error(error);
  
      console.log(workItem.title, "-> Issue Created");
    });
  
  
  }
  
//FIND NEW ISSUE SINCE EVENT
var getNewestWorkItem = (workItems) => {
    return new Promise(function(resolve, reject) {
  
      console.log("getNewestWorkItem");
      var currentDate = new Date()
      var newestWorkItem = workItems[0]
      diff = 99999999999;
  
      workItems.forEach((workItem, i) => {
        var workItemDate = new Date(workItem.date);
        diff2 = currentDate - workItemDate
  
        if (diff2 < diff) {
          diff = diff2;
          newestWorkItem = workItem;
        }
      })
  
      console.log("newestWorkItem:", newestWorkItem);
      resolve(newestWorkItem);
    })
  }
  
  
  //CREATE ISSUE IN CURRENT REPO
  getWorkItems().then((workItems) => {
    getNewestWorkItem(workItems).then((newestWorkItem) => {
      updateRepo(newestWorkItem);
    })
  })