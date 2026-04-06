import { useState } from 'react';
import { HOLDER_COLORS } from '../data/scenarios';

export default function MemberManager({ holders, onAddMember, onRemoveMember, onUpdateMember }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPercent, setNewPercent] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [editPercent, setEditPercent] = useState(0);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const id = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const colorIdx = holders.length % HOLDER_COLORS.length;
    onAddMember({
      id,
      name: newName.trim(),
      role: newRole.trim() || 'Member',
      percent: newPercent,
      color: HOLDER_COLORS[colorIdx],
      group: null,
    });
    setNewName('');
    setNewRole('');
    setNewPercent(5);
    setShowAdd(false);
  };

  const startEdit = (holder) => {
    setEditingId(holder.id);
    setEditPercent(holder.percent);
  };

  const commitEdit = (id) => {
    onUpdateMember(id, { percent: editPercent });
    setEditingId(null);
  };

  return (
    <div className="panel member-panel">
      <h3 className="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Manage Holders
      </h3>
      
      <div className="member-list">
        {holders.map((h) => (
          <div key={h.id} className="member-item">
            <span className="member-dot" style={{ background: h.color }}></span>
            <div className="member-info">
              <span className="member-name">{h.name}</span>
              <span className="member-role">{h.role}</span>
            </div>
            {editingId === h.id ? (
              <div className="member-edit">
                <input
                  type="number"
                  className="number-input"
                  value={editPercent}
                  onChange={(e) => setEditPercent(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.5"
                />
                <span className="pct-sign">%</span>
                <button className="btn-icon btn-confirm" onClick={() => commitEdit(h.id)} title="Save">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            ) : (
              <div className="member-actions">
                <span className="member-pct" onClick={() => startEdit(h)} title="Click to edit">
                  {h.percent.toFixed(1)}%
                </span>
                <button className="btn-icon btn-remove" onClick={() => onRemoveMember(h.id)} title="Remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="add-member-form">
          <input
            className="text-input"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            id="input-new-name"
          />
          <input
            className="text-input"
            placeholder="Role (optional)"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            id="input-new-role"
          />
          <div className="input-group">
            <label className="input-label">
              Starting Ownership
              <span className="input-value">{newPercent}%</span>
            </label>
            <input
              type="range"
              className="slider"
              min="0.5"
              max="50"
              step="0.5"
              value={newPercent}
              onChange={(e) => setNewPercent(Number(e.target.value))}
              id="slider-new-percent"
            />
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={handleAdd} id="btn-add-member">Add</button>
            <button className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="btn-secondary" onClick={() => setShowAdd(true)} id="btn-show-add-member">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Holder
        </button>
      )}
    </div>
  );
}
