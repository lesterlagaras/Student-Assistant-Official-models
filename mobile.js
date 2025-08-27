document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('user-input');
  const conversation = document.getElementById('conversation');
  const sendBtn = document.getElementById('send-btn');

  // Auto-resize textarea
  function resizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
  }

  userInput.addEventListener('input', resizeTextarea);

  // Enter key = new line (not send) - para sa mobile at desktop
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // wag isend
      const start = userInput.selectionStart;
      const end = userInput.selectionEnd;
      userInput.value =
        userInput.value.substring(0, start) +
        "\n" +
        userInput.value.substring(end);
      userInput.selectionStart = userInput.selectionEnd = start + 1;
      resizeTextarea();
    }
  });

  // Send button
  sendBtn.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (!message) return;

    // User message
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.textContent = message;
    conversation.appendChild(msgDiv);

    // Auto scroll
    conversation.scrollTop = conversation.scrollHeight;

    // Clear input
    userInput.value = '';
    resizeTextarea();

    // Simulate AI reply
    setTimeout(() => {
      const aiDiv = document.createElement('div');
      aiDiv.className = 'message ai';
      aiDiv.textContent = "AI reply to: " + message;
      conversation.appendChild(aiDiv);
      conversation.scrollTop = conversation.scrollHeight;
    }, 500);
  });
});

// Mobile viewport height fix
function setViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);