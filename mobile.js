// ================= Main ChatApp Module =================
const ChatApp = {
  // ---------------- State ----------------
  calendarEvents: JSON.parse(localStorage.getItem('calendarEvents')) || [],
  notesPages: JSON.parse(localStorage.getItem("notesPages")) || [""],
  currentDate: new Date(),
  selectedDay: null,
  currentNotesPage: 0,
  isNotesFullscreen: false,

  // ---------------- DOM Elements ----------------
  initDOM: function() {
    // Chat Elements
    this.form = document.getElementById('chat-form');
    this.textarea = document.getElementById('user-input');
    this.conversation = document.getElementById('conversation');
    this.welcomeMsg = document.getElementById('welcome-message');
    this.optionBtn = document.getElementById('option-btn');
    this.optionMenu = document.getElementById('option-menu');
    this.sendBtn = document.getElementById('send-btn');

    // Panels
    this.notesPanel = document.getElementById('notes-panel');
    this.calendarPanel = document.getElementById('calendar-panel');
    this.allEventsPanel = document.getElementById('all-events-panel');

    // Notes
    this.notesTextarea = document.getElementById("notes-textarea");
    this.notesPageIndicator = document.getElementById("notes-page-indicator");
    this.notesBtn = document.getElementById('notes-btn');
    this.closeNotes = document.getElementById('close-notes');
    this.saveNotesBtn = document.getElementById('save-notes');
    this.nextNotesBtn = document.getElementById('next-notes');
    this.backNotesBtn = document.getElementById('back-notes');
    this.fullScreenNotesBtn = document.getElementById('fullscreen-notes');

    // Calendar
    this.calendarGrid = document.getElementById('calendar-grid');
    this.monthYearLabel = document.getElementById('month-year');
    this.prevMonthBtn = document.getElementById('prev-month');
    this.nextMonthBtn = document.getElementById('next-month');
    this.eventTextInput = document.getElementById('event-text');
    this.addCalendarEventBtn = document.getElementById('add-calendar-event');
    this.calendarBtn = document.getElementById('calendar-btn');
    this.closeCalendarBtn = document.getElementById('close-calendar');

    // All Events
    this.allEventsList = document.getElementById('events-list');
    this.allEventsBtn = document.getElementById('view-events-btn');
    this.closeAllEventsBtn = document.getElementById('close-events');

    // Dark Mode
    this.darkToggle = document.getElementById('dark-toggle');
    this.savedMode = localStorage.getItem('chatMode');
  },

  // ---------------- Init ----------------
  init: function() {
    this.initDOM();
    this.initDarkMode();
    this.initChat();
    this.initOptionsMenu();
    this.initNotes();
    this.initCalendar();
    this.initAllEvents();
  },

  // ---------------- Dark Mode ----------------
  initDarkMode: function() {
    if(this.savedMode === 'dark'){
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    this.setDarkMode(document.body.classList.contains('dark-mode'));

    this.darkToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('chatMode', isDark ? 'dark' : 'light');
      this.setDarkMode(isDark);
    });
  },

  setDarkMode: function(isDark) {
    this.darkToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';

    // Panels
    [this.notesPanel, this.calendarPanel, this.allEventsPanel].forEach(panel => {
      if(panel){
        panel.style.backgroundColor = isDark ? '#1e1e1e' : '#fff';
        panel.style.color = isDark ? '#fff' : '#000';
        panel.style.border = isDark ? '1px solid #555' : '1px solid #ccc';
      }
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
        msg.style.backgroundColor = isDark ? '#ffffff' : '#e0e0e0';
        msg.style.color = '#000000';
        msg.style.alignSelf = 'flex-end';
        msg.style.textAlign = 'right';
      } else if(msg.classList.contains('bot')){
        msg.style.backgroundColor = isDark ? '#2c2c2e' : '#ffffff';
        msg.style.color = isDark ? '#ffffff' : '#000000';
        msg.style.alignSelf = 'flex-start';
        msg.style.textAlign = 'left';
      }
    });

    // Welcome message
    if(this.welcomeMsg){
      this.welcomeMsg.style.color = isDark ? '#ffffff' : '#888';
    }

    // Input bar
    const inputBar = document.getElementById('input-bar');
    if(inputBar){
      inputBar.style.backgroundColor = isDark ? '#1e1e1e' : '#fff';
      inputBar.style.border = isDark ? '1px solid #333' : 'none';
      inputBar.style.boxShadow = isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)';
    }

    if(this.textarea){
      this.textarea.style.color = isDark ? '#ffffff' : '#000000';
    }
  },

  // ---------------- Chat ----------------
  initChat: function() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.sendMessage();
    });

    this.sendBtn.addEventListener('click', () => this.sendMessage());

    this.textarea.addEventListener('keydown', e => {
      if(e.key === 'Enter'){
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        this.textarea.value = this.textarea.value.substring(0, start) + "\n" + this.textarea.value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
        this.autoExpand();
      }
    });

    this.textarea.addEventListener('input', () => this.autoExpand());
  },

  sendMessage: function() {
    const msg = this.textarea.value.trim();
    if(!msg) return;

    if(this.welcomeMsg){
      this.welcomeMsg.style.transition = 'opacity 0.3s';
      this.welcomeMsg.style.opacity = 0;
      setTimeout(()=> this.welcomeMsg.remove(), 300);
    }

    this.addMessage(msg, 'user');
    this.textarea.value = '';
    this.autoExpand();

    setTimeout(()=> this.addMessage("🤖 This is a bot reply.", 'bot'), 500);
  },

  addMessage: function(msg, sender='user') {
    const div = document.createElement('div');
    div.className = sender;
    div.textContent = msg;
    this.conversation.appendChild(div);
    this.conversation.scrollTop = this.conversation.scrollHeight;
  },

  autoExpand: function() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = Math.min(this.textarea.scrollHeight, 140) + 'px';
    this.conversation.scrollTop = this.conversation.scrollHeight;
  },

  // ---------------- Options Menu ----------------
  initOptionsMenu: function() {
    this.optionBtn.addEventListener('click', () => {
      this.optionMenu.style.display = this.optionMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', e => {
      if(!this.optionBtn.contains(e.target) && !this.optionMenu.contains(e.target)){
        this.optionMenu.style.display = 'none';
      }
    });
  },

  // ---------------- Notes ----------------
  initNotes: function() {
    const self = this;

    function loadNotes(page){
      self.notesTextarea.value = self.notesPages[page] || "";
      self.notesPageIndicator.textContent = `Page ${page+1} / 10`;
    }

    function saveCurrentNotes(){
      self.notesPages[self.currentNotesPage] = self.notesTextarea.value;
      localStorage.setItem("notesPages", JSON.stringify(self.notesPages));
    }

    self.nextNotesBtn.addEventListener("click", ()=> {
      saveCurrentNotes();
      if(self.currentNotesPage < 9){
        self.currentNotesPage++;
        if(!self.notesPages[self.currentNotesPage]) self.notesPages[self.currentNotesPage] = "";
        loadNotes(self.currentNotesPage);
      } else alert("⚠️ Maximum 10 pages reached!");
    });

    self.backNotesBtn.addEventListener("click", ()=> {
      if(self.currentNotesPage > 0){
        saveCurrentNotes();
        self.currentNotesPage--;
        loadNotes(self.currentNotesPage);
      } else alert("⚠️ First page!");
    });

    self.saveNotesBtn.addEventListener("click", ()=> {
      saveCurrentNotes();
      alert("✅ Notes saved!");
    });

    self.notesBtn.addEventListener("click", ()=> {
      self.notesPanel.style.display = "flex";
      loadNotes(self.currentNotesPage);
    });

    self.closeNotes.addEventListener("click", ()=> self.notesPanel.style.display = "none");

    self.fullScreenNotesBtn.addEventListener("click", ()=> {
      if(!self.isNotesFullscreen){
        self.notesPanel.style.position = "fixed";
        self.notesPanel.style.top = "50%";
        self.notesPanel.style.left = "50%";
        self.notesPanel.style.transform = "translate(-50%, -50%)";
        self.notesPanel.style.width = "100vw";
        self.notesPanel.style.height = "100vh";
        self.notesPanel.style.zIndex = "9999";
        self.notesPanel.style.borderRadius = "0";
        self.notesPanel.style.display = "flex";
        self.notesPanel.style.flexDirection = "column";
        self.notesPanel.style.justifyContent = "center";
        self.notesPanel.style.alignItems = "center";
        self.fullScreenNotesBtn.textContent = "🗗 Minimize";
      } else {
        self.notesPanel.style.position = "";
        self.notesPanel.style.top = "";
        self.notesPanel.style.left = "";
        self.notesPanel.style.transform = "";
        self.notesPanel.style.width = "";
        self.notesPanel.style.height = "";
        self.notesPanel.style.zIndex = "";
        self.notesPanel.style.borderRadius = "";
        self.notesPanel.style.display = "flex";
        self.notesPanel.style.flexDirection = "";
        self.notesPanel.style.justifyContent = "";
        self.notesPanel.style.alignItems = "";
        self.fullScreenNotesBtn.textContent = "⛶ Fullscreen";
      }
      self.isNotesFullscreen = !self.isNotesFullscreen;
    });
  },

  // ---------------- Calendar ----------------
  initCalendar: function() {
    const self = this;

    function saveEvents(){
      localStorage.setItem('calendarEvents', JSON.stringify(self.calendarEvents));
      self.renderAllEvents();
    }

    function renderCalendar(){
      self.calendarGrid.innerHTML = '';
      const today = new Date();

      ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
        const hd = document.createElement('div');
        hd.textContent = d;
        hd.style.fontWeight = 'bold';
        hd.style.textAlign = 'center';
        hd.style.padding = '6px 0';
        self.calendarGrid.appendChild(hd);
      });

      const year = self.currentDate.getFullYear();
      const month = self.currentDate.getMonth();
      self.monthYearLabel.textContent = `${self.currentDate.toLocaleString('default',{month:'long'})} ${year} - Today: ${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month+1, 0).getDate();

      for(let i=0;i<firstDay;i++) self.calendarGrid.appendChild(document.createElement('div'));

      for(let day=1; day<=daysInMonth; day++){
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.style.padding = '6px';
        dayDiv.style.border = '1px solid #ccc';
        dayDiv.style.textAlign = 'center';
        dayDiv.style.cursor = 'pointer';

        const dayKey = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const eventsForDay = self.calendarEvents.filter(e => e.date === dayKey);
        if(eventsForDay.length > 0){
          dayDiv.style.fontWeight='bold';
          dayDiv.title = eventsForDay.map(e => e.text).join('\n');
        }

        if(self.selectedDay === day){
          dayDiv.style.background = '#949694ff';
          dayDiv.style.color = 'white';
        }

        if(day === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
          dayDiv.style.borderRadius = '50%';
          dayDiv.style.border = '2px solid #2196F3';
          dayDiv.style.fontWeight = 'bold';
        }

        dayDiv.addEventListener('click', ()=>{
          self.selectedDay = day;
          renderCalendar();
        });

        self.calendarGrid.appendChild(dayDiv);
      }
    }

    self.renderCalendar = renderCalendar;

    // Buttons
    self.prevMonthBtn.addEventListener('click', ()=> {
      self.currentDate.setMonth(self.currentDate.getMonth()-1);
      self.selectedDay = null;
      renderCalendar();
    });
    self.nextMonthBtn.addEventListener('click', ()=> {
      self.currentDate.setMonth(self.currentDate.getMonth()+1);
      self.selectedDay = null;
      renderCalendar();
    });

    self.addCalendarEventBtn.addEventListener('click', ()=> {
      if(!self.selectedDay || !self.eventTextInput.value.trim()){
        alert('Please select a day and enter event text.');
        return;
      }
      const dateKey = `${self.currentDate.getFullYear()}-${String(self.currentDate.getMonth()+1).padStart(2,'0')}-${String(self.selectedDay).padStart(2,'0')}`;
      self.calendarEvents.push({date: dateKey, text: self.eventTextInput.value.trim()});
      saveEvents();
      self.eventTextInput.value = '';
      renderCalendar();
    });

    self.calendarBtn.addEventListener('click', ()=> {
      self.calendarPanel.style.display = self.calendarPanel.style.display==='flex'?'none':'flex';
    });
    self.closeCalendarBtn.addEventListener('click', ()=> self.calendarPanel.style.display='none');

    // Auto-refresh
    setInterval(()=>{
      const now = new Date();
      if(now.getDate() !== self.currentDate.getDate() ||
         now.getMonth() !== self.currentDate.getMonth() ||
         now.getFullYear() !== self.currentDate.getFullYear()){
        self.currentDate = now;
        self.selectedDay = null;
        renderCalendar();
      }
    }, 60000);

    renderCalendar();
  },

  // ---------------- All Events ----------------
  initAllEvents: function() {
    const self = this;

    function renderAllEvents(){
      if(!self.allEventsList) return;
      self.allEventsList.innerHTML = '';

      if(!self.calendarEvents || self.calendarEvents.length===0){
        const li = document.createElement('div');
        li.textContent = "No events yet!";
        li.style.padding='4px';
        self.allEventsList.appendChild(li);
        return;
      }

      self.calendarEvents.forEach((ev,index)=>{
        const li = document.createElement('div');
        li.style.display='flex';
        li.style.justifyContent='space-between';
        li.style.alignItems='center';
        li.style.padding='4px 0';

        const textSpan = document.createElement('span');
        textSpan.textContent = `${ev.date}: ${ev.text}`;
        textSpan.style.cursor='pointer';
        textSpan.addEventListener('click', ()=>{
          const [y,m,d] = ev.date.split('-').map(Number);
          self.currentDate.setFullYear(y,m-1);
          self.selectedDay = d;
          self.renderCalendar();
          if(self.allEventsPanel) self.allEventsPanel.style.display='none';
          if(self.calendarPanel) self.calendarPanel.style.display='flex';
        });

        const delBtn = document.createElement('button');
        delBtn.textContent='❌';
        delBtn.style.marginLeft='8px';
        delBtn.addEventListener('click', ()=>{
          if(confirm('Delete this event?')){
            self.calendarEvents.splice(index,1);
            localStorage.setItem('calendarEvents', JSON.stringify(self.calendarEvents));
            renderAllEvents();
            self.renderCalendar();
          }
        });

        li.appendChild(textSpan);
        li.appendChild(delBtn);
        self.allEventsList.appendChild(li);
      });
    }

    self.renderAllEvents = renderAllEvents;

    if(self.allEventsBtn){
      self.allEventsBtn.addEventListener('click', ()=>{
        renderAllEvents();
        if(self.allEventsPanel) self.allEventsPanel.style.display='flex';
        if(self.notesPanel) self.notesPanel.style.display='none';
        if(self.calendarPanel) self.calendarPanel.style.display='none';
        if(self.optionMenu) self.optionMenu.style.display='none';
      });
    }

    if(self.closeAllEventsBtn){
      self.closeAllEventsBtn.addEventListener('click', ()=> self.allEventsPanel.style.display='none');
    }
  }
};

// ---------------- Initialize ----------------
document.addEventListener('DOMContentLoaded', ()=> ChatApp.init());