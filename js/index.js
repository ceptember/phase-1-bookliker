const listPanel = document.getElementById('list-panel');
const list = document.getElementById('list'); 
const showPanel = document.getElementById('show-panel');
let loggedInUser = ""; 
let likesArr = [];
let currentBookId = "";
//let currentUsers; 

function fetchUsers () {
    fetch('http://localhost:3000/users')
        .then(resp => resp.json())
        .then(users => {
            loggedInUser = users[0]
            
        })
}

function addLike (){
   // console.log ('like')
    fetch(`http://localhost:3000/books/${currentBookId}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json', 
            Accept: 'application/json'
        },
        body: JSON.stringify(
            {users: likesArr})

    })
        .then(resp => resp.json())
        .then( () => { fetch('http://localhost:3000/books')
            .then(resp => resp.json())
            .then(books => { 
                for (let book of books){
                    if (book.id == currentBookId){
                        document.getElementById(`ul-${book.id}`).innerHTML = "";
                        for (let user of book.users){
                            let userItem = document.createElement('li');
                            userItem.innerHTML = user.username; 
                            document.getElementById(`ul-${book.id}`).appendChild(userItem); 
                        }
                    } 
                }
            })
        })
}

function fetchBooks () {
    fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(books => {    
            //list all the book titles in the List Panel 
            list.innerHTML= ""; 
            for (let book of books){
                let bookItem = document.createElement('li'); 
                bookItem.innerHTML = book.title; 
                list.appendChild(bookItem);
                //show the book info when the title is clicked
                bookItem.addEventListener('click', () => {
                    showPanel.innerHTML = `<img src="${book.img_url}" width="200px"/>
                    <h2>${book.title}</h2>
                    <h3>${book.subtitle}</h3>
                    <h3>${book.author}</h3>
                    <p>${book.description}</p>
                    <h4>Likes:</h4>
                    <ul id = "ul-${book.id}">
                    </ul>
                    <button id = "likeBtn">Like</button>
                    `; 
                    //list the users who liked it in the book info panel 
                    for (let user of book.users){
                        let userItem = document.createElement('li');
                        userItem.innerHTML = user.username; 
                        document.getElementById(`ul-${book.id}`).appendChild(userItem); 
                    }
                    //add listener to the like button
                    document.getElementById('likeBtn').addEventListener('click', () => {
                        //currentUsers = book.users; 
                        likesArr = []; //clear old data
                        likesArr.push(...book.users); 
                        likesArr.push(loggedInUser)
                       // console.log('all likes: ' + likesArr)
                        currentBookId = book.id; 
                        addLike()
                    })
                }) 
            }
        })
}


document.addEventListener("DOMContentLoaded", fetchBooks);
document.addEventListener("DOMContentLoaded", fetchUsers);
