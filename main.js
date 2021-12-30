function change_menu() {
    // log("Menu pressed");
    var my_color = "#00d9ff";
    var title = document.getElementById("menu-title")
    var strips = document.getElementsByClassName("menu-button")
    var element = document.getElementById('menu-elements');
    var style = getComputedStyle(element)
    if (style.display == "none") {
        element.style.display = "block";
    }
    else {
        element.style.display = "none";
        my_color = "white";
    }

    title.style.color = my_color;
    for (var a = 0; a < strips.length; a++) {
        strips[a].style.backgroundColor = my_color;
    }
}

function to_share() {
    document.getElementsByTagName('svg')[0].remove();
    document.getElementById('container').remove();
    let naglowek = document.styleSheets[0].cssRules[1].style;
    naglowek.removeProperty('margin');
    document.styleSheets[0].addRule("#nagłówek", "margin: 2px");
    document.getElementsByTagName("button")[0].remove();

    let title = document.getElementById("nagłówek");
    let dt = document.getElementById("story-title");
    let dd = document.getElementById('story-content');

    title.style.fontSize = "50px"
    dd.style.fontSize = "27px"
    dt.style.fontSize = "37px"
}

var posts_data = null;
/*
function log(text) {
    let elem = document.createElement("p");
    elem.innerHTML = text;
    document.getElementById("output").appendChild(elem);
    output.scroll({
        top: output.scrollHeight,
        left: 0,
        behavior: "smooth"
    })
}

*/
function change_title(new_title) {
    function edit(elem, new_txt) {
        let txt = elem.innerHTML;
        elem.innerHTML =  new_title + txt;
    }
    edit(document.getElementsByTagName("title")[0], new_title);
    edit(document.getElementById("story-title"), new_title);
}


function slice_url() {
    var search = new URLSearchParams(window.location.search);
    return {
        path: window.location.pathname,
        search
    }
}

const notFound = () =>{
    window.location.pathname = "404.html"; //jest id, nie ma daty -> błąd
}

const categories = {
    "swiadectwo": "Świadectwo",
    "historia": "Historia",
    "cytat": "Cytat",
    "modlitwa": "Modlitwa",
    "poprawki": "Możliwe poprawki",
    "inne": "Inne",
    "updates":"Aktualizacje",
    "non-censored":"Niecenzuralne"
}

function stuff_with_json_file(window_url) {
    // Ustawia link do ostatnio udostępnionego postu
    // i zwraca hiperłącza do wskazanych postów(jeśli set_hrefs == true)
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        posts_data = JSON.parse(xhr.responseText)
        //console.log(data)
        let last_post = document.getElementById("last_post")
        last_post.setAttribute("href", posts_data["published_post"]);
        // log("href: " + last_post.getAttribute("href")) //pisanie linku
        const date = window_url.search.get("date");

        //szukanie historii/postów
        if (window_url.path.startsWith("/stories")) {
            // log("stories");
            let value = 0;
            if (window_url.search.has("date")){
                value += 1;
            }
            if (window_url.search.has("id"))
                value += 2
            
            switch (value) {
                case 0: // nothing defined
                    // log("have nothing")
                    var list = []
                    var ul = document.createElement("ul")
                    for(let key in posts_data["posts"])
                        list.push(key);

                    for(let key in list.reverse()){
                        console.log(list[key])
                        key = list[key]
                        let a = document.createElement('a')
                        let li = document.createElement("li");
                        a.innerHTML = key;
                        a.setAttribute("href", "?date="+key);
                        li.appendChild(a);
                        //console.log(li)
                        ul.appendChild(li);
                    }
                    content.appendChild(ul)
                    change_title("Wybierz datę:")
                    break;

                case 1: // only date defined
                    // log("have only date")
                    // log("date: "+date);
                    var list = []
                    var ul = document.createElement("ul")
                    
                    let posts = posts_data["posts"][date];
                    for(let i=posts.length-1; i>=0; i--){
                        let post = posts[i];
                        console.log(post)
                        let a = document.createElement('a')
                        let li = document.createElement("li");
                        a.innerHTML = post["title"];
                        
                        let temp_url =  new URLSearchParams(window_url.search)
                        temp_url.append("id", i)
                        a.setAttribute("href", "?"+temp_url.toString());
                        li.appendChild(a);

                        a.classList.add("near-link","story-category");
                        a.dataset["category"] = categories[post["category"]];
                        //console.log(li)
                        ul.appendChild(li)
                    }


                    content.appendChild(ul)
                    change_title("Posty z: "+ date)
                    break;

                case 2: // only id defined
                    notFound()
                    break;

                case 3: // all defined
                    // log("have all")
                    let id = window_url.search.get("id")
                    let post = posts_data["posts"][date][id]
                    let text = post["content"].replaceAll("\n", "</p><p>")
                    console.log(text)

                    let category = document.createElement("a")
                    category.classList.add("near-title", "story-category")
                    category.dataset["category"] = categories[post["category"]];
                    document.getElementById("story-title").appendChild(category)
                    content.innerHTML = text
                    change_title(post["title"])
                    break;
            }
            if(value == 3) //jeśli jest wszystko podane
                content.classList.add("story-content");
            else
                content.classList.add("story-links");
        }
        // log("inne niż /stories")
    })
    xhr.open("GET", "./data.json")
    xhr.send(null)
}

function go_back_button_listener(){
    console.log("Pressed go_back")
}


window.addEventListener("load", () => {
    /*if (document.getElementById("output") == undefined) {
        let elem = document.createElement("div");
        elem.id = "output";
        document.getElementsByTagName("body")[0].appendChild(elem);
    } */
    let btn = this.document.getElementById("go_back");
    btn.addEventListener("click", go_back_button_listener);
    console.log(btn)
    
    var content = document.getElementById("content");
    // log("Window loaded")
    let url_obj = slice_url();
    console.log(url_obj)
    stuff_with_json_file(url_obj)
})
