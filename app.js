// ------------------------------
// SHOW/HIDE PROFESSION FIELDS
// ------------------------------

function showProfessionFields() {
    const profession = document.getElementById("Profession")?.value;  // FIXED ID

    if (profession === "student") {
        document.getElementById("studentField").style.display = "block";
        document.getElementById("workingField").style.display = "none";
    } 
    else if (profession === "working") {
        document.getElementById("studentField").style.display = "none";
        document.getElementById("workingField").style.display = "block";
    }
    else {
        document.getElementById("studentField").style.display = "none";
        document.getElementById("workingField").style.display = "none";
    }
}



// ------------------------------
// REGISTER FORM
// ------------------------------

document.getElementById("Registerform")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        age: document.getElementById("age").value
    };

    console.log("Register Data:", user);
    alert("Registration data collected!");

    window.location.href = "Login.html";
});



// ------------------------------
// LOGIN FORM
// ------------------------------

document.getElementById("loginform")?.addEventListener("submit", function(e) {
    e.preventDefault();

    const loginData = {
        email: document.getElementById("emaillogin").value,
        password: document.getElementById("loginpas").value
    };

    console.log("Login Data:", loginData);
    alert("Login successful!");

    window.location.href = "profile.html";
});



// ------------------------------
// PROFILE FORM
// ------------------------------

document.getElementById("Profiletype")?.addEventListener("submit", function(e) {

    e.preventDefault();

    const formData = new FormData();

    // IMAGE
    const profilePic = document.getElementById("profilePic").files[0];
    if (profilePic) {
        formData.append("profilePic", profilePic);
    }

    // PROFESSION
    const profession = document.getElementById("profession").value; // FIXED
    formData.append("profession", profession);

    if (profession === "student") {
        formData.append("studyCourse", document.getElementById("studycourse").value); // FIXED
    }
    if (profession === "working") {
        formData.append("workField", document.getElementById("workfield").value); // FIXED
    }

    // OTHER FIELDS
    formData.append("sleepSchedule", document.getElementById("sleep").value);
    formData.append("studyHabit", document.getElementById("study").value);
    formData.append("cleanliness", document.getElementById("clean").value);
    formData.append("budget", document.getElementById("budget").value);
    formData.append("foodPreference", document.getElementById("food").value);
    formData.append("preferredGender", document.getElementById("Gender").value);
    formData.append("language", document.getElementById("language").value);

   for(let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
}
    alert("Profile saved successfully!");

    window.location.href = "matches.html";
});



// ------------------------------
// MATCHES DISPLAY
// ------------------------------

if (document.getElementById("matchcontainer")) {

    const matches = [
        { name: "Aisha", age: 21, score: 92, img: "https://i.pravatar.cc/150?img=1" },
        { name: "Neha", age: 22, score: 89, img: "https://i.pravatar.cc/150?img=2" },
        { name: "Riya", age: 20, score: 85, img: "https://i.pravatar.cc/150?img=3" }
    ];

    matches.forEach(m => {
        document.getElementById("matchcontainer").innerHTML += `
            <div class="match-card">
                <img src="${m.img}" />
                <h3>${m.name}, ${m.age}</h3>
                <p>Compatibility Score: <b>${m.score}%</b></p>
                <button class="btn">View Profile</button>
            </div>
        `;
    });
}
