CREATE TABLE IF NOT EXISTS WEATHER(
   ID           INTEGER   PRIMARY KEY,
   FETCHED      TEXT  NOT NULL,
   FOR_DATE     TEXT  NOT NULL,
   TEMPERATURE  REAL  NOT NULL
);

CREATE TABLE IF NOT EXISTS MEASUREMENTS(
  ID            INTEGER   PRIMARY KEY,
  MEASURED      TEXT  NOT NULL,
  VALUE         REAL  NOT NULL
);

CREATE TABLE IF NOT EXISTS WATERING(
  ID            INTEGER   PRIMARY KEY,
  STATUS        TEXT  NOT NULL DEFAULT "QUEUED",
  STARTED       TEXT  NOT NULL,
  ENDED         TEXT  NOT NULL
);

CREATE TABLE IF NOT EXISTS CONFIG(
  ID            INTEGER   PRIMARY KEY,
  NAME          TEXT  NOT NULL,
  VALUE         TEXT  NOT NULL
);

INSERT INTO CONFIG (NAME, VALUE) VALUES ("MEASUREMENT_LIMIT", "300");
INSERT INTO CONFIG (NAME, VALUE) VALUES ("MEASUREMENT_CRON", "00 01 * * * *")