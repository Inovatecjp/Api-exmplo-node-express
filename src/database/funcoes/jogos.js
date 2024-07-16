const sequelize = require("../../models/connection");
const initializationDone = process.env.DB_INITIALIZED === 'true';

if (initializationDone) {
(async () => {
  const insertJogosFunction = `
    CREATE OR REPLACE FUNCTION insert_jogos()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NOT EXISTS (
            SELECT * FROM "Jogos" WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora
        ) THEN
            INSERT INTO "Jogos" (data, hora, time_casa, time_fora, casa_odd_maior, empate_odd_maior, fora_odd_maior)
            VALUES (NEW.data, NEW.hora, NEW.time_casa, NEW.time_fora, NEW.casa_odd, NEW.empate_odd, NEW.fora_odd);
        ELSE
            UPDATE "Jogos"
            SET casa_odd_maior = GREATEST((SELECT casa_odd_maior FROM "Jogos"
                    WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora), NEW.casa_odd),
                empate_odd_maior = GREATEST((SELECT empate_odd_maior FROM "Jogos"
                    WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora), NEW.empate_odd),
                fora_odd_maior = GREATEST((SELECT fora_odd_maior FROM "Jogos"
                    WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora), NEW.fora_odd)
            WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;


  const UpdateJogosFunction = `CREATE OR REPLACE FUNCTION update_jogos()
  RETURNS TRIGGER AS $$
  DECLARE
      casa_odd_maior_v VARCHAR;
      empate_odd_maior_v VARCHAR;
      fora_odd_maior_v VARCHAR;
  BEGIN
      IF (OLD.casa_odd <> NEW.casa_odd OR 
      OLD.empate_odd <> NEW.empate_odd OR 
      OLD.fora_odd <> NEW.fora_odd) THEN
          SELECT casa_odd_maior INTO casa_odd_maior_v FROM jogos 
              WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora;
          SELECT empate_odd_maior INTO empate_odd_maior_v FROM jogos 
              WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora;
          SELECT fora_odd_maior INTO fora_odd_maior_v FROM jogos 
              WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora;
      
          IF GREATEST(casa_odd_maior_v, NEW.casa_odd) = casa_odd_maior_v THEN
              SELECT MAX(casa_odd) INTO casa_odd_maior_v 
                  FROM bets WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora;
          END IF;
          IF GREATEST(empate_odd_maior_v, NEW.empate_odd) = empate_odd_maior_v THEN 
              SELECT MAX(empate_odd) INTO empate_odd_maior_v 
                  FROM bets WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora;
          END IF;					
          IF GREATEST(fora_odd_maior_v, NEW.fora_odd) = fora_odd_maior_v THEN
              SELECT MAX(fora_odd) INTO fora_odd_maior_v 
                  FROM bets WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora AND data = NEW.data AND hora = NEW.hora;
          END IF;
          UPDATE jogos
          SET casa_odd_maior = GREATEST(casa_odd_maior_v, NEW.casa_odd),
              empate_odd_maior = GREATEST(empate_odd_maior_v, NEW.empate_odd),
              fora_odd_maior = GREATEST(fora_odd_maior_v, NEW.fora_odd)                   
          WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora
                  AND data = NEW.data AND hora = NEW.hora;
      ELSE
          UPDATE jogos
          SET data = NEW.data, hora = NEW.hora
          WHERE time_casa = NEW.time_casa AND time_fora = NEW.time_fora;
      END IF;
  
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  `;


  const createFunctionWebhook = `
  CREATE OR REPLACE FUNCTION handle_update_notify_webhook()
  RETURNS trigger
  LANGUAGE 'plpgsql'
  COST 100
  VOLATILE NOT LEAKPROOF
  AS $BODY$
  BEGIN
      NOTIFY webhook_channel, '{"atualizei": "atualizei"}';
      RETURN NEW;
  END;        
  $BODY$;`
    

    const create_trigger_insert = ` DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_trigger
            WHERE tgname = 'after_insert_trigger'
        ) THEN
            EXECUTE 'CREATE TRIGGER after_insert_trigger
                AFTER INSERT ON bets
                FOR EACH ROW
                EXECUTE FUNCTION insert_jogos()';
        END IF;
    END$$;`

  const create_trigger_update = `
  DO $$
  BEGIN
      IF NOT EXISTS (
          SELECT 1
          FROM pg_trigger
          WHERE tgname = 'after_update_trigger'
      ) THEN
          EXECUTE 'CREATE TRIGGER after_update_trigger
              AFTER UPDATE ON bets
              FOR EACH ROW
              EXECUTE FUNCTION update_jogos()';
      END IF;
  END$$;`


  const createTriggersWebhooks = `
  DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_trigger
                        WHERE tgname = 'insert_trigger_notify_webhook'
                    ) THEN
                        EXECUTE 'CREATE TRIGGER insert_trigger_notify_webhook
                            AFTER INSERT ON bets
                            FOR EACH ROW
                            EXECUTE FUNCTION handle_update_notify_webhook()';
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_trigger
                        WHERE tgname = 'update_trigger_notify_webhook'
                    ) THEN
                        EXECUTE 'CREATE TRIGGER update_trigger_notify_webhook
                            AFTER UPDATE ON bets
                            FOR EACH ROW
                            EXECUTE FUNCTION handle_update_notify_webhook()';
                    END IF;

                    IF NOT EXISTS (
                        SELECT 1
                        FROM pg_trigger
                        WHERE tgname = 'delete_trigger_notify_webhook'
                    ) THEN
                        EXECUTE 'CREATE TRIGGER delete_trigger_notify_webhook
                            AFTER DELETE ON bets
                            FOR EACH ROW
                            EXECUTE FUNCTION handle_update_notify_webhook()';
                    END IF;
                END$$;`


  await sequelize.query(insertJogosFunction);
  await sequelize.query(UpdateJogosFunction);
  await sequelize.query(createFunctionWebhook);



  await sequelize.query(create_trigger_insert);
  await sequelize.query(create_trigger_update);
  await sequelize.query(createTriggersWebhooks);


  // Adicione mais funções e gatilhos conforme necessário
})();
}