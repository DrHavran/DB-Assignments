const DATA_FILE = "assignments.json"; 
let allData = null;

async function loadAll() {
    if (!allData) {
        allData = await getData(DATA_FILE);
    }
    return allData;
}

export async function getData(file) {
    const isProduction =
        window.location.hostname === "drhavran.github.io";

    const url = isProduction
        ? `https://drhavran.github.io/DB-Assignments/${file}`
        : `../${file}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    return await response.json();
}

// Returns headers of main parts
export async function getSectionNames() {
    const data = await loadAll();
    return Object.keys(data);
}

// Returns a part inside a part
export async function getSection(name) {
    const data = await loadAll();
    return data[name];
}