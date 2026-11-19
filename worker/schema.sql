-- Pedidos del checkout de Helios Digital
-- Crear/actualizar:  npx wrangler d1 execute helios-pedidos --remote --file=worker/schema.sql
CREATE TABLE IF NOT EXISTS pedidos (
  id               TEXT PRIMARY KEY,
  creado           TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado      TEXT,
  plan_id          TEXT NOT NULL,
  plan_nombre      TEXT NOT NULL,
  cantidad         INTEGER NOT NULL DEFAULT 1,
  mantencion       INTEGER NOT NULL DEFAULT 0,
  modalidad        TEXT NOT NULL,            -- 'anticipo' | 'total'
  total            INTEGER NOT NULL,         -- CLP, IVA incluido
  monto_hoy        INTEGER NOT NULL,         -- lo que se cobra en Mercado Pago
  saldo            INTEGER NOT NULL,         -- lo que queda contra entrega
  nombre           TEXT NOT NULL,
  correo           TEXT NOT NULL,
  telefono         TEXT NOT NULL,
  empresa          TEXT,
  rut              TEXT,
  estado           TEXT NOT NULL DEFAULT 'creado', -- creado | pendiente | pagado | rechazado | reembolsado | revisar
  mp_preference_id TEXT,
  mp_payment_id    TEXT,
  mp_status        TEXT,
  correo_enviado   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_creado ON pedidos(creado);
