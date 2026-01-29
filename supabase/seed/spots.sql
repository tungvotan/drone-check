-- Seed data: 25 curated Australian FPV spots
-- Sources: MAAA clubs (maaa.asn.au), AuFPV directory, community recommendations

INSERT INTO spots (name, slug, description, latitude, longitude, state, type, nearest_airport_km, airspace_class, amenities, notes, source_url) VALUES

-- NEW SOUTH WALES
('SSME Camden', 'ssme-camden', 'Sydney Scale Model Enthusiasts - large grass field with designated FPV area. One of Sydney''s premier RC flying clubs.', -34.0489, 150.6942, 'NSW', 'maaa_club', 8.5, 'G', ARRAY['parking', 'toilet', 'shade', 'seating'], 'Members only on weekends, check club schedule. Great for both fixed wing and multi-rotor.', 'https://www.maaa.asn.au'),

('Razorback FPV Field', 'razorback-fpv', 'Popular community spot near Picton with clear sightlines and minimal RF interference.', -34.2167, 150.5833, 'NSW', 'community', 15.2, 'G', ARRAY['parking'], 'Best early morning before wind picks up. Watch for livestock.', NULL),

('Lake George FPV', 'lake-george-fpv', 'Dry lake bed near Canberra offering vast open space for long-range flying.', -35.0667, 149.4167, 'NSW', 'field', 25.0, 'G', ARRAY['parking'], 'Access from Federal Highway. Check conditions - can be muddy after rain.', NULL),

('Illawarra Model Flyers', 'illawarra-model-flyers', 'Well-maintained club field with all-weather strip near Wollongong.', -34.5236, 150.8547, 'NSW', 'maaa_club', 12.0, 'G', ARRAY['parking', 'toilet', 'shade', 'power'], 'MAAA membership required. Excellent facilities.', 'https://www.maaa.asn.au'),

('Richmond RAAF Flyers', 'richmond-raaf-flyers', 'Club field near RAAF Richmond - check NOTAMs and club schedule.', -33.6006, 150.7811, 'NSW', 'maaa_club', 5.0, 'G', ARRAY['parking', 'toilet'], 'Close to controlled airspace - stay below 120m AGL. Members only.', 'https://www.maaa.asn.au'),

-- VICTORIA
('VARMS Dodd Field', 'varms-dodd-field', 'Victorian Association of Radio Model Soaring - premier glider and multi-rotor field.', -37.8833, 145.2667, 'VIC', 'maaa_club', 18.0, 'G', ARRAY['parking', 'toilet', 'shade'], 'Thermal soaring focus but FPV welcome. Beautiful Yarra Valley views.', 'https://www.maaa.asn.au'),

('Bacchus Marsh FPV', 'bacchus-marsh-fpv', 'Open farmland west of Melbourne with excellent conditions for racing.', -37.6833, 144.4333, 'VIC', 'community', 22.0, 'G', ARRAY['parking'], 'Permission required from landowner. Popular with Melbourne FPV community.', NULL),

('VMAA Muckleford', 'vmaa-muckleford', 'Victorian Model Aircraft Association main field - large site with multiple runways.', -37.0167, 144.1833, 'VIC', 'maaa_club', 30.0, 'G', ARRAY['parking', 'toilet', 'shade', 'power', 'seating'], 'Full facilities, camping available for events. Great for FPV racing events.', 'https://www.maaa.asn.au'),

('Frankston Model Flyers', 'frankston-model-flyers', 'Convenient Melbourne bayside location with good facilities.', -38.1500, 145.1333, 'VIC', 'maaa_club', 15.0, 'G', ARRAY['parking', 'toilet'], 'Close to Moorabbin airspace - altitude restrictions apply.', 'https://www.maaa.asn.au'),

-- QUEENSLAND
('Gold Coast Model Flyers', 'gold-coast-model-flyers', 'Active club with dedicated FPV area near Gold Coast Airport.', -28.1667, 153.4833, 'QLD', 'maaa_club', 8.0, 'G', ARRAY['parking', 'toilet', 'shade'], 'Check airport CTAF before flying. Great weather year-round.', 'https://www.maaa.asn.au'),

('Brisbane Valley FPV', 'brisbane-valley-fpv', 'Scenic flying location in Brisbane Valley with mountain backdrop.', -27.4500, 152.4667, 'QLD', 'community', 35.0, 'G', ARRAY['parking'], 'Amazing scenery for cruising. Watch for afternoon thermals.', NULL),

('TBMAC Taringa', 'tbmac-taringa', 'The Brisbane Model Aero Club - longest running club in QLD.', -27.4833, 152.9667, 'QLD', 'maaa_club', 12.0, 'G', ARRAY['parking', 'toilet', 'shade', 'power'], 'Inner Brisbane location - great for after-work sessions.', 'https://www.maaa.asn.au'),

('Cairns Model Flyers', 'cairns-model-flyers', 'Tropical flying at its best - year-round good weather.', -16.9186, 145.7781, 'QLD', 'maaa_club', 10.0, 'G', ARRAY['parking', 'toilet', 'shade'], 'Wet season can limit access. Watch for crocodiles near waterways!', 'https://www.maaa.asn.au'),

('Sunshine Coast FPV', 'sunshine-coast-fpv', 'Community spot with ocean views and reliable sea breeze.', -26.6833, 153.0833, 'QLD', 'community', 18.0, 'G', ARRAY['parking'], 'Great for freestyle with natural features. Popular weekend spot.', NULL),

-- WESTERN AUSTRALIA
('WARMAC Perth', 'warmac-perth', 'Western Australian Radio Model Aircraft Club - main Perth field.', -31.8167, 115.9667, 'WA', 'maaa_club', 20.0, 'G', ARRAY['parking', 'toilet', 'shade', 'power', 'seating'], 'Full facilities, multiple strips. Active FPV racing community.', 'https://www.maaa.asn.au'),

('Kalgoorlie FPV', 'kalgoorlie-fpv', 'Remote outback flying with vast open spaces and minimal interference.', -30.7489, 121.4658, 'WA', 'field', 8.0, 'G', ARRAY['parking'], 'Extreme heat in summer - fly early morning. Amazing for long range.', NULL),

('Geraldton Model Flyers', 'geraldton-model-flyers', 'Mid-west club with excellent coastal conditions.', -28.7667, 114.6000, 'WA', 'maaa_club', 12.0, 'G', ARRAY['parking', 'toilet'], 'Sea breeze provides consistent wind. Great for wing flying.', 'https://www.maaa.asn.au'),

-- SOUTH AUSTRALIA
('Adelaide Soaring Club', 'adelaide-soaring-club', 'Thermal soaring focused but welcomes FPV. Excellent facilities.', -34.7833, 138.7167, 'SA', 'maaa_club', 25.0, 'G', ARRAY['parking', 'toilet', 'shade', 'power'], 'Amazing thermal conditions. Share airspace with gliders respectfully.', 'https://www.maaa.asn.au'),

('Murray Bridge FPV', 'murray-bridge-fpv', 'Riverside flying spot with scenic Murray River backdrop.', -35.1200, 139.2700, 'SA', 'community', 30.0, 'G', ARRAY['parking'], 'Beautiful location for cinematic flying. Watch for boat traffic.', NULL),

-- TASMANIA
('Hobart Model Aero Club', 'hobart-model-aero-club', 'Tasmania''s premier flying club with stunning mountain views.', -42.8333, 147.2833, 'TAS', 'maaa_club', 15.0, 'G', ARRAY['parking', 'toilet', 'shade'], 'Changeable weather - check forecasts carefully. Beautiful scenery.', 'https://www.maaa.asn.au'),

('Launceston Model Aircraft', 'launceston-model-aircraft', 'Northern Tassie club with reliable flying conditions.', -41.4333, 147.1333, 'TAS', 'maaa_club', 12.0, 'G', ARRAY['parking', 'toilet'], 'Good facilities, friendly community.', 'https://www.maaa.asn.au'),

-- NORTHERN TERRITORY
('Darwin Model Aero Club', 'darwin-model-aero-club', 'Tropical flying with year-round good conditions in dry season.', -12.4634, 130.8456, 'NT', 'maaa_club', 10.0, 'G', ARRAY['parking', 'toilet', 'shade', 'water'], 'Avoid wet season (Nov-Apr). Amazing sunsets for golden hour flying.', 'https://www.maaa.asn.au'),

('Alice Springs FPV', 'alice-springs-fpv', 'Red centre flying with iconic Australian outback landscape.', -23.6980, 133.8807, 'NT', 'field', 12.0, 'G', ARRAY['parking'], 'Extreme heat - fly dawn/dusk only. Stunning for cinematic content.', NULL),

-- ACT
('Canberra Model Aircraft Club', 'canberra-model-aircraft-club', 'Capital region club with well-maintained facilities.', -35.3333, 149.1000, 'ACT', 'maaa_club', 20.0, 'G', ARRAY['parking', 'toilet', 'shade', 'power'], 'Cold winters but excellent year-round flying. Near controlled airspace - check altitude.', 'https://www.maaa.asn.au'),

('Jerrabomberra Wetlands', 'jerrabomberra-wetlands', 'Urban park suitable for micro quads and small drones.', -35.3167, 149.1500, 'ACT', 'park', 8.0, 'G', ARRAY['parking', 'toilet', 'seating'], 'Stay away from wildlife. Small drones only - very public area.', NULL);
