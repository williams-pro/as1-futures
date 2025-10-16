# AS1 Futures Database v3.0 - Production Scripts

Este directorio contiene los scripts necesarios para configurar la base de datos de AS1 Futures en producción y replicar la estructura de desarrollo.

## 📁 Estructura de Archivos

```
scripts_pro/
├── 00-setup-production-database-fixed.sql     # Script maestro inicial
├── 00-replicate-dev-structure-simple.sql      # Script maestro de replicación (RECOMENDADO)
├── 01-database-structure.sql                  # Solo estructura de BD
├── 02-storage-buckets.sql                     # Solo configuración de storage
├── 03-create-admin-user.sql                   # Solo creación de usuario admin
├── 07-create-missing-tables.sql               # Tablas faltantes de desarrollo
├── 08-create-functions.sql                    # Funciones personalizadas
├── 09-create-triggers.sql                     # Triggers del sistema
├── 10-complete-rls-policies.sql               # Políticas RLS completas
├── 11-create-complete-indexes.sql             # Índices completos
└── README.md                                  # Este archivo
```

## 🚀 Configuración Rápida (Recomendado)

### Opción 1: Replicación Completa de Desarrollo ⭐

**Para replicar toda la estructura de desarrollo en producción:**

```sql
-- Ejecutar en Supabase SQL Editor
-- Copiar y pegar el contenido de 00-replicate-dev-structure-simple.sql
```

Este script incluye:
- ✅ Todas las tablas faltantes (`activity_log`, `player_interactions`, `player_videos`, etc.)
- ✅ Particiones mensuales para `player_views`
- ✅ Todas las funciones personalizadas
- ✅ Políticas RLS básicas
- ✅ Índices básicos

### Opción 2: Configuración Básica + Replicación

```sql
-- 1. Estructura básica
-- Ejecutar 00-setup-production-database-fixed.sql

-- 2. Replicación completa
-- Ejecutar 00-replicate-dev-structure-simple.sql

-- 3. Optimización completa (opcional)
-- Ejecutar 09-create-triggers.sql
-- Ejecutar 10-complete-rls-policies.sql
-- Ejecutar 11-create-complete-indexes.sql
```

## 📊 Estructura Completa de la Base de Datos

### Tablas Principales
- `tournaments` - Torneos
- `tournament_groups` - Grupos de torneos
- `teams` - Equipos
- `players` - Jugadores
- `matches` - Partidos
- `scouts` - Scouts/Usuarios
- `favorites` - Favoritos de scouts

### Tablas de Analytics (Nuevas)
- `activity_log` - Log de actividades del sistema
- `player_interactions` - Interacciones de scouts con jugadores
- `player_videos` - Videos asociados a jugadores
- `player_view_stats` - Estadísticas agregadas de vistas
- `player_views` - Registro detallado de vistas (particionado mensualmente)
- `player_views_archive` - Archivo de vistas antiguas

### Particiones Mensuales
- `player_views_2025_01` a `player_views_2025_12` - Particiones mensuales para optimización

## 🔧 Funciones Personalizadas

- `archive_old_player_views()` - Archiva vistas antiguas
- `auto_favorite_on_exclusive()` - Auto-favorito en exclusivos
- `check_exclusive_limit()` - Valida límite de exclusivos
- `create_next_month_partition()` - Crea partición del próximo mes
- `ensure_single_active_tournament()` - Asegura un solo torneo activo
- `get_active_tournament()` - Obtiene torneo activo
- `log_activity()` - Registra actividades
- `update_player_view_stats()` - Actualiza estadísticas de vistas
- `update_updated_at()` - Actualiza timestamp
- `generate_player_code()` - Genera códigos únicos de jugadores

## 👤 Creación de Usuario Admin

### Datos del Usuario Admin:
- **Email:** `williams.blanco@prointernacional.com`
- **Contraseña:** `1707AS` (el frontend agrega "AS" automáticamente)
- **Nombre:** Williams Blanco
- **Rol:** admin

### Pasos Requeridos:

1. **Crear usuario en Supabase Auth:**
   - Ir a Supabase Dashboard > Authentication > Users
   - Hacer clic en "Add user" o "Invite user"
   - Email: `williams.blanco@prointernacional.com`
   - Contraseña: `1707AS`
   - Anotar el User ID (UUID)

2. **Actualizar script de admin:**
   - Abrir `03-create-admin-user.sql`
   - Reemplazar `YOUR_ADMIN_USER_ID` con el UUID real del paso anterior
   - Descomentar las líneas del INSERT

3. **Ejecutar script:**
   - En Supabase SQL Editor, ejecutar el script actualizado

## 📋 Verificación

Después de ejecutar los scripts, puedes verificar que todo esté correcto:

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar scouts (debe incluir tu usuario admin)
SELECT * FROM scouts;

-- Verificar buckets de storage
SELECT * FROM storage.buckets;

-- Verificar políticas de seguridad
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verificar funciones personalizadas
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## 🔧 Configuración de Variables de Entorno

Asegúrate de tener configuradas las siguientes variables en tu archivo `.env`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Database
DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

## 📋 Checklist de Producción

### Configuración Básica
- [ ] Base de datos creada y accesible
- [ ] Script maestro ejecutado exitosamente
- [ ] Usuario admin creado en Supabase Auth
- [ ] Perfil de scout admin creado en la base de datos
- [ ] Buckets de storage configurados
- [ ] Políticas de seguridad aplicadas

### Replicación de Desarrollo
- [ ] Tablas de analytics creadas (`activity_log`, `player_interactions`, etc.)
- [ ] Particiones mensuales configuradas
- [ ] Funciones personalizadas instaladas
- [ ] Triggers del sistema activos
- [ ] Políticas RLS completas
- [ ] Índices optimizados

### Verificación Final
- [ ] Variables de entorno configuradas
- [ ] Aplicación probada y funcionando
- [ ] Login de admin funcional
- [ ] Analytics funcionando correctamente

## 🆘 Solución de Problemas

### Error: "relation does not exist"
- Verificar que el script se ejecutó completamente
- Revisar logs de PostgreSQL para errores

### Error: "permission denied"
- Verificar que el usuario tiene permisos de superusuario
- Ejecutar como usuario postgres si es necesario

### Error: "bucket already exists"
- Normal, los scripts usan `ON CONFLICT` para evitar duplicados

### Usuario admin no puede acceder
- Verificar que el User ID en `scouts` coincide con el de `auth.users`
- Verificar que el usuario tiene rol 'admin' en la tabla scouts

### Tablas de analytics no funcionan
- Verificar que las particiones mensuales están creadas
- Verificar que los triggers están activos
- Verificar que las políticas RLS permiten acceso

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs de PostgreSQL
2. Verificar permisos de usuario
3. Confirmar que todas las dependencias están instaladas
4. Contactar al equipo de desarrollo

---

**Versión:** 3.0  
**Última actualización:** Enero 2025