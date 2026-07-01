-- ============================================================
-- AI Student Chapters — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Team Members ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,                       -- NULL for regular members
  class TEXT NOT NULL,
  image_url TEXT,
  emoji TEXT,
  is_leader BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Events ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',  -- upcoming | completed
  location TEXT,
  duration TEXT,
  participants_count INT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Event Winners ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_winners (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  rank TEXT NOT NULL,
  prize TEXT,
  category TEXT NOT NULL,          -- UG | PG
  medal_key TEXT NOT NULL,         -- gold | silver | bronze | runner
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Winner Members ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS winner_members (
  id SERIAL PRIMARY KEY,
  winner_id INT NOT NULL REFERENCES event_winners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Gallery ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  caption TEXT,
  title TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Sessions / Workshops ────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  embed_url TEXT NOT NULL,
  download_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── FAQ ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  page TEXT NOT NULL DEFAULT 'faq',  -- faq | about
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Tools ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Wrench',
  url TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'primary',
  badge TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Open Tool',
  is_download BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Chatbot Q&A ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chatbot_qa (
  id SERIAL PRIMARY KEY,
  keywords TEXT[] NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Site Settings (key-value) ───────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Public can read, only authenticated users can write
-- ============================================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE winner_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read event_winners" ON event_winners FOR SELECT USING (true);
CREATE POLICY "Public read winner_members" ON winner_members FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read tools" ON tools FOR SELECT USING (true);
CREATE POLICY "Public read chatbot_qa" ON chatbot_qa FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Authenticated write policies (INSERT, UPDATE, DELETE)
CREATE POLICY "Admin insert team_members" ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update team_members" ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete team_members" ON team_members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update events" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete events" ON events FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert event_winners" ON event_winners FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update event_winners" ON event_winners FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete event_winners" ON event_winners FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert winner_members" ON winner_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update winner_members" ON winner_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete winner_members" ON winner_members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert gallery" ON gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update gallery" ON gallery FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete gallery" ON gallery FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert sessions" ON sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update sessions" ON sessions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete sessions" ON sessions FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert faqs" ON faqs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update faqs" ON faqs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete faqs" ON faqs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert tools" ON tools FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update tools" ON tools FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete tools" ON tools FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert chatbot_qa" ON chatbot_qa FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update chatbot_qa" ON chatbot_qa FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete chatbot_qa" ON chatbot_qa FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert site_settings" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update site_settings" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete site_settings" ON site_settings FOR DELETE USING (auth.role() = 'authenticated');


-- ============================================================
-- SEED DATA — Current hardcoded values
-- ============================================================

-- ─── Team Leaders ────────────────────────────────────────────
INSERT INTO team_members (name, role, class, image_url, emoji, is_leader, sort_order) VALUES
  ('Kartik Sharad Valhe', 'President', 'IMCA-IV', '/team/Kartik-Valhe.webp', '👑', true, 1),
  ('Krushnali Vanusing Jadhav', 'Vice President', 'IMCA-II', '/team/Krushnali-Jadhav.webp', '⭐', true, 2),
  ('Tejas Dipak Panchbhai', 'Secretary', 'IMCA-IV', '/team/Tejas-Panchbhai.webp', '📋', true, 3),
  ('Aastha Vilas Deshmukh', 'Treasurer', 'IMCA-II', '/team/Aastha-Deshmukh.webp', '💰', true, 4),
  ('Chirag Rajesh Behere', 'Event Manager', 'IMCA-II', '/team/Chirag-Behere.webp', '🎯', true, 5),
  ('Aniruddha Balaji Landge', 'Tech Lead', 'IMCA-III', '/team/Aniruddha-Landge.webp', '💻', true, 6),
  ('Moin Altaf Ansari', 'Documentation Head', 'IMCA-II', '/team/Moin-Ansari.webp', '📝', true, 7),
  ('Shreyash Sunil Patil', 'Camera Lead', 'IMCA-IV', '/team/Shreyash-Patil.webp', '📸', true, 8),
  ('Bhumika Vilas Patil', 'Social Media', 'IMCA-II', '/team/Bhumika-Patil-I-2.webp', '📱', true, 9);

-- ─── Team Members ────────────────────────────────────────────
INSERT INTO team_members (name, class, image_url, is_leader, sort_order) VALUES
  ('Vaibhav Jaywantorao Patil', 'IMCA-IV', '/team/Vaibhav-Patil.webp', false, 10),
  ('Sejal Prashant Patil', 'IMCA-II', '/team/Sejal-Patil.webp', false, 11),
  ('Sai Paresh Upakare', 'IMCA-IV', '/team/Sai-Upakare.webp', false, 12),
  ('Bhumika Nitin Patil', 'IMCA-IV', '/team/Bhumika-Patil.webp', false, 13),
  ('Tejaswini Pravin Pawar', 'IMCA-I', NULL, false, 14),
  ('Tejas Aaba Bagul', 'IMCA-I', NULL, false, 15),
  ('Shrikant Dinesh Borase', 'IMCA-I', NULL, false, 16),
  ('Manasi Dipak Bhamare', 'IMCA-I', NULL, false, 17),
  ('Ruchita Prabhakar Chaudhari', 'IMCA-I', NULL, false, 18),
  ('Radhika Vijay Patil', 'IMCA-I', NULL, false, 19),
  ('Yogesh Adhikar Badgujar', 'IMCA-I', NULL, false, 20),
  ('Harshada Manohar Bagul', 'IMCA-I', NULL, false, 21),
  ('Om Bhaskar Borse', 'IMCA-I', NULL, false, 22),
  ('Harsh Naresh Fulari', 'IMCA-I', NULL, false, 23),
  ('Purushottam Kishor Patil', 'IMCA-I', NULL, false, 24),
  ('Ketana Ambalal Lohar', 'MCA-I', NULL, false, 25),
  ('Karuna Nitin Soni', 'MCA-I', NULL, false, 26),
  ('Pushpanjali Manohar Patil', 'MCA-I', NULL, false, 27),
  ('Utkarsha Manohar Patil', 'MCA-I', NULL, false, 28);

-- ─── Events ──────────────────────────────────────────────────
INSERT INTO events (title, slug, date, description, status, location, duration, participants_count, logo_url) VALUES
  ('Code Carnival', 'code-carnival', '2026-03-24', 'The 6-hour build sprint was a massive success! 33 participants competed across UG & PG categories.', 'completed', 'On Campus', '6 Hours', 33, '/images/code-carnival-logo.webp');

-- ─── Event Winners — UG ──────────────────────────────────────
INSERT INTO event_winners (event_id, team_name, rank, prize, category, medal_key, sort_order) VALUES
  (1, 'STAR', '1st Rank', '₹500', 'UG', 'gold', 1),
  (1, 'The Ultron', '2nd Rank', '₹500', 'UG', 'silver', 2),
  (1, 'Code Warriors', '1st Runner-up', NULL, 'UG', 'bronze', 3),
  (1, 'PAYLO4D_C4RT3L', '2nd Runner-up', NULL, 'UG', 'runner', 4);

-- ─── Event Winners — PG ──────────────────────────────────────
INSERT INTO event_winners (event_id, team_name, rank, prize, category, medal_key, sort_order) VALUES
  (1, 'SoloStack', '1st Rank', '₹500', 'PG', 'gold', 1),
  (1, 'DRAG', '2nd Rank', '₹500', 'PG', 'silver', 2),
  (1, 'Nova Zen Coders', '1st Runner-up', NULL, 'PG', 'bronze', 3),
  (1, 'Hackathon Horizon', '2nd Runner-up', NULL, 'PG', 'runner', 4);

-- ─── Winner Members — UG ─────────────────────────────────────
-- STAR (winner_id = 1)
INSERT INTO winner_members (winner_id, name, class) VALUES (1, 'Vishwakarma Rishabh Pandurang', 'IMCA 2');
-- The Ultron (winner_id = 2)
INSERT INTO winner_members (winner_id, name, class) VALUES
  (2, 'Yash Mahendra Patil', 'IMCA 2'),
  (2, 'Hrishikesh Sambhaji Bari', 'IMCA 2'),
  (2, 'Tejas Haresh Sonavane', 'IMCA 2');
-- Code Warriors (winner_id = 3)
INSERT INTO winner_members (winner_id, name, class) VALUES
  (3, 'Tiwari Mehul Sanjay', 'IMCA 3'),
  (3, 'Bhavesh Mahendra Borse', 'IMCA 2'),
  (3, 'Moin Altaf Ansari', 'IMCA 2');
-- PAYLO4D_C4RT3L (winner_id = 4)
INSERT INTO winner_members (winner_id, name, class) VALUES
  (4, 'Aniruddha Balaji Landge', 'IMCA 3'),
  (4, 'Aastha Vilas Deshmukh', 'IMCA 2'),
  (4, 'Vaibhav Jaywantrao Patil', 'IMCA 4');

-- ─── Winner Members — PG ─────────────────────────────────────
-- SoloStack (winner_id = 5)
INSERT INTO winner_members (winner_id, name, class) VALUES (5, 'Pratik Mahajan', 'IMCA 4');
-- DRAG (winner_id = 6)
INSERT INTO winner_members (winner_id, name, class) VALUES
  (6, 'Aditya Wagh', 'MCA 1 B'),
  (6, 'Akshay Borase', 'MCA 1 B');
-- Nova Zen Coders (winner_id = 7)
INSERT INTO winner_members (winner_id, name, class) VALUES
  (7, 'Chirag Kishor Borse', 'MCA 1 B'),
  (7, 'Kalpesh Dnyaneshwar Sonawane', 'MCA 1 B');
-- Hackathon Horizon (winner_id = 8)
INSERT INTO winner_members (winner_id, name, class) VALUES
  (8, 'Monika Anil Patil', 'MCA 1 B'),
  (8, 'Jayashree Mukunda Patil', 'MCA 1 B'),
  (8, 'Divya Madhukar Patil', 'MCA 2 B');

-- ─── Gallery — Images ────────────────────────────────────────
INSERT INTO gallery (type, url, caption, sort_order) VALUES
  ('image', '/images/event1.webp', 'Workshop on IMCA classes', 1),
  ('image', '/images/event2.webp', 'Workshop on MCA classes', 2),
  ('image', '/images/event3.webp', 'Workshop by Hon. HOD Dr. M. N. Behere', 3),
  ('image', '/images/event4.webp', 'Mentors Meet', 4),
  ('image', '/images/event5.webp', 'Team AISC', 5),
  ('image', '/images/event6.webp', 'Inauguration', 6);

-- ─── Gallery — Videos ────────────────────────────────────────
INSERT INTO gallery (type, url, caption, title, description, sort_order) VALUES
  ('video', '/Hackthon Highlights/hacakthon.mp4', 'Hackathon Moments', '🏆 Hackathon Moments', 'Best highlights from the competition', 7),
  ('video', '/Hackthon Highlights/invetations.mp4', 'Invites & Guests', '🎤 Invites & Guests', 'The team invited special guests', 8),
  ('video', '/Hackthon Highlights/session.mp4', 'Live Session', '💻 Live Session', 'Workshop session on classes', 9);

-- ─── Sessions ────────────────────────────────────────────────
INSERT INTO sessions (title, embed_url, download_url, sort_order) VALUES
  ('1. What is Hackathon', 'https://docs.google.com/presentation/d/1mLfETYAr32KgcQeict9f856BxBwgRPye/embed?start=false&loop=false&delayms=3000', '/ppt/What is hackathon.pptx', 1),
  ('2. What is Vibe Coding', 'https://docs.google.com/presentation/d/11B9NhHo_G7Jhv9G807eqxSyIQhddXCWh/embed?start=false&loop=false&delayms=3000', '/ppt/What is Vibe coding.pptx', 2);

-- ─── FAQ (main FAQ page) ─────────────────────────────────────
INSERT INTO faqs (question, answer, sort_order, page) VALUES
  ('What is AI Student Chapters? 🤔', 'We''re a student-led community at RCPIMRD that''s all about AI. Think hackathons, workshops, building cool projects, and just vibing with people who love tech. No boring lectures, we promise.', 1, 'faq'),
  ('Who can join the club? 🙋', 'Literally anyone at RCPIMRD! Doesn''t matter if you''ve never written a line of code — if you''re curious about AI and want to learn, you''re in. We welcome all skill levels.', 2, 'faq'),
  ('Do I need coding experience? 💻', 'Nope! We run beginner-friendly workshops to get you started. All you need is a laptop and the willingness to learn. We''ll handle the rest.', 3, 'faq'),
  ('What kind of events do you organize? 🎉', 'We do hands-on workshops, guest sessions, coding bootcamps, and our legendary ''Code-Carnival'' Hackathon. Check out the Sessions page for what''s coming up next!', 4, 'faq'),
  ('How do I stay updated? 📱', 'Join our WhatsApp group — that''s where all the action happens. We also post on our Instagram (@ai.student_chapters). Links are on the Home page!', 5, 'faq');

-- ─── FAQ (about page) ────────────────────────────────────────
INSERT INTO faqs (question, answer, sort_order, page) VALUES
  ('Who can join AI Student Chapters?', 'Any student at RCPIMRD, from MCA and IMCA (1st year), can apply. We welcome all backgrounds — technical or not!', 1, 'about'),
  ('Is there any fee to join?', 'Nope, absolutely free! No hidden costs. Everything is open to students.', 2, 'about'),
  ('Do I need to know coding?', 'Not necessarily! We have roles for designers, speakers, content creators, and event managers too.', 3, 'about'),
  ('What is Vibe Coding?', 'Vibe coding is an intuitive approach to building software where you focus on flow, logic, and AI-assisted generation rather than writing every single line.', 4, 'about'),
  ('How often do you host events?', 'Typically one major event per month — from hackathons to guest speakers and workshops.', 5, 'about'),
  ('How do I register for Code-Carnival?', 'Click the "Register Now" button on the Events page and fill out the form. But hurry — spots are limited! ⚡', 6, 'about');

-- ─── Tools ───────────────────────────────────────────────────
INSERT INTO tools (title, description, icon_name, url, color, badge, cta_text, is_download, sort_order) VALUES
  ('AISC Certificate Studio', 'Generate professional certificates for event participants, workshop attendees, and club members. Paste names from Excel/PDF and download beautifully designed certificates instantly.', 'Award', 'https://certificate-aisc.vercel.app/', 'primary', 'Live', 'Open Tool', false, 1),
  ('studymatrrial', 'Access the official study material document.', 'BookOpen', '/studymeterial.pdf', 'primary', 'PDF', 'Download PDF', true, 2);

-- ─── Chatbot Q&A ─────────────────────────────────────────────
INSERT INTO chatbot_qa (keywords, answer, sort_order) VALUES
  (ARRAY['what is', 'about', 'tell me about', 'what are', 'who are you', 'introduce'], 'AI Student Chapters is a student-run tech club at RCPIMRD college focused on AI, ML, and emerging technologies! 🚀 We host hackathons, workshops, coding sessions, and tech talks to help students explore the world of tech.', 1),
  (ARRAY['join', 'member', 'sign up', 'register', 'enroll', 'how to join', 'become'], 'Joining is super easy! 🎉 You don''t need any coding experience — we welcome everyone. Just reach out to us on Instagram @ai.student_chapters or email us at imrdaistudentclub@gmail.com and we''ll get you onboard!', 2),
  (ARRAY['team', 'lead', 'president', 'who leads', 'members', 'committee', 'core'], E'Here''s our awesome core team! 🌟\n👑 President: Kartik Sharad Valhe\n⭐ Vice President: Krushnali Vanusing Jadhav\n📋 Secretary: Tejas Dipak Panchbhai\n💰 Treasurer: Aastha Vilas Deshmukh\n🎯 Event Manager: Chirag Rajesh Behere\n💻 Tech Lead: Aniruddha Balaji Landge\n📝 Documentation Head: Moin Altaf Ansari\n📸 Camera Lead: Shreyash Sunil Patil\n📱 Social Media: Bhumika Vilas Patil', 3),
  (ARRAY['event', 'hackathon', 'workshop', 'session', 'activity', 'done', 'past'], E'We''ve hosted some amazing events! 🎪\n🏆 Code-Carnival Hackathon (March 2026) — our flagship event!\n💻 Vibe Coding Workshop — hands-on coding fun\n🤖 AI/ML Workshops — learn cutting-edge tech\n🎤 Guest lectures from industry experts\nStay tuned on our Instagram for upcoming events!', 4),
  (ARRAY['coding', 'code', 'programming', 'skill', 'experience', 'beginner', 'need'], 'Nope, you don''t need any coding skills to join! 💪 We welcome complete beginners and experienced coders alike. Our workshops start from the basics, so everyone can learn and grow together.', 5),
  (ARRAY['vibe coding', 'vibe'], 'Vibe Coding is our signature workshop format! 🎶 It''s all about coding in a chill, collaborative environment with music, snacks, and good vibes. We make learning to code fun and stress-free!', 6),
  (ARRAY['next event', 'upcoming', 'when', 'schedule', 'next'], 'Follow us on Instagram @ai.student_chapters to stay updated on upcoming events! 📱 You can also email us at imrdaistudentclub@gmail.com to get on our mailing list. Exciting things are always in the works! 🔥', 7),
  (ARRAY['contact', 'reach', 'email', 'instagram', 'social', 'connect', 'talk'], E'You can reach us through:\n📧 Email: imrdaistudentclub@gmail.com\n📸 Instagram: @ai.student_chapters\nFeel free to DM us or drop an email — we''d love to hear from you! 💬', 8),
  (ARRAY['kartik'], 'Kartik Sharad Valhe is our President! 👑 He leads the club and drives our vision forward.', 9),
  (ARRAY['krushnali'], 'Krushnali Vanusing Jadhav is our Vice President! ⭐ She supports the president and helps coordinate all club activities.', 10),
  (ARRAY['tejas'], 'Tejas Dipak Panchbhai is our Secretary! 📋 He manages club communications and keeps everything organized.', 11),
  (ARRAY['aastha'], 'Aastha Vilas Deshmukh is our Treasurer! 💰 She manages the club''s finances and budgets.', 12),
  (ARRAY['chirag'], 'Chirag Rajesh Behere is our Event Manager! 🎯 He plans and executes all our amazing events, from hackathons to workshops.', 13),
  (ARRAY['aniruddha'], 'Aniruddha Balaji Landge is our Tech Lead! 💻 He handles technical workshops and leads the tech infrastructure.', 14),
  (ARRAY['moin'], 'Moin Altaf Ansari is our Documentation Head! 📝 He is responsible for managing all the important documents and reports.', 15),
  (ARRAY['shreyash'], 'Shreyash Sunil Patil is our Camera Lead! 📸 He captures all the great moments at our events.', 16),
  (ARRAY['bhumika'], 'Bhumika Vilas Patil handles Social Media! 📱 She manages our online presence and keeps the community engaged.', 17),
  (ARRAY['hi', 'hello', 'hey', 'hii', 'hiii', 'sup', 'yo', 'hola', 'greetings'], 'Hey there! 👋 Welcome to AI Student Chapters! How can I help you today? You can ask me about the club, events, team, or how to join!', 18),
  (ARRAY['thanks', 'thank', 'thx', 'ty', 'appreciate'], 'You''re welcome! 😊 Happy to help! If you have more questions, feel free to ask anytime. See you at our next event! ⚡', 19),
  (ARRAY['bye', 'goodbye', 'see you', 'later', 'cya'], 'See you later! 👋 Don''t forget to follow us on Instagram @ai.student_chapters for updates. Have an awesome day! 🌟', 20),
  (ARRAY['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning'], 'We''re all about AI & ML! 🤖 Our club explores artificial intelligence, machine learning, deep learning, and other emerging technologies through hands-on workshops and projects. Join us to dive into the world of AI!', 21),
  (ARRAY['college', 'rcpimrd', 'school', 'university'], 'AI Student Chapters is based at RCPIMRD college! 🏫 We''re a student-run tech club that''s open to all students of the college. Come join our tech community!', 22);

-- ─── Site Settings ───────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
  ('tools_password', 'member@aisc'),
  ('whatsapp_group_link', 'https://chat.whatsapp.com/FQdz9mHb4y37ooH1JxiYoF'),
  ('whatsapp_community_link', 'https://chat.whatsapp.com/IfBOfK4bE7l1D0N5C9KXYv'),
  ('instagram_handle', '@ai.student_chapters'),
  ('email', 'imrdaistudentclub@gmail.com');

-- ============================================================
-- STORAGE SETUP (BUCKET & POLICIES)
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
