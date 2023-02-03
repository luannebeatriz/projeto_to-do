// seleção de elementos
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const filterSelect = document.querySelector('#filter-select');
const searchInput = document.querySelector('#search-input');

let oldInputValue;
let todoArrayData = [];
let filterType = 'all';
let inputFilterArray = [];
let inputFilterText = '';
let delayTimer;

// funções
const saveTodo = (text) => {
  for (let i = 0; i < todoArrayData.length; i++) {
    if (todoArrayData[i].text === text) {
      alert('Tarefa já existente.');
      return;
    }
  }
  displayItem({ text: text });
  saveItem(text);
};

const onInit = () => {
  loadLocalStorage();
  reloadAllData();
};

const reloadAllData = () => {
  cleanOldList();
  if (todoArrayData.length === 0) {
    return;
  }
  if (inputFilterText) {
    inputFilterArray.forEach((element) => {
      displayItem(element);
    });
  } else {
    todoArrayData.forEach((element) => {
      displayItem(element);
    });
  }
};

const cleanOldList = () => {
  todoList.innerHTML = '';
};

const displayItem = (listItem) => {
  if (!listItem) {
    return;
  }
  const todo = document.createElement('div');
  todo.classList.add('todo');
  if (listItem.isDone) {
    if (filterType === 'todo') {
      todo.classList.add('hide');
      todo.classList.remove('todo');
    } else {
      todo.classList.add('done');
    }
  } else if (!listItem.isDone && filterType === 'done') {
    todo.classList.add('hide');
    todo.classList.remove('todo');
  }

  const todoTitle = document.createElement('h3');
  todoTitle.innerText = listItem.text;
  todoTitle.title = listItem.text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement('button');
  doneBtn.classList.add('finish-todo');
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement('button');
  editBtn.classList.add('edit-todo');
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('remove-todo');
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  todoList.appendChild(todo);

  if (todoInput.value) {
    todoInput.value = '';
    todoInput.focus();
  }
};

const toggleForms = () => {
  editForm.classList.toggle('hide');
  todoForm.classList.toggle('hide');
  todoList.classList.toggle('hide');
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll('.todo');

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector('h3');

    if (todoTitle.innerText === oldInputValue) {
      updateItem(oldInputValue, text);
    }
  });
};

const updateItem = (oldValue, newValue) => {
  todoArrayData.forEach((item) => {
    if (item.text === oldValue) {
      item.text = newValue;
    }
  });

  updateLocalStorage(todoArrayData);
};

const updateLocalStorage = (updatedList) => {
  localStorage.setItem('todolist', JSON.stringify(updatedList));
  todoArrayData = updatedList;
  reloadAllData();
};

const saveItem = (text, isDone = false) => {
  const item = {
    isDone: isDone,
    text: text,
  };

  todoArrayData.push(item);
  updateLocalStorage(todoArrayData);
};

const loadLocalStorage = () => {
  const localList = JSON.parse(localStorage.getItem('todolist'));
  todoArrayData = localList !== null ? localList : [];
};

const finishItem = (text) => {
  todoArrayData.forEach((item) => {
    if (item.text === text) {
      item.isDone = !item.isDone;
    }
  });

  updateLocalStorage(todoArrayData);
};

const removeItem = (text) => {
  const filteredArray = todoArrayData.filter((element) => {
    if (element.text !== text) {
      return element;
    }
  });

  updateLocalStorage(filteredArray);
  reloadAllData();
};

const searchText = (text) => {
  if (!text) {
    inputFilterArray = [];
  } else {
    inputFilterArray = todoArrayData.filter((element) => {
      return element.text.toLowerCase().includes(text.toLowerCase());
    });
  }

  reloadAllData();
};

// eventos
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  // if (inputValue !== "" &&
  //   inputValue !== null &&
  //   inputValue !== undefined
  //   inputValue !== false) {

  //   }

  if (inputValue)
    if (inputValue) {
      saveTodo(inputValue);
    }
});

document.addEventListener('click', (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest('div');
  let todoTitle;

  if (parentEl && parentEl.querySelector('h3')) {
    todoTitle = parentEl.querySelector('h3').innerText;
  }

  if (targetEl.classList.contains('finish-todo')) {
    parentEl.classList.toggle('done');
    finishItem(todoTitle);
  }

  if (targetEl.classList.contains('remove-todo')) {
    removeItem(todoTitle);
  }

  if (targetEl.classList.contains('edit-todo')) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener('click', (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

filterSelect.addEventListener('change', (e) => {
  const newType = e.target.value;

  filterType = newType;
  reloadAllData();
});

searchInput.addEventListener('keyup', (e) => {
  inputFilterText = e.target.value;

  clearTimeout(delayTimer);
  delayTimer = setTimeout(() => {
    searchText(inputFilterText);
  }, 220);
});
