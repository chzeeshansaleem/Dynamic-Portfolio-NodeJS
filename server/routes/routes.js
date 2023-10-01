import { handleSignup, handleLogin, logout } from "../controllers/userLogin.js";
import {
  addProject,
  deleteProject,
  showProjects,
  updateProject,
} from "../controllers/userProjects.js";
import {
  addEduactionOfUser,
  showEducation,
  deleteEducation,
  updateEducation,
} from "../controllers/userEducation.js";
import {
  showExperience,
  addExperience,
  updateExperience,
  deleteExperiences,
} from "../controllers/userExperience.js";
import {
  updateProfileByUser,
  showUserForProfile,
} from "../controllers/userProfile.js";
import {
  showUserProfile,
  addUser,
  updateUserRole,
  deleteUserByAdmin,
} from "../controllers/admin.js";
export const routes = [
  {
    path: "/",
    method: "GET",
    role: "admin",
    handler: showUserProfile,
  },
  {
    path: "/signup",
    method: "POST",
    role: "user" || "admin",
    handler: handleSignup,
  },
  {
    path: "/login",
    method: "POST",
    role: "user" || "admin",
    handler: handleLogin,
  },
  {
    path: "/add_users",
    method: "POST",
    role: "admin",
    handler: addUser,
  },
  {
    path: "/deleteUsers/",
    method: "DELETE",
    role: "admin",
    handler: deleteUserByAdmin,
  },

  {
    path: "/profileUpdate/",
    method: "PUT",
    role: "user",
    handler: updateProfileByUser,
  },
  {
    path: "/projects",
    method: "GET",
    role: "admin",
    handler: showProjects,
  },
  {
    path: "/projects",
    method: "GET",
    role: "user",
    handler: showProjects,
  },
  {
    path: "/education",
    method: "GET",
    role: "user",
    handler: showEducation,
  },
  {
    path: "/adminUsers/",
    method: "PUT",
    role: "admin",
    handler: updateUserRole,
  },
  {
    path: "/profileUpdate",
    method: "GET",
    role: "user",
    handler: showUserForProfile,
  },
  {
    path: "/userAddProjects",
    method: "POST",
    role: "user",
    handler: addProject,
  },
  {
    path: "/projects/",
    method: "DELETE",
    role: "user",
    handler: deleteProject,
  },

  {
    path: "/projectUpdate/",
    method: "PUT",
    role: "user",
    handler: updateProject,
  },
  {
    path: "/addEduaction",
    method: "POST",
    role: "user",
    handler: addEduactionOfUser,
  },
  {
    path: "/educationUpdate/",
    method: "PUT",
    role: "user",
    handler: updateEducation,
  },
  {
    path: "/educationDelete/",
    method: "DELETE",
    role: "user",
    handler: deleteEducation,
  },
  {
    path: "/addExperience",
    method: "POST",
    role: "user",
    handler: addExperience,
  },
  {
    path: "/experienceUpdate/",
    method: "PUT",
    role: "user",
    handler: updateExperience,
  },
  {
    path: "/experienceDelete/",
    method: "DELETE",
    role: "user",
    handler: deleteExperiences,
  },
  {
    path: "/experience",
    method: "GET",
    role: "user",
    handler: showExperience,
  },
  {
    path: "/logout",
    method: "GET",
    role: "user" || "admin",
    handler: logout,
  },
];
