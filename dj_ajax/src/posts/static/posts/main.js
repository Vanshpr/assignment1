const postBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const url = window.location.href
const dropzone = document.getElementById('my-dropzone')
const addBtn = document.getElementById('add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]

let visible = 3

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const deleted = localStorage.getItem('title')
if (deleted){
    localStorage.clear()
}

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type: 'POST',
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken' : csrftoken,
                'pk':clickedId,
            },
            success: function(response){
                clickedBtn.textContent = response.liked ? `Unlike(${response.count})`: `Like(${response.count})`
            },
            error: function(error){
                console.log(error)
            }
        })
    }))
    console.log(likeUnlikeForms)
}

const get_data = () => {
  endBox.classList.add('not-visible')
  $.ajax({
    type: 'GET',
    url: `/api/posts/${visible}/`,
    success: resp => {
      console.log(resp)
      // Give some time for the spinner to appear.
      setTimeout(() => {
        spinnerBox.classList.add('not-visible')
        // postBox.innerHTML = ''
        resp.data.forEach( el => {
          postBox.innerHTML += `
            <div class="card mb-2">
            <!-- <img src="..." class="card-img-top" alt="..."> --!>
            <div class="card-body">
              <h5 class="card-title">${el.title}</h5>
              <p class="card-text">${el.body}</p>
            </div>
            <div class="card-footer">
              <div class="row">
                <div class="col-2"><a href="${window.location.href}${el.id}" class="btn btn-primary">Details...</a></div>
                <div class="col-2">
                <form class='like-unlike-forms' data-form-id="${el.id}">
                    <button href="#" class="btn btn-primary" id="like-unlike-${el.id}"> ${el.liked ? `Unlike(${el.count})`: `Like(${el.count})`}</button>
                </form>    
                </div>
              </div>
            </div>
          </div>
          `
        })
        if (resp.size == 0) {
          endBox.innerHTML = 'No posts added yet...'
        } else if (visible < resp.size) {
          endBox.classList.remove('not-visible')
        }
        likeUnlikePosts()
      }, 100)
    },
    error: err => {
      console.error(err)
    }
  })
}

loadBtn.addEventListener('click', () => {
  spinnerBox.classList.remove('not-visible')
  visible += 3
  get_data()
})

let newPostId = null
postForm.addEventListener('submit', e => {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title':title.value,
            'body':body.value
        },
        success: function(response){
            newPostId = response.id
            postBox.insertAdjacentHTML('afterbegin',`
            <div class="card mb-2">
            <!-- <img src="..." class="card-img-top" alt="..."> --!>
            <div class="card-body">
              <h5 class="card-title">${response.title}</h5>
              <p class="card-text">${response.body}</p>
            </div>
            <div class="card-footer">
              <div class="row">
                <div class="col-2"><a href="${url}${response.id}" class="btn btn-primary">Details...</a></div>
                <div class="col-2">
                <form class='like-unlike-forms' data-form-id="${response.id}">
                    <button class="btn btn-primary" id="like-unlike-${response.id}">Like (0) </button>
                </form>    
                </div>
              </div>
            </div>
          </div>
            `)
            likeUnlikePosts()
           // $("#addPostModal").modal("hide")
            //postForm.reset()
        },
        error: function(error){
            console.log(error)
        }
    })
})

addBtn.addEventListener('click', ()=> {
  dropzone.classList.remove('not-visible')
})

closeBtns.forEach(btn=> btn.addEventListener('click', ()=>{
  postForm.reset()
  if (!dropzone.classList.contains('not-visible')) {
      dropzone.classList.add('not-visible')
  }
  const myDropzone = Dropzone.forElement("#my-dropzone")
  myDropzone.removeAllFiles(true)
}))

addBtn.addEventListener('click', ()=> {
  dropzone.classList.remove('not-visible')
})

closeBtns.forEach(btn=> btn.addEventListener('click', ()=>{
  postForm.reset()
  if (!dropzone.classList.contains('not-visible')) {
      dropzone.classList.add('not-visible')
  }
  const myDropzone = Dropzone.forElement("#my-dropzone")
  myDropzone.removeAllFiles(true)
}))

dropzone.autoDiscover = false
const myDropzone = new Dropzone('#my-dropzone', {
  url: 'upload/',
  init: function() {
      this.on('sending', function(file, xhr, formData){
        formData.append('csrfmiddlewaretoken', csrftoken);
        if (newPostId) {
            formData.append('new_post_id', newPostId);
        }
      })
  },
  maxFiles: 5,
  maxFilessize: 4,
  acceptedFiles: '.png, .jpg, .jpeg'
})


get_data()