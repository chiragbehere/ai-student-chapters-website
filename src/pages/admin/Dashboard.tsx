import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, Image as ImageIcon, BookOpen, MessageCircleQuestion,
  Wrench, Bot, Settings, LogOut, Plus, Pencil, Trash2, Save, X,
  ChevronRight, LayoutDashboard, Trophy, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';
import { ImageCropper } from '../../components/admin/ImageCropper';

// ─── Types ───────────────────────────────────────────────────
type Tab = 'team' | 'events' | 'winners' | 'winner_members' | 'gallery' | 'sessions' | 'faq' | 'tools' | 'chatbot' | 'settings';

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  table: string;
  columns: { key: string; label: string; type: 'text' | 'textarea' | 'boolean' | 'number' | 'select' | 'file'; options?: string[] }[];
}

// ─── Tab Configurations ──────────────────────────────────────
const TABS: TabConfig[] = [
  {
    id: 'team', label: 'Team', icon: <Users size={16} />, table: 'team_members',
    columns: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'class', label: 'Class', type: 'text' },
      { key: 'image_url', label: 'Image URL', type: 'file' },
      { key: 'emoji', label: 'Emoji', type: 'text' },
      { key: 'is_leader', label: 'Is Leader', type: 'boolean' },
      { key: 'sort_order', label: 'Order', type: 'number' },
    ]
  },
  {
    id: 'events', label: 'Events', icon: <Calendar size={16} />, table: 'events',
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'slug', label: 'Slug', type: 'text' },
      { key: 'date', label: 'Date (YYYY-MM-DD)', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: ['upcoming', 'completed'] },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'duration', label: 'Duration', type: 'text' },
      { key: 'participants_count', label: 'Participants', type: 'number' },
      { key: 'logo_url', label: 'Logo URL', type: 'file' },
      { key: 'registration_url', label: 'Registration Link', type: 'text' },
      { key: 'registration_open', label: 'Registration Open', type: 'boolean' },
    ]
  },
  {
    id: 'gallery', label: 'Gallery', icon: <ImageIcon size={16} />, table: 'gallery',
    columns: [
      { key: 'type', label: 'Type', type: 'select', options: ['image', 'video'] },
      { key: 'url', label: 'URL (or File)', type: 'file' },
      { key: 'caption', label: 'Caption', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'sort_order', label: 'Order', type: 'number' },
    ]
  },
  {
    id: 'sessions', label: 'Sessions', icon: <BookOpen size={16} />, table: 'sessions',
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'embed_url', label: 'Embed URL', type: 'text' },
      { key: 'download_url', label: 'Download URL', type: 'text' },
      { key: 'sort_order', label: 'Order', type: 'number' },
    ]
  },
  {
    id: 'faq', label: 'FAQ', icon: <MessageCircleQuestion size={16} />, table: 'faqs',
    columns: [
      { key: 'question', label: 'Question', type: 'text' },
      { key: 'answer', label: 'Answer', type: 'textarea' },
      { key: 'page', label: 'Page', type: 'select', options: ['faq', 'about'] },
      { key: 'sort_order', label: 'Order', type: 'number' },
    ]
  },
  {
    id: 'tools', label: 'Tools', icon: <Wrench size={16} />, table: 'tools',
    columns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'icon_name', label: 'Icon', type: 'text' },
      { key: 'url', label: 'URL', type: 'text' },
      { key: 'badge', label: 'Badge', type: 'text' },
      { key: 'cta_text', label: 'CTA Text', type: 'text' },
      { key: 'is_download', label: 'Is Download', type: 'boolean' },
      { key: 'sort_order', label: 'Order', type: 'number' },
    ]
  },
  {
    id: 'chatbot', label: 'Chatbot', icon: <Bot size={16} />, table: 'chatbot_qa',
    columns: [
      { key: 'keywords', label: 'Keywords (comma-separated)', type: 'text' },
      { key: 'answer', label: 'Answer', type: 'textarea' },
      { key: 'sort_order', label: 'Order', type: 'number' },
    ]
  },
  {
    id: 'settings', label: 'Settings', icon: <Settings size={16} />, table: 'site_settings',
    columns: [
      { key: 'key', label: 'Key', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' },
    ]
  },
];

// ─── Dashboard Component ─────────────────────────────────────
const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('team');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [cropData, setCropData] = useState<{ file: File, colKey: string } | null>(null);

  const currentTab = TABS.find(t => t.id === activeTab)!;

  // Fetch rows
  const fetchRows = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const orderCol = currentTab.columns.find(c => c.key === 'sort_order') ? 'sort_order' : 'id';
    try {
      const res = await supabase
        .from(currentTab.table)
        .select('*')
        .order(orderCol);
      if (res.error) throw res.error;
      setRows(res.data || []);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  }, [currentTab]);

  const handleFileUpload = async (colKey: string, file: File) => {
    if (!supabase) return;
    try {
      setUploadingFiles(prev => ({ ...prev, [colKey]: true }));
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${currentTab.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

      setEditingRow(prev => prev ? { ...prev, [colKey]: publicUrl } : null);
      setStatusMsg({ type: 'success', text: 'File uploaded successfully' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Upload failed' });
    } finally {
      setUploadingFiles(prev => ({ ...prev, [colKey]: false }));
    }
  };

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!supabase || !editingRow) return;
    setSaving(true);

    // Process keywords field for chatbot_qa
    let rowToSave = { ...editingRow };
    if (currentTab.table === 'chatbot_qa' && typeof rowToSave.keywords === 'string') {
      rowToSave.keywords = (rowToSave.keywords as string).split(',').map(k => k.trim()).filter(Boolean);
    }

    // Remove id and created_at for new rows
    if (isNew) {
      const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = rowToSave;
      void _id; void _ca; void _ua;

      const { error } = await supabase.from(currentTab.table).insert(rest as never);
      if (error) {
        showStatus('error', `Failed to create: ${error.message}`);
      } else {
        showStatus('success', 'Created successfully!');
        setEditingRow(null);
        setIsNew(false);
        document.body.style.overflow = '';
        fetchRows();
      }
    } else {
      const { id, created_at: _ca, updated_at: _ua, ...rest } = rowToSave;
      void _ca; void _ua;

      const { error } = await supabase.from(currentTab.table).update(rest as never).eq('id', id as number);
      if (error) {
        showStatus('error', `Failed to update: ${error.message}`);
      } else {
        showStatus('success', 'Updated successfully!');
        setEditingRow(null);
        document.body.style.overflow = '';
        fetchRows();
      }
    }
    setSaving(false);
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!supabase) return;
    const { error } = await supabase.from(currentTab.table).delete().eq('id', id);
    if (error) {
      showStatus('error', `Failed to delete: ${error.message}`);
    } else {
      showStatus('success', 'Item deleted');
      setDeleteId(null);
      document.body.style.overflow = '';
      fetchRows();
    }
  };

  // New row template
  const createNewRow = () => {
    const row: Record<string, unknown> = {};
    currentTab.columns.forEach(col => {
      if (col.type === 'boolean') row[col.key] = false;
      else if (col.type === 'number') row[col.key] = 0;
      else if (col.type === 'select' && col.options) row[col.key] = col.options[0];
      else row[col.key] = '';
    });
    setEditingRow(row);
    setIsNew(true);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-panel p-8 text-center max-w-md">
          <Settings size={40} className="text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading text-heading mb-2">Supabase Not Configured</h2>
          <p className="text-foreground/50 text-sm mb-4">
            Add your Supabase credentials to <code className="px-1.5 py-0.5 rounded bg-foreground/10 text-xs">.env</code> and restart the dev server.
          </p>
          <pre className="text-left text-xs bg-background p-4 rounded-xl border border-border overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-key`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background transition-colors duration-300">
      <SEO title="Admin Dashboard" description="Manage AI Student Chapters content" />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 md:hidden w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-heading shadow-lg"
      >
        {sidebarOpen ? <X size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border pt-20 pb-6 px-4 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-heading text-sm">Admin Panel</h2>
            <p className="text-[10px] text-foreground/40 truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); setEditingRow(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-foreground/50 hover:text-heading hover:bg-foreground/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-coral/70 hover:text-coral hover:bg-coral/5 transition-all mt-4"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-10 px-4 md:px-8 overflow-auto">
        {/* Status notification */}
        <AnimatePresence>
          {statusMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`fixed top-24 right-6 z-50 px-4 py-3 rounded-xl text-xs font-medium border shadow-lg ${statusMsg.type === 'success'
                ? 'bg-lime/10 border-lime/20 text-lime'
                : 'bg-coral/10 border-coral/20 text-coral'
              }`}
            >
              {statusMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-heading text-heading transition-colors">
              {currentTab.label}
            </h1>
            <p className="text-foreground/40 text-xs mt-1">
              Manage {currentTab.label.toLowerCase()} data • {rows.length} items
            </p>
          </div>
          <button
            onClick={() => {
              createNewRow();
              document.body.style.overflow = 'hidden';
            }}
            className="genz-btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingRow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
              onClick={(e) => { if (e.target === e.currentTarget) { setEditingRow(null); setIsNew(false); document.body.style.overflow = ''; } }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold font-heading text-heading">
                    {isNew ? 'Create New' : 'Edit'} {currentTab.label.replace(/s$/, '')}
                  </h3>
                  <button onClick={() => { setEditingRow(null); setIsNew(false); document.body.style.overflow = ''; }} className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/40 hover:text-heading transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {currentTab.columns.map(col => (
                    <div key={col.key}>
                      <label className="text-[10px] font-bold tracking-widest text-foreground/30 uppercase mb-1.5 block">
                        {col.label}
                      </label>
                      {col.type === 'textarea' ? (
                        <textarea
                          value={(editingRow[col.key] as string) || ''}
                          onChange={e => setEditingRow({ ...editingRow, [col.key]: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border/15 text-heading text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 transition-all resize-y"
                        />
                      ) : col.type === 'boolean' ? (
                        <button
                          type="button"
                          onClick={() => setEditingRow({ ...editingRow, [col.key]: !editingRow[col.key] })}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${editingRow[col.key]
                            ? 'bg-primary/10 border-primary/20 text-primary'
                            : 'bg-foreground/5 border-border/15 text-foreground/40'
                          }`}
                        >
                          {editingRow[col.key] ? '✓ Yes' : '✗ No'}
                        </button>
                      ) : col.type === 'select' ? (
                        <select
                          value={(editingRow[col.key] as string) || col.options?.[0]}
                          onChange={e => setEditingRow({ ...editingRow, [col.key]: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border/15 text-heading text-sm focus:outline-none focus:border-primary/40 transition-all"
                        >
                          {col.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : col.type === 'number' ? (
                        <input
                          type="number"
                          value={(editingRow[col.key] as number) ?? 0}
                          onChange={e => setEditingRow({ ...editingRow, [col.key]: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border/15 text-heading text-sm focus:outline-none focus:border-primary/40 transition-all"
                        />
                      ) : col.type === 'file' ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.type.startsWith('image/')) {
                                  setCropData({ file, colKey: col.key });
                                } else {
                                  handleFileUpload(col.key, file);
                                }
                              }
                            }}
                            className="block w-full text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                          />
                          {uploadingFiles[col.key] && (
                            <p className="text-xs text-primary animate-pulse">Uploading...</p>
                          )}
                          {Boolean(editingRow[col.key]) && !uploadingFiles[col.key] && (
                            <div className="flex items-center gap-2 mt-2">
                              {String(editingRow[col.key]).match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                                <img src={String(editingRow[col.key])} alt="preview" className="h-10 w-10 object-cover rounded-lg border border-border/20" />
                              )}
                              <input
                                type="text"
                                value={editingRow[col.key] as string || ''}
                                onChange={e => setEditingRow({ ...editingRow, [col.key]: e.target.value })}
                                className="flex-1 px-4 py-2 rounded-xl bg-foreground/5 border border-border/15 text-heading text-sm focus:outline-none focus:border-primary/40 transition-all"
                                placeholder="Or paste URL here..."
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={
                            Array.isArray(editingRow[col.key])
                              ? (editingRow[col.key] as string[]).join(', ')
                              : (editingRow[col.key] as string) || ''
                          }
                          onChange={e => setEditingRow({ ...editingRow, [col.key]: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-border/15 text-heading text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="genz-btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditingRow(null); setIsNew(false); document.body.style.overflow = ''; }}
                    className="genz-btn-outline flex-1 py-3 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {deleteId !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
              >
                <Trash2 size={32} className="text-coral mx-auto mb-4" />
                <h3 className="text-lg font-bold font-heading text-heading mb-2">Delete Item?</h3>
                <p className="text-foreground/50 text-sm mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 py-3 rounded-xl bg-coral/10 border border-coral/20 text-coral font-semibold text-sm hover:bg-coral/20 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => { setDeleteId(null); document.body.style.overflow = ''; }}
                    className="flex-1 py-3 rounded-xl bg-foreground/5 border border-border text-heading font-semibold text-sm hover:bg-foreground/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
              {currentTab.icon}
            </div>
            <p className="text-foreground/40 text-sm">No {currentTab.label.toLowerCase()} found</p>
            <button onClick={createNewRow} className="text-primary text-sm font-medium mt-2 hover:underline">
              Add your first one →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <motion.div
                key={row.id as number}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-4 flex flex-wrap items-center gap-4 group card-hover"
              >
                {/* Image thumbnail */}
                {(() => {
                  const imgUrl = (row.image_url || row.logo_url || (row.type === 'image' && row.url)) as string | undefined;
                  if (imgUrl && typeof imgUrl === 'string' && imgUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) {
                    return (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-foreground/5 border border-border flex-shrink-0">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    );
                  }
                  return null;
                })()}
                {/* Summary */}
                <div className="flex-1 min-w-[200px]">
                  <p className="font-heading font-semibold text-sm text-heading truncate">
                    {(row.name || row.title || row.question || row.key || `#${row.id}`) as string}
                  </p>
                  <p className="text-foreground/40 text-xs truncate max-w-md mt-0.5">
                    {(row.role || row.description || row.answer || row.value || row.caption || '') as string}
                  </p>
                </div>

                {/* Meta pills */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {row.is_leader !== undefined && (
                    <span className={`pill text-[10px] ${row.is_leader ? 'bg-primary/10 text-primary border-primary/20' : 'bg-foreground/5 text-foreground/30 border-border'}`}>
                      {row.is_leader ? 'Leader' : 'Member'}
                    </span>
                  )}
                  {typeof row.type === 'string' && (
                    <span className="pill text-[10px] bg-accent/10 text-accent border-accent/20">
                      {row.type}
                    </span>
                  )}
                  {typeof row.page === 'string' && (
                    <span className="pill text-[10px] bg-secondary/10 text-secondary border-secondary/20">
                      {row.page}
                    </span>
                  )}
                  {row.sort_order !== undefined && (
                    <span className="text-[10px] text-foreground/25 font-medium">
                      #{row.sort_order as number}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {currentTab.id === 'events' && (
                    <>
                      <button
                        onClick={() => navigate(`/admin/events/${row.id}/timeline`)}
                        className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                        title="Manage Timeline"
                      >
                        <Clock size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/events/${row.id}/winners`)}
                        className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors"
                        title="Manage Winners"
                      >
                        <Trophy size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      if (currentTab.table === 'chatbot_qa' && Array.isArray(row.keywords)) {
                        setEditingRow({ ...row, keywords: (row.keywords as string[]).join(', ') });
                      } else {
                        setEditingRow({ ...row });
                      }
                      setIsNew(false);
                      document.body.style.overflow = 'hidden';
                    }}
                    className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => { setDeleteId(row.id as number); document.body.style.overflow = 'hidden'; }}
                    className="w-8 h-8 rounded-full bg-coral/5 flex items-center justify-center text-coral hover:bg-coral/10 hover:text-coral transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      {/* Image Cropper Modal */}
      <AnimatePresence>
        {cropData && (
          <ImageCropper
            imageFile={cropData.file}
            circular={currentTab.id === 'team'}
            onCropComplete={(croppedFile) => {
              handleFileUpload(cropData.colKey, croppedFile);
              setCropData(null);
            }}
            onCancel={() => setCropData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
