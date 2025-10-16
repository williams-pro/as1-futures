-- Script para insertar datos de prueba de favoritos
-- Asegúrate de que existan jugadores y un usuario scout/admin en la base de datos

-- Insertar algunos favoritos de prueba
INSERT INTO favorites (scout_id, player_id, tournament_id, is_favorite, is_exclusive, display_order)
SELECT 
  '00000000-0000-0000-0000-000000000001', -- scout_id (ajusta según tu usuario)
  p.id, -- player_id
  '00000000-0000-0000-0000-000000000001', -- tournament_id
  true, -- is_favorite
  false, -- is_exclusive
  ROW_NUMBER() OVER (ORDER BY p.created_at) -- display_order
FROM players p
LIMIT 3;

-- Insertar algunos exclusivos de prueba
INSERT INTO favorites (scout_id, player_id, tournament_id, is_favorite, is_exclusive, display_order)
SELECT 
  '00000000-0000-0000-0000-000000000001', -- scout_id (ajusta según tu usuario)
  p.id, -- player_id
  '00000000-0000-0000-0000-000000000001', -- tournament_id
  true, -- is_favorite
  true, -- is_exclusive
  ROW_NUMBER() OVER (ORDER BY p.created_at) -- display_order
FROM players p
OFFSET 3
LIMIT 2;

-- Verificar los datos insertados
SELECT 
  f.id,
  f.scout_id,
  f.player_id,
  f.tournament_id,
  f.is_favorite,
  f.is_exclusive,
  f.display_order,
  p.first_name,
  p.last_name
FROM favorites f
JOIN players p ON f.player_id = p.id
WHERE f.scout_id = '00000000-0000-0000-0000-000000000001'
ORDER BY f.display_order;


