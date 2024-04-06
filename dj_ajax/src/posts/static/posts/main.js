const postBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

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
                console.log(response)
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
                <div class="col-2"><a href="#" class="btn btn-primary">Details...</a></div>
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

get_data()