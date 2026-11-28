import { useState } from 'react';

export function SpaceBookingForm({ onSubmit }) {
  const [form, setForm] = useState({
    spaceId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(form);
    }
  };

  return (
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
  );
}

export default SpaceBookingForm;
