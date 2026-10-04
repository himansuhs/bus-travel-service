import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/buses";

function App() {
  const [buses, setBuses] = useState([]);

  const [form, setForm] = useState({
    busName: "",
    from: "",
    to: "",
    departureTime: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // GET buses
  const fetchBuses = async () => {
    try {
      const response = await axios.get(API_URL);
      setBuses(response.data);
    } catch (error) {
      console.error("Failed to fetch buses:", error);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          ...form,
          price: Number(form.price),
        });
      } else {
        await axios.post(API_URL, {
          ...form,
          price: Number(form.price),
        });
      }

      setForm({
        busName: "",
        from: "",
        to: "",
        departureTime: "",
        price: "",
      });

      setEditingId(null);

      await fetchBuses();
    } catch (error) {
      console.error("Failed to save bus:", error);
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEdit = (bus) => {
    setForm({
      busName: bus.busName,
      from: bus.from,
      to: bus.to,
      departureTime: bus.departureTime,
      price: bus.price,
    });

    setEditingId(bus._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBuses();
    } catch (error) {
      console.error("Failed to delete bus:", error);
    }
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">🚌</div>

          <div>
            <h2>redBus</h2>
            <span>DevOps Demo Platform</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#manage">Manage Buses</a>
          <a href="#buses">Available Buses</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-content">

          <div className="hero-text">
            <span className="hero-badge">
              AWS DevOps Project
            </span>

            <h1>
              Travel smarter with
              <span> redBus</span>
            </h1>

            <p>
              Simple bus management application built with React,
              Node.js, Express and MongoDB — deployed using Docker,
              Kubernetes and AWS.
            </p>

            <div className="hero-stats">

              <div>
                <strong>{buses.length}</strong>
                <span>Buses</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Availability</span>
              </div>

              <div>
                <strong>Cloud</strong>
                <span>Ready</span>
              </div>

            </div>
          </div>

          <div className="hero-card">

            <div className="bus-illustration">
              🚌
            </div>

            <h3>Your Journey Starts Here</h3>

            <p>
              Add and manage bus routes easily.
            </p>

          </div>

        </div>
      </section>

      {/* Add Bus */}
      <section className="manage-section" id="manage">

        <div className="section-heading">
          <span>BUS MANAGEMENT</span>

          <h2>
            {editingId ? "Update Bus" : "Add New Bus"}
          </h2>

          <p>
            Manage bus information through a simple CRUD interface.
          </p>
        </div>

        <form className="bus-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Bus Name</label>

            <input
              type="text"
              name="busName"
              placeholder="e.g. VRL Travels"
              value={form.busName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>From</label>

            <input
              type="text"
              name="from"
              placeholder="e.g. Pune"
              value={form.from}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>To</label>

            <input
              type="text"
              name="to"
              placeholder="e.g. Mumbai"
              value={form.to}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Departure</label>

            <input
              type="text"
              name="departureTime"
              placeholder="e.g. 10:00 PM"
              value={form.departureTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price ₹</label>

            <input
              type="number"
              name="price"
              placeholder="850"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Bus"
              : "Add Bus"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setEditingId(null);

                setForm({
                  busName: "",
                  from: "",
                  to: "",
                  departureTime: "",
                  price: "",
                });
              }}
            >
              Cancel
            </button>
          )}

        </form>

      </section>

      {/* Bus List */}
      <section className="bus-section" id="buses">

        <div className="section-heading">

          <span>AVAILABLE BUSES</span>

          <h2>Explore Bus Routes</h2>

          <p>
            View and manage buses stored in MongoDB.
          </p>

        </div>

        {buses.length === 0 ? (

          <div className="empty-state">

            <div>🚌</div>

            <h3>No buses available</h3>

            <p>
              Add your first bus using the form above.
            </p>

          </div>

        ) : (

          <div className="bus-grid">

            {buses.map((bus) => (

              <div className="bus-card" key={bus._id}>

                <div className="bus-card-header">

                  <div>
                    <span className="bus-label">
                      AC Sleeper
                    </span>

                    <h3>{bus.busName}</h3>
                  </div>

                  <div className="price">
                    ₹{bus.price}
                  </div>

                </div>

                <div className="route">

                  <div className="route-location">

                    <span className="route-dot"></span>

                    <div>
                      <small>FROM</small>
                      <strong>{bus.from}</strong>
                    </div>

                  </div>

                  <div className="route-line">

                    <span>━━━━━━</span>
                    <small>🚌</small>

                  </div>

                  <div className="route-location">

                    <span className="route-dot destination"></span>

                    <div>
                      <small>TO</small>
                      <strong>{bus.to}</strong>
                    </div>

                  </div>

                </div>

                <div className="bus-info">

                  <div>
                    <span>Departure</span>
                    <strong>{bus.departureTime}</strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong className="available">
                      Available
                    </strong>
                  </div>

                </div>

                <div className="card-actions">

                  <button
                    className="edit-button"
                    onClick={() => handleEdit(bus)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(bus._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* Footer */}
      <footer>

        <div>
          <strong>redBus DevOps Platform</strong>

          <p>
            React • Node.js • MongoDB • Docker • Kubernetes • AWS
          </p>
        </div>

        <span>
          Built for AWS DevOps demonstration
        </span>

      </footer>

    </div>
  );
}

export default App;