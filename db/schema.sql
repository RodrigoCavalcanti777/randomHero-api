create table if not exists heroes (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 50),
  age integer not null check (age between 1 and 10000),
  gender text not null check (char_length(gender) between 1 and 30),
  ability text not null check (char_length(ability) between 1 and 200),
  alignment text not null check (alignment in ('hero', 'villain')),
  power integer not null check (power between 1 and 100),
  background text check (background is null or char_length(background) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists heroes_name_unique_idx on heroes (lower(name));

alter table heroes enable row level security;
-- Sem policies de propósito: só a chave secreta do servidor acessa a tabela.