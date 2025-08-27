document.addEventListener('DOMContentLoaded', () => {
  // ================= Elements =================
  const welcomeMessage = document.getElementById('welcome-message');
  const conversation = document.getElementById('conversation');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const darkToggle = document.getElementById('dark-toggle');
  const optionBtn = document.getElementById('option-btn');
  const optionMenu = document.getElementById('option-menu');
  const notesBtn = document.getElementById('notes-btn');
  const notesPanel = document.getElementById('notes-panel');
  const closeNotes = document.getElementById('close-notes');
  const calendarBtn = document.getElementById('calendar-btn');
  const calendarPanel = document.getElementById('calendar-panel');
  const closeCalendar = document.getElementById('close-calendar');
  const saveNotes = document.getElementById('save-notes');
  const notesInput = document.getElementById('notes-input');
  const nextNotes = document.getElementById('next-notes');
  const backNotes = document.getElementById('back-notes');
  const addCalendarEventBtn = document.getElementById('add-calendar-event');
  const eventTextInput = document.getElementById('event-text');
  const monthYearLabel = document.getElementById('month-year');
  const calendarGrid = document.getElementById('calendar-grid');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const viewEventsBtn = document.getElementById('view-events-btn');
  const allEventsPanel = document.getElementById('all-events-panel');
  const eventsList = document.getElementById('events-list');
  const closeEvents = document.getElementById('close-events');
  const fullScreenNotesBtn = document.getElementById('fullscreen-notes');

  // ================= Notes Setup =================
  const pageIndicator = document.createElement("div");
  pageIndicator.id = "page-indicator";
  pageIndicator.style.textAlign = "center";
  pageIndicator.style.marginTop = "8px";
  notesPanel.appendChild(pageIndicator);

  let currentPage = 0;
  const totalPages = 10;

  function updateIndicator() {
    pageIndicator.textContent = `Page ${currentPage + 1} / ${totalPages}`;
  }

  function loadNotes(page) {
    notesInput.value = localStorage.getItem('myNotes_' + page) || "";
    updateIndicator();
  }

  function saveCurrentNotes() {
    localStorage.setItem('myNotes_' + currentPage, notesInput.value);
  }

  loadNotes(currentPage);

  // ================= Chat =================
  function addMessage(content, sender='user') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'ai' ? 'ai-message' : 'user-message');
    msgDiv.innerHTML = content.replace(/\n/g, '<br>');
    conversation.appendChild(msgDiv);
    conversation.scrollTop = conversation.scrollHeight;
  }

  function sendMessage() {
    let text = userInput.value.replace(/\r/g, '').replace(/\u200B/g, '').trim();
    if (!text) return;

    if (welcomeMessage.style.display !== 'none') {
      welcomeMessage.style.display = 'none';
      conversation.style.display = 'flex';
    }

    addMessage(text, 'user');
    userInput.value = '';
    resizeTextarea();
    conversation.style.marginBottom = '160px';
    setTimeout(() => addMessage("This is A.S.T.R.A's response.", 'ai'), 500);
  }

  sendBtn.addEventListener('click', sendMessage);

  // ================= Textarea Handling =================
  function resizeTextarea() {
    const maxHeight = 150;
    userInput.style.height = 'auto';
    const newHeight = Math.min(userInput.scrollHeight, maxHeight);
    userInput.style.height = newHeight + 'px';
    conversation.style.marginBottom = 160 + newHeight - 40 + 'px';
    conversation.scrollTop = conversation.scrollHeight;
  }

  userInput.addEventListener('input', resizeTextarea);
  userInput.addEventListener('focus', () => {
    setTimeout(() => {
      userInput.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      userInput.scrollTop = userInput.scrollHeight;
    }, 300);
  });

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ================= Dark Mode =================
  const savedMode = localStorage.getItem('chatMode');
  if (savedMode === 'dark') {
    document.body.classList.add('dark-mode'); 
    darkToggle.textContent = '☀️ Light Mode';
    setPanelsDarkMode(true);
  } else {
    darkToggle.textContent = '🌙 Dark Mode';
    setPanelsDarkMode(false);
  }

  darkToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    darkToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('chatMode', isDark ? 'dark' : 'light');
    setPanelsDarkMode(isDark);
  });

  function setPanelsDarkMode(isDark) {
    [notesPanel, calendarPanel, allEventsPanel].forEach(panel => {
      panel.style.backgroundColor = isDark ? '#1e1e1e' : '#fff';
      panel.style.color = isDark ? '#f5f5f5' : '#000';
      panel.style.border = isDark ? '1px solid #555' : '1px solid #ccc';
    });
  }

  // ================= Options Menu =================
  optionBtn.addEventListener('click', () => {
    optionMenu.style.display = optionMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!optionBtn.contains(e.target) && !optionMenu.contains(e.target)) {
      optionMenu.style.display = 'none';
    }
  });

  // ================= Notes Navigation =================
  notesBtn.addEventListener('click', () => {
    notesPanel.style.display = notesPanel.style.display === 'flex' ? 'none' : 'flex';
    calendarPanel.style.display = 'none';
    allEventsPanel.style.display = 'none';
    optionMenu.style.display = 'none';
  });

  closeNotes.addEventListener('click', () => notesPanel.style.display = 'none');
  saveNotes.addEventListener('click', () => { saveCurrentNotes(); alert("✅ Notes saved!"); });
  nextNotes.addEventListener('click', () => { 
    if(currentPage < totalPages-1){ 
      saveCurrentNotes(); 
      currentPage++; 
      loadNotes(currentPage);
    } else { alert("⚠️ Last page!"); }
  });
  backNotes.addEventListener('click', () => { 
    if(currentPage>0){ 
      saveCurrentNotes(); 
      currentPage--; 
      loadNotes(currentPage);
    } else{ alert("⚠️ First page!"); }
  });

  // ================= Notes Fullscreen =================
  let isFullScreen = false;
  const originalNotesStyles = { width: notesPanel.style.width, height: notesPanel.style.height, top: notesPanel.style.top, left: notesPanel.style.left, position: notesPanel.style.position };

  fullScreenNotesBtn.addEventListener('click', () => {
    if(!isFullScreen){
      notesPanel.style.position='fixed'; 
      notesPanel.style.width='60%'; 
      notesPanel.style.height='60%';
      notesPanel.style.top='20%'; 
      notesPanel.style.left='20%'; 
      notesPanel.style.zIndex='1000'; 
      notesPanel.style.flexDirection='column';
      isFullScreen = true;
    } else {
      notesPanel.style.position=originalNotesStyles.position;
      notesPanel.style.width=originalNotesStyles.width;
      notesPanel.style.height=originalNotesStyles.height;
      notesPanel.style.top=originalNotesStyles.top;
      notesPanel.style.left=originalNotesStyles.left;
      isFullScreen = false;
    }
  });

  // ================= Calendar =================
  let currentDate = new Date();
  let calendarEvents = JSON.parse(localStorage.getItem('calendarEvents')) || [];
  let selectedDay = null;

  function saveEvents() { localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents)); }

  function renderCalendar() {
    calendarGrid.innerHTML = '';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d=>{
      const hd=document.createElement('div'); 
      hd.textContent=d; 
      hd.style.fontWeight='bold'; 
      hd.style.textAlign='center'; 
      hd.style.padding='6px 0'; 
      calendarGrid.appendChild(hd);
    });

    const year=currentDate.getFullYear(), month=currentDate.getMonth();
    monthYearLabel.textContent=`${currentDate.toLocaleString('default',{month:'long'})} ${year}`;
    const firstDay=new Date(year,month,1).getDay();
    const daysInMonth=new Date(year,month+1,0).getDate();

    for(let i=0;i<firstDay;i++) calendarGrid.appendChild(document.createElement('div'));

    for(let day=1;day<=daysInMonth;day++){
      const dayDiv=document.createElement('div'); 
      dayDiv.textContent=day; 
      dayDiv.style.padding='6px'; 
      dayDiv.style.border='1px solid #ccc';
      dayDiv.style.textAlign='center'; 
      dayDiv.style.cursor='pointer';
      const dayKey=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      if(calendarEvents.filter(e=>e.date===dayKey).length>0){ 
        dayDiv.style.fontWeight='bold'; 
        dayDiv.title=calendarEvents.filter(e=>e.date===dayKey).map(e=>e.text).join('\n');
      }
      if(selectedDay===day){dayDiv.style.background='#4CAF50'; dayDiv.style.color='white';}
      const today=new Date(); 
      if(day===today.getDate() && month===today.getMonth() && year===today.getFullYear()){
        dayDiv.style.fontWeight='bold'; 
        dayDiv.style.backgroundColor='#fff'; 
        dayDiv.style.color='#000'; 
        dayDiv.style.borderRadius='50%';
      }
      dayDiv.addEventListener('click',()=>{selectedDay=day; renderCalendar();});
      calendarGrid.appendChild(dayDiv);
    }
  }

  prevMonthBtn.addEventListener('click',()=>{currentDate.setMonth(currentDate.getMonth()-1); selectedDay=null; renderCalendar();});
  nextMonthBtn.addEventListener('click',()=>{currentDate.setMonth(currentDate.getMonth()+1); selectedDay=null; renderCalendar();});
  addCalendarEventBtn.addEventListener('click',()=>{
    if(!selectedDay || !eventTextInput.value.trim()){alert('Please select a day and enter event text.'); return;}
    const dateKey=`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`;
    calendarEvents.push({date:dateKey,text:eventTextInput.value.trim()});
    saveEvents(); 
    eventTextInput.value=''; 
    renderCalendar();
  });

  calendarBtn.addEventListener('click',()=>{calendarPanel.style.display=calendarPanel.style.display==='flex'?'none':'flex'; notesPanel.style.display='none'; allEventsPanel.style.display='none'; optionMenu.style.display='none';});
  closeCalendar.addEventListener('click',()=>calendarPanel.style.display='none');

  setInterval(()=>{
    const now=new Date(); 
    if(now.getDate()!==currentDate.getDate()||now.getMonth()!==currentDate.getMonth()||now.getFullYear()!==currentDate.getFullYear()){
      currentDate=now; 
      selectedDay=null; 
      renderCalendar();
    }
  },60000);

  // ================= View All Events =================
  viewEventsBtn.addEventListener('click',()=>{
    calendarPanel.style.display='none'; 
    notesPanel.style.display='none'; 
    allEventsPanel.style.display='flex'; 
    optionMenu.style.display='none'; 
    renderAllEvents();
  });

  closeEvents.addEventListener('click',()=>allEventsPanel.style.display='none');

  function renderAllEvents(){
    eventsList.innerHTML='';
    if(calendarEvents.length===0){ eventsList.textContent='No events set.'; return;}
    calendarEvents.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach((ev,index)=>{
      const evDiv=document.createElement('div');
      evDiv.style.display='flex'; 
      evDiv.style.justifyContent='space-between'; 
      evDiv.style.alignItems='center';
      evDiv.style.border='1px solid #ccc'; 
      evDiv.style.borderRadius='6px'; 
      evDiv.style.padding='5px 8px';
      evDiv.style.background=document.body.classList.contains('dark-mode')?'#333':'#f5f5f5';
      evDiv.style.color=document.body.classList.contains('dark-mode')?'#fff':'#000'; 
      evDiv.style.marginBottom='5px';
      const textSpan=document.createElement('span'); 
      textSpan.textContent=`${ev.date} → ${ev.text}`;
      const deleteBtn=document.createElement('button'); 
      deleteBtn.textContent='❌'; 
      deleteBtn.style.background='none';
      deleteBtn.style.border='none'; 
      deleteBtn.style.cursor='pointer'; 
      deleteBtn.style.fontSize='14px'; 
      deleteBtn.style.color='#ff4d4d';
      deleteBtn.addEventListener('click',()=>{ 
        if(confirm('Are you sure you want to delete this event?')){ 
          calendarEvents.splice(index,1); 
          saveEvents(); 
          renderAllEvents(); 
          renderCalendar(); 
        }
      });
      evDiv.appendChild(textSpan); 
      evDiv.appendChild(deleteBtn); 
      eventsList.appendChild(evDiv);
    });
  }

  // ================= Initial Render =================
  renderCalendar();
  resizeTextarea();
});