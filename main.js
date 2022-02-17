function change_menu() {
  // log("Menu pressed");
  var my_color = "#00d9ff";
  var title = document.getElementById("menu-title");
  var strips = document.getElementsByClassName("menu-button");
  var element = document.getElementById("menu-elements");
  var style = getComputedStyle(element);
  if (style.display == "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
    my_color = "white";
  }

  title.style.color = my_color;
  for (var a = 0; a < strips.length; a++) {
    strips[a].style.backgroundColor = my_color;
  }
}

function to_share() {
  document.getElementsByTagName("svg")[0].remove();
  document.getElementById("container").remove();
  let naglowek = document.styleSheets[0].cssRules[1].style;
  naglowek.removeProperty("margin");
  document.styleSheets[0].addRule("#nagłówek", "margin: 2px");
  document.getElementsByTagName("button")[0].remove();

  let title = document.getElementById("nagłówek");
  let dt = document.getElementById("story-title");
  let dd = document.getElementById("story-content");

  title.style.fontSize = "50px";
  dd.style.fontSize = "27px";
  dt.style.fontSize = "37px";
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
  function edit(elem, new_text) {
    let txt = elem.innerText;
    elem.innerText = new_text + txt;
  }
  edit(document.getElementsByTagName("title")[0], ` ${new_title} | `);
  edit(document.getElementById("story-title"), new_title);
}

function create_stories_list(key, data) {
  const dt = document.createElement("dt");
  dt.innerHTML = key
  dt.className = "story-date";
  const dd = document.createElement("dd");
  const ul = document.createElement("ul");
  for (let id in data) {
    let story = data[id];
    const a = document.createElement("a");
    a.innerText = story.title;
    a.setAttribute("href", `?date=${key}&id=${id}`);
    a.classList.add("near-link", "story-category");
    a.dataset["category"] = categories[story["category"]];
    const li = document.createElement("li");
		li.classList.add("story-link")
    li.appendChild(a);
    ul.appendChild(li);
  }
  dd.appendChild(ul);
  const div = document.createElement("div");
  div.setAttribute("class", "date-div");
  div.appendChild(dt);
  div.appendChild(dd);
  return div;
}

function slice_url() {
  var search = new URLSearchParams(window.location.search);
  return {
    path: window.location.pathname,
    search,
  };
}

const notFound = () => {
  window.location.pathname = "404.html"; //jest id, nie ma daty -> błąd
};

const categories = {
  swiadectwo: "Świadectwo",
  historia: "Historia",
  cytat: "Cytat",
  modlitwa: "Modlitwa",
  poprawki: "Możliwe poprawki",
  inne: "Inne",
  updates: "Aktualizacje",
  "non-censored": "Niecenzuralne",
};

function stuff_with_json_file(window_url) {
  // Ustawia link do ostatnio udostępnionego postu
  // i zwraca hiperłącza do wskazanych postów(jeśli set_hrefs == true)
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function () {
    posts_data = JSON.parse(xhr.responseText);
    let last_post = document.getElementById("last_post");
    last_post.setAttribute("href", posts_data["published_post"]);
    // log("href: " + last_post.getAttribute("href")) //pisanie linku
    const date = window_url.search.get("date");

    //szukanie historii/postów
    if (window_url.path.startsWith("/stories")) {
      // log("stories");
      let value = 0; // co jest podane? (id/date)
			//TODO: zmienić to na tablice bitowe
      if (window_url.search.has("date")) {
        value += 1;
      }
      if (window_url.search.has("id")) value += 2;

      switch (value) {
        case 0: // nothing defined
          case 1: //
          // log("have nothing")
          change_title("Przysłane wpisy");
          for (let key in posts_data["posts"]) {
            const date_div = create_stories_list(key, posts_data["posts"][key]);
            content.appendChild(date_div);
          }
          content.id = "div-with-dates";
          break;
        case 2: // only id defined
          notFound();
          break;

        case 3: // all defined
          // log("have all")
          let id = window_url.search.get("id");
          let post = posts_data["posts"][date][id];
          if (!post) return notFound();
          let text = post["content"].replaceAll("\n", "</p><p>");
          content.innerHTML = text;
          change_title(post["title"]);

          let category = document.createElement("a");
          category.classList.add("near-title", "story-category");
          category.dataset["category"] = categories[post["category"]];
          let elem = document.getElementById("story-title");
					elem.appendChild(category);
					console.log(elem)
          break;
      }
      if (value == 3)
        //jeśli jest wszystko podane
        content.classList.add("story-content");
    }
    // log("inne niż /stories")
  });
  xhr.open("GET", "./data.json");
  xhr.send(null);
}

function go_back_button_listener() {
  if (document.referrer.startsWith(document.location.origin)) {
    window.history.go(-1);
  } else {
    window.location.pathname = "/";
  }
}

window.addEventListener("load", () => {
  /*if (document.getElementById("output") == undefined) {
        let elem = document.createElement("div");
        elem.id = "output";
        document.getElementsByTagName("body")[0].appendChild(elem);
    } */
  let btn = this.document.getElementById("go_back");
  if (btn) btn.addEventListener("click", go_back_button_listener);

  var content = document.getElementById("content");
  let url_obj = slice_url();
  stuff_with_json_file(url_obj);
});

function to_share() {
  document.getElementsByTagName("svg")[0].remove();
  document.getElementById("container").remove();

  document.getElementById("nagłówek").style.fontSize = "50px";
  document.getElementById("story-title").style.fontSize = "37px";
  document.getElementById("content").style.fontSize = "27px";
  console.log(document.getElementsByClassName("near-title")[0]);
  console.log(document.styleSheets[2]);
  document.styleSheets[2].insertRule(
    ".near-title::after {font-size: 22px;}",
    0
  );
  document.styleSheets[2].insertRule("#naglowek {margin: 2px;}", 0);
  document.getElementsByTagName("button")[0].remove();
}
