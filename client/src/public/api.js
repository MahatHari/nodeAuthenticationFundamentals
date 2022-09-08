const baseurl = "https://api.hari.dev";

// Refactoring process of getting form values
function getField_values(formId) {
  return Object.values(formId).reduce((obj, field) => {
    if (field.name) {
      obj[field.name] = field.value;
    }
    return obj;
  }, {});
}

function getPostObjectOptions(stringifyObject) {
  return {
    method: "POST",
    body: JSON.stringify(stringifyObject),
    credentials: "include",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  };
}

(() => {
  // Handle Registration

  const registrationForm = document.getElementById("registration-form");

  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const field_values = getField_values(registrationForm);

    // do ajax
    if (Object.keys(field_values).length > 0) {
      const res = await fetch(`${baseurl}/register`, {
        method: "POST",
        body: JSON.stringify(field_values),
        credentials: "include",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      console.log(res);
    }
  });

  // Handle Login

  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const field_values = getField_values(loginForm);
    // do ajax
    if (Object.keys(field_values).length > 0) {
      const res = await fetch(`${baseurl}/login`, {
        method: "POST",
        body: JSON.stringify(field_values),
        credentials: "include",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
    }
  });

  // Handle Change Password
  const changePasswordForm = document.getElementById("change-password");
  changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const field_values = getField_values(changePasswordForm);
      // do ajax
      // call server
      if (Object.keys(field_values).length > 0) {
        const result = await fetch(`${baseurl}/changePassword`, {
          method: "POST",
          body: JSON.stringify(field_values),
          credentials: "include",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  });
  //Handle Fogot Password
  const forgotPasswordForm = document.getElementById("forgot-password-form");
  forgotPasswordForm.addEventListener("submit", async (e) => {
    console.log("Forgot Password");
    e.preventDefault();
    try {
      const field_values = getField_values(forgotPasswordForm);
      const result = await fetch(`${baseurl}/forgot-password`, {
        method: "POST",
        body: JSON.stringify(field_values),
        credentials: "include",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  });
})();
// Handle logout
async function logout() {
  try {
    const res = await fetch(`${baseurl}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
  }
}
