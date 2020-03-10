URL Shorten implemented in nodejs

Prerequisties
- Postgres
- NodeJS

- Create table with following columns in postgres
CREATE TABLE public.urlshorten
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    shorturl character varying COLLATE pg_catalog."default",
    longurl character varying COLLATE pg_catalog."default",
    CONSTRAINT urlshorten_pkey PRIMARY KEY (id)
)