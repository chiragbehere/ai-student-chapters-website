import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';

type TimelineItem = Record<string, any>;

const EventTimeline = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchEventData = useCallback(async () => {
    if (!supabase || !eventId) return;
    setLoading(true);
    try {
      const { data: evData, error: evErr } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (evErr) throw evErr;
      setEventDetails(evData);

      const { data: tlData, error: tlErr } = await supabase
        .from('event_timeline')
        .select('*')
        .eq('event_id', eventId)
        .order('sort_order');
      if (tlErr) throw tlErr;
      setTimeline(tlData || []);
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

  const handleSave = async () => {
    if (!supabase || !editingItem || !eventId) return;
    setSaving(true);
    try {
      const payload = { ...editingItem, event_id: parseInt(eventId) };
      if (isNew) {
        if ('id' in payload) delete payload.id;
        // @ts-ignore
        const { error } = await supabase.from('event_timeline').insert([payload]);
        if (error) throw error;
        showStatus('success', 'Timeline item added');
      } else {
        // @ts-ignore
        const { error } = await supabase.from('event_timeline').update(payload).eq('id', editingItem.id);
        if (error) throw error;
        showStatus('success', 'Timeline item updated');
      }
      setEditingItem(null);
      setIsNew(false);
      fetchEventData();
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!supabase || !deleteId) return;
    try {
      const { error } = await supabase.from('event_timeline').delete().eq('id', deleteId);
      if (error) throw error;
      showStatus('success', 'Timeline item deleted');
      setDeleteId(null);
      fetchEventData();
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to delete item');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-10 px-4 md:px-8">
      <SEO title="Manage Timeline" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-heading hover:bg-foreground/10 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-heading text-heading flex items-center gap-2">
            <Clock className="text-primary" /> Manage Timeline
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
        <h2 className="text-xl font-bold text-heading">Schedule Items</h2>
        <button
          onClick={() => {
            setEditingItem({ event_id: parseInt(eventId || '0'), time: '', label: '', emoji: '⏰' });
            setIsNew(true);
            document.body.style.overflow = 'hidden';
          }}
          className="genz-btn-primary py-2 px-4 text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : timeline.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <Clock size={32} className="text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/40">No timeline items added yet for this event.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timeline.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-4">
                <div className="text-3xl">{item.emoji || '⏰'}</div>
                <div>
                  <div className="text-primary font-bold text-xs tracking-wider mb-1">{item.time}</div>
                  <h3 className="text-base font-bold font-heading text-heading">{item.label}</h3>
                  {item.sub_text && <p className="text-foreground/40 text-xs mt-1">{item.sub_text}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { 
                  setEditingItem(item); 
                  setIsNew(false); 
                  document.body.style.overflow = 'hidden';
                }} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => { setDeleteId(item.id); document.body.style.overflow = 'hidden'; }} className="p-2 rounded-xl bg-coral/10 text-coral hover:bg-coral/20 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">{isNew ? 'Add Timeline Item' : 'Edit Timeline Item'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Time (e.g., 09:00 - 10:00)</label>
                  <input type="text" value={editingItem.time || ''} onChange={e => setEditingItem({...editingItem, time: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:border-primary/40 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Label (e.g., Check-in)</label>
                  <input type="text" value={editingItem.label || ''} onChange={e => setEditingItem({...editingItem, label: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:border-primary/40 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Sub Text (Description)</label>
                  <input type="text" value={editingItem.sub_text || ''} onChange={e => setEditingItem({...editingItem, sub_text: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:border-primary/40 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Emoji (e.g., 🚪)</label>
                  <input type="text" value={editingItem.emoji || ''} onChange={e => setEditingItem({...editingItem, emoji: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:border-primary/40 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-foreground/30 mb-1 block">Sort Order</label>
                  <input type="number" value={editingItem.sort_order || 0} onChange={e => setEditingItem({...editingItem, sort_order: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { handleSave(); document.body.style.overflow = ''; }} disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-xl">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setEditingItem(null); document.body.style.overflow = ''; }} className="flex-1 bg-foreground/5 border border-border py-2 rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card p-6 rounded-2xl max-w-xs w-full text-center shadow-2xl">
              <h3 className="text-lg font-bold mb-2">Delete Item?</h3>
              <p className="text-sm text-foreground/50 mb-4">This action cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => { handleDelete(); document.body.style.overflow = ''; }} className="flex-1 py-2 bg-coral/10 text-coral rounded-xl">Delete</button>
                <button onClick={() => { setDeleteId(null); document.body.style.overflow = ''; }} className="flex-1 py-2 bg-foreground/5 border border-border rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventTimeline;
