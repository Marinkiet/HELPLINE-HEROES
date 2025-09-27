/*
  # Create app content tables

  1. New Tables
    - `app_content`
      - `id` (uuid, primary key)
      - `content_key` (text, unique) - identifier like 'hero.title', 'categories.recognition'
      - `content_type` (text) - 'text', 'object', 'array'
      - `translations` (jsonb) - contains all language translations
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `game_content`
      - `id` (uuid, primary key)
      - `game_id` (text) - references games
      - `content_key` (text) - identifier like 'welcome', 'scenarios.1'
      - `content_type` (text) - 'text', 'object', 'array'
      - `translations` (jsonb) - contains all language translations
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Create app_content table
CREATE TABLE IF NOT EXISTS app_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text UNIQUE NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  translations jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_content table
CREATE TABLE IF NOT EXISTS game_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL,
  content_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  translations jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(game_id, content_key)
);

-- Enable RLS
ALTER TABLE app_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read on app_content"
  ON app_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read on game_content"
  ON game_content
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated admin write access
CREATE POLICY "Allow authenticated insert on app_content"
  ON app_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on app_content"
  ON app_content
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on game_content"
  ON game_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on game_content"
  ON game_content
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_app_content_updated_at
  BEFORE UPDATE ON app_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_content_updated_at
  BEFORE UPDATE ON game_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert app content data
INSERT INTO app_content (content_key, content_type, translations) VALUES
('hero.title', 'text', '{
  "en": "You Are a SUPERHERO!",
  "af": "Jy is ''n SUPERHELD!",
  "zu": "Ungiqhawe ELIKHULU!",
  "xh": "Ungumphakamisi OMKHULU!",
  "st": "U ke QHAWE le leholo!",
  "tn": "O ke PHAKELA e kgolo!",
  "ts": "U munhu wa MATIMBA!",
  "ve": "Ni ndi PHAKELA khulwane!",
  "nr": "Ungiqhawe ELIKHULU!",
  "nso": "O ke PHAKELA e kgolo!"
}'),

('hero.subtitle', 'text', '{
  "en": "Learn how to stay safe, help friends, and be brave!",
  "af": "Leer hoe om veilig te bly, vriende te help, en dapper te wees!",
  "zu": "Funda ukuthi ungahlala kanjani uphephile, usize abangane, futhi ube nesibindi!",
  "xh": "Funda indlela yokugcina ukhuseleko, ukunceda abahlobo, kwaye ube nesibindi!",
  "st": "Ithute hore na u ka dula u sireletsehile joang, u thuse metsoalle, ''me u be sebete!",
  "tn": "Ithuta gore o ka nna jang o sireletsegile, o thuse ditsala, mme o nne pelokgale!",
  "ts": "Dyondza leswaku u nga tshama u hlayisekile njhani, u pfuna vanghana, naswona u va wa matimba!",
  "ve": "Guda uri ni nga dzula ni tshi khou pfalwa hani, ni thuse vhaṅwali, nahone ni vhe na khongolose!",
  "nr": "Funda ukuthi ungahlala kanjani uphephile, usize abangane, futhi ube nesibindi!",
  "nso": "Ithuta gore o ka dula o šireletšegile bjang, o thuše bagwera, gomme o be pelokgale!"
}'),

('categories.recognition', 'text', '{
  "en": "Safety Recognition",
  "af": "Veiligheidsherkenning",
  "zu": "Ukubona Ukuphepha",
  "xh": "Ukuqonda Ukhuseleko",
  "st": "Ho tseba Polokeho",
  "tn": "Go lemoga Pabalesego",
  "ts": "Ku vona Vuhlayiseki",
  "ve": "U divha Vhushai",
  "nr": "Ukubona Ukuphepha",
  "nso": "Go lemoga Polokego"
}'),

('categories.response', 'text', '{
  "en": "Response Skills",
  "af": "Reaksievaardighede",
  "zu": "Amakhono Okuphendula",
  "xh": "Izakhono Zokuphendula",
  "st": "Tsebo ea ho Arabela",
  "tn": "Bokgoni jwa go Araba",
  "ts": "Vuswikoti bya ku Hlamula",
  "ve": "Zwikili zwa u Fhindula",
  "nr": "Amakhono Okuphendula",
  "nso": "Bokgoni bja go Araba"
}'),

('categories.reporting', 'text', '{
  "en": "Getting Help",
  "af": "Hulp kry",
  "zu": "Ukuthola Usizo",
  "xh": "Ukufumana Uncedo",
  "st": "Ho fumana Thuso",
  "tn": "Go bona Thuso",
  "ts": "Ku kuma Mpfuno",
  "ve": "U wana Thuso",
  "nr": "Ukuthola Usizo",
  "nso": "Go hwetša Thušo"
}'),

('categories.support', 'text', '{
  "en": "Support Network",
  "af": "Ondersteuningsnetwerk",
  "zu": "Inethiwekhi Yokusekela",
  "xh": "Uthungelwano Lwenkxaso",
  "st": "Marang-rang a Tšehetso",
  "tn": "Mafaratlhatlha a Tshegetso",
  "ts": "Netiweke ya Nseketelo",
  "ve": "Netiweke ya Thuso",
  "nr": "Inethiwekhi Yokusekela",
  "nso": "Netiweke ya Thekgo"
}');

-- Insert game content for Safe Touch Detective
INSERT INTO game_content (game_id, content_key, content_type, translations) VALUES
('safe_touch_detective', 'welcome', 'text', '{
  "en": "Hi there! Welcome to Safe Touch Detective. You''ll be the detective today! Click on the 3 green stars to enter and start your safety adventure.",
  "af": "Hallo daar! Welkom by Veilige Raak Speurder. Jy gaan vandag die speurder wees! Klik op die 3 groen sterre om in te gaan en jou veiligheidsavontuur te begin.",
  "zu": "Sawubona! Wamukelekile ku-Safe Touch Detective. Uzoba umcuphi namuhla! Chofoza izinkanyezi eziluhlaza ezingu-3 ukuze ungene uqale uhambo lwakho lokuphepha."
}'),

('safe_touch_detective', 'body_parts.upper_body', 'text', '{
  "en": "This is your upper body. The covered areas are private parts. Only trusted adults like doctors or parents helping you get dressed should touch these areas.",
  "af": "Dit is jou boonste liggaam. Die bedekte areas is private dele. Slegs vertroude volwassenes soos dokters of ouers wat jou help aantrek moet hierdie areas raak.",
  "zu": "Lesi yisitho sakho esiphezulu. Izindawo ezimboziwe yizingxenye eziyimfihlo. Kuphela abantu abadala abathembekile njengodokotela noma abazali abakusiza ukugqoka okumele bathinte lezi zindawo."
}');