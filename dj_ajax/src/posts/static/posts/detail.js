const postBox = document.getElementById('post-box')
const backBtn = document.getElementById('back-btn')
const url = window.location.href + "data/"
const spinnerBox = document.getElementById('spinner-box')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

backBtn.addEventListener('click', ()=>{
    history.back()
})

$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        const data = response.data

        if (data.logged_in !== data.author){
            console.log('Different')
        }else{
            console.log('The same')
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }

        const titleEl = document.createElement('h3')
        titleEl.setAttribute('class', 'mt-3')
        titleEl.setAttribute('id', 'title')

        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class', 'mt-1')
        bodyEl.setAttribute('id', 'body')

        titleEl.textContent = data.title
        bodyEl.textContent = data.body

        postBox.appendChild(titleEl)
        postBox.appendChild(bodyEl)


        spinnerBox.classList.add('not-visible')
    },
    error: function(error){
        console.log(error);
    }
})