chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openJobTab") {
      const jobId = message.url.split("/").pop();
  
      chrome.storage.local.get("appliedJobs", (data) => {
        const appliedJobs = data.appliedJobs || [];
  
        if (!appliedJobs.includes(jobId)) {
          chrome.tabs.create({
            url: message.url,
            active: false
          }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
              if (tabId === tab.id && changeInfo.status === 'complete') {
                chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: ['content.js']
                });
                chrome.tabs.onUpdated.removeListener(listener);
              }
            });
          });
        } else {
          console.log(jobId);
        }
      });
    }
  });
  