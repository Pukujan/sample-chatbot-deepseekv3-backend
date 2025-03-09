const loginForm = document.getElementById("loginForm");
const signupLink = document.getElementById("signupLink");

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    console.log("Logged in user:", userCredential.user);
  } catch (error) {
    alert("Login failed: " + error.message);
    console.error("Login error:", error);
  }
});

// Signup
signupLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful!");
    console.log("Signed up user:", userCredential.user);
  } catch (error) {
    alert("Signup failed: " + error.message);
    console.error("Signup error:", error);
  }
});