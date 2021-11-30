/* 
Skrivet av Amanda HWatz Björkholm 2021
Moment 2 - Javascriptbaserad webbutveckling
*/

"use strict"

// Variabler
const coursesEl = document.getElementById("courses");
const messageEl = document.getElementById("message");
const saveBtn = document.getElementById("save");
const form = document.getElementById("add-form");
const messageForm = document.getElementById("message-form");

//const url = "http://localhost:3000/courses";
const url = "https://afternoon-dawn-27820.herokuapp.com/courses";

// Lyssnare
window.addEventListener("load", getCourses);
saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addCourse();
});

// Funktioner
// Göm element
function hideElement() {
    // Byt ut klassen
    messageEl.classList.replace("message", "hide");
    messageEl.innerHTML = ""; // Nollställ
}

// Hämta kurser
function getCourses() {
    // Nollställ kurslistan och sätt rubriker
    coursesEl.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Kurskod</th>
        <th>Kursnamn</th>
        <th class="center">Period</th>
        <th class="center">Radera</th>
    </tr>
    `;

    // GET-anrop
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let i = 1;
            
            data.forEach(course => {
                // Skriv ut till table-tagg
                coursesEl.innerHTML += `
                <tr>
                    <td class="id">${i}</td>
                    <td class="code">${course.courseId}</td>
                    <td class="name">${course.courseName}</td>
                    <td class="center period">${course.coursePeriod}</td>
                    <td class="center delete"><i title="Radera kurs" onClick="deleteCourse('${course._id}')" class="fas fa-trash-alt"></i></td>
                <tr>
                `;
                i +=1;
            }) 
        });
}

// Ta bort en kurs
function deleteCourse(id) {
    // Bekräfta med användare
    if (confirm("Är du säker på att du vill ta bort den här kursen?")) {
        // DELETE-anrop med ID
        fetch(url + "/" + id, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Visa meddelande till användare i 3 sekunder
                messageEl.innerHTML = `<span>${data.message}</span>`;
                messageEl.classList.replace("hide", "message");
                setTimeout(hideElement, 3000);

                // Hämta kurserna på nytt
                getCourses();
            })
            .catch(error => {
                console.log("Error: ", error);
            });
    } else {
        return false; // Om användaren ångrar sig, avbryt funktionen
    }
}

// Lägg till en kurs
function addCourse(){
    // Hämta värden från formuläret
    let codeInput = document.getElementById("courseId").value;
    let nameInput = document.getElementById("courseName").value;
    let periodInput = document.getElementById("coursePeriod").value;

    // Kontrollera tomma värden
    if(codeInput == "" || nameInput == "" || periodInput == ""){
        messageForm.innerHTML = "Alla fält måste fyllas i!";
        messageForm.style.display = "block";
        return false;
    }

    // Nollställ och göm felmeddelande
    messageForm.innerHTML = "";
    messageForm.style.display = "none";

    // Gör period till en int och skapa objekt
    periodInput = parseInt(periodInput);
    let obj = {"courseId":codeInput,"courseName":nameInput,"coursePeriod":periodInput};

    // Skicka till webbtjänsten med POST
    fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(obj),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Skriver ut kurser på nytt
        getCourses();
    })
    .catch(error => {
        console.log("Error: ", error);
    });

    form.reset(); // Återställ formuläret
}
