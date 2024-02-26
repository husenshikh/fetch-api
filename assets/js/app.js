const cl= console.log;


const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl= document.getElementById('content');
const userIdControl= document.getElementById('userId');
const cardContainer = document.getElementById('cardContainer');
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")
const loader= document.getElementById('loader');

const baseUrl= `https://jsonplaceholder.typicode.com`;

const postUrl= `${baseUrl}/posts/`;

const onDelete = (ele) => {                // seventh step post delete
    Swal.fire({
        title: "Do you want to remove this post?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: `Don't remove`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            cl(ele);
                let deleteId = ele.closest(".card").id;
                cl(deleteId);
                let deleteUrl = `${baseUrl}/posts/${deleteId}`;
                fetch(deleteUrl,{                     
                    method : "DELETE",
                    headers : {
                        'content-type' : 'application/json',
                        'token' : 'wrweertr'
                    }
                })
                .then (res => {
                    res.json()
                    document.getElementById(deleteId).remove()
                    Swal.fire({
                        title: `Post is deleteded successfully !!!`,
                        icon: `success`,
                        timer: 2000
                     })
                })

                .catch(err => {
                    cl(err)
                })
            
    } 
       
 });
    
 };

const onEdit = (ele) => {                   //fifth step
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId",editId);
    let editUrl = `${baseUrl}/posts/${editId}`;
    fetch(editUrl, {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'token' : 'wrweertr'
        }
    })
    .then(res => {
       return res.json()
    })
    .then(data => {
        cl(data)
        titleControl.value = data.title;
        contentControl.value = data.body;
        userIdControl.value = data.userId

        submitBtn.classList.add("d-none");
        updateBtn.classList.remove("d-none");
    })
    .catch(err => {
        cl(err)
    })
}

const  cardTeamplating = (arr) => {                         // second step
    cardContainer.innerHTML = arr.map(post => {
        return `
                <div class="card mb-4" id= "${post.id}">
                    <div class="card-header">
                        <h4 class="m-0">${post.title}</h4>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>    
                </div>
                `
    }).join("")
}

const creatCard = (obj) => {                            // fourth step
    let card = document.createElement("div");
    card.id = obj.id;
    card.className = "card mb-4";
    card.innerHTML = `
                    <div class="card-header">
                        <h4 class="m-0">${obj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>
                    `
                    cardContainer.append(card)
}

fetch(postUrl,{                     // first step 
    method : "GET",
    headers : {
        'content-type' : 'application/json',
        'token' : 'wrweertr'
    }
})
.then(res => {
    return res.json()
})
.then(data => {
    cl(data)
    cardTeamplating(data)
})
.catch(err => {
    cl(err)
})

const onPostSubmit = (eve) => {              // third step
    eve.preventDefault()
    let obj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    cl(obj)

    fetch(postUrl, {
        method : "POST",
        headers : {
            'content-type' : 'application/json',
            'token' : 'wrweertr'
        }
    })
    .then(res => {
       return res.json()
    })
    .then(data => {
        cl(data)
        obj.id = data.id;
        creatCard(obj)
        Swal.fire({
            title: `Post is Submited successfully !!!`,
            icon: `success`,
            timer: 2000
         })
      
    })
    .catch(err => {
        cl(err)
    })
}

const onPostUpdate = () => {          // sixth step
    let updatedObj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    cl(updatedObj)
    let updateId = localStorage.getItem("editId");
    let updateUrl = `${baseUrl}/posts/${updateId}`;
    fetch(updateUrl, {
        method : "PATCH",
        body : JSON.stringify(updatedObj),
        headers : {
            'content-type' : 'application/json',
            'token' : 'wrweertr'
        }
    })
    .then(res => {
      return res.json()
    })
    .then(data => {
       // cl(data)
        updatedObj.id = updateId
        let card = [...document.getElementById(updatedObj.id).children];
        cl(card)
        card[0].innerHTML = ` <h4 class="m-0">${updatedObj.title}</h4>`;
        card[1].innerHTML = ` <p class="m-0">${updatedObj.body}</p>`;
        Swal.fire({
            title : `Post is Updated Successfully !!!`,
            icon : "success",
            timer : 2000
        })
    })
    .catch(err => {
        cl(err)
    })
}

postForm.addEventListener("submit",onPostSubmit)
updateBtn.addEventListener("click",onPostUpdate)
