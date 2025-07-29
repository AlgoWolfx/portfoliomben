-- Messages tablosu için RLS politikaları
-- Sadece messages tablosu için, diğer tabloları etkilemez

-- Messages tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages tablosu için RLS enable et
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Messages için ANONIM kullanıcıların insert yapabilmesi için politikası
CREATE POLICY "Allow anonymous users to insert messages" ON messages
  FOR INSERT
  WITH CHECK (true);

-- Messages için admin kullanıcıların okuyabilmesi için politikası
CREATE POLICY "Allow authenticated users to read messages" ON messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Messages için admin kullanıcıların silebilmesi için politikası
CREATE POLICY "Allow authenticated users to delete messages" ON messages
  FOR DELETE
  USING (auth.role() = 'authenticated'); 