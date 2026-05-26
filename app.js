// ── API Configuration ─────────────────────────────────────────────────────────
const API_URL = "http://localhost:5000";

// ── Token Helpers ─────────────────────────────────────────────────────────────
const getToken   = ()      => localStorage.getItem("accessToken");
const saveToken  = (token) => localStorage.setItem("accessToken", token);
const removeToken = ()     => localStorage.removeItem("accessToken");

// ── Core Request Function ─────────────────────────────────────────────────────
const request = async (method, endpoint, body = null, auth = false) => {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers["Authorization"] = `Bearer ${getToken()}`;
  const options = { method, headers, credentials: "include" };
  if (body) options.body = JSON.stringify(body);
  try {
    const res  = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    return { success: false, message: "Network error. Is the server running?" };
  }
};

// ── Show toast message ────────────────────────────────────────────────────────
const showMessage = (message, type = "error") => {
  const existing = document.getElementById("dromdost-msg");
  if (existing) existing.remove();
  const div = document.createElement("div");
  div.id = "dromdost-msg";
  div.style.cssText = `
    position:fixed; top:20px; right:20px; z-index:9999;
    padding:12px 20px; border-radius:8px; font-size:14px;
    background:${type === "success" ? "#4CAF50" : "#f44336"};
    color:white; box-shadow:0 4px 12px rgba(0,0,0,0.2); max-width:300px;
  `;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
};

// ── Button loading state ──────────────────────────────────────────────────────
const setLoading = (btn, loading) => {
  if (loading) {
    btn.disabled    = true;
    btn.dataset.txt = btn.textContent;
    btn.textContent = "Please wait...";
  } else {
    btn.disabled    = false;
    btn.textContent = btn.dataset.txt || btn.textContent;
  }
};

// ── Redirect to login if not authenticated ────────────────────────────────────
const requireAuth = () => {
  if (!getToken()) { window.location.href = "Login.html"; return false; }
  return true;
};


// ══════════════════════════════════════════════════════════════════════════════
// SHOW/HIDE PROFESSION FIELDS
// ══════════════════════════════════════════════════════════════════════════════

function showProfessionFields() {
  const profession = document.getElementById("Profession")?.value;
  if (profession === "student") {
    document.getElementById("studentField").style.display = "block";
    document.getElementById("workingField").style.display = "none";
  } else if (profession === "working") {
    document.getElementById("studentField").style.display = "none";
    document.getElementById("workingField").style.display = "block";
  } else {
    document.getElementById("studentField").style.display = "none";
    document.getElementById("workingField").style.display = "none";
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// REGISTER FORM
// ══════════════════════════════════════════════════════════════════════════════

document.getElementById("Registerform")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const btn      = this.querySelector("button[type='submit']");
  const name     = document.getElementById("name").value.trim();
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) { showMessage("Please fill in all fields."); return; }

  setLoading(btn, true);
  const data = await request("POST", "/api/auth/register", { name, email, password });
  setLoading(btn, false);

  if (data.success) {
    saveToken(data.accessToken);
    showMessage("Account created successfully! 🎉", "success");
    setTimeout(() => window.location.href = "profile.html", 1000);
  } else {
    showMessage(data.message || "Registration failed. Try again.");
  }
});


// ══════════════════════════════════════════════════════════════════════════════
// LOGIN FORM
// ══════════════════════════════════════════════════════════════════════════════

document.getElementById("loginform")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const btn      = this.querySelector("button[type='submit']");
  const email    = document.getElementById("emaillogin").value.trim();
  const password = document.getElementById("loginpas").value;

  if (!email || !password) { showMessage("Please enter email and password."); return; }

  setLoading(btn, true);
  const data = await request("POST", "/api/auth/login", { email, password });
  setLoading(btn, false);

  if (data.success) {
    saveToken(data.accessToken);
    showMessage("Welcome back! 👋", "success");
    setTimeout(() => window.location.href = "profile.html", 1000);
  } else {
    showMessage(data.message || "Invalid email or password.");
  }
});


// ══════════════════════════════════════════════════════════════════════════════
// PROFILE FORM
// ══════════════════════════════════════════════════════════════════════════════

document.getElementById("Profiletype")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!requireAuth()) return;

  const btn = this.querySelector("button[type='submit']");

  // Profession mapping
  const professionRaw = document.getElementById("Profession")?.value || "";
  const professionMap = {
    student: "student", working: "working_professional",
    freelancer: "freelancer", entrepreneur: "entrepreneur", other: "other",
  };
  const profession = professionMap[professionRaw] || "other";

  // All values are now clean from the select options directly
  const sleepTime        = document.getElementById("sleep")?.value     || "11pm_1am";
  const studyHabits      = document.getElementById("study")?.value     || "flexible";
  const cleanlinessLevel = parseInt(document.getElementById("clean")?.value) || 3;
  const budgetMax        = parseInt(document.getElementById("budget")?.value) || 10000;
  const foodPreference   = document.getElementById("food")?.value      || "no_preference";
  const preferredGender  = document.getElementById("Gender")?.value    || "no_preference";
  const city             = document.getElementById("city")?.value?.trim() || "";
  const age              = parseInt(document.getElementById("age")?.value) || 18;
  const gender           = document.getElementById("gender")?.value    || "prefer_not_to_say";
  const smokingAllowed   = document.getElementById("smoking")?.value === "true";
  const drinkingAllowed  = document.getElementById("drinking")?.value === "true";
  const petsAllowed      = document.getElementById("pets")?.value === "true";

  // Language — split by comma for multi-language options
  const languageRaw    = document.getElementById("language")?.value || "English";
  const languagesSpoken = languageRaw.split(",").map(l => l.trim()).filter(Boolean);

  if (!city) { showMessage("Please enter your city."); return; }
  if (!age || age < 17) { showMessage("Please enter a valid age."); return; }

  const profileData = {
    city, age, gender, profession,
    foodPreference, studyHabits, preferredGender,
    languagesSpoken, cleanlinessLevel,
    smokingAllowed, drinkingAllowed, petsAllowed,
    budget: { min: 0, max: budgetMax },
    sleepSchedule: { sleepTime, wakeTime: "8am_10am" },
  };

  setLoading(btn, true);

  // Try update first, create if profile doesn't exist yet
  let data = await request("PUT", "/api/profile", profileData, true);
  if (!data.success && data.message?.includes("not found")) {
    data = await request("POST", "/api/profile", profileData, true);
  }

  setLoading(btn, false);

  if (data.success) {
    showMessage("Profile saved! 🏠", "success");
    setTimeout(() => window.location.href = "matches.html", 1000);
  } else {
    showMessage(data.message || "Failed to save profile.");
    console.error("Profile error:", data);
  }
});


// ══════════════════════════════════════════════════════════════════════════════
// MATCHES PAGE
// ══════════════════════════════════════════════════════════════════════════════

if (document.getElementById("matchcontainer")) {
  requireAuth() && loadMatches();
}

async function loadMatches() {
  const container = document.getElementById("matchcontainer");
  container.innerHTML = `<p style="text-align:center;color:#666;grid-column:1/-1;">Finding your best matches... 🔍</p>`;

  const data = await request("GET", "/api/match?limit=20&minScore=0", null, true);

  if (!data.success) {
    container.innerHTML = `<p style="text-align:center;color:red;grid-column:1/-1;">${data.message || "Failed to load matches."}</p>`;
    return;
  }

  if (data.matches.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:#666;grid-column:1/-1;">
        <h3>No matches found yet 😔</h3>
        <p>Complete your profile and check back later.</p>
      </div>`;
    return;
  }

  container.innerHTML = "";
  data.matches.forEach(match => {
    const avatar = match.user?.avatar || `https://i.pravatar.cc/150?u=${match.user?._id}`;
    const name   = match.user?.name   || "Unknown";
    const score  = match.score        || 0;
    const city   = match.city         || "Unknown city";

    container.innerHTML += `
      <div class="match-card">
        <img src="${avatar}" alt="${name}" onerror="this.src='https://i.pravatar.cc/150?img=1'" />
        <h3>${name}</h3>
        <p style="color:#888;font-size:13px;">📍 ${city}</p>
        <p>Compatibility: <b>${score}%</b></p>
        <div style="background:#eee;border-radius:20px;height:8px;margin:8px 0;">
          <div style="background:#6c63ff;width:${score}%;height:8px;border-radius:20px;"></div>
        </div>
        <button class="btn" onclick="saveMatch('${match.user?._id}', this)">💾 Save</button>
      </div>`;
  });
}

async function saveMatch(candidateId, btn) {
  const data = await request("PATCH", `/api/match/${candidateId}/save`, null, true);
  if (data.success) {
    btn.textContent = data.isSaved ? "✅ Saved" : "💾 Save";
    showMessage(data.isSaved ? "Match saved!" : "Match unsaved.", "success");
  } else {
    showMessage(data.message || "Could not save match.");
  }
}


// ══════════════════════════════════════════════════════════════════════════════
// LOGOUT
// ══════════════════════════════════════════════════════════════════════════════

document.getElementById("logoutBtn")?.addEventListener("click", async (e) => {
  e.preventDefault();
  await request("POST", "/api/auth/logout", null, true);
  removeToken();
  window.location.href = "Login.html";
});
