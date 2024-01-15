import React, { useEffect, useState } from "react";

const Home = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    interests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (_id) => {
    try {
      const requestBody = {
        name: formData.name,
        description: formData.description,
      };

      if (formData.interests.trim() !== "") {
        requestBody.interests = formData.interests
          .split(",")
          .map((item) => item.trim());
      }

      const response = await fetch(`http://localhost:3000/update/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Fetch the updated data immediately after the update
      const updatedDataResponse = await fetch("http://localhost:3000/");
      if (!updatedDataResponse.ok) {
        throw new Error("Network response for updated data was not ok");
      }

      const updatedData = await updatedDataResponse.json();
      setData(updatedData);
      setFormData({ name: "", description: "", interests: "" });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      let response;
      const requestBody = {
        name: formData.name,
        description: formData.description,
      };

      if (formData.interests.trim() !== "") {
        requestBody.interests = formData.interests
          .split(",")
          .map((item) => item.trim());
      }

      if (formData.name && formData.description && formData.interests) {
        response = await fetch("http://localhost:3000/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        throw new Error("Please fill in all required fields");
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const rowData = await response.json();
      setData([...data, rowData]); // Update the data array
      setFormData({ name: "", description: "", interests: "" });
    } catch (error) {
      console.error("Error adding data:", error);
      // Handle errors appropriately
    }
  };

  const handleClick = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setData(data.filter((item) => item._id !== _id));
    } catch (error) {
      console.error("Error deleting data:", error);
      setData(data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const rowData = await response.json();
        setData(rowData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="main">
      <div className="outer">
        {data.map((item) => (
          <div className="card" key={item._id}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>

            <h2>Interests:</h2>
            <ul>
              {item.interests &&
                item.interests.map((interest, interestIndex) => (
                  <li className="list" key={interestIndex}>
                    {interest}
                  </li>
                ))}
            </ul>
            <button onClick={() => handleClick(item._id)}>Delete</button>
            <button onClick={() => handleSubmit(item._id)}>Update</button>
          </div>
        ))}
      </div>
      <div className="form-container">
        <form onSubmit={handleAdd}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Interest:
            <textarea
              name="interests"
              value={formData.interests}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
