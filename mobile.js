// ================= Chat Elements =================
const form = document.getElementById('chat-form');
const textarea = document.getElementById('user-input');
const conversation = document.getElementById('conversation');
const welcomeMsg = document.getElementById('welcome-message');
const optionBtn = document.getElementById('option-btn');
const optionMenu = document.getElementById('option-menu');
const sendBtn = document.getElementById('send-btn');

// ================= Panels =================
const notesPanel = document.getElementById('notes-panel');
const calendarPanel = document.getElementById('calendar-panel');
const allEventsPanel = document.getElementById('all-events-panel');

// ================= All Events =================
document.addEventListener('DOMContentLoaded', () => {
  const allEventsPanel = document.getElementById('all-events-panel');
  const allEventsList = document.getElementById('events-list');
  const allEventsBtn = document.getElementById('view-events-btn');
  const closeAllEvents = document.getElementById('close-events');

  // ensure global calendar variables exist
  if (typeof calendarEvents === 'undefined') window.calendarEvents = [];
  if (typeof currentDate === 'undefined') window.currentDate = new Date();
  if (typeof selectedDay === 'undefined') window.selectedDay = null;

  function renderAllEvents() {
    if (!allEventsList) return; // safe guard
    allEventsList.innerHTML = '';

    if (!calendarEvents || calendarEvents.length === 0) {
      const li = document.createElement('div');
      li.textContent = "No events yet!";
      li.style.padding = '4px';
      allEventsList.appendChild(li);
      return;
    }

    calendarEvents.forEach((ev, index) => {
      const li = document.createElement('div');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.padding = '4px 0';

      const textSpan = document.createElement('span');
      textSpan.textContent = `${ev.date}: ${ev.text}`;
      textSpan.style.cursor = 'pointer';
      textSpan.addEventListener('click', () => {
        const [y, m, d] = ev.date.split('-').map(Number);
        currentDate.setFullYear(y, m - 1);
        selectedDay = d;

        if (typeof renderCalendar === 'function') renderCalendar();

        if (allEventsPanel) allEventsPanel.style.display = 'none';
        if (calendarPanel) calendarPanel.style.display = 'flex';
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = '❌';
      delBtn.style.marginLeft = '8px';
      delBtn.addEventListener('click', () => {
        if (confirm('Delete this event?')) {
          calendarEvents.splice(index, 1);
          localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
          renderAllEvents();
          if (typeof renderCalendar === 'function') renderCalendar();
        }
      });

      li.appendChild(textSpan);
      li.appendChild(delBtn);
      allEventsList.appendChild(li);
    });
  }

  // Open All Events Panel
  if (allEventsBtn) allEventsBtn.addEventListener('click', () => {
    renderAllEvents();
    if (allEventsPanel) allEventsPanel.style.display = 'flex';
    if (notesPanel) notesPanel.style.display = 'none';
    if (calendarPanel) calendarPanel.style.display = 'none';
    if (optionMenu) optionMenu.style.display = 'none';
  });

  // Close All Events Panel
  if (closeAllEvents) closeAllEvents.addEventListener('click', () => {
    if (allEventsPanel) allEventsPanel.style.display = 'none';
  });
});

// ================= Dark Mode =================
const darkToggle = document.getElementById('dark-toggle');
const savedMode = localStorage.getItem('chatMode');

if(savedMode === 'dark'){
  document.body.classList.add('dark-mode');
} else {
  document.body.classList.remove('dark-mode');
}
setDarkMode(document.body.classList.contains('dark-mode'));

darkToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('chatMode', isDark ? 'dark' : 'light');
  setDarkMode(isDark);
});

function setDarkMode(isDark) {
  darkToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';

  // Panels
  [notesPanel, calendarPanel, allEventsPanel].forEach(panel => {
    panel.style.backgroundColor = isDark ? '#1e1e1e' : '#fff';
    panel.style.color = isDark ? '#ffffff' : '#000000';
    panel.style.border = isDark ? '1px solid #555' : '1px solid #ccc';
  });

  // Buttons
  const buttons = document.querySelectorAll('#option-menu button, .panel-btn, #send-btn, #add-calendar-event');
  buttons.forEach(btn => {
    btn.style.backgroundColor = isDark ? '#ffffff' : '#d3d3d3';
    btn.style.color = '#000000';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.padding = '4px 8px';
    btn.style.cursor = 'pointer';
    btn.style.margin = '2px';
  });

  // Chat messages
const chatDivs = document.querySelectorAll('#conversation div');
chatDivs.forEach(msg => {
  if(msg.classList.contains('user')){
    // User bubble: Light grey in light mode, white/light in dark mode
    msg.style.backgroundColor = isDark ? '#ffffff' : '#e0e0e0';
    msg.style.color = '#000000';
    msg.style.alignSelf = 'flex-end'; // user messages on right
    msg.style.textAlign = 'right';
  } else if(msg.classList.contains('bot')){
    // Bot bubble: White in light mode, dark grey in dark mode
    msg.style.backgroundColor = isDark ? '#2c2c2e' : '#ffffff';
    msg.style.color = isDark ? '#ffffff' : '#000000';
    msg.style.alignSelf = 'flex-start'; // bot messages on left
    msg.style.textAlign = 'left';
  }
});

  // Welcome message
  if(welcomeMsg){
    welcomeMsg.style.color = isDark ? '#ffffff' : '#888';
  }

  // Input bar
  const inputBar = document.getElementById('input-bar');
  inputBar.style.backgroundColor = isDark ? '#1e1e1e' : '#fff';
  inputBar.style.border = isDark ? '1px solid #333' : 'none';
  inputBar.style.boxShadow = isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)';

  // Textarea color
  textarea.style.color = isDark ? '#ffffff' : '#000000';
}

// ================= Message Handling =================
function addMessage(msg, sender = 'user') {
  const div = document.createElement('div');
  div.className = sender;
  div.textContent = msg;
  conversation.appendChild(div);
  conversation.scrollTop = conversation.scrollHeight;
}

function sendMessage() {
  const msg = textarea.value.trim();
  if(!msg) return;

  if(welcomeMsg){
    welcomeMsg.style.transition = 'opacity 0.3s';
    welcomeMsg.style.opacity = 0;
    setTimeout(()=> welcomeMsg.remove(), 300);
  }

  addMessage(msg, 'user');
  textarea.value = '';
  autoExpand();
  setTimeout(()=> addMessage("🤖 This is a bot reply.", 'bot'), 500);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  sendMessage();
});

textarea.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    e.preventDefault();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + "\n" + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    autoExpand();
  }
});

function autoExpand() {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
  conversation.scrollTop = conversation.scrollHeight;
}
textarea.addEventListener('input', autoExpand);

sendBtn.addEventListener('click', sendMessage);

// ================= Options Menu =================
optionBtn.addEventListener('click', () => {
  optionMenu.style.display = optionMenu.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', e => {
  if(!optionBtn.contains(e.target) && !optionMenu.contains(e.target)){
    optionMenu.style.display = 'none';
  }
});

// ================= Notes =================
let notesPages = JSON.parse(localStorage.getItem("notesPages")) || [""];
const MAX_PAGES = 10;
let currentPage = 0;
const notesTextarea = document.getElementById("notes-textarea");
const notesPageIndicator = document.getElementById("notes-page-indicator");
const notesBtn = document.getElementById('notes-btn');
const closeNotes = document.getElementById('close-notes');
const saveNotes = document.getElementById('save-notes');
const nextNotes = document.getElementById('next-notes');
const backNotes = document.getElementById('back-notes');
const fullScreenNotesBtn = document.getElementById('fullscreen-notes');

function loadNotes(page){
  notesTextarea.value = notesPages[page] || "";
  notesPageIndicator.textContent = `Page ${page+1} / ${MAX_PAGES}`;
}

function saveCurrentNotes(){
  notesPages[currentPage] = notesTextarea.value;
  localStorage.setItem("notesPages", JSON.stringify(notesPages));
}

nextNotes.addEventListener("click", ()=>{
  saveCurrentNotes();
  if(currentPage < MAX_PAGES-1){
    currentPage++;
    if(!notesPages[currentPage]) notesPages[currentPage] = "";
    loadNotes(currentPage);
  } else alert("⚠️ Maximum 10 pages reached!");
});

backNotes.addEventListener("click", ()=>{
  if(currentPage > 0){
    saveCurrentNotes();
    currentPage--;
    loadNotes(currentPage);
  } else alert("⚠️ First page!");
});

saveNotes.addEventListener("click", ()=>{
  saveCurrentNotes();
  alert("✅ Notes saved!");
});

notesBtn.addEventListener("click", ()=>{
  notesPanel.style.display = "flex";
  loadNotes(currentPage);
});

closeNotes.addEventListener("click", ()=> notesPanel.style.display = "none");

let isNotesFullscreen = false;
fullScreenNotesBtn.addEventListener("click", ()=>{
  if(!isNotesFullscreen){
    // Fullscreen mode
    notesPanel.style.position = "fixed";
    notesPanel.style.top = "50%";
    notesPanel.style.left = "50%";
    notesPanel.style.transform = "translate(-50%, -50%)";
    notesPanel.style.width = "100vw";
    notesPanel.style.height = "100vh";
    notesPanel.style.zIndex = "9999";
    notesPanel.style.borderRadius = "0";
    notesPanel.style.display = "flex";
    notesPanel.style.flexDirection = "column";
    notesPanel.style.justifyContent = "center";
    notesPanel.style.alignItems = "center";
    fullScreenNotesBtn.textContent = "🗗 Minimize";
  } else {
    // Exit fullscreen but keep panel visible and centered
    notesPanel.style.position = "";
    notesPanel.style.top = "";
    notesPanel.style.left = "";
    notesPanel.style.transform = "";
    notesPanel.style.width = "";
    notesPanel.style.height = "";
    notesPanel.style.zIndex = "";
    notesPanel.style.borderRadius = "";
    notesPanel.style.display = "flex"; // keep visible
    notesPanel.style.flexDirection = "";
    notesPanel.style.justifyContent = "";
    notesPanel.style.alignItems = "";
    fullScreenNotesBtn.textContent = "⛶ Fullscreen";
  }
  isNotesFullscreen = !isNotesFullscreen;
});

// ================= Calendar =================
document.addEventListener('DOMContentLoaded', () => {
  let currentDate = new Date();
  // Make calendarEvents global so All Events panel can access it
  window.calendarEvents = JSON.parse(localStorage.getItem('calendarEvents')) || [];
  let selectedDay = null;

  const calendarPanel = document.getElementById('calendar-panel');
  const calendarGrid = document.getElementById('calendar-grid');
  const monthYearLabel = document.getElementById('month-year');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const eventTextInput = document.getElementById('event-text');
  const addCalendarEventBtn = document.getElementById('add-calendar-event');
  const calendarBtn = document.getElementById('calendar-btn');
  const closeCalendar = document.getElementById('close-calendar');

  // Reference to All Events panel rendering function (assume already defined elsewhere)
  const renderAllEvents = window.renderAllEvents || function(){};

  function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(window.calendarEvents));
    renderAllEvents(); // Update All Events panel immediately
  }

  function renderCalendar() {
    calendarGrid.innerHTML = '';
    const today = new Date();

    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      const hd = document.createElement('div');
      hd.textContent = d;
      hd.style.fontWeight = 'bold';
      hd.style.textAlign = 'center';
      hd.style.padding = '6px 0';
      calendarGrid.appendChild(hd);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYearLabel.textContent = `${currentDate.toLocaleString('default',{month:'long'})} ${year} - Today: ${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();

    for(let i=0; i<firstDay; i++) calendarGrid.appendChild(document.createElement('div'));

    for(let day=1; day<=daysInMonth; day++){
      const dayDiv = document.createElement('div');
      dayDiv.textContent = day;
      dayDiv.style.padding = '6px';
      dayDiv.style.border = '1px solid #ccc';
      dayDiv.style.textAlign = 'center';
      dayDiv.style.cursor = 'pointer';

      const dayKey = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const eventsForDay = window.calendarEvents.filter(e => e.date === dayKey);
      if(eventsForDay.length > 0){
        dayDiv.style.fontWeight='bold';
        dayDiv.title = eventsForDay.map(e => e.text).join('\n');
      }

      if(selectedDay === day){
        dayDiv.style.background = '#949694ff';
        dayDiv.style.color = 'white';
      }

      if(day === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
        dayDiv.style.borderRadius = '50%';
        dayDiv.style.border = '2px solid #2196F3';
        dayDiv.style.fontWeight = 'bold';
      }

      dayDiv.addEventListener('click', () => {
        selectedDay = day;
        renderCalendar();
      });

      calendarGrid.appendChild(dayDiv);
    }
  }

  // ================= Mobile Keyboard Handling =================
  let initialHeight = window.innerHeight;

  function scrollToInput(retry = 0) {
    if(calendarPanel && eventTextInput){
      const offset = eventTextInput.offsetTop - 20;
      calendarPanel.style.paddingBottom = '250px';
      calendarPanel.scrollTo({top: offset, behavior: 'smooth'});

      if(retry < 5){
        setTimeout(()=>scrollToInput(retry+1), 300);
      }
    }
  }

  eventTextInput.addEventListener('focus', () => scrollToInput(0));
  eventTextInput.addEventListener('blur', () => {
    if(calendarPanel){
      calendarPanel.scrollTo({top: 0, behavior: 'smooth'});
      calendarPanel.style.paddingBottom = '0px';
    }
  });

  window.addEventListener('resize', () => {
    if(calendarPanel.style.display === 'flex'){
      const newHeight = window.innerHeight;
      if(newHeight < initialHeight){
        scrollToInput(0);
      }
      initialHeight = newHeight;
    }
  });

  // ================= Calendar Buttons =================
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth()-1);
    selectedDay = null;
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth()+1);
    selectedDay = null;
    renderCalendar();
  });

  addCalendarEventBtn.addEventListener('click', () => {
    if(!selectedDay || !eventTextInput.value.trim()){
      alert('Please select a day and enter event text.');
      return;
    }
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;
    window.calendarEvents.push({date: dateKey, text: eventTextInput.value.trim()});
    saveEvents();
    eventTextInput.value = '';
    renderCalendar();
  });

  calendarBtn.addEventListener('click', () => {
    calendarPanel.style.display = calendarPanel.style.display==='flex'?'none':'flex';
  });

  closeCalendar.addEventListener('click', () => calendarPanel.style.display = 'none');

  // Auto-refresh every minute
  setInterval(() => {
    const now = new Date();
    if(now.getDate() !== currentDate.getDate() ||
       now.getMonth() !== currentDate.getMonth() ||
       now.getFullYear() !== currentDate.getFullYear()){
      currentDate = now;
      selectedDay = null;
      renderCalendar();
    }
  }, 60000);

  // Initial render
  renderCalendar();
});