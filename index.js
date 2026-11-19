import { getSectionNames } from "./data.js";

const grid = document.getElementById("grid");
const status = document.getElementById("status");

// Order of groups on the page + description shown next to the letter.
// Add / edit these freely — anything in the JSON with an unlisted letter
// will still render (at the end, alphabetically) but without a description.
const GROUP_ORDER = ["Z", "A", "K"];
const GROUP_DESCRIPTIONS = {
    Z: "Základní úlohy",
    A: "Úlohy s agregacemi",
    K: "Komplexní úlohy, mohou a nemusí obsahovat vše",
};

function groupNames(names) {
    const groups = {};
    for (const name of names) {
        const letter = name[0];
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(name);
    }
    for (const letter in groups) {
        groups[letter].sort(
            (a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10)
        );
    }
    return groups;
}

async function init() {
    try {
        const names = await getSectionNames();
        status.remove();
        const groups = groupNames(names);

        const orderedLetters = [
            ...GROUP_ORDER.filter(l => groups[l]),
            ...Object.keys(groups)
                .filter(l => !GROUP_ORDER.includes(l))
                .sort(),
        ];

        for (const letter of orderedLetters) {
            const section = document.createElement("section");
            section.className = "group";

            const h2 = document.createElement("h2");
            h2.textContent = letter;
            const desc = GROUP_DESCRIPTIONS[letter];
            if (desc) {
                const span = document.createElement("span");
                span.textContent = `– ${desc}`;
                h2.appendChild(span);
            }
            section.appendChild(h2);

            const cards = document.createElement("div");
            cards.className = "cards";
            for (const name of groups[letter]) {
                const a = document.createElement("a");
                a.href = `page/assignment.html?section=${encodeURIComponent(name)}`;
                a.textContent = name;
                cards.appendChild(a);
            }
            section.appendChild(cards);
            grid.appendChild(section);
        }
    } catch (err) {
        status.textContent = "Nepodařilo se načíst data: " + err.message;
        status.classList.add("error");
    }
}

init();