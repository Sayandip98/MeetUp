// src/components/meeting/ParticipantList.jsx
const ParticipantList = ({ participants, isHost, onMute, onRemove }) => {
  return (
    <>
      <h2>Participants</h2>
      <div className="participant-row">
        <span>You</span>
      </div>
      {participants.map((p) => (
        <div key={p.socketId} className="participant-row">
          <span>{p.name}</span>
          {isHost && (
            <div>
              <button onClick={() => onMute(p.socketId)}>Mute</button>
              <button onClick={() => onRemove(p.socketId)}>Remove</button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ParticipantList;
