const getCrafts = async () => {
    try {
        return (await fetch("api/crafts/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showCrafts = async () => {
    let crafts = await getCrafts();
    let craftsDiv = document.getElementById("crafts-list");
    craftsDiv.innerHTML = "";
    crafts.forEach((craft) => {
      const section = document.createElement("section");
      section.classList.add("craft");
      craftsDiv.append(section);
  
      const a = document.createElement("a");
      a.href = "#";
      section.append(a);
  
    const img = document.createElement("img");
    img.src = craft.img;
    a.append(img);
  
      a.onclick = (e) => {
        e.preventDefault();
        displayDetails(craft);
      };
    });
  };

    const displayDetails = (craft) => {
        openDialog("craft-details");
        const craftDetails = document.getElementById("craft-details");
        craftDetails.innerHTML = "";
        craftDetails.classList.remove("hidden");
      
        const craftInner = document.createElement("div");
        craftInner.classList.add("craft-inner");
      
        const img = document.createElement("img");
        img.src = craft.img;
        craftInner.appendChild(img);
      
        const details = document.createElement("div");
        details.classList.add("details");
      
        const h3 = document.createElement("h3");
        h3.innerHTML = craft.name;
        details.appendChild(h3);
      
        const p = document.createElement("p");
        p.innerHTML = craft.description;
        details.appendChild(p);
      
        const ul = document.createElement("ul");
        craft.supplies.forEach((supply) => {
          const li = document.createElement("li");
          li.innerHTML = supply;
          ul.appendChild(li);
        });
        details.appendChild(ul);
      
        const deletebutton = document.createElement("a");
        deletebutton.innerHTML = "	&#9249;";
        details.appendChild(deletebutton);
        deletebutton.id = "delete-button";
      
        const editButton = document.createElement("a");
        editButton.innerHTML = "&#9998; ";
        details.appendChild(editButton);
        editButton.id = "edit-button";
      
        craftInner.appendChild(img);
        craftInner.appendChild(details);
        craftDetails.appendChild(craftInner);
      
        editButton.onclick = showCraftForm;
        deletebutton.onclick = deleteCraft.bind(this, craft);
      
        fillEditForm(craft);
      };

const fillEditForm = (craft) => {
    const form = document.getElementById("craft-form");
    form._id.value = craft._id;
    form.name.value = craft.name;
    form.description.value = craft.description;
    document.getElementById("img-prev").src = craft.img;

    fillSupplies(craft.supplies);
};

const fillSupplies = (supplies) => {
    const section = document.getElementById("supplies-boxes");
    supplies.forEach((supply) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = supply;
        section.append(input);
    });
};

const addEditCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("craft-form");
    const formData = new FormData(form);
    let response;
    formData.append("supplies", getSupplies());

    console.log(...formData);

    if(form._id.value.trim() == "") {
        console.log("in post");
        response = await fetch("/api/crafts", {
            method: "POST",
            body: formData,
        });
    } else {
        console.log("in put");
        response = await fetch(`/api/crafts/${form._id.value}`, {
            method:"PUT",
            body:formData,
        });
    }

    if(response.status != 200) {
        console.log("Error adding or editing craft");
    }

    await response.json();
    resetForm();
    document.getElementById("dialog").style.display = "none";
    showCrafts();
};

const getSupplies = () => {
    const inputs = document.querySelectorAll("#supplies-boxes input");
    let supplies = [];

    inputs.forEach((input) => {
        supplies.push(input.value);
    });

    return supplies;
};

const resetForm = () => {
    const form = document.getElementById("craft-form");
    form.reset();
    form._id.value = "";
    document.getElementById("supplies-boxes").innerHTML = "";
    document.getElementById("img-prev").src = "";
};

const showCraftForm = (e) => {
    openDialog("craft-form");
    console.log(e.target);
    if(e.target.getAttribute("id") != "edit-button") {
        resetForm();
    }
};

const deleteCraft = async(craft) => {
    let response = await fetch(`/api/crafts/${craft._id}`, {
        method:"DELETE",
        headers:{
            "Content-Type":"application/json;charset=utf-8",
    },
  });

    if(response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    resetForm();
    showCrafts();
    document.getElementById("dialog").style.display = "none";
};

const addSupply = (e) => {
    e.preventDefault();
    const section = document.getElementById("supplies-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item) => {
        item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
};

showCrafts();
document.getElementById("craft-form").onsubmit = addEditCraft;
document.getElementById("add-button").onclick = showCraftForm;
document.getElementById("add-supplies").onclick = addSupply;

document.getElementById("img").onchange = (e) => {
    if(!e.target.files.length) {
        document.getElementById("img-prev").src = "";
        return;
    }
    document.getElementById("img-prev").src = URL.createObjectURL(e.target.files.item(0));
};

  