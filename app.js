const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const itemCount = document.getElementById('item-count');
const clearBtn = document.getElementById('clear-btn');
const filterBtns = document.querySelectorAll('.filter');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Save to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Render list based on filter
function render() {
  const filtered = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (filtered.length === 0) {
    todoList.innerHTML = `<li class="empty-message">No tasks here yet ✨</li>`;
  } else {
    todoList.innerHTML = filtered.map(todo => `
      <li class="todo-item" data-id="${todo.id}">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} />
        <span class="todo-text ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.text)}</span>
        <button class="delete-btn">✕</button>
      </li>
    `).join('');
  }

  const active = todos.filter(t => !t.completed).length;
  itemCount.textContent = `${active} item${active !== 1 ? 's' : ''} left`;
  updateFilterBtns();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateFilterBtns() {
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}

// Add todo
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todos.unshift({ id: Date.now(), text, completed: false });
  todoInput.value = '';
  saveTodos();
  render();
}

// Toggle complete
function toggleComplete(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

// Delete todo
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

// Clear completed
function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  render();
}

// Event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTodo();
});

clearBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Delegate events on the list
todoList.addEventListener('click', e => {
  const item = e.target.closest('.todo-item');
  if (!item) return;
  const id = Number(item.dataset.id);

  if (e.target.classList.contains('delete-btn')) {
    deleteTodo(id);
  } else if (e.target.type === 'checkbox') {
    toggleComplete(id);
  }
});

// Initial render
render();
