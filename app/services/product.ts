// get all products
export const fetchProductsList = async () => {
  const token = localStorage.getItem("token"); // Or from a secure context/store

  try {
    const res = await fetch(`/api/products`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data, "data.");
    return data.products;
  } catch (error) {
    return error;
  }
};

export const fetchSearchProducts = async (search: string) => {
  const token = localStorage.getItem("token"); // Or from a secure context/store

  try {
    const res = await fetch(
      `/api/products?search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error(
        `Failed to fetch products: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
