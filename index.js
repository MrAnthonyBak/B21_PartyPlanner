const COHORT = "2503-FTB-ET-WEB-AM";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const form = document.querySelector("form");

const state = {
    parties: [],
};


async function getParties() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.parties = json.data;
        renderEvents();
    } catch (err) {
        console.error("Fetching Error", err);
    }
}


async function addEvents(party) {
    try {
        const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(party),
        });
        const json = await response.json();
        if (json.error) {
        throw new Error(json.error.message);
        }
    } catch (err) {
        console.error("Error adding events:", err);
    }
    await getParties();
}


function renderEvents() {
    const $parties = document.querySelector("#partyList");
    const partiesHTML = state.parties.map((party) => {
        const $party = document.createElement("li");

        $party.innerHTML = 
            `<h2>${party.name}</h2>
            <time datetime="${party.date}">${party.date}</time>
            <address>${party.location}</address>
            <p>${party.description}</p>
            <button data-id="${party.id}"> Delete </button>`;

        const deleteButton = $party.querySelector("button");
        deleteButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = deleteButton.getAttribute("data-id");
        await deletePost(id);
        });
        return $party;
    });
    $parties.replaceChildren(...partiesHTML);
}


async function render() {
    await getParties();
    renderEvents();
}


render();


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const event = {
        name: form.partyName.value,
        description: form.description.value,
        date: form.date.value,
        location: form.location.value,
    };
    await addEvents(event);
    render();
});


async function deletePost(id) {
    console.log(id);
    try {
        const response = await fetch(API_URL + "/" + id, {
        method: "DELETE",
        });
        if (!response.ok) {
        throw new Error("Cannot delete the event.");
        }
    } catch (err) {
        console.error(err);
    }
    await getParties();
    renderEvents();
}