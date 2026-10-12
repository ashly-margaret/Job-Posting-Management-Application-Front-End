interface SignupPayload {
  email: string;
  password: string;
  name: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export async function signupUser(payload: SignupPayload) {
  console.log("Sending user data to API:", payload); // Log the user data

  try {
    const res = await fetch("/api/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Signup response:", data);
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function login(payload: LoginPayload) {
  console.log("Sending user data to API:", payload); // Log the user data

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Login response:", data);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
