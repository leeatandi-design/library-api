import { useState } from 'react';

function SpaceBookingPage() {
  const [space, setSpace] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const spaces = [
    { id: 'quiet-study-1', name: 'Quiet Study Room A (1-2 persons)' },
    { id: 'quiet-study-2', name: 'Quiet Study Room B (1-2 persons)' },
    { id: 'group-collab-1', name: 'Group Collaboration Hub (4-8 persons)' },
    { id: 'conference-room', name: 'Conference & Presentation Hall (10-20 persons)' },
    { id: 'multimedia-lab', name: 'Multimedia & Podcast Studio' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!space || !date || !startTime || !endTime) {
      setError('Please fill in all booking details.');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be later than start time.');
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSpace('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setSubmitted(false);
  };

  return (
    <div className="booking-page-container">
      <div className="booking-card">
        <h2>Reserve a Study Space</h2>
        <p className="booking-subtitle">
          Book quiet pods, discussion rooms, or multimedia spaces.
        </p>

        {submitted ? (
          <div className="booking-success-box">
            <span className="success-icon">🎉</span>
            <h3>Booking Confirmed!</h3>
            <p>
              Your reservation for <strong>{spaces.find((s) => s.id === space)?.name}</strong> on{' '}
              <strong>{date}</strong> from <strong>{startTime}</strong> to <strong>{endTime}</strong> has been secured.
            </p>
            <button onClick={handleReset} className="auth-submit-btn" style={{ marginTop: '1.5rem' }}>
              Book Another Space
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            {error && <div className="auth-error-alert">{error}</div>}

            <div className="form-group">
              <label htmlFor="space-select">Select Space</label>
              <select
                id="space-select"
                required
                value={space}
                onChange={(e) => setSpace(e.target.value)}
              >
                <option value="">-- Choose a Study Space --</option>
                {spaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="booking-date">Date</label>
              <input
                id="booking-date"
                type="date"
                required
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start-time">Start Time</label>
                <input
                  id="start-time"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end-time">End Time</label>
                <input
                  id="end-time"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Confirm Reservation
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SpaceBookingPage;
