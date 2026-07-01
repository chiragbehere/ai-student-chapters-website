import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, UserPlus, ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';

type Winner = Record<string, any>;
type Member = Record<string, any>;

const EventWinners = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Winner Edit State
  const [editingWinner, setEditingWinner] = useState<Winner | null>(null);
  const [isNewWinner, setIsNewWinner] = useState(false);
  const [savingWinner, setSavingWinner] = useState(false);
  const [deleteWinnerId, setDeleteWinnerId] = useState<number | null>(null);

  // Member Edit State
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isNewMember, setIsNewMember] = useState(false);
  const [savingMember, setSavingMember] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);

  const fetchEventData = useCallback(async () => {
    if (!supabase || !eventId) return;
    setLoading(true);
    try {
      // Fetch Event details
      const { data: evData, error: evErr } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (evErr) throw evErr;
      setEventDetails(evData);

      // Fetch Winners with Members
      const { data: winData, error: winErr } = await supabase
        .from('event_winners')
        .select('*, winner_members(*)')
        .eq('event_id', eventId)
        .order('sort_order');
      if (winErr) throw winErr;
      setWinners(winData || []);
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // --- Winner Handlers ---
  const saveWinner = async () => {
    if (!supabase || !editingWinner || !eventId) return;
    setSavingWinner(true);
    try {
      const payload = { ...editingWinner, event_id: parseInt(eventId) };
      if ('winner_members' in payload) {
        delete payload.winner_members;
      }

      if (isNewWinner) {
        if ('id' in payload) delete payload.id;
        // @ts-ignore
        const { error } = await supabase.from('event_winners').insert([payload]);
        if (error) throw error;
        showStatus('success', 'Winner added successfully');
      } else {
        // @ts-ignore
        const { error } = await supabase.from('event_winners').update(payload).eq('id', editingWinner.id);
        if (error) throw error;
        showStatus('success', 'Winner updated successfully');
      }
      setEditingWinner(null);
      setIsNewWinner(false);
      document.body.style.overflow = '';
      fetchEventData();
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to save winner');
    } finally {
      setSavingWinner(false);
    }
  };

  const deleteWinner = async () => {
    if (!supabase || !deleteWinnerId) return;
    try {
      const { error } = await supabase.from('event_winners').delete().eq('id', deleteWinnerId);
      if (error) throw error;
      showStatus('success', 'Winner deleted');
      setDeleteWinnerId(null);
      document.body.style.overflow = '';
      fetchEventData();
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to delete winner');
    }
  };

  // --- Member Handlers ---
  const saveMember = async () => {
    if (!supabase || !editingMember) return;
    setSavingMember(true);
    try {
      const payload = { ...editingMember };
      if (isNewMember) {
        if ('id' in payload) delete payload.id;
        // @ts-ignore
        const { error } = await supabase.from('winner_members').insert([payload]);
        if (error) throw error;
        showStatus('success', 'Member added successfully');
      } else {
        // @ts-ignore
        const { error } = await supabase.from('winner_members').update(payload).eq('id', editingMember.id);
        if (error) throw error;
        showStatus('success', 'Member updated successfully');
      }
      setEditingMember(null);
      setIsNewMember(false);
      document.body.style.overflow = '';
      fetchEventData();
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to save member');
    } finally {
      setSavingMember(false);
    }
  };

  const deleteMember = async () => {
    if (!supabase || !deleteMemberId) return;
    try {
      const { error } = await supabase.from('winner_members').delete().eq('id', deleteMemberId);
      if (error) throw error;
      showStatus('success', 'Member deleted');
      setDeleteMemberId(null);
      document.body.style.overflow = '';
      fetchEventData();
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to delete member');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-10 px-4 md:px-8">
      <SEO title="Manage Winners" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-heading hover:bg-foreground/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-heading text-heading">
            Manage Winners
          </h1>
          {eventDetails && (
            <p className="text-foreground/40 text-sm mt-1">
              Event: {eventDetails.title}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-24 right-6 z-50 px-4 py-3 rounded-xl text-xs font-medium border shadow-lg ${statusMsg.type === 'success' ? 'bg-lime/10 border-lime/20 text-lime' : 'bg-coral/10 border-coral/20 text-coral'}`}
          >
            {statusMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-heading">Teams & Positions</h2>
        <button
          onClick={() => {
            setEditingWinner({ event_id: parseInt(eventId || '0'), category: 'UG', medal_key: 'gold' });
            setIsNewWinner(true);
            document.body.style.overflow = 'hidden';
          }}
          className="genz-btn-primary py-2 px-4 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Winner
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : winners.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <Trophy size={32} className="text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/40">No winners added yet for this event.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {winners.map((winner) => (
            <div key={winner.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Winner Header */}
              <div className="bg-foreground/5 p-4 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-heading text-lg">{winner.team_name}</h3>
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded-lg text-xs font-medium">{winner.category}</span>
                    <span className="px-2 py-1 bg-yellow-400/10 text-yellow-500 rounded-lg text-xs font-medium">{winner.rank}</span>
                  </div>
                  <p className="text-sm text-foreground/50 mt-1">Prize: {winner.prize || 'None'} • Medal: {winner.medal_key}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingWinner(winner); setIsNewWinner(false); document.body.style.overflow = 'hidden'; }} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => { setDeleteWinnerId(winner.id); document.body.style.overflow = 'hidden'; }} className="p-2 rounded-xl bg-coral/10 text-coral hover:bg-coral/20 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-foreground/70 flex items-center gap-2"><UserPlus size={14}/> Team Members</h4>
                  <button onClick={() => { setEditingMember({ winner_id: winner.id }); setIsNewMember(true); document.body.style.overflow = 'hidden'; }} className="text-primary text-xs hover:underline flex items-center gap-1">
                    <Plus size={12} /> Add Member
                  </button>
                </div>

                {winner.winner_members && winner.winner_members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {winner.winner_members.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50 hover:border-border transition-colors group">
                        <div>
                          <p className="font-medium text-sm text-heading">{member.name}</p>
                          <p className="text-xs text-foreground/50">{member.class}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingMember(member); setIsNewMember(false); document.body.style.overflow = 'hidden'; }} className="p-1.5 text-foreground/40 hover:text-primary"><Pencil size={12}/></button>
                          <button onClick={() => { setDeleteMemberId(member.id); document.body.style.overflow = 'hidden'; }} className="p-1.5 text-foreground/40 hover:text-coral"><Trash2 size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-foreground/30 italic">No members added.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Winner Edit Modal */}
      <AnimatePresence>
        {editingWinner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold mb-4">{isNewWinner ? 'Add Winner' : 'Edit Winner'}</h3>
              <div className="space-y-4">
                <div><label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Team Name</label><input type="text" value={editingWinner.team_name || ''} onChange={e => setEditingWinner({...editingWinner, team_name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:border-primary/40 focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Category</label><select value={editingWinner.category || 'UG'} onChange={e => setEditingWinner({...editingWinner, category: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15"><option value="UG">UG</option><option value="PG">PG</option></select></div>
                  <div><label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Medal</label><select value={editingWinner.medal_key || 'gold'} onChange={e => setEditingWinner({...editingWinner, medal_key: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15"><option value="gold">Gold</option><option value="silver">Silver</option><option value="bronze">Bronze</option><option value="runner">Runner</option></select></div>
                </div>
                <div><label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Rank (e.g. 1st Rank)</label><input type="text" value={editingWinner.rank || ''} onChange={e => setEditingWinner({...editingWinner, rank: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:outline-none" /></div>
                <div><label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Prize (e.g. ₹500)</label><input type="text" value={editingWinner.prize || ''} onChange={e => setEditingWinner({...editingWinner, prize: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:outline-none" /></div>
                <div><label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Sort Order</label><input type="number" value={editingWinner.sort_order || 0} onChange={e => setEditingWinner({...editingWinner, sort_order: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:outline-none" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { saveWinner(); document.body.style.overflow = ''; }} disabled={savingWinner} className="flex-1 bg-primary text-white py-2 rounded-xl">{savingWinner ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setEditingWinner(null); document.body.style.overflow = ''; }} className="flex-1 bg-foreground/5 border border-border py-2 rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Edit Modal */}
      <AnimatePresence>
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-xs shadow-2xl">
              <h3 className="text-lg font-bold mb-4">{isNewMember ? 'Add Member' : 'Edit Member'}</h3>
              <div className="space-y-4">
                <div><label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Name</label><input type="text" value={editingMember.name || ''} onChange={e => setEditingMember({...editingMember, name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:outline-none" /></div>
                <div><label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Class</label><input type="text" value={editingMember.class || ''} onChange={e => setEditingMember({...editingMember, class: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:outline-none" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { saveMember(); document.body.style.overflow = ''; }} disabled={savingMember} className="flex-1 bg-primary text-white py-2 rounded-xl">{savingMember ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setEditingMember(null); document.body.style.overflow = ''; }} className="flex-1 bg-foreground/5 border border-border py-2 rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modals */}
      <AnimatePresence>
        {deleteWinnerId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"><div className="bg-card p-6 rounded-2xl max-w-xs w-full text-center"><h3 className="text-lg font-bold mb-2">Delete Winner?</h3><p className="text-sm text-foreground/50 mb-4">This removes the team and all members.</p><div className="flex gap-2"><button onClick={() => { deleteWinner(); document.body.style.overflow = ''; }} className="flex-1 py-2 bg-coral/10 text-coral rounded-xl">Delete</button><button onClick={() => { setDeleteWinnerId(null); document.body.style.overflow = ''; }} className="flex-1 py-2 bg-foreground/5 border border-border rounded-xl">Cancel</button></div></div></div>
        )}
        {deleteMemberId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"><div className="bg-card p-6 rounded-2xl max-w-xs w-full text-center"><h3 className="text-lg font-bold mb-2">Delete Member?</h3><div className="flex gap-2"><button onClick={() => { deleteMember(); document.body.style.overflow = ''; }} className="flex-1 py-2 bg-coral/10 text-coral rounded-xl">Delete</button><button onClick={() => { setDeleteMemberId(null); document.body.style.overflow = ''; }} className="flex-1 py-2 bg-foreground/5 border border-border rounded-xl">Cancel</button></div></div></div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventWinners;
