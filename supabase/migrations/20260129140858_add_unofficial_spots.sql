-- Add unofficial/community favorite FPV spots

INSERT INTO spots (name, slug, description, latitude, longitude, state, type, nearest_airport_km, airspace_class, amenities, notes, source_url) VALUES

-- NEW SOUTH WALES
('Bondi Cliffs', 'bondi-cliffs', 'Spectacular coastal flying along the cliffs between Bondi and Bronte. Best for cinematic cruising.', -33.8944, 151.2742, 'NSW', 'community', 12.5, 'G', ARRAY['parking', 'seating'], 'Strict 30m height limit due to helicopter paths. Stay away from people on the coastal walk.', NULL),

('North Curl Curl Rock Pool', 'north-curl-curl-freestyle', 'Craggy rocks and a dramatic tidal pool make this a favorite for Sydney freestyle pilots.', -33.7656, 151.2989, 'NSW', 'community', 20.0, 'G', ARRAY['parking'], 'Awesome textures for proximity flying. Keep an eye on tide/swell for gear safety.', NULL),

('Bay Markers', 'bay-markers-sydney', 'Large spiral hill in Olympic Park area offering unique architectural lines and top-down potential.', -33.8347, 151.0772, 'NSW', 'park', 14.5, 'G', ARRAY['parking', 'seating'], 'Iconic spiral path. Popular with morning photographers, so fly early.', NULL),

-- VICTORIA
('Williamstown Foreshore', 'williamstown-foreshore', 'Open coastal area with views back towards the Melbourne skyline. Great for sunset sessions.', -37.8647, 144.8961, 'VIC', 'community', 15.0, 'G', ARRAY['parking', 'toilet', 'seating'], 'Consistent sea breeze. Popular with walkers, stay over the water/rocks where possible.', NULL),

('Albert Park', 'albert-park-fpv', 'Vast urban park with plenty of space for micro-quads and cinematic cruising around the lake.', -37.8447, 144.9667, 'VIC', 'park', 12.0, 'G', ARRAY['parking', 'toilet', 'seating'], 'Be extremely vigilant for helicopter traffic from nearby hospitals. Avoid flying during GP events.', NULL),

-- QUEENSLAND
('Kianawah Park', 'kianawah-park-brisbane', 'Large complex of open fields, perfect for practicing gates or open-field cruising.', -27.4528, 153.1111, 'QLD', 'park', 10.0, 'G', ARRAY['parking', 'toilet', 'shade', 'power'], 'Great flat area for tuning and testing. Check for cricket/footy matches before flying.', NULL),

-- WESTERN AUSTRALIA
('Omeo Shipwreck', 'omeo-shipwreck-coogee', 'Historic shipwreck just offshore. A premier location for Perth cinematic FPV.', -32.1225, 115.7608, 'WA', 'community', 25.0, 'G', ARRAY['parking', 'toilet', 'seating'], 'Submerged wreck is perfect for diving. Very popular for snorkelling - fly when it is quiet.', NULL),

-- SOUTH AUSTRALIA
('Victoria Park (Park 16)', 'victoria-park-adelaide', 'Designated community drone zone. The "home" of Adelaide recreational flying.', -34.9350, 138.6214, 'SA', 'park', 6.0, 'G', ARRAY['parking', 'toilet', 'shade', 'seating'], 'Adelaide''s most drone-friendly park. Stay north of the central gardens.', NULL),

-- TASMANIA
('Hope Beach', 'hope-beach-tas', 'Vast, often deserted beach. Perfect for legal long-range cruising and coastal surfing.', -43.0500, 147.4500, 'TAS', 'community', 15.0, 'G', ARRAY['parking'], 'Deserted beach vibes. Great for fixed wing and long range. No facilities - bring everything.', NULL),

-- ACT
('Lawson Old Navy Station', 'lawson-navy-station', 'Atmospheric ruins and old foundations in a quiet area. Perfect for proxy and exploring.', -35.2158, 149.1086, 'ACT', 'community', 8.0, 'G', ARRAY['parking'], 'Fenced area but foundations are visible and flyable. Very quiet, great for freestyle practice.', NULL);
