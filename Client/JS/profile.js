//import users from "../db/user.json" assert { type: "json" };
import logout from "../JS/index.js";

// console.log(users);
const redirct = localStorage.getItem("user");
if (!redirct) {
  const url = "http://127.0.0.1:5500/Client/HTML/login.html";
  window.location.href = url;
}

var loginUser = JSON.parse(localStorage.getItem("user"));
console.log("Login User: " + loginUser);

// showing user profile
async function userProfile() {
  try {
    const response = await fetch("http://localhost:8000/profileUpdate");

    if (!response.ok) {
      throw new error(`fetching ka  error Status: ${response.status}`);
    }

    const users = await response.json();

    console.log(users);

    const user12 = users.filter((user) => user.email === loginUser.email);
    console.log(user12);
    let user1 = user12.shift();
    if (user1) {
      const emailProfile = document.querySelector(".emailProfile");
      const nameProfile = document.querySelector(".nameProfile");
      const passwordProfile = document.querySelector(".passwordProfile");
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
      passwordProfile.textContent = user1.password;
      roleProfile.textContent = user1.role;
      numberProfile.textContent = user1.phoneNumber;
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

      const skillsList = document.createElement("ul");
      if (user1.skills) {
        user1.skills.forEach((skill) => {
          const listItem = document.createElement("li");
          listItem.style.listStyle = "none";
          listItem.textContent = skill;
          skillsList.appendChild(listItem);
        });
      }
      skillsProfile.appendChild(skillsList);
      const expList = document.createElement("ul");
      // if (user1.experience) {
      //   user1.experience.forEach((exp) => {
      //     console.log(exp);
      //     const listItem = document.createElement("li");

      //     listItem.style.marginLeft = "10px";
      //     const des = document.createElement("h3");
      //     const com = document.createElement("h4");
      //     const date = document.createElement("div");
      //     const startDate = document.createElement("div");
      //     const endDate = document.createElement("div");
      //     des.textContent = exp.designation;

      //     com.textContent = exp.company;
      //     startDate.textContent = exp.startDate;
      //     endDate.textContent = exp.EndDate;
      //     const lineBreak = document.createElement("br");
      //     date.appendChild(startDate);
      //     date.appendChild(endDate);
      //     date.style.display = "inline";
      //     startDate.style.float = "left";

      //     endDate.style.float = "left";
      //     endDate.style.marginLeft = "10px";
      //     listItem.appendChild(des);

      //     listItem.appendChild(com);
      //     listItem.appendChild(date);
      //     listItem.appendChild(lineBreak);
      //     expList.appendChild(listItem);
      //     // listItem.style.listStyle = "none";
      //   });
      // }
      console.log(expList);
      experienceProfile.appendChild(expList);
    }
  } catch (error) {
    console.log("Fetch error:", error);
    alert("Fetch error:", error);
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
  degreeInput.type = "text";
  degreeInput.id = "editDegree";
  degreeInput.value = educationItem.degree;

  // Create university input field
  const universityLabel = document.createElement("label");
  universityLabel.textContent = "University:";
  const universityInput = document.createElement("input");
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

  // Create end date input field
  const endDateLabel = document.createElement("label");
  endDateLabel.textContent = "End Date:";
  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateInput.id = "editEndDate";
  endDateInput.valueAsDate = new Date(educationItem.EndDate);

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

      // Create a new education object with the updated data
      const updatedEducationItem = {
        username: loginUser.email,
        eduId: index,
        degree: updatedDegree,
        university: updatedUniversity,
        startDate: updatedStartDate,
        EndDate: updatedEndDate,
      };
      console.log(updatedEducationItem);
      const res = await fetch(
        `http://localhost:8000/educationUpdate/${index}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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
    const response = await fetch("http://localhost:8000/education");

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
    const deleteHeader = document.createElement("th"); // Add a header for delete button
    deleteHeader.textContent = "Delete"; // Set header text for delete button
    headerRow.appendChild(degreeHeader);
    headerRow.appendChild(universityHeader);
    headerRow.appendChild(startDateHeader);
    headerRow.appendChild(endDateHeader);
    headerRow.appendChild(editHeader);
    headerRow.appendChild(deleteHeader); // Append delete header to the table
    educationTable.appendChild(headerRow);

    // Populate the table with education data

    const user12 = users.filter((user) => user.username === loginUser.email);
    console.log(user12);
    // let user1 = user12;
    user12.forEach((item, index) => {
      const row = document.createElement("tr");
      const degreeCell = document.createElement("td");
      degreeCell.textContent = item.degree;
      console.log(item.degree);
      const universityCell = document.createElement("td");
      universityCell.textContent = item.university;
      const startDateCell = document.createElement("td");
      startDateCell.textContent = item.startDate;
      const endDateCell = document.createElement("td");
      endDateCell.textContent = item.EndDate;
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
        const educationEditForm11 = createEducationEditForm(item, item.eduId);
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
          `http://localhost:8000/educationDelete/${item.eduId}`,
          {
            method: "DELETE",
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
  positionInput.type = "text";
  positionInput.id = "editPosition";
  positionInput.value = experienceItem.position;

  //  company input field
  const companyLabel = document.createElement("label");
  companyLabel.textContent = "Company:";
  const companyInput = document.createElement("input");
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

  //  end date input field
  const endDateLabel = document.createElement("label");
  endDateLabel.textContent = "End Date:";
  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  endDateInput.id = "editEndDate";
  endDateInput.valueAsDate = new Date(experienceItem.endDate);

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

      // Create a new experience object with the updated data
      const updatedExperienceItem = {
        username: loginUser.email,
        expId: index,
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedExperienceItem),
        }
      );

      if (res.status === 200) {
        // Successfully updated the education item on the server
        alert("Experience item updated successfully");
      } else {
        // Handle error cases here
        alert("Failed to update experience item");
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
    const response = await fetch("http://localhost:8000/experience");

    if (!response.ok) {
      throw new error(`fetching ka  error Status: ${response.status}`);
    }

    const users = await response.json();

    console.log(users);

    const user12 = users.filter((user) => user.username === loginUser.email);
    console.log(user12);

    user12.forEach((item, index) => {
      const row = document.createElement("tr");
      const positionCell = document.createElement("td");
      positionCell.textContent = item.position;
      const companyCell = document.createElement("td");
      companyCell.textContent = item.company;
      const startDateCell = document.createElement("td");
      startDateCell.textContent = item.startDate;
      const endDateCell = document.createElement("td");
      endDateCell.textContent = item.endDate;
      const editCell = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.style.background = "lightgreen";
      editButton.style.padding = "5px 20px";
      editButton.style.border = "none";
      editButton.style.fontWeight = "bold";
      const experienceEditForm = document.querySelector(".experienceEditForm");
      if (experienceEditForm) {
        editButton.addEventListener("click", () => {
          const experienceEditForm11 = createExperienceEditForm(
            item,
            item.expId
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
          `http://localhost:8000/experienceDelete/${item.expId}`,
          {
            method: "DELETE",
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
  } catch (error) {}

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
  // editProfile.onclick =   async function () {
  //   const modal = document.querySelector(".modal");
  //   if (modal) {
  //     modal.style.display = "block";
  //     modal.style.backgroundColor = "white";
  //     modal.style.width = "60%";
  //     modal.style.height = "80%";
  //     modal.style.overflowY = "auto";
  //     modal.style.overflowX = "hidden";
  //     modal.style.marginLeft = "10%";
  //   }
  //   const MainContentOfProject = document.querySelector(
  //     ".MainContentOfProject"
  //   );
  //   MainContentOfProject.innerHTML = "";

  //   const editform = document.createElement("form");

  //   const editTable = document.createElement("table");
  //   const editrow1 = document.createElement("tr");
  //   const editrow2 = document.createElement("tr");
  //   const editrow3 = document.createElement("tr");
  //   const editrow4 = document.createElement("tr");
  //   const editrow5 = document.createElement("tr");
  //   const editrow6 = document.createElement("tr");
  //   const editdata11 = document.createElement("td");
  //   const editdata12 = document.createElement("td");
  //   const editdata121 = document.createElement("input");
  //   editdata121.addEventListener("input", function (event) {
  //     const inputValue = event.target.value;
  //     const regex = /[^a-zA-Z\s]/g;

  //     if (regex.test(inputValue)) {
  //       event.target.value = inputValue.replace(/[^a-zA-Z\s]/g, "");
  //     }
  //   });

  //   const editdata21 = document.createElement("td");
  //   const editdata22 = document.createElement("td");
  //   const editdata221 = document.createElement("input");
  //   const editdata31 = document.createElement("td");
  //   const editdata32 = document.createElement("td");
  //   const editdata321 = document.createElement("input");
  //   editdata321.addEventListener("input", function (event) {
  //     const inputValue = event.target.value;
  //     const regex = /[^0-9]/g;

  //     if (regex.test(inputValue)) {
  //       event.target.value = inputValue.replace(/[^0-9]/g, "");
  //     }
  //   });

  //   const editdata41 = document.createElement("td");
  //   const editdata42 = document.createElement("td");
  //   editdata42.style.display = "flex";
  //   editdata42.style.flexDirection = "column";
  //   const inputEditFields = document.createElement("div");
  //   inputEditFields.style.display = "";
  //   const editdata421 = document.createElement("input");
  //   editdata421.placeholder = "Degree";
  //   const editdata422 = document.createElement("input");
  //   editdata422.placeholder = "Institute";
  //   const editdata423 = document.createElement("input");
  //   editdata423.type = "date";
  //   editdata423.placeholder = "Starting Date";
  //   const editdata424 = document.createElement("input");
  //   editdata424.type = "date";
  //   editdata424.placeholder = "Ending Date"; // Add a placeholder for ending date
  //   const presentStatusLabel = document.createElement("label");

  //   // presentStatusLabel.style.marginTop = "100px";
  //   // Create a label for present status

  //   presentStatusLabel.textContent = "Present Status";
  //   const presentStatusInput = document.createElement("input");
  //   presentStatusInput.style.margin = "-22px 20%";
  //   presentStatusInput.type = "checkbox"; // Use a checkbox for present status
  //   presentStatusInput.id = "presentStatus"; // Add an ID for the input
  //   inputEditFields.appendChild(editdata421);
  //   inputEditFields.appendChild(editdata422);
  //   inputEditFields.appendChild(editdata423);
  //   inputEditFields.appendChild(editdata424);
  //   inputEditFields.appendChild(presentStatusLabel);
  //   inputEditFields.appendChild(presentStatusInput);
  //   //inputEditFields.appendChild(presentStatusText);

  //   presentStatusInput.addEventListener("change", () => {
  //     if (presentStatusInput.checked) {
  //       editdata424.disabled = true;
  //       editdata424.value = "present";
  //     } else {
  //       editdata424.disabled = false;
  //     }
  //   });

  //   const SaveEduBtn = document.createElement("input");
  //   inputEditFields.appendChild(editdata421);
  //   inputEditFields.appendChild(editdata422);
  //   inputEditFields.appendChild(editdata423);
  //   inputEditFields.appendChild(editdata424);
  //   inputEditFields.appendChild(SaveEduBtn);
  //   const showdatass = document.createElement("div");
  //   const showEducation1 = document.createElement("ul");

  //   createEducationTable();

  //   // editEducation.textContent = "Edit";
  //   SaveEduBtn.type = "button";
  //   SaveEduBtn.value = "Add Education";

  //   // /////  New education ki entry save kro
  //   SaveEduBtn.onclick = function () {
  //     // Create a new education object based on the input fields
  //     const newEducationItem = {
  //       eduId: 56,
  //       degree: editdata421.value,
  //       university: editdata422.value,
  //       startDate: editdata423.value,
  //       EndDate: editdata424.value,
  //     };
  //     user1.education.push(newEducationItem);

  //     //reseet fields
  //     editdata421.value = "";
  //     editdata422.value = "";
  //     editdata423.value = "";
  //     editdata424.value = "";

  //     //call function for show
  //     createEducationTable();
  //   };
  //   // showEducation.appendChild(editEducation);
  //   showdatass.appendChild(showEducation1);

  //   editdata421.addEventListener("input", function (event) {
  //     const inputValue = event.target.value;
  //     const regex = /[^a-zA-Z\s]/;
  //     if (regex.test(inputValue)) {
  //       event.target.value = inputValue.replace(/[^a-zA-Z\s,]/, "");
  //     }
  //   });

  //   const editdata61 = document.createElement("td");
  //   const editdata62 = document.createElement("td");
  //   editdata62.style.display = "flex";
  //   editdata62.style.flexDirection = "column";
  //   const experEditFields = document.createElement("div");
  //   inputEditFields.style.display = "";
  //   const editdata621 = document.createElement("input");
  //   editdata621.placeholder = "Position";
  //   const editdata622 = document.createElement("input");
  //   editdata622.placeholder = "company";
  //   const editdata623 = document.createElement("input");
  //   editdata623.type = "date";
  //   editdata423.placeholder = "Starting Date";
  //   const editdata624 = document.createElement("input");
  //   editdata624.type = "date";
  //   editdata624.placeholder = "Ending Date"; // Add a placeholder for ending date
  //   const presentStatusLabelExp = document.createElement("label");

  //   // presentStatusLabel.style.marginTop = "100px";
  //   // Create a label for present status

  //   presentStatusLabelExp.textContent = "Present Status";
  //   const presentStatusInputexp = document.createElement("input");
  //   presentStatusInputexp.style.margin = "-22px 20%";
  //   presentStatusInputexp.type = "checkbox"; // Use a checkbox for present status
  //   presentStatusInputexp.id = "presentStatus"; // Add an ID for the input
  //   experEditFields.appendChild(editdata621);
  //   experEditFields.appendChild(editdata622);
  //   experEditFields.appendChild(editdata623);
  //   experEditFields.appendChild(editdata624);
  //   experEditFields.appendChild(presentStatusLabelExp);
  //   experEditFields.appendChild(presentStatusInputexp);
  //   //inputEditFields.appendChild(presentStatusText);

  //   presentStatusInput.addEventListener("change", () => {
  //     if (presentStatusInput.checked) {
  //       editdata624.disabled = true;
  //       editdata624.value = "present";
  //     } else {
  //       editdata624.disabled = false;
  //     }
  //   });

  //   const SaveExpBtn = document.createElement("input");
  //   experEditFields.appendChild(editdata621);
  //   experEditFields.appendChild(editdata622);
  //   experEditFields.appendChild(editdata623);
  //   experEditFields.appendChild(editdata624);
  //   experEditFields.appendChild(SaveExpBtn);
  //   const showdataExp = document.createElement("div");
  //   const showExp1 = document.createElement("ul");

  //   createEducationTable();

  //   SaveExpBtn.type = "button";
  //   SaveExpBtn.value = "Add Education";

  //   // /////  New exper ki entry save kro
  //   SaveExpBtn.onclick = function () {
  //     // Create a new exp object based on the input fields
  //     const newExperienceItem = {
  //       expId: 56,
  //       position: editdata621.value,
  //       company: editdata622.value,
  //       startDate: editdata623.value,
  //       EndDate: editdata624.value,
  //     };
  //     user1.experience.push(newExperienceItem);

  //     //reseet fields
  //     editdata621.value = "";
  //     editdata622.value = "";
  //     editdata623.value = "";
  //     editdata624.value = "";

  //     //call function for show
  //     createExperienceTable();
  //   };
  //   showdataExp.appendChild(showExp1);

  //   const editdata51 = document.createElement("td");
  //   const editdata52 = document.createElement("td");
  //   const editdata521 = document.createElement("input");
  //   editdata521.addEventListener("input", function (event) {
  //     const inputValue = event.target.value;
  //     const regex = /[^a-zA-Z0-9\s,]/;

  //     if (regex.test(inputValue)) {
  //       event.target.value = inputValue.replace(/[^a-zA-Z0-9\s,]/, "");
  //     }
  //   });

  //   editdata11.textContent = "Name:";
  //   editdata121.value = user1.name;
  //   editdata21.textContent = "password:";
  //   editdata221.value = user1.password;
  //   editdata31.textContent = "phone:";
  //   editdata321.value = user1.phoneNumber;
  //   editdata41.textContent = "Education";
  //   editdata421.value = "";

  //   editdata51.textContent = "Skills:";
  //   editdata521.value = user1.skills;
  //   editdata61.textContent = "Experince:";

  //   editdata62.appendChild(experEditFields); //2nd td
  //   editdata52.appendChild(editdata521); //2nd td

  //   editdata42.appendChild(inputEditFields);
  //   editdata42.appendChild(showdatass);

  //   editdata32.appendChild(editdata321); //2nd td
  //   editdata22.appendChild(editdata221); //2nd td
  //   editdata12.appendChild(editdata121); //2nd td
  //   editrow1.appendChild(editdata11);
  //   editrow1.appendChild(editdata12);
  //   editrow2.appendChild(editdata21);
  //   editrow2.appendChild(editdata22);
  //   editrow3.appendChild(editdata31);
  //   editrow3.appendChild(editdata32);
  //   editrow4.appendChild(editdata41);
  //   editrow4.appendChild(editdata42);
  //   editrow5.appendChild(editdata51);
  //   editrow5.appendChild(editdata52);
  //   editrow6.appendChild(editdata61);
  //   editrow6.appendChild(editdata62);
  //   editTable.appendChild(editrow1);
  //   editTable.appendChild(editrow2);
  //   editTable.appendChild(editrow3);
  //   editTable.appendChild(editrow4);
  //   editTable.appendChild(editrow5);
  //   editTable.appendChild(editrow6);
  //   editform.appendChild(editTable);
  //   const savebtn = document.createElement("button");
  //   savebtn.textContent = "Save";
  //   savebtn.type = "submit";
  //   const cancelEdit = document.getElementById("crossprofile");
  //   cancelEdit.onclick = function () {
  //     modal.style.display = "none";
  //   };
  //   editform.appendChild(savebtn);
  //   MainContentOfProject.appendChild(editform);
  //   savebtn.onclick = function (e) {
  //     e.preventDefault();
  //     console.log("after default click submit");
  //     const userindex = users.findIndex((u) => u.email === loginUser);
  //     if (userindex !== -1) {
  //       users[userindex].name = editdata121.value;
  //       if (editdata221.value == "") {
  //         alert("Please enter Passwords");
  //       } else {
  //         users[userindex].password = editdata221.value;
  //       }
  //       users[userindex].phoneNumber = editdata321.value;

  //       users[userindex].skills = editdata521.value.split(",");
  //     }
  //     modal.style.display = "none";
  //     userProfile();
  //     createEducationTable();
  //     createExperienceTable();
  //   };
  // };
  editProfile.onclick = async function () {
    try {
      const response = await fetch("http://localhost:8000/profileUpdate");

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
      editdata121.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        const regex = /[^a-zA-Z\s]/g;

        if (regex.test(inputValue)) {
          event.target.value = inputValue.replace(/[^a-zA-Z\s]/g, "");
        }
      });

      const editdata21 = document.createElement("td");
      const editdata22 = document.createElement("td");
      const editdata221 = document.createElement("input");
      const editdata31 = document.createElement("td");
      const editdata32 = document.createElement("td");
      const editdata321 = document.createElement("input");
      editdata321.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        const regex = /[^0-9]/g;

        if (regex.test(inputValue)) {
          event.target.value = inputValue.replace(/[^0-9]/g, "");
        }
      });

      const editdata41 = document.createElement("td");
      const editdata42 = document.createElement("td");
      editdata42.style.display = "flex";
      editdata42.style.flexDirection = "column";
      const inputEditFields = document.createElement("div");
      inputEditFields.style.display = "";
      const editdata421 = document.createElement("input");
      editdata421.placeholder = "Degree";
      const editdata422 = document.createElement("input");
      editdata422.placeholder = "Institute";
      const editdata423 = document.createElement("input");
      editdata423.type = "date";
      editdata423.placeholder = "Starting Date";
      const editdata424 = document.createElement("input");
      editdata424.type = "date";
      editdata424.placeholder = "Ending Date"; // Add a placeholder for ending date
      const presentStatusLabel = document.createElement("label");

      // presentStatusLabel.style.marginTop = "100px";
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
      inputEditFields.appendChild(presentStatusLabel);
      inputEditFields.appendChild(presentStatusInput);
      //inputEditFields.appendChild(presentStatusText);

      presentStatusInput.addEventListener("change", () => {
        if (presentStatusInput.checked) {
          editdata424.disabled = true;
          editdata424.value = "present";
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
          EndDate: editdata424.value,
        };
        // user1.education.push(newEducationItem);

        try {
          const response = await fetch("http://localhost:8000/addEduaction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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

      editdata421.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        const regex = /[^a-zA-Z\s]/;
        if (regex.test(inputValue)) {
          event.target.value = inputValue.replace(/[^a-zA-Z\s,]/, "");
        }
      });

      const editdata61 = document.createElement("td");
      const editdata62 = document.createElement("td");
      editdata62.style.display = "flex";
      editdata62.style.flexDirection = "column";
      const experEditFields = document.createElement("div");
      inputEditFields.style.display = "";
      const editdata621 = document.createElement("input");
      editdata621.placeholder = "Position";
      const editdata622 = document.createElement("input");
      editdata622.placeholder = "company";
      const editdata623 = document.createElement("input");
      editdata623.type = "date";
      editdata423.placeholder = "Starting Date";
      const editdata624 = document.createElement("input");
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
      experEditFields.appendChild(presentStatusLabelExp);
      experEditFields.appendChild(presentStatusInputexp);
      //inputEditFields.appendChild(presentStatusText);

      presentStatusInput.addEventListener("change", () => {
        if (presentStatusInput.checked) {
          editdata624.disabled = true;
          editdata624.value = "present";
        } else {
          editdata624.disabled = false;
        }
      });

      const SaveExpBtn = document.createElement("input");
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
          endDate: editdata624.value,
        };
        // user1.experience.push(newExperienceItem);

        try {
          const response = await fetch("http://localhost:8000/addExperience", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
      editdata521.addEventListener("input", function (event) {
        const inputValue = event.target.value;
        const regex = /[^a-zA-Z0-9\s,]/;

        if (regex.test(inputValue)) {
          event.target.value = inputValue.replace(/[^a-zA-Z0-9\s,]/, "");
        }
      });

      editdata11.textContent = "Name:";
      editdata121.value = user1.name;
      editdata21.textContent = "password:";
      editdata221.value = user1.password;
      editdata31.textContent = "phone:";
      editdata321.value = user1.phoneNumber;
      editdata41.textContent = "Education";
      editdata421.value = "";

      editdata51.textContent = "Skills:";
      editdata521.value = user1.skills;
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
      editrow2.appendChild(editdata21);
      editrow2.appendChild(editdata22);
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
      editTable.appendChild(editrow4);
      editTable.appendChild(editrow5);
      editTable.appendChild(editrow6);
      editform.appendChild(editTable);
      const savebtn = document.createElement("button");
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

          if (editdata221.value == "") {
            alert("Please enter Passwords");
          } else {
            users[userindex].password = editdata221.value;
          }

          users[userindex].phoneNumber = editdata321.value;
          users[userindex].skills = editdata521.value.split(",");
        }

        try {
          const updatedProfile = users[userindex];
          console.log(updatedProfile);

          const res = await fetch(
            `http://localhost:8000/profileUpdate/${loginUser.email}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedProfile),
            }
          );

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

// Logout button for admin and user
if (logoutbtn) {
  logoutbtn.onclick = logout;
}
