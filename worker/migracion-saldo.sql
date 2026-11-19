-- Agrega el cobro del saldo (50% restante) a la tabla de pedidos.
-- Base ya creada:   npx wrangler d1 execute helios-pedidos --remote --file=worker/migracion-saldo.sql
-- Base nueva:       primero worker/schema.sql y después este archivo.
-- Se corre UNA sola vez: si lo repites, avisa que las columnas ya existen (no pasa nada más).
ALTER TABLE pedidos ADD COLUMN saldo_estado TEXT NOT NULL DEFAULT 'ninguno'; -- ninguno | link_enviado | pagado | revisar | reembolsado
ALTER TABLE pedidos ADD COLUMN saldo_preference_id TEXT;
ALTER TABLE pedidos ADD COLUMN saldo_link TEXT;
ALTER TABLE pedidos ADD COLUMN saldo_payment_id TEXT;
ALTER TABLE pedidos ADD COLUMN saldo_pagado_en TEXT;
ALTER TABLE pedidos ADD COLUMN saldo_correo_enviado INTEGER NOT NULL DEFAULT 0;
