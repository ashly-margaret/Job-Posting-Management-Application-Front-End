// get all persons
// export const fetchUsersList = async () => {

//   try {
//     const res = await fetch(`/api/persons`, {
//       method: "GET",
//       cache: "no-store",
//     });
//     const data = await res.json();
//     console.log(data, "data.");
//     return data.users;
//   } catch (error) {
//     return error;
//   }
// };

export const fetchUsersList = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`/api/persons`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data.users;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};


// Add a new person
export const addUser = async (user: {
  name: string;
  username: string;
  url: string;
}) => {
  const token = localStorage.getItem("token"); // Or from a secure context/store

  try {
    console.log("Sending user data to API:", user); // Log the user data
    const res = await fetch(`/api/persons`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      throw new Error(`Failed to add user: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("User added successfully:", data); // Log the response
    return data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Update a person
export const updateUser = async (payload: {
  userId: number;
  updateData: { name: string; username: string; url: string };
}) => {
  const token = localStorage.getItem("token"); // Or from a secure context/store

  try {
    const res = await fetch(`/api/persons`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Wrapped payload
    });

    if (!res.ok) {
      throw new Error(`Failed to update user: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log("User updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const fetchPersonDetailsByUserId = async (userId: number) => {
  const token = localStorage.getItem("token"); // Or from a secure context/store

  try {
    const res = await fetch(`/api/personDetails/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch details for userId ${userId}`);
    }

    const data = await res.json();
    console.log("Fetched personDetails:", data.details);
    return data.details;
  } catch (error) {
    console.error("Error in fetchPersonDetailsByUserId:", error);
    return null;
  }
};

export const deletePerson = async (id: number) => {
  console.log("Delete button clicked for person ID:", typeof id);
  const token = localStorage.getItem("token"); // Or from a secure context/store

  try {
    const res = await fetch(`/api/persons/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to delete product: ${res.status} ${res.statusText}`
      );
    }

    console.log("Product deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
