
function waitForJobsAndSendToBackground(retries = 10) {
  const jobLinks = [...document.querySelectorAll('a[data-testid="job-search-job-card-link"]')]
    .map(link => link.href);

  if (jobLinks.length === 0 && retries > 0) {
    console.log("⏳ Waiting for jobs to load...");
    setTimeout(() => waitForJobsAndSendToBackground(retries - 1), 1000);
    return;
  }

  if (jobLinks.length === 0) {
    return;
  }

  console.log(`🔗 Found ${jobLinks.length} jobs. Sending to background...`);

  jobLinks.forEach((url, index) => {
    setTimeout(() => {
      chrome.runtime.sendMessage({ action: "openJobTab", url });
    }, index * 5000); 
  });
}


function autoApply() {
    const jobId = window.location.href.split("/").pop();
  
    const applyBtn = [...document.querySelectorAll("button")].find(btn =>
      btn.innerText.includes("Easy Apply")
    );
  
    if (applyBtn) {
      applyBtn.click();
  
      setTimeout(() => {
        const submitBtn = [...document.querySelectorAll("button")].find(btn =>
          btn.innerText.includes("Submit")
        );
  
        if (submitBtn) {
          submitBtn.click();
          chrome.storage.local.get("appliedJobs", (data) => {
            const appliedJobs = data.appliedJobs || [];
            if (!appliedJobs.includes(jobId)) {
              appliedJobs.push(jobId);
              chrome.storage.local.set({ appliedJobs }, () => {
                console.log("Stored as applied:", jobId);
              });
            }
          });
  
          setTimeout(() => {
            console.log("🚪 Closing tab after applying");
            window.close();
          }, 5000);
  
        } else {
          console.log("⚠️ Submit button not found.");
        }
      }, 2000);
    } else {
      console.log("Easy Apply not found.");
    }
  }
  

if (window.location.href.includes("/jobs")) {
  waitForJobsAndSendToBackground();
}

if (window.location.href.includes("/job-detail/")) {
  setTimeout(autoApply, 3000);
}

