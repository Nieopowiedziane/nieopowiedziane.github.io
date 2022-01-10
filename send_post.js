const webhook_href = "https://formspree.io/f/mpzbwvrd" 

window.addEventListener("load", function () {
    let category = this.document.getElementById("category")
    let options = {
        "swiadectwo": "Świadectwo",
        "historia": "Historia",
        "cytat": "Cytat",
        "modlitwa": "Modlitwa",
        "poprawki": "Możliwe poprawki",
        "inne": "Inne"
    }
    for (let val in options) {
        // console.log(val)
        let opt = this.document.createElement("option")
        opt.setAttribute("option", val);
        opt.innerHTML = options[val]
        category.appendChild(opt)
        // console.log(opt)
    }
    function getElemByName(name) {
        // console.log(document.getElementsByName(name)[0])
        return document.getElementsByName(name)[0];
    }
    document.getElementById("submit").onclick = function () {
        //log("Pressed \"" + this.getAttribute("id") + "\"")

        // zbieranie danych
        let title = getElemByName("story-title").value;
        let type = getElemByName("story-category").value;
        let content = getElemByName("story-content").value;
        let data = {
            "Tytuł": title,
            "Kategoria": type,
            "Treść": content,
        }
    
        // Uzupełnianie danych według podanego wyżej template'u
        for (let a in data) {
            
            if (data[a] == "") { //Sprawdzanie czy wszystkie pola są zapełnione
                alert("Nie zapełniłeś pola: " + a);
                return;
            }
        }
        
        data = JSON.stringify(data)
        console.log("Data to send: \n" + data)

        let client = new XMLHttpRequest();
        client.addEventListener("load", function(){
            console.log("href: " + webhook_href)
            console.log("type: "+ this.responseType)
            console.log("code: "+ this.status)
            console.log("txt: "+ this.responseText)
            if(this.status == 200){
                alert("Wiadomość została wysłana :D")
                window.location.pathname = "post.html"
            }
            else{
                alert("Możliwe, że coś poszło nie tak :<")
            }
        })
        client.open("POST", webhook_href)
        client.setRequestHeader("Content-type", "application/json");
        client.send(data)
    }
})