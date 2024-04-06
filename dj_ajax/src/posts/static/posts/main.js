const postBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

let visible = 3

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
                <div class="col-2"><a href="#" class="btn btn-primary">${el.liked ? `Unlike(${el.count})`: `Like(${el.count})`}</a></div>
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