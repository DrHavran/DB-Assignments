import { getSection } from "../data.js";

const params = new URLSearchParams(window.location.search);
const sectionName = params.get("section");

const title = document.getElementById("title");
const content = document.getElementById("content");

function createLightbulb() {
    const btn = document.createElement("button");
    btn.className = "note-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Zobrazit poznámku");
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6V17c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
        </svg>`;
    return btn;
}

function renderSection(container, section) {
    for (const [letter, tasks] of Object.entries(section)) {
        const heading = document.createElement("h2");
        heading.textContent = letter;
        container.appendChild(heading);

        const list = document.createElement("ol");
        for (const task of Object.values(tasks)) {
            const text = typeof task === "string" ? task : task.text;
            const note = typeof task === "string" ? null : task.note;

            const li = document.createElement("li");

            const span = document.createElement("span");
            span.className = "task-text";
            span.textContent = text;
            li.appendChild(span);

            if (note) {
                const btn = createLightbulb();
                const noteEl = document.createElement("div");
                noteEl.className = "task-note";
                noteEl.textContent = note;
                noteEl.hidden = true;

                btn.addEventListener("click", () => {
                    noteEl.hidden = !noteEl.hidden;
                    btn.classList.toggle("active", !noteEl.hidden);
                });

                li.appendChild(btn);
                li.appendChild(noteEl);
            }

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

document.getElementById("back").addEventListener("click", () => {
    history.back();
});