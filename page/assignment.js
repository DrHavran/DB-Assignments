import { getSection } from "../data.js";

document.getElementById("back").addEventListener("click", () => {
    window.location.href = "../index.html";
});

const params = new URLSearchParams(window.location.search);
const sectionName = params.get("section");

const title = document.getElementById("title");
const content = document.getElementById("content");

function renderSection(container, section) {
    for (const [letter, tasks] of Object.entries(section)) {
        const heading = document.createElement("h2");
        heading.textContent = letter;
        container.appendChild(heading);

        const list = document.createElement("ol");
        for (const text of Object.values(tasks)) {
            const li = document.createElement("li");
            li.textContent = text;
            list.appendChild(li);
        }
        container.appendChild(list);
    }
}

async function init() {
    if (!sectionName) {
        title.textContent = "Chybí parametr 'section' v URL";
        return;
    }

    title.textContent = sectionName;

    try {
        const section = await getSection(sectionName);
        if (!section) {
            content.textContent = `Sekce "${sectionName}" neexistuje.`;
            return;
        }
        renderSection(content, section);
    } catch (err) {
        content.textContent = "Nepodařilo se načíst data: " + err.message;
    }
}

init();