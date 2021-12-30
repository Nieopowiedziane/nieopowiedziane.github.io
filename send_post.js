var template = {
    embeds: [
        {
            title: "New comming post",
            color: 0x4287f5,
            fields: [],
    }]
}


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
            "title": title,
            "type": type,
            "content": content,
        }
        
        let fields = {
            "title": "Tytuł",
            "type" : "Kategoria",
            "content" : "Treść"
        }
        // Uzupełnianie danych według podanego wyżej template'u
        let msg = new Object(template);
        for (let a in data) {
            
            if (data[a] == "") { //Sprawdzanie czy wszystkie pola są zapełnione
                alert("Nie zapełniłeś pola: " + fields[a]);
                return;
            }
            let obj = {
                name: a,
                value: data[a],
                inline: false
            };
            msg.embeds[0].fields.push(obj);
        }
        data = JSON.stringify(msg)
        console.log("Data to send: \n" + data)

        let client = new XMLHttpRequest();
        client.addEventListener("load", function(){
            console.log("type: "+ this.responseType)
            console.log("code: "+ this.status)
            console.log("txt: "+ this.responseText)
            if(this.status == 204){
                alert("Wiadomość została wysłana :D")
                window.location.pathname = "post.html"
            }
            else{
                alert("Możliwe, że coś poszło nie tak :<")
            }
        })
        client.open("POST", "https://discord.com/api/webhooks/925091793178091581/s3FMQMjV9c8VbQtjCT7LMveqv3vU28h_6Z4r6zgtRVvutVRLdec8I7E-jkF7lIKNLDrr")
        client.setRequestHeader("Content-type", "application/json");
        client.send(data)
    }
})