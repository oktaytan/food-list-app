//get elements
const itemList = document.querySelector(".items");
const httpForm = document.getElementById("httpForm");
const itemInput = document.getElementById("itemInput");
const imageInput = document.getElementById("imageInput");
const feedback = document.querySelector(".feedback");
const items = document.querySelector(".items");
const submtiBtn = document.getElementById("submitBtn");
let editedItemID = 0;

const url = 'https://5c852ae163a5850014a821df.mockapi.io/foods';


httpForm.addEventListener('submit', submitFood);

// submit food
function submitFood(e) {
  e.preventDefault();
  const foodValue = itemInput.value;
  const imgValue = imageInput.value;

  if (foodValue === '' || imgValue === '') {
    showFeedback('Please enter valid values.')
  } else {
    postFood(imgValue, foodValue);
    itemInput.value = '';
    imageInput.value = '';
  }
}

// load foods
document.addEventListener('DOMContentLoaded', function () {
  getFoods(showFoods);
});

// show feedback
function showFeedback(text) {
  feedback.textContent = text;
  feedback.classList.add('showItem');
  setTimeout(function () {
    feedback.classList.remove('showItem');
  }, 3000);
}

// get foods
function getFoods(cb) {
  const url = 'https://5c852ae163a5850014a821df.mockapi.io/foods';

  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);

  xhr.onload = function () {
    if (this.status === 200) {
      cb(this.responseText);
    } else {
      this.onerror();
    }
  }

  xhr.onerror = function () {
    console.log('There was an error.');
  }

  xhr.send();
}

// show foods
function showFoods(data) {
  let foods = JSON.parse(data);

  let info = '';

  foods.forEach(food => {
    info += `
    <li class="bg-dark list-group-item d-flex flex-column align-items-center justify-content-between flex-wrap item my-3">
      <img src="${food.avatar}" id='itemImage' class='itemImage img-thumbnail bg-dark' alt="">
      <h6 id="itemName" class="itemName text-light">${food.name}</h6>
      <div class="icons">

        <a href='#' class="itemIcon mx-2 edit-icon" data-id='${food.id}'>
          <i class="fas fa-edit"></i>
        </a>
        <a href='#' class="itemIcon mx-2 delete-icon" data-id='${food.id}'>
          <i class="fas fa-trash"></i>
        </a>
      </div>
    </li>
    `;
  });

  itemList.innerHTML = info;
  // get icons
  getIcons();
}

// post food to API
function postFood(img, foodName) {
  const avatar = `img/${img}.jpeg`;
  const name = foodName;
  const url = 'https://5c852ae163a5850014a821df.mockapi.io/foods';

  const xhr = new XMLHttpRequest();

  xhr.open('POST', url, true);

  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    getFoods(showFoods);
  }

  xhr.onerror = function () {
    console.log('There was an error.');
  }

  xhr.send(`avatar=${avatar}&name=${name}`);
}

// get icons
function getIcons() {
  const editIcons = document.querySelectorAll('.edit-icon');
  const deleteIcons = document.querySelectorAll('.delete-icon');

  deleteIcons.forEach(icon => {
    const itemID = icon.dataset.id;
    icon.addEventListener('click', function (e) {
      e.preventDefault();
      deleteFood(itemID);
    });
  });

  editIcons.forEach(icon => {
    const itemID = icon.dataset.id;
    icon.addEventListener('click', function (e) {
      e.preventDefault();
      const parent = e.target.parentElement.parentElement.parentElement;
      const img = parent.querySelector('.itemImage').src;
      const name = parent.querySelector('.itemName').textContent;
      editFood(parent, img, name, itemID);
    });
  })
}

// delete food from API
function deleteFood(id) {
  const url = `https://5c852ae163a5850014a821df.mockapi.io/foods/${id}`;

  const xhr = new XMLHttpRequest();

  xhr.open('DELETE', url, true);

  xhr.onload = function () {
    if (this.status === 200) {
      getFoods(showFoods);
    } else {
      this.onerror();
    }
  }

  xhr.onerror = function () {
    console.log('There was an error.');
  }

  xhr.send();
}

// edit food from DOM
function editFood(parent, img, name, itemID) {

  itemList.removeChild(parent);

  const imgIndex = img.indexOf('img/');
  const jpegIndex = img.indexOf('.jpeg');

  const avatar = img.slice(imgIndex + 4, jpegIndex);

  itemInput.value = name.trim();
  imageInput.value = avatar;
  editedItemID = itemID;
  submtiBtn.textContent = 'Edit food';
  httpForm.removeEventListener('submit', submitFood);
  httpForm.addEventListener('submit', editFoodAPI);
}

// edit food to API
function editFoodAPI(e) {
  e.preventDefault();
  const id = editedItemID;
  const foodValue = itemInput.value;
  const imgValue = imageInput.value;

  if (foodValue === '' || imgValue === '') {
    showFeedback('Please enter valid values.')
  } else {
    const img = `img/${imgValue}.jpeg`;
    const name = foodValue;

    const url = `https://5c852ae163a5850014a821df.mockapi.io/foods/${id}`;

    const xhr = new XMLHttpRequest();

    xhr.open('PUT', url, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
      reverseForm();
    }

    xhr.onerror = function () {
      console.log('There was an error.');
    }

    xhr.send(`avatar=${img}&name=${name}`);
  }
}

function reverseForm() {
  itemInput.value = '';
  imageInput.value = '';
  submtiBtn.textContent = 'Add food';
  httpForm.removeEventListener('submit', editFoodAPI);
  httpForm.addEventListener('submit', submitFood);
  getFoods(showFoods);
}