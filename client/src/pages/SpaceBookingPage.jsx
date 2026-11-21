import { useState } from 'react';

function SpaceBookingPage() {
  const [form, setForm] = useState({
    spaceId: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="booking-page-container">
      <div className="booking-card">
        <h2>Reserve a Study Space</h2>
        <p className="booking-subtitle">
          Book quiet study rooms, discussion pods, or conference halls.
        </p>

        {submitted ? (
          <div className="booking-success-box">
            <span className="success-icon">🎉</span>
            <h3>Booking Confirmed!</h3>
            <p>
              Your reservation for study space on {form.date} from {form.startTime} to {form.endTime} has been received.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="auth-submit-btn"
              style={{ marginTop: '1.5rem' }}
            >
              Book Another Space
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="spaceId">Study Space</label>
              <select
                id="spaceId"
                name="spaceId"
                value={form.spaceId}
                onChange={handleChange}
                required
              >
                <option value="">Select a study space</option>
                <option value="1">Room A (4 seats)</option>
                <option value="2">Room B (8 seats)</option>
                <option value="3">Quiet Pod 1 (1 seat)</option>
                <option value="4">Multimedia Lab (6 seats)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  id="startTime"
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  id="endTime"
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Request Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SpaceBookingPage;
