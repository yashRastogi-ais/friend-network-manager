const state = {
  currentUser: {
    name: 'Alicia Stone',
    title: 'Product Designer',
    profileId: 'alicia-stone',
  },
  friends: [
    { id: 1, name: 'Maya Chen', title: 'Marketing Lead', status: 'Available' },
    { id: 2, name: 'Noah Brooks', title: 'Software Engineer', status: 'At meetup' },
    { id: 3, name: 'Leah Gomez', title: 'Community Manager', status: 'Online' },
    { id: 4, name: 'Ethan Park', title: 'Operations Lead', status: 'Offline' },
  ],
  requests: [
    { id: 5, name: 'Rina Nouri', title: 'UX Researcher', status: 'New' },
    { id: 6, name: 'Tariq Mendez', title: 'Product Strategist', status: 'New' },
    { id: 7, name: 'Lina Park', title: 'Community Ops', status: 'New' },
  ],
  suggestions: [
    { id: 8, name: 'Sofia Blake', title: 'Brand Designer', mutuals: 4 },
    { id: 9, name: 'Daniel Wu', title: 'Full Stack Dev', mutuals: 7 },
    { id: 10, name: 'Priya Shah', title: 'Community Ops', mutuals: 5 },
  ],
};

const friendList = document.getElementById('friendList');
const requestList = document.getElementById('requestList');
const suggestionList = document.getElementById('suggestionList');
const searchInput = document.getElementById('searchInput');
const totalFriendsStat = document.getElementById('totalFriendsStat');
const pendingRequestsStat = document.getElementById('pendingRequestsStat');
const mutualConnectionsStat = document.getElementById('mutualConnectionsStat');
const navRequestCount = document.getElementById('navRequestCount');
const miniFriends = document.getElementById('miniFriends');
const qrCanvas = document.getElementById('qrCanvas');
const profileLinkText = document.getElementById('profileLinkText');
const modalWindow = document.getElementById('modalWindow');
const modalTitle = document.getElementById('modalTitle');
const modalForm = document.getElementById('modalForm');
const formName = document.getElementById('formName');
const formCategory = document.getElementById('formCategory');
const formDescription = document.getElementById('formDescription');

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function avatarGradient(name) {
  const colors = [
    'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    'linear-gradient(135deg, #22c55e, #14b8a6)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
    'linear-gradient(135deg, #10b981, #0ea5e9)',
  ];
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function filterBySearch(items) {
  const value = (searchInput.value || '').trim().toLowerCase();
  if (!value) return items;

  return items.filter((item) => {
    const haystack = `${item.name} ${item.title || ''} ${item.status || ''} ${item.category || ''}`.toLowerCase();
    return haystack.includes(value);
  });
}

function renderFriends() {
  const friends = filterBySearch(state.friends);

  friendList.innerHTML = friends
    .map(
      (friend) => `
      <div class="user-card">
        <div class="user-main">
          <div class="avatar" style="background:${avatarGradient(friend.name)};">${initials(friend.name)}</div>
          <div class="user-meta">
            <strong>${friend.name}</strong>
            <span>${friend.title} • ${friend.status}</span>
          </div>
        </div>
        <div class="action-group">
          <button class="action-btn secondary">Message</button>
          <button class="action-btn reject" data-remove-id="${friend.id}">Remove</button>
        </div>
      </div>
    `
    )
    .join('');

  totalFriendsStat.textContent = state.friends.length;
  miniFriends.textContent = state.friends.length;

  document.querySelectorAll('[data-remove-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.removeId);
      state.friends = state.friends.filter((friend) => friend.id !== id);
      renderAll();
    });
  });
}

function renderRequests() {
  const requests = filterBySearch(state.requests);

  requestList.innerHTML = requests
    .map(
      (request) => `
      <div class="user-card">
        <div class="user-main">
          <div class="avatar" style="background:${avatarGradient(request.name)};">${initials(request.name)}</div>
          <div class="user-meta">
            <strong>${request.name}</strong>
            <span>${request.title}</span>
          </div>
        </div>
        <div class="action-group">
          <button class="action-btn accept" data-accept-id="${request.id}">Accept</button>
          <button class="action-btn reject" data-decline-id="${request.id}">Ignore</button>
        </div>
      </div>
    `
    )
    .join('');

  pendingRequestsStat.textContent = state.requests.length;
  navRequestCount.textContent = state.requests.length;

  document.querySelectorAll('[data-accept-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.acceptId);
      const accepted = state.requests.find((request) => request.id === id);
      if (accepted) {
        state.requests = state.requests.filter((request) => request.id !== id);
        state.friends.unshift({
          id: Date.now(),
          name: accepted.name,
          title: accepted.title,
          status: 'Available',
        });
      }
      renderAll();
    });
  });

  document.querySelectorAll('[data-decline-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.declineId);
      state.requests = state.requests.filter((request) => request.id !== id);
      renderAll();
    });
  });
}

function renderSuggestions() {
  const suggestions = filterBySearch(state.suggestions);

  suggestionList.innerHTML = suggestions
    .map(
      (person) => `
      <div class="user-card">
        <div class="user-main">
          <div class="avatar" style="background:${avatarGradient(person.name)};">${initials(person.name)}</div>
          <div class="user-meta">
            <strong>${person.name}</strong>
            <span>${person.title} • ${person.mutuals} mutuals</span>
          </div>
        </div>
        <div class="action-group">
          <button class="action-btn primary" data-connect-id="${person.id}">Connect</button>
        </div>
      </div>
    `
    )
    .join('');

  const mutualTotal = state.suggestions.reduce((sum, person) => sum + (person.mutuals || 0), 0);
  mutualConnectionsStat.textContent = mutualTotal;

  document.querySelectorAll('[data-connect-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.connectId);
      const selected = state.suggestions.find((person) => person.id === id);
      if (selected) {
        state.friends.unshift({
          id: Date.now(),
          name: selected.name,
          title: selected.title,
          status: 'Available',
        });
        state.suggestions = state.suggestions.filter((person) => person.id !== id);
      }
      renderAll();
    });
  });
}

function renderAll() {
  renderFriends();
  renderRequests();
  renderSuggestions();
}

function generateQrCode() {
  const data = JSON.stringify({
    type: 'friend-network-profile',
    profileId: state.currentUser.profileId,
    name: state.currentUser.name,
    title: state.currentUser.title,
  });

  profileLinkText.textContent = `circlelink://profile/${state.currentUser.profileId}`;

  QRCode.toCanvas(qrCanvas, data, {
    width: 180,
    margin: 1,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  }, (error) => {
    if (error) {
      console.error('QR code generation failed:', error);
    }
  });
}

function openModal(type) {
  modalWindow.classList.remove('hidden');
  modalTitle.textContent = type === 'group' ? 'Create New Group' : 'Create New Event';
  formName.value = '';
  formCategory.value = '';
  formDescription.value = '';

  if (type === 'event') {
    formCategory.placeholder = 'Example: Tech Meetup / Social Mixer';
  } else {
    formCategory.placeholder = 'Example: Design / Business / Community';
  }
}

function closeModal() {
  modalWindow.classList.add('hidden');
}

searchInput.addEventListener('input', renderAll);

document.getElementById('quickAddBtn').addEventListener('click', () => {
  const newFriend = {
    id: Date.now(),
    name: 'Olivia Martin',
    title: 'Event Coordinator',
    status: 'Available',
  };

  state.friends.unshift(newFriend);
  renderAll();
});

document.getElementById('createGroupBtn').addEventListener('click', () => openModal('group'));
document.getElementById('createEventBtn').addEventListener('click', () => openModal('event'));
document.getElementById('qrToggleBtn').addEventListener('click', () => {
  const section = document.querySelector('.qr-wrap');
  section.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

modalForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = formName.value.trim();
  const category = formCategory.value.trim();
  const description = formDescription.value.trim();

  if (!name || !category || !description) {
    return;
  }

  const item = {
    id: Date.now(),
    name,
    title: category,
    status: 'New',
    category,
    description,
  };

  if (modalTitle.textContent.includes('Group')) {
    state.suggestions.unshift({
      id: Date.now() + 1,
      name,
      title: category,
      mutuals: 2,
    });
  } else {
    state.requests.unshift({
      id: Date.now() + 2,
      name,
      title: `${category} Event`,
      status: 'Invitation',
    });
  }

  closeModal();
  renderAll();
});

generateQrCode();
renderAll();
