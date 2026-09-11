// src/components/meeting/WaitingRoom.jsx
const WaitingRoom = ({ waitingUsers, onAdmit, onDeny }) => {
  if (waitingUsers.length === 0) return null;

  return (
    <div className="waiting-room-banner">
      <h3>Waiting Room</h3>
      {waitingUsers.map((u) => (
        <div key={u.socketId} className="participant-row">
          <span>{u.name}</span>
          <div>
            <button onClick={() => onAdmit(u.socketId)}>Admit</button>
            <button onClick={() => onDeny(u.socketId)}>Deny</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WaitingRoom;
