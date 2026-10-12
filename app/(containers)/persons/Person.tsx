"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  deletePerson,
  fetchUsersList,
  updateUser,
} from "@/app/services/persons";
import { Eye } from "lucide-react";

interface Person {
  userId: number;
  name: string;
  username: string;
  url?: string;
}

const Persons = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState<Person | null>(null);

  const router = useRouter();

  const loadUsers = async () => {
    try {
      const data: Person[] = await fetchUsersList();
      setPersons(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setPersons([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ When clicking edit
  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({ ...person }); // Fill formData with selected person
  };

  const handleCancel = () => {
    setEditingPerson(null);
    setFormData(null);
  };

  // ✅ Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "username" ? value : value,
          }
        : null
    );
  };

  const handleSave = async () => {
    if (!formData || !formData.userId) return;

    try {
      await updateUser({
        userId: formData.userId,
        updateData: {
          name: formData.name,
          username: formData.username,
          url: formData.url || "",
        },
      });

      await loadUsers(); // Reload the list
      setEditingPerson(null); // Close popup
      setFormData(null);
    } catch (error) {
      console.error("Failed to update person", error);
    }
  };

  const handleDelete = async (person: Person) => {
    await deletePerson(person.userId)
      .then((data: any) => {
        console.log("person delete", data);
      })
      .catch((err: Error) => {
        console.log("person error ", err);
      });
  };
  const navigateToAddUser = () => {
    router.push("/addUser");
  };

  const handleNavigate = (person: Person) => {
    router.push(`/persons/${person.userId}`);
  };
  return (
    <div className="mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Person Info</h1>
        <button
          onClick={navigateToAddUser}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Add Person
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {persons?.map((person) => (
          <motion.div
            key={person.userId}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition">
              <div className="flex justify-end cursor-pointer">
                <Eye
                  onClick={() => {
                    handleNavigate(person);
                  }}
                />
              </div>
              <img
                src={person.url}
                alt={person.name}
                className="w-[300px] h-[200px] object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {person.name}
              </h2>
              <p className="text-gray-500">Username: {person.username}</p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleEdit(person)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(person)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✅ Edit Popup */}
      {editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Edit Person</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData?.username || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                name="url"
                value={formData?.url || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Persons;
