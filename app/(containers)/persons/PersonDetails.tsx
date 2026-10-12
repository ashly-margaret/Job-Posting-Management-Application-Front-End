"use client";

import FaceLoader from "@/app/component/faceloader/FaceLoader";
// import SpinnerLoader from "@/app/component/spinnerLoader/SpinnerLoader";
import { fetchPersonDetailsByUserId } from "@/app/services/persons";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PersonDetails = () => {
  const params = useParams();
  const userId = parseInt(params?.person_id as string, 10);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchPersonDetailsByUserId(userId);
        console.log("Fetched personDetails:", data);

        setDetails(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(userId)) {
      fetchDetails();
    }
  }, [userId]);

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <FaceLoader />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!details) return <div>No details found for userId: {userId}</div>;
  return (
    <div>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-6 border">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Person Details
          </h2>

          <p className="mb-2 text-gray-700">
            <strong className="font-semibold">Name:</strong> {details.name}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="font-semibold">Designation:</strong>{" "}
            {details.Designation}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="font-semibold">Description:</strong>{" "}
            {details.Description}
          </p>
          <p className="mb-2 text-gray-700">
            <strong className="font-semibold">Country:</strong>{" "}
            {details.Country}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
