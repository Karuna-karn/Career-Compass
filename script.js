const careerForm = document.getElementById("careerForm");
const progressBar = document.getElementById("progressBar");
const scoreText = document.getElementById("scoreText");

const recommendationList =
document.getElementById("recommendationList");

const reportBox =
document.getElementById("reportBox");

const scoreCard =
document.getElementById("scoreCard");

const statusCard =
document.getElementById("statusCard");

const skillCount =
document.getElementById("skillCount");

const themeToggle =
document.getElementById("themeToggle");

const downloadPdf =
document.getElementById("downloadPdf");

/* ---------------- THEME ---------------- */

loadTheme();

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
    document.body.classList.contains("dark");

    localStorage.setItem("theme", isDark);

    themeToggle.textContent =
    isDark
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

function loadTheme() {

    const savedTheme =
    localStorage.getItem("theme");

    if(savedTheme === "true") {

        document.body.classList.add("dark");

        themeToggle.textContent =
        "☀️ Light Mode";
    }
}

/* ---------------- FORM SUBMIT ---------------- */

careerForm.addEventListener("submit", function(e){

    e.preventDefault();

    const studentName =
    document.getElementById("studentName").value;

    const cgpa =
    parseFloat(
    document.getElementById("cgpa").value
    );

    const projects =
    parseInt(
    document.getElementById("projects").value
    );

    const certifications =
    parseInt(
    document.getElementById("certifications").value
    );

    const internship =
    document.getElementById("internship").value;

    const selectedSkills =
    Array.from(
        document.querySelectorAll(
            ".skills-grid input:checked"
        )
    ).map(skill => skill.value);

    /* Score Calculation */

    let score = 0;

    /* CGPA */

    if(cgpa >= 8.5)
        score += 25;
    else if(cgpa >= 7.5)
        score += 20;
    else if(cgpa >= 6.5)
        score += 15;
    else
        score += 8;

    /* Projects */

    if(projects >= 5)
        score += 25;
    else if(projects >= 3)
        score += 18;
    else
        score += 10;

    /* Skills */

    score += Math.min(
        selectedSkills.length * 3,
        25
    );

    /* Internship */

    if(internship === "Yes")
        score += 15;

    /* Certifications */

    score += Math.min(
        certifications * 2,
        10
    );

    if(score > 100)
        score = 100;

    updateDashboard(
        studentName,
        score,
        selectedSkills,
        cgpa,
        projects,
        certifications,
        internship
    );

});

/* ---------------- DASHBOARD ---------------- */

function updateDashboard(
    studentName,
    score,
    selectedSkills,
    cgpa,
    projects,
    certifications,
    internship
){

    progressBar.style.width =
    score + "%";

    scoreText.innerText =
    `Your Placement Readiness Score is ${score}%`;

    scoreCard.innerText =
    score + "%";

    skillCount.innerText =
    selectedSkills.length;

    let status = "";

    if(score >= 85)
        status = "Excellent";
    else if(score >= 70)
        status = "Good";
    else if(score >= 50)
        status = "Average";
    else
        status = "Needs Improvement";

    statusCard.innerText = status;

    generateRecommendations(
        selectedSkills,
        cgpa,
        projects,
        certifications,
        internship
    );

    generateReport(
        studentName,
        score,
        status,
        cgpa,
        projects,
        certifications,
        internship,
        selectedSkills
    );

    saveData(
        studentName,
        score,
        status
    );
}

/* ---------------- RECOMMENDATIONS ---------------- */

function generateRecommendations(
    skills,
    cgpa,
    projects,
    certifications,
    internship
){

    recommendationList.innerHTML = "";

    const recommendations = [];

    if(cgpa < 7.5)
        recommendations.push(
        "Improve CGPA above 7.5 for better opportunities."
        );

    if(projects < 4)
        recommendations.push(
        "Build at least 4-5 strong portfolio projects."
        );

    if(certifications < 2)
        recommendations.push(
        "Complete certifications from reputable platforms."
        );

    if(internship === "No")
        recommendations.push(
        "Try to secure at least one internship."
        );

    const requiredSkills = [
        "HTML",
        "CSS",
        "JavaScript",
        "Git",
        "GitHub"
    ];

    requiredSkills.forEach(skill => {

        if(!skills.includes(skill)) {

            recommendations.push(
            `Learn ${skill}.`
            );
        }
    });

    if(recommendations.length === 0){

        recommendations.push(
        "Excellent profile! Continue interview preparation."
        );
    }

    recommendations.forEach(item => {

        const li =
        document.createElement("li");

        li.textContent = item;

        recommendationList.appendChild(li);
    });
}

/* ---------------- REPORT ---------------- */

function generateReport(
    name,
    score,
    status,
    cgpa,
    projects,
    certifications,
    internship,
    skills
){

    reportBox.innerHTML = `
        <strong>Name:</strong> ${name}<br>
        <strong>CGPA:</strong> ${cgpa}<br>
        <strong>Projects:</strong> ${projects}<br>
        <strong>Certifications:</strong> ${certifications}<br>
        <strong>Internship:</strong> ${internship}<br>
        <strong>Skills:</strong> ${skills.join(", ")}<br>
        <strong>Score:</strong> ${score}%<br>
        <strong>Status:</strong> ${status}
    `;
}

/* ---------------- LOCAL STORAGE ---------------- */

function saveData(
    name,
    score,
    status
){

    const data = {
        name,
        score,
        status
    };

    localStorage.setItem(
        "placementReport",
        JSON.stringify(data)
    );
}

/* ---------------- PDF ---------------- */

downloadPdf.addEventListener("click", () => {

    const reportText =
    reportBox.innerText;

    if(
        reportText.includes(
        "Generate your readiness report"
        )
    ){
        alert(
        "Generate report first"
        );
        return;
    }

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    doc.setFontSize(16);

    doc.text(
    "Placement Ready Report",
    20,
    20
    );

    const lines =
    doc.splitTextToSize(
    reportText,
    170
    );

    doc.setFontSize(12);

    doc.text(
    lines,
    20,
    40
    );

    doc.save(
    "Placement_Report.pdf"
    );
});

/* ---------------- LOAD SAVED REPORT ---------------- */

window.addEventListener("load", () => {

    const saved =
    JSON.parse(
    localStorage.getItem(
        "placementReport"
    )
    );

    if(saved){

        scoreCard.innerText =
        saved.score + "%";

        statusCard.innerText =
        saved.status;

        progressBar.style.width =
        saved.score + "%";

        scoreText.innerText =
        `Last Saved Score: ${saved.score}%`;
    }
});