const insert = (content) => {
  // Find body to the active tab
  const body = document.getElementsByTagName("body");

  if (body.length === 0) {
    return;
  }

  // If hl-modal already exist on dom
  const existingHlModal = document.getElementById("hl-modal");
  if (existingHlModal) {
    existingHlModal.remove();
  }

  // Create the modal
  var modal = document.createElement("div");
  modal.id = "hl-modal";
  // modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.zIndex = 1;
  modal.style.left = 0;
  modal.style.top = 0;
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.overflow = "auto";
  modal.style.backgroundColor = "rgba(0,0,0,0.4)";
  document.body.appendChild(modal);

  // Create the modal content
  var modalContent = document.createElement("div");
  // modalContent.style.backgroundColor = "#F9DBBB";
  modalContent.style.backgroundColor = "#FFFFFF";
  modalContent.style.margin = "10% auto";
  modalContent.style.padding = "20px";
  // modalContent.style.border = "1px solid #FF0303";
  // modalContent.style.borderRadius = "5px";
  modalContent.style.width = "80%";
  modalContent.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.75)";
  modal.appendChild(modalContent);

  // Create the close button
  var closeButton = document.createElement("span");
  closeButton.innerHTML = "&times;";
  closeButton.style.float = "right";
  closeButton.style.fontSize = "28px";
  closeButton.style.fontWeight = "bold";
  closeButton.style.color = "#FF0303";
  if (content !== "generating...") {
    closeButton.onclick = function () {
      modal.style.display = "none";
    };
    closeButton.style.opacity = "1";
    closeButton.style.cursor = "pointer";
  } else {
    closeButton.style.opacity = "0.7";
    closeButton.style.cursor = "not-allowed";
  }
  modalContent.appendChild(closeButton);

  // Create the love letter content
  var loveLetter = document.createElement("p");
  loveLetter.style.fontFamily = "Georgia, serif";
  loveLetter.style.fontSize = "1.2em";
  // loveLetter.style.color = "#2E3840";
  loveLetter.style.color = "#000000";
  loveLetter.style.lineHeight = "1.5em";
  loveLetter.style.marginBottom = "20px";
  loveLetter.style.alignItems = "center";
  loveLetter.style.whiteSpace = "pre-wrap";
  loveLetter.style.letterSpacing = "0.5px";

  loveLetter.innerHTML = content;
  modalContent.appendChild(loveLetter);

  if (content !== "generating...") {
    // Copy button
    var copyButton = document.createElement("button");
    copyButton.className = "hl-copy-button";
    copyButton.style.cssText =
      "background-color: #4E6E81; color: #F9DBBB; border: none; padding: 5px 10px; cursor: pointer; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 10px; display: flex; align-items: center; justify-content: center;";
    // Create the copy icon element
    var copyIcon = document.createElement("i");
    copyIcon.className = "hl-copy-icon";
    copyIcon.style.cssText =
      "background-color: #FF0303; color: #F9DBBB; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; margin-right: 5px;";
    // Add the copy icon element to the copy button element
    copyIcon.innerHTML = "&#x2398;";
    copyButton.appendChild(copyIcon);
    // Add the text label to the copy button element
    var copyText = document.createElement("span");
    copyText.textContent = "Copy";
    copyButton.appendChild(copyText);
    // Add the copy button element to the modal content
    modalContent.appendChild(copyButton);

    // Copy button events
    // Add event listener for the click event of the copy button
    copyButton.addEventListener("click", function () {
      // Copy the text content of the loveLetter element to the clipboard
      var loveLetterText = loveLetter.textContent;
      var tempInput = document.createElement("input");
      tempInput.value = loveLetterText;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      // Show a notification that the text has been copied
      var notification = document.createElement("div");
      notification.textContent = "Text copied to clipboard";
      notification.style.cssText =
        "background-color: #4E6E81; color: #F9DBBB; border-radius: 5px; padding: 10px; position: absolute; bottom: 10px; right: 10px; z-index: 9999;";
      document.body.appendChild(notification);
      setTimeout(function () {
        document.body.removeChild(notification);
      }, 3000);
    });
  }

  // On success return true
  return true;
};

chrome.runtime.onMessage.addListener(
  // This is the message listener
  (request, sender, sendResponse) => {
    if (request.message === "inject") {
      const { content } = request;

      // Call this insert function
      const result = insert(content);

      // If something went wrong, send a failed status
      if (!result) {
        sendResponse({ status: "failed" });
      }

      sendResponse({ status: "success" });
    }
  }
);
