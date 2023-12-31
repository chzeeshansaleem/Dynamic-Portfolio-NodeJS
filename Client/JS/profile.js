const token1 = getLocalStorageWithExpiry("token");
function getLocalStorageWithExpiry(key) {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const parsedItem = JSON.parse(item);
  const now = new Date();

  if (now.getTime() > parsedItem.expiry) {
    // Item has expired, so remove it from localStorage
    localStorage.removeItem(key);
    return null;
  }

  return parsedItem.value;
}
console.log(token1);
const token = `"${token1}"`;
console.log("User token:", token);
if (!token1) {
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}

var loginUser = JSON.parse(localStorage.getItem("user"));
console.log("Login User: " + loginUser);
// validation func
function ValidationInputByRegex(inputElement, regex) {
  inputElement.addEventListener("input", function (event) {
    const inputValue = event.target.value;

    if (regex.test(inputValue)) {
      event.target.value = inputValue.replace(regex, "");
    }
  });
}

// showing user profile
async function userProfile() {
  try {
    const response = await fetch("http://localhost:8000/profileUpdate", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
      },
    });

    if (!response.ok) {
      throw new error(`fetching ka  error Status: ${response.status}`);
    }

    const users = await response.json();

    console.log(users);

    const user12 = users.filter((user) => user.email === loginUser.email);
    console.log(user12);
    let user1 = users[0];
    if (user1) {
      const emailProfile = document.querySelector(".emailProfile");
      const nameProfile = document.querySelector(".nameProfile");
      const roleProfile = document.querySelector(".roleProfile");
      const numberProfile = document.querySelector(".numberProfile");
      const educationProfile = document.querySelector(".educationProfile");
      const skillsProfile = document.querySelector(".skillsProfile");
      const experienceProfile = document.querySelector(".experienceProfile");
      educationProfile.innerHTML = "";
      skillsProfile.innerHTML = "";
      experienceProfile.innerHTML = "";
      emailProfile.textContent = user1.email;
      nameProfile.textContent = user1.name;
      roleProfile.textContent = user1.role;
      numberProfile.textContent = user1.phone;
      const educationList = document.createElement("ul");
      if (user1.education) {
        user1.education.forEach((educationItem) => {
          const listItem = document.createElement("li");
          listItem.style.marginLeft = "10px";
          const deg = document.createElement("h3");
          const uni = document.createElement("h4");
          const date = document.createElement("div");
          const startDate = document.createElement("div");
          const endDate = document.createElement("div");
          deg.textContent = educationItem.degree;
          uni.textContent = educationItem.university;
          startDate.textContent = educationItem.startDate;
          endDate.textContent = educationItem.EndDate;
          const lineBreak = document.createElement("br");
          date.appendChild(startDate);
          date.appendChild(endDate);
          date.style.display = "inline";
          startDate.style.float = "left";

          endDate.style.float = "left";
          endDate.style.marginLeft = "10px";
          listItem.appendChild(deg);
          listItem.appendChild(uni);
          listItem.appendChild(date);
          listItem.appendChild(lineBreak);
          // listItem.style.listStyle = "none";

          educationList.appendChild(listItem);
        });
      }
      educationProfile.appendChild(educationList);
      const skillArr = user1.skill.split(",");
      const skillsList = document.createElement("ul");
      if (skillArr.length > 0) {
        skillArr.forEach((skill) => {
          const listItem = document.createElement("li");
          listItem.style.listStyle = "none";
          listItem.textContent = skill;
          skillsList.appendChild(listItem);
        });
      }
      skillsProfile.appendChild(skillsList);
      const expList = document.createElement("ul");

      console.log(expList);
      experienceProfile.appendChild(expList);
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
}
// Function to create an education edit form
function createEducationEditForm(educationItem, index) {
  // Create form element
  const edumodal = document.querySelector(".educationEditForm");
  edumodal.style.display = "block";
  const form = document.createElement("form");

  // Create degree input field
  const degreeLabel = document.createElement("label");
  degreeLabel.textContent = "Degree:";
  const degreeInput = document.createElement("input");
  const degreeInputRegex = /[^a-zA-Z0-9\s]/g;
  ValidationInputByRegex(degreeInput, degreeInputRegex);
  degreeInput.type = "text";
  degreeInput.id = "editDegree";
  degreeInput.value = educationItem.degree;

  // Create university input field
  const universityLabel = document.createElement("label");
  universityLabel.textContent = "University:";
  const universityInput = document.createElement("input");
  const universityInputRegex = /[^a-zA-Z0-9\s]/g;
  ValidationInputByRegex(universityInput, universityInputRegex);
  universityInput.type = "text";
  universityInput.id = "editUniversity";
  universityInput.value = educationItem.university;

  // Create start date input field
  const startDateLabel = document.createElement("label");
  startDateLabel.textContent = "Start Date:";
  const startDateInput = document.createElement("input");
  startDateInput.type = "date";
  startDateInput.id = "editStartDate";
  startDateInput.valueAsDate = new Date(educationItem.startDate);
  // Date validation
  startDateInput.addEventListener("input", function (event) {
    const inputValue = event.target.value;
    const dateParts = inputValue.split("-");

    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);

      if (year > 9999) {
        event.target.value = "9999-";
        return;
      }
      if (month > 12) {
        event.target.value = `${year}-12-`;
        return;
      }

      if (day > 31) {
        event.target.value = `${year}-${month}-31`;
        return;
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      event.target.value = "";
    }
  });
  // Create end date input field
  const endDateLabel = document.createElement("label");
  endDateLabel.textContent = "End Date:";
  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateInput.id = "editEndDate";
  endDateInput.valueAsDate = new Date(educationItem.endDate);
  // Date validation
  endDateInput.addEventListener("input", function (event) {
    const inputValue = event.target.value;
    const dateParts = inputValue.split("-");

    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);

      if (year > 9999) {
        event.target.value = "9999-";
        return;
      }
      if (month > 12) {
        event.target.value = `${year}-12-`;
        return;
      }

      if (day > 31) {
        event.target.value = `${year}-${month}-31`;
        return;
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      event.target.value = "";
    }
  });

  const presentStatusLabel = document.createElement("label");

  // Create a label for present status

  presentStatusLabel.textContent = "Present Status";
  const presentStatusInput = document.createElement("input");
  presentStatusInput.style.marginTop = "0px";
  presentStatusLabel.style.backgroundColor = "red";
  presentStatusInput.style.marginLeft = "20%";
  //presentStatusLabel.style.margin = "0px 10%";
  presentStatusInput.style.marginTop = "10px";
  presentStatusInput.type = "checkbox"; // Use a checkbox for present status
  presentStatusInput.id = "presentStatus"; // Add an ID for the input
  // Create Save button
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.id = "saveEducation";

  // Create Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.id = "cancelEducation";

  // Append input fields and buttons to the form
  form.appendChild(degreeLabel);
  form.appendChild(degreeInput);
  form.appendChild(universityLabel);
  form.appendChild(universityInput);
  form.appendChild(startDateLabel);
  form.appendChild(startDateInput);
  form.appendChild(endDateLabel);
  form.appendChild(endDateInput);
  //form.appendChild(presentStatusLabel);
  //form.appendChild(presentStatusInput);
  form.appendChild(saveButton);
  form.appendChild(cancelButton);

  // Event listener for Save button
  saveButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      // Get updated values from input fields
      const updatedDegree = degreeInput.value;
      const updatedUniversity = universityInput.value;
      const updatedStartDate = startDateInput.value;
      const updatedEndDate = endDateInput.value;
      if (
        degreeInput.value == "" ||
        universityInput.value == "" ||
        startDateInput.value == ""
      ) {
        alert("all fields are required");
        return;
      }
      if (new Date(startDateInput.value) >= new Date(endDateInput.value)) {
        alert("Start date must be before end date");
        return;
      }
      // Create a new education object with the updated data
      const updatedEducationItem = {
        degree: updatedDegree,
        university: updatedUniversity,
        startDate: updatedStartDate,
        endDate: updatedEndDate,
      };
      if (new Date(updatedStartDate) >= new Date(updatedEndDate)) {
        alert("Start date must be before end date");
        return;
      }
      console.log(updatedEducationItem);
      const res = await fetch(
        `http://localhost:8000/educationUpdate/${index}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
          },
          body: JSON.stringify(updatedEducationItem),
        }
      );

      if (res.status === 200) {
        // Successfully updated the education item on the server
        alert("Education item updated successfully");
      } else {
        // Handle error cases here
        alert("Failed to update education item");
      }

      // Hide the form
      form.style.display = "none";

      // Call a function to re-render the education list or table
      createEducationTable();
    } catch (error) {
      console.log(error);
    }

    // (You might also want to save the changes to your database or storage here)
  });

  // Event listener for Cancel button
  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Hide the form without making any changes
    form.style.display = "none";
  });

  return form;
}

// display the form for education editing
async function createEducationTable() {
  const educationTable = document.createElement("table");
  try {
    const response = await fetch("http://localhost:8000/education", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
      },
    });

    if (!response.ok) {
      throw new error(`fetching ka  error Status: ${response.status}`);
    }

    const users = await response.json();

    console.log(users);

    educationTable.classList.add("education-table");

    // Create the table header row
    const headerRow = document.createElement("tr");

    const degreeHeader = document.createElement("th");
    degreeHeader.textContent = "Degree";
    const universityHeader = document.createElement("th");
    universityHeader.textContent = "University";
    const startDateHeader = document.createElement("th");
    startDateHeader.textContent = "Start Date";
    const endDateHeader = document.createElement("th");
    endDateHeader.textContent = "End Date";
    const editHeader = document.createElement("th");
    editHeader.textContent = "Edit";
    const deleteHeader = document.createElement("th");
    deleteHeader.textContent = "Delete";
    headerRow.appendChild(degreeHeader);
    headerRow.appendChild(universityHeader);
    headerRow.appendChild(startDateHeader);
    headerRow.appendChild(endDateHeader);
    headerRow.appendChild(editHeader);
    headerRow.appendChild(deleteHeader);
    educationTable.appendChild(headerRow);
    if (users.result.length == 0) {
      const noRecordsRow = document.createElement("tr");
      const noRecordsCell = document.createElement("td");
      noRecordsCell.setAttribute("colspan", "6");
      noRecordsCell.textContent = "Record not found";
      noRecordsRow.appendChild(noRecordsCell);
      educationTable.appendChild(noRecordsRow);
    } else {
      users.result.forEach((item, index) => {
        const row = document.createElement("tr");
        const degreeCell = document.createElement("td");
        degreeCell.textContent = item.degree;
        console.log(item.degree);
        const universityCell = document.createElement("td");
        universityCell.textContent = item.university;
        const startDateCell = document.createElement("td");
        const newDate = new Date(item.startDate);
        startDateCell.textContent = newDate.toLocaleDateString();
        const endDateCell = document.createElement("td");
        console.log(newDate.toLocaleDateString());
        const newEndDate = new Date(item.endDate);
        endDateCell.textContent = newEndDate.toLocaleDateString();
        const editCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.background = "lightgreen";
        editButton.style.padding = "5px 20px";
        editButton.style.border = "none";
        editButton.style.fontWeight = "bold";
        const educationEditForm = document.querySelector(".educationEditForm");

        // Replace with your button
        editButton.addEventListener("click", () => {
          const educationEditForm11 = createEducationEditForm(item, item.ID);
          // Assuming you have a container element to append the form to
          const formContainer = document.getElementById("formContainer");
          educationEditForm.appendChild(educationEditForm11);
        });
        const deleteCell = document.createElement("td"); // Create a cell for delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.style.background = "red";
        deleteButton.style.padding = "5px 20px";
        deleteButton.style.border = "none";
        deleteButton.style.fontWeight = "bold";
        // Add an event listener to the "Delete" button
        deleteButton.addEventListener("click", async () => {
          // Remove the education item from the user's education array
          const res = await fetch(
            `http://localhost:8000/educationDelete/${item.ID}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
              },
            }
          );
          if (res.status === 200) {
            alert("deleted successfully");
          } else {
            alert;
          }
          // Re-render the education table with the updated data
          createEducationTable();
          // (You might also want to save the changes to your database or storage here)
        });

        editCell.appendChild(editButton);
        deleteCell.appendChild(deleteButton); // Add the delete button to the delete cell

        // Add the cells to the row
        row.appendChild(degreeCell);
        row.appendChild(universityCell);
        row.appendChild(startDateCell);
        row.appendChild(endDateCell);
        row.appendChild(editCell);
        row.appendChild(deleteCell); // Add the delete cell to the row

        // Add the row to the table
        educationTable.appendChild(row);
      });
    }
  } catch (error) {
    alert("Error: " + error);
  }

  const educationProfile = document.querySelector(".educationProfile");
  // Clear the previous education content and add the new table
  educationProfile.innerHTML = "";
  educationProfile.appendChild(educationTable);
}

// display experience edit form

function createExperienceEditForm(experienceItem, index) {
  // form element
  const experienceEditForm = document.querySelector(".experienceEditForm"); // Corrected selector
  if (experienceEditForm) {
    experienceEditForm.style.display = "block";
  }
  const form = document.createElement("form");

  //  position input field
  const positionLabel = document.createElement("label");
  positionLabel.textContent = "Position:";
  const positionInput = document.createElement("input");
  const positionInputRegex = /[^a-zA-Z0-9\s]/g;
  ValidationInputByRegex(positionInput, positionInputRegex);
  positionInput.type = "text";
  positionInput.id = "editPosition";
  positionInput.value = experienceItem.position;

  //  company input field
  const companyLabel = document.createElement("label");
  companyLabel.textContent = "Company:";
  const companyInput = document.createElement("input");
  const companyInputRegex = /[^a-zA-Z0-9\s]/g;
  ValidationInputByRegex(companyInput, companyInputRegex);
  companyInput.type = "text";
  companyInput.id = "editCompany";
  companyInput.value = experienceItem.company;

  //  start date input field
  const startDateLabel = document.createElement("label");
  startDateLabel.textContent = "Start Date:";
  const startDateInput = document.createElement("input");
  startDateInput.type = "date";
  startDateInput.id = "editStartDate";
  startDateInput.valueAsDate = new Date(experienceItem.startDate);
  startDateInput.addEventListener("input", function (event) {
    const inputValue = event.target.value;
    const dateParts = inputValue.split("-");

    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);

      if (year > 9999) {
        event.target.value = "9999-";
        return;
      }
      if (month > 12) {
        event.target.value = `${year}-12-`;
        return;
      }

      if (day > 31) {
        event.target.value = `${year}-${month}-31`;
        return;
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      event.target.value = "";
    }
  });

  //  end date input field
  const endDateLabel = document.createElement("label");
  endDateLabel.textContent = "End Date:";
  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateInput.id = "editEndDate";
  endDateInput.valueAsDate = new Date(experienceItem.endDate);
  // date validation
  endDateInput.addEventListener("input", function (event) {
    const inputValue = event.target.value;
    const dateParts = inputValue.split("-");

    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);

      if (year > 9999) {
        event.target.value = "9999-";
        return;
      }
      if (month > 12) {
        event.target.value = `${year}-12-`;
        return;
      }

      if (day > 31) {
        event.target.value = `${year}-${month}-31`;
        return;
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      event.target.value = "";
    }
  });
  //  Save button
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.id = "saveExperience";
  // cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.id = "cancelExperience";

  // Append input fields and Save button to the form
  form.appendChild(positionLabel);
  form.appendChild(positionInput);
  form.appendChild(companyLabel);
  form.appendChild(companyInput);
  form.appendChild(startDateLabel);
  form.appendChild(startDateInput);
  form.appendChild(endDateLabel);
  form.appendChild(endDateInput);
  form.appendChild(saveButton);
  form.appendChild(cancelButton);
  if (experienceEditForm) {
    experienceEditForm.appendChild(form);
  }

  // Event listener for Save button
  saveButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      // Get updated values from input fields
      const updatedPosition = positionInput.value;
      const updatedCompany = companyInput.value;
      const updatedStartDate = startDateInput.value;
      const updatedEndDate = endDateInput.value;

      if (
        positionInput.value == "" ||
        companyInput.value == "" ||
        startDateInput.value == ""
      ) {
        alert("all fields are required");
        return;
      }
      if (new Date(startDateInput.value) >= new Date(endDateInput.value)) {
        alert("Start date must be before end date");
        return;
      }
      // Create a new experience object with the updated data
      const updatedExperienceItem = {
        position: updatedPosition,
        company: updatedCompany,
        startDate: updatedStartDate,
        endDate: updatedEndDate,
      };

      console.log(index);
      const res = await fetch(
        `http://localhost:8000/experienceUpdate/${index}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
          },
          body: JSON.stringify(updatedExperienceItem),
        }
      );
      console.log(res);
      if (res.status === 200) {
        // Successfully updated the education item on the server
        alert("Experience item updated successfully");
      } else if (res.status === 400) {
        // Successfully updated the education item on the server
        alert("fields are empty");
        return;
      } else if (res.status === 403) {
        // Handle error cases here
        alert("user not logged in");
        return;
      } else {
        alert("server error: " + res.status);
      }

      // Update the experience data in the user's experience array
      //  user1.experience[index] = updatedExperienceItem;

      // Remove the form
      form.remove();

      // Call a function to re-render the experience table
      createExperienceTable();
    } catch (error) {
      console.log(error);
    }

    // (You might also want to save the changes to your database or storage here)
  });

  cancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Hide the form and clear it
    form.style.display = "none";
    form.innerHTML = "";
  });
}
// display experience
async function createExperienceTable() {
  const experienceTable = document.createElement("table");
  experienceTable.classList.add("experience-table");
  // Create the table header row
  const headerRow = document.createElement("tr");
  const positionHeader = document.createElement("th");
  positionHeader.textContent = "Position";
  const companyHeader = document.createElement("th");
  companyHeader.textContent = "Company";
  const startDateHeader = document.createElement("th");
  startDateHeader.textContent = "Start Date";
  const endDateHeader = document.createElement("th");
  endDateHeader.textContent = "End Date";
  const editHeader = document.createElement("th");
  editHeader.textContent = "Edit";
  const deleteHeader = document.createElement("th");
  deleteHeader.textContent = "Delete"; // Add a header for delete button

  headerRow.appendChild(positionHeader);
  headerRow.appendChild(companyHeader);
  headerRow.appendChild(startDateHeader);
  headerRow.appendChild(endDateHeader);
  headerRow.appendChild(editHeader);
  headerRow.appendChild(deleteHeader); // Append delete header to the table
  experienceTable.appendChild(headerRow);

  try {
    const response = await fetch("http://localhost:8000/experience", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
      },
    });

    if (!response.ok) {
      throw new error(`fetching ka  error Status: ${response.status}`);
    }

    const users = await response.json();

    console.log(users);
    if (users.message === "record not found") {
      const noRecordsRow = document.createElement("tr");
      const noRecordsCell = document.createElement("td");
      noRecordsCell.setAttribute("colspan", "6");
      noRecordsCell.textContent = "Record not found";
      noRecordsRow.appendChild(noRecordsCell);
      experienceTable.appendChild(noRecordsRow);
    } else {
      users.forEach((item, index) => {
        const row = document.createElement("tr");
        const positionCell = document.createElement("td");
        positionCell.textContent = item.position;
        const companyCell = document.createElement("td");
        companyCell.textContent = item.company;
        const startDateCell = document.createElement("td");
        const newDate = new Date(item.startDate);
        startDateCell.textContent = newDate.toLocaleDateString();
        const endDateCell = document.createElement("td");
        console.log(newDate.toLocaleDateString());
        const newEndDate = new Date(item.endDate);
        endDateCell.textContent = newEndDate.toLocaleDateString();
        //   endDateCell.textContent = item.endDate;
        const editCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.background = "lightgreen";
        editButton.style.padding = "5px 20px";
        editButton.style.border = "none";
        editButton.style.fontWeight = "bold";
        const experienceEditForm = document.querySelector(
          ".experienceEditForm"
        );
        if (experienceEditForm) {
          editButton.addEventListener("click", () => {
            const experienceEditForm11 = createExperienceEditForm(
              item,
              item.ID
            );

            experienceEditForm.appendChild(experienceEditForm11);
          });
        }
        // Replace with your button

        const deleteCell = document.createElement("td"); // Create a cell for delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.background = "red";
        deleteButton.style.padding = "5px 20px";
        deleteButton.style.border = "none";
        deleteButton.style.fontWeight = "bold";
        // Add an event listener to the "Delete" button
        deleteButton.addEventListener("click", async () => {
          // Remove the experience item from the user's experience array
          console.log(item.expId);
          const res = await fetch(
            `http://localhost:8000/experienceDelete/${item.ID}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
              },
            }
          );
          if (res.status === 200) {
            alert(" experiences deleted  successfully");
          } else {
            alert("not deleted");
          }
          // Re-render the experience table with the updated data
          createExperienceTable();
          // (You might also want to save the changes to your database or storage here)
        });

        editCell.appendChild(editButton);
        deleteCell.appendChild(deleteButton); // Add the delete button to the delete cell

        // Add the cells to the row
        row.appendChild(positionCell);
        row.appendChild(companyCell);
        row.appendChild(startDateCell);
        row.appendChild(endDateCell);
        row.appendChild(editCell);
        row.appendChild(deleteCell); // Add the delete cell to the row

        // Add the row to the table
        experienceTable.appendChild(row);
      });
    }
  } catch (error) {
    console.log("error: " + error);
  }

  // Populate the table with experience data

  const experienceProfile = document.querySelector(".experienceProfile");
  // Clear the previous experience content and add the new table
  experienceProfile.innerHTML = "";
  experienceProfile.appendChild(experienceTable);
}
userProfile();
createEducationTable();
createExperienceTable();
const editProfile = document.querySelector(".editProfile");
if (editProfile) {
  editProfile.onclick = async function () {
    try {
      const response = await fetch("http://localhost:8000/profileUpdate", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
        },
      });

      if (!response.ok) {
        throw new error(`fetching ka  error Status: ${response.status}`);
      }

      const users = await response.json();

      console.log(users);

      const user12 = users.filter((user) => user.email === loginUser.email);
      console.log(user12);
      let user1 = user12.shift();
      const modal = document.querySelector(".modal");
      if (modal) {
        modal.style.display = "block";
        modal.style.backgroundColor = "white";
        modal.style.width = "60%";
        modal.style.height = "80%";
        modal.style.overflowY = "auto";
        modal.style.overflowX = "hidden";
        modal.style.marginLeft = "10%";
      }
      const MainContentOfProject = document.querySelector(
        ".MainContentOfProject"
      );
      MainContentOfProject.innerHTML = "";

      const editform = document.createElement("form");

      const editTable = document.createElement("table");
      const editrow1 = document.createElement("tr");
      const editrow2 = document.createElement("tr");
      const editrow3 = document.createElement("tr");
      const editrow4 = document.createElement("tr");
      const editrow5 = document.createElement("tr");
      const editrow6 = document.createElement("tr");
      const editdata11 = document.createElement("td");
      const editdata12 = document.createElement("td");
      const editdata121 = document.createElement("input");

      const editdata121Regex = /[^a-zA-Z\s]/g;
      ValidationInputByRegex(editdata121, editdata121Regex);

      const editdata22 = document.createElement("td");
      const editdata221 = document.createElement("input");

      const editdata31 = document.createElement("td");
      const editdata32 = document.createElement("td");
      const editdata321 = document.createElement("input");
      const editdata321Regex = /[^0-9]/g;
      ValidationInputByRegex(editdata321, editdata321Regex);

      const editdata41 = document.createElement("td");
      const editdata42 = document.createElement("td");
      editdata42.style.display = "flex";
      editdata42.style.flexDirection = "column";
      const inputEditFields = document.createElement("div");
      inputEditFields.style.display = "";
      const editdata421 = document.createElement("input");
      const editdata421Regex = /[^a-zA-Z\s._-]/g;
      ValidationInputByRegex(editdata421, editdata421Regex);
      editdata421.placeholder = "Degree";
      const editdata422 = document.createElement("input");
      const editdata422Regex = /[^a-zA-Z0-9\s@._-]/g;
      ValidationInputByRegex(editdata422, editdata422Regex);
      editdata422.placeholder = "Institute";
      const editdata423 = document.createElement("input");
      editdata423.type = "date";
      editdata423.placeholder = "Starting Date";
      editdata423.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        const dateParts = inputValue.split("-");

        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]);
          const day = parseInt(dateParts[2]);

          if (year > 9999) {
            event.target.value = "9999-";
            return;
          }
          if (month > 12) {
            event.target.value = `${year}-12-`;
            return;
          }

          if (day > 31) {
            event.target.value = `${year}-${month}-31`;
            return;
          }
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
          event.target.value = "";
        }
      });

      const editdata424 = document.createElement("input");
      editdata424.type = "date";
      editdata424.placeholder = "Ending Date";
      editdata424.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        const dateParts = inputValue.split("-");

        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]);
          const day = parseInt(dateParts[2]);

          if (year > 9999) {
            event.target.value = "9999-";
            return;
          }
          if (month > 12) {
            event.target.value = `${year}-12-`;
            return;
          }

          if (day > 31) {
            event.target.value = `${year}-${month}-31`;
            return;
          }
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
          event.target.value = "";
        }
      });
      const presentStatusLabel = document.createElement("label");

      // Create a label for present status

      presentStatusLabel.textContent = "Present Status";
      const presentStatusInput = document.createElement("input");
      presentStatusInput.style.margin = "-22px 20%";
      presentStatusInput.type = "checkbox"; // Use a checkbox for present status
      presentStatusInput.id = "presentStatus"; // Add an ID for the input
      inputEditFields.appendChild(editdata421);
      inputEditFields.appendChild(editdata422);
      inputEditFields.appendChild(editdata423);
      inputEditFields.appendChild(editdata424);
      // inputEditFields.appendChild(presentStatusLabel);
      //inputEditFields.appendChild(presentStatusInput);
      //inputEditFields.appendChild(presentStatusText);

      presentStatusInput.addEventListener("change", () => {
        if (presentStatusInput.checked) {
          editdata424.disabled = true;
        } else {
          editdata424.disabled = false;
        }
      });

      const SaveEduBtn = document.createElement("input");
      inputEditFields.appendChild(editdata421);
      inputEditFields.appendChild(editdata422);
      inputEditFields.appendChild(editdata423);
      inputEditFields.appendChild(editdata424);
      inputEditFields.appendChild(SaveEduBtn);
      const showdatass = document.createElement("div");
      const showEducation1 = document.createElement("ul");
      SaveEduBtn.style.backgroundColor = "skyblue";
      SaveEduBtn.style.border = "none";
      SaveEduBtn.style.fontWeight = "bold";
      SaveEduBtn.style.borderRadius = "0px";
      SaveEduBtn.style.padding = "5px 10px";
      createEducationTable();

      // editEducation.textContent = "Edit";
      SaveEduBtn.type = "button";
      SaveEduBtn.value = "Add Education";

      // /////  New education ki entry save kro
      SaveEduBtn.onclick = async function () {
        // Create a new education object based on the input fields

        const newEducationItem = {
          username: loginUser.email,
          degree: editdata421.value,
          university: editdata422.value,
          startDate: editdata423.value,
          endDate: editdata424.value || "present",
        };

        if (
          editdata421.value == "" ||
          editdata422.value == "" ||
          editdata423.value == "" ||
          editdata424.value == ""
        ) {
          alert("all fields are required");
          return;
        }
        if (new Date(editdata423.value) >= new Date(editdata424.value)) {
          alert("Start date must be before end date");
          return;
        }
        try {
          const response = await fetch("http://localhost:8000/addEduaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
            },
            body: JSON.stringify(newEducationItem),
          });
          console.log(response.status);
          const data = await response.json();
          console.log(data); // Log the response data for debugging
          if (response.status === 200) {
            // Successfully added the education item on the server
            alert("Education item added successfully");
            //reseet fields
            editdata421.value = "";
            editdata422.value = "";
            editdata423.value = "";
            editdata424.value = "";
          } else {
            // Handle error cases here
            alert("Failed to add education item");
          }
        } catch (error) {
          console.error("Error:", error);
        }

        //call function for show
        createEducationTable();
      };
      // showEducation.appendChild(editEducation);
      showdatass.appendChild(showEducation1);

      const editdata61 = document.createElement("td");
      const editdata62 = document.createElement("td");
      editdata62.style.display = "flex";
      editdata62.style.flexDirection = "column";
      const experEditFields = document.createElement("div");
      inputEditFields.style.display = "";
      const editdata621 = document.createElement("input");
      const editdata621Regex = /[^a-zA-Z\s_-]/g;
      ValidationInputByRegex(editdata621, editdata621Regex);
      editdata621.placeholder = "Position";
      const editdata622 = document.createElement("input");
      const editdata622Regex = /[^a-zA-Z0-9\s_-]/g;
      ValidationInputByRegex(editdata622, editdata622Regex);
      editdata622.placeholder = "company";
      const editdata623 = document.createElement("input");
      editdata623.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        const dateParts = inputValue.split("-");

        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]);
          const day = parseInt(dateParts[2]);

          if (year > 9999) {
            event.target.value = "9999-";
            return;
          }
          if (month > 12) {
            event.target.value = `${year}-12-`;
            return;
          }

          if (day > 31) {
            event.target.value = `${year}-${month}-31`;
            return;
          }
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
          event.target.value = "";
        }
      });
      editdata623.type = "date";
      editdata423.placeholder = "Starting Date";
      const editdata624 = document.createElement("input");
      editdata624.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        const dateParts = inputValue.split("-");

        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]);
          const day = parseInt(dateParts[2]);

          if (year > 9999) {
            event.target.value = "9999-";
            return;
          }
          if (month > 12) {
            event.target.value = `${year}-12-`;
            return;
          }

          if (day > 31) {
            event.target.value = `${year}-${month}-31`;
            return;
          }
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
          event.target.value = "";
        }
      });
      editdata624.type = "date";
      editdata624.placeholder = "Ending Date"; // Add a placeholder for ending date
      const presentStatusLabelExp = document.createElement("label");

      // presentStatusLabel.style.marginTop = "100px";
      // Create a label for present status

      presentStatusLabelExp.textContent = "Present Status";
      const presentStatusInputexp = document.createElement("input");
      presentStatusInputexp.style.margin = "-22px 20%";
      presentStatusInputexp.type = "checkbox"; // Use a checkbox for present status
      presentStatusInputexp.id = "presentStatus"; // Add an ID for the input
      experEditFields.appendChild(editdata621);
      experEditFields.appendChild(editdata622);
      experEditFields.appendChild(editdata623);
      experEditFields.appendChild(editdata624);
      //experEditFields.appendChild(presentStatusLabelExp);
      //experEditFields.appendChild(presentStatusInputexp);
      //inputEditFields.appendChild(presentStatusText);

      presentStatusInputexp.addEventListener("change", () => {
        if (presentStatusInputexp.checked) {
          editdata624.disabled = true;
        } else if (!presentStatusInputexp.checked) {
          editdata624.disabled = false;
        } else {
          console.log("not null");
        }
      });

      const SaveExpBtn = document.createElement("input");
      SaveExpBtn.style.backgroundColor = "skyblue";
      SaveExpBtn.style.border = "none";
      SaveExpBtn.style.fontWeight = "bold";
      SaveExpBtn.style.borderRadius = "0px";
      SaveExpBtn.style.padding = "5px 10px";
      experEditFields.appendChild(editdata621);
      experEditFields.appendChild(editdata622);
      experEditFields.appendChild(editdata623);
      experEditFields.appendChild(editdata624);
      experEditFields.appendChild(SaveExpBtn);
      const showdataExp = document.createElement("div");
      const showExp1 = document.createElement("ul");

      createEducationTable();

      SaveExpBtn.type = "button";
      SaveExpBtn.value = "Add EXperience";

      // /////  New exper ki entry save kro
      SaveExpBtn.onclick = async function () {
        // Create a new exp object based on the input fields
        const newExperienceItem = {
          username: loginUser.email,
          position: editdata621.value,
          company: editdata622.value,
          startDate: editdata623.value,
          endDate: editdata624.value || "present",
        };

        if (
          editdata621.value == "" ||
          editdata622.value == "" ||
          editdata623.value == "" ||
          editdata624.value == ""
        ) {
          alert("all fields are required");
          return;
        }
        if (new Date(editdata623.value) >= new Date(editdata624.value)) {
          alert("Start date must be before end date");
          return;
        }
        // user1.experience.push(newExperienceItem);

        try {
          const response = await fetch("http://localhost:8000/addExperience", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
            },
            body: JSON.stringify(newExperienceItem),
          });
          console.log(response.status);
          const data = await response.json();
          console.log(data); // Log the response data for debugging
          if (response.status === 200) {
            // Successfully added the education item on the server
            alert("Experience item added successfully");
            //reseet fields
            editdata621.value = "";
            editdata622.value = "";
            editdata623.value = "";
            editdata624.value = "";
          } else {
            // Handle error cases here
            alert("Failed to add experience item");
          }
        } catch (error) {
          console.error("Error:", error);
        }

        //call function for show
        createExperienceTable();
      };
      showdataExp.appendChild(showExp1);

      const editdata51 = document.createElement("td");
      const editdata52 = document.createElement("td");
      const editdata521 = document.createElement("input");
      const editdata521Regex = /[^a-zA-Z0-9\s,]/g;
      ValidationInputByRegex(editdata521, editdata521Regex);
      editdata11.textContent = "Name:";
      editdata121.value = user1.name;

      editdata31.textContent = "phone:";
      editdata321.value = user1.phone;
      editdata41.textContent = "Education";
      editdata421.value = "";

      editdata51.textContent = "Skills:";
      editdata521.value = user1.skill;
      editdata61.textContent = "Experince:";

      editdata62.appendChild(experEditFields); //2nd td
      editdata52.appendChild(editdata521); //2nd td

      editdata42.appendChild(inputEditFields);
      editdata42.appendChild(showdatass);

      editdata32.appendChild(editdata321); //2nd td
      editdata22.appendChild(editdata221); //2nd td
      editdata12.appendChild(editdata121); //2nd td
      editrow1.appendChild(editdata11);
      editrow1.appendChild(editdata12);

      editrow3.appendChild(editdata31);
      editrow3.appendChild(editdata32);
      editrow4.appendChild(editdata41);
      editrow4.appendChild(editdata42);
      editrow5.appendChild(editdata51);
      editrow5.appendChild(editdata52);
      editrow6.appendChild(editdata61);
      editrow6.appendChild(editdata62);
      editTable.appendChild(editrow1);
      editTable.appendChild(editrow2);
      editTable.appendChild(editrow3);
      editTable.appendChild(editrow5);
      editTable.appendChild(editrow4);
      editTable.appendChild(editrow6);
      editform.appendChild(editTable);
      const savebtn = document.createElement("button");
      savebtn.style.backgroundColor = "skyblue";
      savebtn.style.border = "none";
      savebtn.style.fontWeight = "bold";
      savebtn.style.borderRadius = "0px";
      savebtn.style.padding = "5px 10px";
      savebtn.style.boxShadow = "2px 2px 5px gray";
      savebtn.textContent = "Save";
      savebtn.type = "submit";
      const cancelEdit = document.getElementById("crossprofile");
      cancelEdit.onclick = function () {
        modal.style.display = "none";
      };
      editform.appendChild(savebtn);
      MainContentOfProject.appendChild(editform);

      savebtn.onclick = async function (e) {
        e.preventDefault();

        const userindex = users.findIndex((u) => u.email === loginUser.email);

        if (userindex !== -1) {
          users[userindex].name = editdata121.value;

          if (editdata121.value === "") {
            alert("Please enter Name");
            return;
          }

          users[userindex].phoneNumber = editdata321.value;
          users[userindex].skills = editdata521.value.split(",");
        }

        if (editdata321.value == "" || editdata521.value == "") {
          alert("all fields are required");
          return;
        }
        try {
          const updatedProfile = users[userindex];
          console.log(updatedProfile);

          const res = await fetch(
            `http://localhost:8000/profileUpdate/${updatedProfile.ID}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
              },
              body: JSON.stringify(updatedProfile),
            }
          );
          console.log(res.status);
          if (res.status === 200) {
            alert("Profile Updated successfully");
            userProfile();
            createEducationTable();
            createExperienceTable();
          } else {
            alert("Profile update failed");
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("An error occurred while updating the profile.");
        }

        modal.style.display = "none";
      };
    } catch (error) {}
  };
}

const logoutbtn = document.getElementById("logout");
async function logout(e) {
  e.preventDefault();
  const res = await fetch("http://localhost:8000/logout", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
    },
  });
  localStorage.removeItem("user");
  localStorage.removeItem("admin");
  localStorage.removeItem("token");
  console.log(res);
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}
if (logoutbtn) {
  logoutbtn.onclick = logout;
}
